"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Copy, ExternalLink } from "lucide-react";
import { GiftButton } from "@/components/gift/GiftButton";
import type { Policy, Voucher } from "@/lib/private/service";
import { HISTORY_LABEL, INELIGIBLE_REASON, PLAN_LABEL, brl, dateBR, postJson, usePrivateData, usePublicPolicies, type Panel } from "./usePrivateData";

export type OfferOption = { id: string; planId: string; name: string; price: string; amount: number };

const card = "rounded-[var(--radius-lg)] border border-white/10 bg-ink-900 p-6 sm:p-8";

function Rules({ p }: { p: Policy }) {
  const rows: [string, string][] = [
    ["Valor", brl(p.valor)],
    ["Compra mínima", p.compra_minima > 0 ? brl(p.compra_minima) : "Sem mínimo"],
    ["Limite do desconto", `até ${p.desconto_max_percentual.toLocaleString("pt-BR")}% do pedido`],
    ["Validade", `${p.validade_dias} dias após a ativação`],
    ["Uso", "1 vez por cliente, pessoal e intransferível"],
    ["Cumulativo", p.cumulativo ? "Sim" : "Não, com outros benefícios ou cupons"],
    ["Onde vale", p.somente_presente ? "Compras de presente" : "Qualquer compra elegível"],
  ];
  return (
    <dl className="m-0 grid gap-x-6 gap-y-2 text-[14px] sm:grid-cols-[auto_1fr]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-paper-0/50">{k}</dt>
          <dd className="m-0 text-paper-0/85">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Terms({ p }: { p: Policy }) {
  return (
    <details className="group mt-5 border-t border-white/10 pt-4">
      <summary className="cursor-pointer text-[13px] text-paper-0/60 marker:text-paper-0/30 hover:text-paper-0">Termos (versão {p.termos_versao})</summary>
      <p className="m-0 mt-3 text-[13px] leading-relaxed text-paper-0/60">{p.termos_texto}</p>
    </details>
  );
}

export default function BenefitsPanel({ offers }: { offers: OfferOption[] }) {
  const pub = usePublicPolicies();
  const { data, reload } = usePrivateData();

  if (pub.status === "loading" || data.state === "loading") {
    return (
      <div className={card} role="status">
        <span className="sr-only">Carregando benefícios…</span>
        <div className="flex flex-col gap-3" aria-hidden>
          <div className="h-6 w-64 max-w-full animate-pulse rounded-full bg-white/10" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded-full bg-white/[0.07]" />
          <div className="h-4 w-56 animate-pulse rounded-full bg-white/[0.07]" />
        </div>
      </div>
    );
  }

  if (pub.status === "unavailable" || data.state === "unavailable" || pub.status === "error" || data.state === "error") {
    return (
      <div className={card} role="alert">
        <p className="m-0 flex items-center gap-2 font-display text-[20px] font-medium text-paper-0">
          <AlertCircle size={18} aria-hidden /> Benefícios indisponíveis no momento.
        </p>
        <p className="m-0 mt-2 text-[15px] text-paper-0/60">Nada foi alterado no seu benefício. Tente novamente em instantes.</p>
      </div>
    );
  }

  if (data.state === "ready") return <Authenticated panel={data.panel} offers={offers} reload={reload} />;

  // Visitante sem sessão: só benefícios ativos e regras públicas.
  if (pub.politicas.length === 0) {
    return (
      <div className={card} role="status">
        <p className="m-0 font-display text-[20px] font-medium text-paper-0">Nenhum benefício ativo no momento.</p>
        <p className="m-0 mt-2 text-[15px] text-paper-0/60">Quando houver, ele aparece aqui com todas as regras.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {pub.politicas.map((p) => (
        <article key={p.codigo} className={card} aria-labelledby={`pol-${p.codigo}`}>
          <h2 id={`pol-${p.codigo}`} className="m-0 font-display text-[24px] font-medium tracking-[-0.02em] text-paper-0">
            {p.nome}
          </h2>
          <p className="m-0 mt-2 text-[15px] text-paper-0/65">{p.descricao}</p>
          <div className="mt-6">
            <Rules p={p} />
          </div>
          <Terms p={p} />
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
            <Link href="/private-access" className="inline-flex min-h-12 items-center rounded-full bg-[var(--gift-accent)] px-7 text-sm font-medium text-ink-950">
              Acessar com meu link pessoal
            </Link>
            <span className="text-[13px] text-paper-0/50">O código é gerado só para clientes identificados.</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function Authenticated({ panel, offers, reload }: { panel: Panel; offers: OfferOption[]; reload: () => Promise<void> }) {
  if (panel.politicas.length === 0 && panel.vouchers.length === 0) {
    return (
      <div className={card} role="status">
        <p className="m-0 font-display text-[20px] font-medium text-paper-0">Nenhum benefício ativo para você agora.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {panel.politicas.map((p) => (
        <PolicyCard key={p.codigo} p={p} voucher={panel.vouchers.find((v) => v.politica === p.codigo)} panel={panel} offers={offers} reload={reload} />
      ))}
      <History panel={panel} />
    </div>
  );
}

function PolicyCard({ p, voucher, panel, offers, reload }: { p: Policy; voucher?: Voucher; panel: Panel; offers: OfferOption[]; reload: () => Promise<void> }) {
  const eligibleOffers = offers.filter((o) => p.planos_permitidos.includes(o.planId) && o.amount >= p.compra_minima);
  const [offerId, setOfferId] = useState(eligibleOffers[0]?.id ?? "");
  const [isGift, setIsGift] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  // Chave de idempotência por tentativa: reenvio (duplo clique, rede) não duplica.
  const [idemKey, setIdemKey] = useState(() => crypto.randomUUID());
  const [copied, setCopied] = useState(false);

  async function issue() {
    setBusy(true);
    setMsg(null);
    const r = await postJson("/api/private/benefits/issue", { politica: p.codigo }).catch(() => null);
    setBusy(false);
    if (!r?.ok) setMsg({ tone: "err", text: r?.json?.message ?? "Não foi possível ativar agora." });
    await reload();
  }

  async function reserve() {
    if (!voucher) return;
    setBusy(true);
    setMsg(null);
    const r = await postJson("/api/private/benefits/reserve", { voucherId: voucher.id, offerId, presente: isGift, idempotencyKey: idemKey }).catch(() => null);
    setBusy(false);
    if (!r) return setMsg({ tone: "err", text: "Sem conexão. Tente de novo — não haverá cobrança duplicada." });
    if (!r.ok) {
      setMsg({ tone: "err", text: r.json.message ?? "Não foi possível usar o benefício." });
      setIdemKey(crypto.randomUUID());
      return reload();
    }
    setCheckoutUrl(r.json.checkoutUrl);
    setMsg({ tone: "ok", text: `Benefício reservado: ${brl(r.json.desconto)} de desconto. A reserva vale até ${new Date(r.json.expiraEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.` });
    await reload();
  }

  async function cancel() {
    if (!voucher?.reserva) return;
    setBusy(true);
    await postJson("/api/private/benefits/cancel", { resgateId: voucher.reserva.id }).catch(() => null);
    setBusy(false);
    setCheckoutUrl(null);
    setIdemKey(crypto.randomUUID());
    setMsg({ tone: "ok", text: "Reserva cancelada. O benefício continua disponível." });
    await reload();
  }

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const statusText: Record<Voucher["status"], string> = {
    disponivel: "Disponível",
    reservado: "Checkout em andamento",
    resgatado: "Utilizado",
    expirado: "Expirado",
    cancelado: "Cancelado",
  };
  const checkoutOn = panel.checkoutMode === "coupon_param";
  const reservaUrl = checkoutUrl ?? voucher?.reserva?.checkoutUrl ?? null;

  return (
    <article className={card} aria-labelledby={`pol-${p.codigo}`} data-voucher-status={voucher?.status ?? "nao_emitido"}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 id={`pol-${p.codigo}`} className="m-0 font-display text-[24px] font-medium tracking-[-0.02em] text-paper-0">
          {p.nome}
        </h2>
        {voucher && (
          <span className={`rounded-full px-3 py-1 text-[12px] ${voucher.status === "disponivel" ? "bg-[var(--gift-accent)] text-ink-950" : "border border-white/20 text-paper-0/70"}`}>
            {statusText[voucher.status]}
          </span>
        )}
      </div>
      <p className="m-0 mt-2 text-[15px] text-paper-0/65">{p.descricao}</p>
      <div className="mt-6">
        <Rules p={p} />
      </div>

      {!voucher && p.elegibilidade === "elegivel" && (
        <GiftButton variant="accent" className="mt-6" onClick={() => void issue()} disabled={busy}>
          {busy ? "Ativando…" : "Ativar e gerar meu código"}
        </GiftButton>
      )}
      {!voucher && p.elegibilidade !== "elegivel" && (
        <p className="m-0 mt-6 rounded-[var(--radius-sm)] border border-white/10 bg-white/[0.03] p-4 text-[14px] text-paper-0/70" data-state="nao_elegivel">
          {INELIGIBLE_REASON[p.elegibilidade ?? ""] ?? "Este benefício não se aplica ao seu cadastro."}
        </p>
      )}

      {voucher && (
        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-[14px]">
            <span className="text-paper-0/60">
              Válido até <span className="text-paper-0">{dateBR(voucher.expira_em)}</span>
            </span>
            <span className="text-paper-0/60">
              Ativado em <span className="text-paper-0">{dateBR(voucher.emitido_em)}</span>
            </span>
          </div>

          {voucher.codigo ? (
            <div className="flex flex-wrap items-center gap-3">
              <code className="rounded-[var(--radius-sm)] border border-white/15 bg-ink-950 px-4 py-3 font-mono text-[16px] tracking-[0.08em] text-paper-0" aria-label="Seu código de resgate">
                {voucher.codigo}
              </code>
              <button type="button" onClick={() => void copy(voucher.codigo!)} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/20 px-4 text-[13px] text-paper-0/80 hover:text-paper-0">
                <Copy size={13} aria-hidden /> {copied ? "Copiado" : "Copiar código"}
              </button>
            </div>
          ) : (
            <p className="m-0 text-[13px] text-paper-0/50">Código final ···{voucher.codigo_final}</p>
          )}

          {voucher.status === "disponivel" && (
            <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-white/10 p-5">
              <span className="text-[11px] uppercase tracking-[var(--ls-caps)] text-paper-0/55">Usar no checkout</span>
              {eligibleOffers.length === 0 ? (
                <p className="m-0 text-[14px] text-paper-0/60">Nenhuma opção de presente disponível agora para este benefício.</p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Presente">
                    {eligibleOffers.map((o) => (
                      <label key={o.id} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-[14px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--gift-accent)] ${offerId === o.id ? "border-[var(--gift-accent)]/70 text-paper-0" : "border-white/15 text-paper-0/70"}`}>
                        <input type="radio" name={`offer-${p.codigo}`} value={o.id} checked={offerId === o.id} onChange={() => setOfferId(o.id)} className="sr-only" />
                        {o.name} · {o.price}
                      </label>
                    ))}
                  </div>
                  {p.somente_presente && (
                    <label className="flex cursor-pointer items-start gap-3 text-[14px] text-paper-0/75">
                      <input type="checkbox" checked={isGift} onChange={(e) => setIsGift(e.target.checked)} className="mt-1 h-4 w-4 accent-[#D4FC3C]" />
                      Confirmo que esta compra é um presente.
                    </label>
                  )}
                  <GiftButton
                    variant="accent"
                    className="self-start"
                    disabled={busy || !checkoutOn || !offerId || (p.somente_presente && !isGift)}
                    onClick={() => void reserve()}
                  >
                    {busy ? "Reservando…" : "Usar benefício no checkout"}
                  </GiftButton>
                  {!checkoutOn && (
                    <p className="m-0 text-[13px] text-paper-0/50" data-state="checkout_off">
                      O resgate direto no checkout está sendo habilitado com o meio de pagamento. Seu benefício segue válido até {dateBR(voucher.expira_em)}.
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {voucher.status === "reservado" && (
            <div className="flex flex-wrap items-center gap-3">
              {reservaUrl && (
                <a href={reservaUrl} rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--gift-accent)] px-7 text-sm font-medium text-ink-950">
                  Ir para o checkout <ExternalLink size={14} aria-hidden />
                </a>
              )}
              <GiftButton variant="ghost" onClick={() => void cancel()} disabled={busy}>
                Cancelar reserva
              </GiftButton>
              {voucher.reserva && (
                <span className="text-[13px] text-paper-0/55">
                  {PLAN_LABEL[voucher.reserva.plano] ?? voucher.reserva.plano} · desconto {brl(voucher.reserva.valor_desconto)}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {msg && (
        <p role={msg.tone === "err" ? "alert" : "status"} className={`m-0 mt-4 text-[14px] ${msg.tone === "err" ? "text-red-300" : "text-paper-0/80"}`}>
          {msg.text}
        </p>
      )}
      <Terms p={p} />
    </article>
  );
}

function History({ panel }: { panel: Panel }) {
  return (
    <section className={card} aria-labelledby="historico-title">
      <h2 id="historico-title" className="m-0 font-display text-[20px] font-medium text-paper-0">
        Histórico de uso
      </h2>
      {panel.historico.length === 0 ? (
        <p className="m-0 mt-3 text-[14px] text-paper-0/55">Nenhum uso registrado ainda.</p>
      ) : (
        <ul className="m-0 mt-4 flex list-none flex-col divide-y divide-white/10 p-0">
          {panel.historico.map((h) => (
            <li key={h.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-[14px]">
              <span className="text-paper-0/85">
                {HISTORY_LABEL[h.status] ?? h.status} · {PLAN_LABEL[h.plano] ?? h.plano}
              </span>
              <span className="font-mono text-[13px] text-paper-0/60">
                {brl(h.valor_desconto)} · {dateBR(h.confirmado_em ?? h.encerrado_em ?? h.reservado_em)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
