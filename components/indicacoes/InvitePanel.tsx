"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Copy, ExternalLink } from "lucide-react";
import { GiftButton } from "@/components/gift/GiftButton";
import { postJson } from "@/components/private/usePrivateData";
import { brl, useJson } from "./useReferralData";

type Convite = {
  programa: { ativo: boolean; desconto_indicado: number; compra_minima: number; janela_atribuicao_dias: number; termos_versao: string; termos_texto: string } | null;
  temConvite: boolean;
  convite: { cupom: string | null; desconto: number; expiraEm: string } | null;
};

export type InviteOffer = { id: string; name: string; price: string; amount: number };

const card = "rounded-[var(--radius-lg)] border border-white/10 bg-ink-900 p-6 sm:p-8";

const ESTADOS: Record<string, string> = {
  invalido: "Não reconhecemos este convite. Confira o link que você recebeu.",
  inativo: "Este convite não está mais ativo.",
};

// Página do indicado: ativa o convite (cupom pessoal) e vai ao checkout real.
export default function InvitePanel({ offers, estado }: { offers: InviteOffer[]; estado: string | null }) {
  const { load, reload } = useJson<Convite>("/api/indicacoes/convite");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [offerId, setOfferId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (load.state === "loading") return <div className={`${card} h-48 animate-pulse`} aria-hidden />;
  if (load.state !== "ready") {
    return (
      <div className={card} role="alert">
        <p className="m-0 flex items-center gap-2 text-[16px] text-paper-0">
          <AlertCircle size={18} aria-hidden /> Não foi possível carregar seu convite agora.
        </p>
        <Link href="/presentes" className="mt-4 inline-flex text-[14px] underline underline-offset-4">
          Conhecer os presentes
        </Link>
      </div>
    );
  }
  const { programa, temConvite, convite } = load.data;

  if (estado && ESTADOS[estado]) {
    return (
      <div className={card} role="alert" data-state={`convite_${estado}`}>
        <p className="m-0 text-[16px] text-paper-0">{ESTADOS[estado]}</p>
        <Link href="/presentes" className="mt-4 inline-flex min-h-12 items-center rounded-full border border-white/25 px-6 text-sm text-paper-0">
          Conhecer a PURION GT
        </Link>
      </div>
    );
  }
  if (!programa?.ativo || (!temConvite && !convite)) {
    return (
      <div className={card} data-state="sem_convite">
        <p className="m-0 text-[16px] text-paper-0">Para ganhar o desconto de indicação, abra o link de convite que você recebeu.</p>
        <Link href="/presentes" className="mt-4 inline-flex min-h-12 items-center rounded-full border border-white/25 px-6 text-sm text-paper-0">
          Conhecer a PURION GT
        </Link>
      </div>
    );
  }

  async function ativar() {
    setBusy(true);
    setMsg(null);
    const r = await postJson("/api/indicacoes/convite", {}).catch(() => null);
    setBusy(false);
    if (!r?.ok) setMsg(r?.json?.message ?? "Não foi possível ativar o convite.");
    await reload();
  }

  async function checkout() {
    if (!offerId) return;
    setBusy(true);
    setMsg(null);
    const r = await postJson("/api/indicacoes/convite/checkout", { offerId }).catch(() => null);
    setBusy(false);
    if (r?.ok && r.json.checkoutUrl) window.location.assign(r.json.checkoutUrl);
    else setMsg(r?.json?.message ?? "Não foi possível abrir o checkout.");
  }

  const elegiveis = offers.filter((o) => o.amount >= programa.compra_minima);

  if (!convite) {
    return (
      <div className={card} data-state="convite_disponivel">
        <p className="m-0 font-mono text-[32px] tracking-[-0.03em] text-paper-0">{brl(programa.desconto_indicado)}</p>
        <p className="m-0 mt-1 text-[16px] text-paper-0">de desconto na sua primeira compra PURION GT.</p>
        <p className="m-0 mt-2 text-[14px] text-paper-0/55">
          Para pedidos a partir de {brl(programa.compra_minima)}. Seu cupom é pessoal, de uso único e vale por {programa.janela_atribuicao_dias} dias.
        </p>
        <GiftButton variant="accent" className="mt-6" onClick={() => void ativar()} disabled={busy}>
          {busy ? "Ativando…" : "Ativar meu desconto"}
        </GiftButton>
        {msg && (
          <p role="alert" className="m-0 mt-4 text-[14px] text-paper-0/80">
            {msg}
          </p>
        )}
        <p className="m-0 mt-5 text-[12px] text-paper-0/40">Não pedimos nenhum dado para ativar o convite.</p>
      </div>
    );
  }

  return (
    <div className={card} data-state="convite_ativo">
      <p className="m-0 text-[14px] text-paper-0/60">Seu desconto de {brl(convite.desconto)} está ativo até {new Date(convite.expiraEm).toLocaleDateString("pt-BR")}.</p>
      {convite.cupom && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <code aria-label="Seu cupom de desconto" className="rounded-[var(--radius-sm)] border border-white/15 bg-ink-950 px-4 py-3 font-mono text-[16px] tracking-[0.06em] text-paper-0">
            {convite.cupom}
          </code>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(convite.cupom!).then(() => setCopied(true), () => setCopied(false));
            }}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/20 px-4 text-[13px] text-paper-0/80"
          >
            <Copy size={13} aria-hidden /> {copied ? "Copiado" : "Copiar cupom"}
          </button>
        </div>
      )}
      <fieldset className="m-0 mt-6 border-0 p-0">
        <legend className="mb-3 text-[11px] uppercase tracking-[var(--ls-caps)] text-paper-0/55">Escolha sua primeira PURION</legend>
        <div className="flex flex-wrap gap-2">
          {elegiveis.map((o) => (
            <label key={o.id} className={`flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-[14px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--gift-accent)] ${offerId === o.id ? "border-[var(--gift-accent)]/70 text-paper-0" : "border-white/15 text-paper-0/70"}`}>
              <input type="radio" name="oferta" value={o.id} checked={offerId === o.id} onChange={() => setOfferId(o.id)} className="sr-only" />
              {o.name} · {o.price}
            </label>
          ))}
        </div>
      </fieldset>
      <GiftButton variant="accent" className="mt-5" onClick={() => void checkout()} disabled={busy || !offerId}>
        Ir para o checkout <ExternalLink size={14} aria-hidden />
      </GiftButton>
      {msg && (
        <p role="alert" className="m-0 mt-4 text-[14px] text-paper-0/80" data-state="checkout_msg">
          {msg}
        </p>
      )}
    </div>
  );
}
