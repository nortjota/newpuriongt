"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Copy, MessageCircle } from "lucide-react";
import { GiftButton } from "@/components/gift/GiftButton";
import { postJson } from "@/components/private/usePrivateData";
import { EXTRATO_LABEL, STATUS_LABEL, brl, dia, useJson, type ReferralPanel as Panel } from "./useReferralData";

const card = "rounded-[var(--radius-lg)] border border-white/10 bg-ink-900 p-6 sm:p-8";

// Área autenticada do indicador (sessão do Private Access).
export default function ReferralPanel() {
  const { load, reload } = useJson<Panel | { authenticated: false }>("/api/indicacoes/me");

  if (load.state === "loading") {
    return (
      <div className={card} role="status">
        <span className="sr-only">Carregando sua área de indicação…</span>
        <div className="flex flex-col gap-3" aria-hidden>
          <div className="h-6 w-56 animate-pulse rounded-full bg-white/10" />
          <div className="h-12 w-full animate-pulse rounded-full bg-white/[0.07]" />
        </div>
      </div>
    );
  }
  if (load.state !== "ready") {
    return (
      <div className={card} role="alert">
        <p className="m-0 flex items-center gap-2 font-display text-[20px] font-medium text-paper-0">
          <AlertCircle size={18} aria-hidden /> Indicações indisponíveis no momento.
        </p>
        <p className="m-0 mt-2 text-[15px] text-paper-0/60">Suas indicações e recompensas continuam registradas. Tente novamente mais tarde.</p>
      </div>
    );
  }
  const d = load.data;
  if (!d.authenticated) {
    return (
      <div className={card} data-state="anonimo">
        <h2 className="m-0 font-display text-[22px] font-medium text-paper-0">Seu link de indicação</h2>
        <p className="m-0 mt-2 text-[15px] text-paper-0/60">
          O link é pessoal e fica disponível para quem já comprou PURION GT. Acesse com o link individual que você recebeu.
        </p>
        <Link href="/private-access#ativar" className="mt-5 inline-flex min-h-12 items-center rounded-full bg-[var(--gift-accent)] px-7 text-sm font-medium text-ink-950">
          Acessar meu Private Access
        </Link>
      </div>
    );
  }
  if (!d.programa?.ativo) {
    return (
      <div className={card} data-state="programa_em_preparacao">
        <h2 className="m-0 font-display text-[22px] font-medium text-paper-0">Programa em preparação</h2>
        <p className="m-0 mt-2 text-[15px] text-paper-0/60">Avisaremos você assim que o programa de indicação abrir.</p>
      </div>
    );
  }
  return <Authenticated d={d} reload={reload} />;
}

function Authenticated({ d, reload }: { d: Panel; reload: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function act(url: string) {
    setBusy(true);
    setMsg(null);
    const r = await postJson(url, {}).catch(() => null);
    setBusy(false);
    if (!r?.ok) setMsg(r?.json?.message ?? "Não foi possível concluir agora.");
    await reload();
  }
  async function copy(text: string, what: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
    } catch {
      setCopied(null);
    }
  }
  const creditoAtivo = d.creditos.find((c) => c.status === "disponivel");

  return (
    <div className="flex flex-col gap-4">
      <section className={card} aria-labelledby="meu-link" data-state={d.link ? "com_link" : d.podeIndicar ? "sem_link" : "nao_elegivel"}>
        <h2 id="meu-link" className="m-0 font-display text-[22px] font-medium text-paper-0">
          Seu link de indicação
        </h2>
        {!d.podeIndicar ? (
          <p className="m-0 mt-3 text-[15px] text-paper-0/65">O link é liberado para quem já tem uma compra aprovada da PURION GT.</p>
        ) : !d.link ? (
          <>
            <p className="m-0 mt-2 text-[15px] text-paper-0/60">Gere seu link pessoal. Ele não mostra seu nome, e-mail nem telefone.</p>
            <GiftButton variant="accent" className="mt-5" onClick={() => void act("/api/indicacoes/link")} disabled={busy}>
              {busy ? "Gerando…" : "Gerar meu link"}
            </GiftButton>
          </>
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="ref-link">
                Seu link
              </label>
              <input
                id="ref-link"
                readOnly
                value={d.link}
                onFocus={(e) => e.currentTarget.select()}
                className="min-h-12 flex-1 rounded-[var(--radius-pill)] border border-white/12 bg-ink-950 px-5 font-mono text-[14px] text-paper-0"
              />
              <GiftButton variant="ghost" onClick={() => void copy(d.link!, "link")}>
                <Copy size={14} aria-hidden /> {copied === "link" ? "Copiado" : "Copiar link"}
              </GiftButton>
            </div>
            {d.whatsapp && (
              <a
                href={d.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-full bg-[var(--gift-accent)] px-7 text-sm font-medium text-ink-950"
              >
                <MessageCircle size={16} aria-hidden /> Compartilhar no WhatsApp
              </a>
            )}
            <p className="m-0 text-[12px] text-paper-0/45">O WhatsApp abre com a mensagem pronta; você escolhe para quem enviar.</p>
          </div>
        )}
        {msg && (
          <p role="alert" className="m-0 mt-4 text-[14px] text-red-300">
            {msg}
          </p>
        )}
      </section>

      <section className={card} aria-labelledby="minhas-recompensas">
        <h2 id="minhas-recompensas" className="m-0 font-display text-[22px] font-medium text-paper-0">
          Suas recompensas
        </h2>
        <dl className="m-0 mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[var(--radius-md)] border border-white/10 p-4">
            <dt className="text-[12px] uppercase tracking-[0.1em] text-paper-0/50">Em validação</dt>
            <dd className="m-0 mt-1 font-mono text-[24px] text-paper-0" data-testid="saldo-pendente">
              {brl(d.saldo.pendente)}
            </dd>
          </div>
          <div className="rounded-[var(--radius-md)] border border-white/10 p-4">
            <dt className="text-[12px] uppercase tracking-[0.1em] text-paper-0/50">Disponível</dt>
            <dd className="m-0 mt-1 font-mono text-[24px] text-paper-0" data-testid="saldo-disponivel">
              {brl(d.saldo.disponivel)}
            </dd>
          </div>
        </dl>
        <p className="m-0 mt-3 text-[13px] text-paper-0/50">
          {d.resumo.visitantes} {d.resumo.visitantes === 1 ? "pessoa abriu" : "pessoas abriram"} seu link · {d.resumo.aprovadas} recompensa(s) liberada(s)
        </p>

        {creditoAtivo ? (
          <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-5">
            <span className="text-[13px] text-paper-0/60">
              Código de crédito ({brl(creditoAtivo.valor)}) · válido até {new Date(creditoAtivo.expira_em).toLocaleDateString("pt-BR")}
            </span>
            {creditoAtivo.codigo && (
              <div className="flex flex-wrap items-center gap-3">
                <code aria-label="Seu código de crédito" className="rounded-[var(--radius-sm)] border border-white/15 bg-ink-950 px-4 py-3 font-mono text-[15px] tracking-[0.06em] text-paper-0">
                  {creditoAtivo.codigo}
                </code>
                <button type="button" onClick={() => void copy(creditoAtivo.codigo!, "credito")} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/20 px-4 text-[13px] text-paper-0/80">
                  <Copy size={13} aria-hidden /> {copied === "credito" ? "Copiado" : "Copiar"}
                </button>
              </div>
            )}
            <p className="m-0 text-[12px] text-paper-0/45">
              {d.checkoutMode === "coupon_param" ? "Informe o código no checkout." : "O uso do crédito no checkout está sendo habilitado. Seu saldo está garantido."}
            </p>
          </div>
        ) : (
          d.saldo.disponivel > 0 && (
            <GiftButton variant="light" className="mt-5" onClick={() => void act("/api/indicacoes/credito")} disabled={busy}>
              Gerar código com meu crédito
            </GiftButton>
          )
        )}
      </section>

      <section className={card} aria-labelledby="historico-indicacoes">
        <h2 id="historico-indicacoes" className="m-0 font-display text-[22px] font-medium text-paper-0">
          Histórico de indicações
        </h2>
        {d.indicacoes.length === 0 ? (
          <p className="m-0 mt-3 text-[14px] text-paper-0/55">Nenhuma indicação ainda. Compartilhe seu link para começar.</p>
        ) : (
          <ul className="m-0 mt-4 flex list-none flex-col divide-y divide-white/10 p-0">
            {d.indicacoes.map((i, n) => (
              <li key={n} className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-[14px]" data-status={i.status}>
                <span className="text-paper-0/85">
                  Indicação {d.indicacoes.length - n} · {STATUS_LABEL[i.status] ?? i.status}
                </span>
                <span className="font-mono text-[13px] text-paper-0/60">
                  {i.recompensa !== null ? `${brl(i.recompensa)} · ` : ""}
                  {i.liberacao_prevista ? `libera em ${dia(i.liberacao_prevista)}` : dia(i.data)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {d.extrato.length > 0 && (
          <details className="mt-5 border-t border-white/10 pt-4">
            <summary className="cursor-pointer text-[13px] text-paper-0/60 hover:text-paper-0">Extrato de recompensas</summary>
            <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0 text-[13px]">
              {d.extrato.map((e, n) => (
                <li key={n} className="flex justify-between gap-3 text-paper-0/70">
                  <span>
                    {EXTRATO_LABEL[e.tipo] ?? e.tipo} · {e.bucket === "pendente" ? "em validação" : "disponível"}
                  </span>
                  <span className="font-mono">
                    {brl(e.valor)} · {dia(e.data)}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>
    </div>
  );
}
