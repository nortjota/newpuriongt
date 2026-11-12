"use client";

import { useId, useState } from "react";
import { Copy, Send } from "lucide-react";
import { GIFT_FEATURES } from "@/lib/content/gifts";
import { GiftButton } from "./GiftButton";

const MAX = 280;

// Dedicatória: enquanto o cartão impresso não existe (GIFT_FEATURES), o
// visitante escreve aqui e envia a mensagem por conta própria — copiando ou
// abrindo o WhatsApp com o texto pronto para escolher o contato. Nada é
// prometido como "vai junto no pedido".
export default function DedicationComposer() {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");
  const [status, setStatus] = useState("");
  const baseId = useId();

  const body = message.trim();
  const fullText = [to.trim() && `${to.trim()},`, body, from.trim() && `— ${from.trim()}`].filter(Boolean).join("\n\n");
  const disabled = body.length === 0;

  async function copy() {
    try {
      await navigator.clipboard.writeText(fullText);
      setStatus("Dedicatória copiada.");
    } catch {
      setStatus("Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.");
    }
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
  const fieldClass =
    "w-full rounded-[var(--radius-sm)] border border-white/12 bg-white/[0.04] px-4 py-3 text-[15px] text-paper-0 placeholder:text-paper-0/35 transition-colors focus:border-signal-400/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-400/40";

  return (
    <div className="flex flex-col gap-5 rounded-[var(--radius-lg)] border border-white/10 bg-ink-900 p-6 sm:p-8">
      <div className="flex flex-col gap-1.5">
        <h3 className="m-0 font-display text-[22px] font-medium tracking-[-0.02em] text-paper-0">Escreva sua dedicatória</h3>
        <p className="m-0 text-[13px] leading-relaxed text-paper-0/55">
          {GIFT_FEATURES.printedDedication
            ? "Sua mensagem segue impressa junto com o pedido."
            : "O cartão impresso ainda não está disponível. Escreva aqui e envie sua mensagem a quem vai receber — por WhatsApp ou junto com o presente."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-[12px] uppercase tracking-[0.12em] text-paper-0/50" htmlFor={`${baseId}-to`}>
          Para
          <input
            id={`${baseId}-to`}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            maxLength={40}
            autoComplete="off"
            placeholder="Nome de quem recebe"
            className={`${fieldClass} normal-case tracking-normal`}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-[12px] uppercase tracking-[0.12em] text-paper-0/50" htmlFor={`${baseId}-from`}>
          De
          <input
            id={`${baseId}-from`}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            maxLength={40}
            autoComplete="off"
            placeholder="Seu nome"
            className={`${fieldClass} normal-case tracking-normal`}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-[12px] uppercase tracking-[0.12em] text-paper-0/50" htmlFor={`${baseId}-msg`}>
        Mensagem
        <textarea
          id={`${baseId}-msg`}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setStatus("");
          }}
          maxLength={MAX}
          rows={4}
          aria-describedby={`${baseId}-count`}
          placeholder="Para você, que cuida do carro como cuida de quem ama…"
          className={`${fieldClass} resize-none normal-case leading-relaxed tracking-normal`}
        />
      </label>
      <span id={`${baseId}-count`} className="-mt-3 self-end font-mono text-[11px] text-paper-0/40">
        {message.length}/{MAX}
      </span>

      <div className="flex flex-col gap-3 sm:flex-row">
        <GiftButton variant="ghost" onClick={copy} disabled={disabled} className="sm:flex-1">
          <Copy size={15} aria-hidden />
          Copiar dedicatória
        </GiftButton>
        {disabled ? (
          <GiftButton variant="ghost" disabled className="sm:flex-1">
            <Send size={15} aria-hidden />
            Enviar por WhatsApp
          </GiftButton>
        ) : (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-white/25 bg-white/[0.06] px-7 py-3.5 text-sm font-medium text-paper-0 transition-colors hover:border-white/50 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-signal-400 sm:flex-1"
          >
            <Send size={15} aria-hidden />
            Enviar por WhatsApp
          </a>
        )}
      </div>
      <p role="status" aria-live="polite" className="m-0 min-h-[1.25em] text-[13px] text-signal-400">
        {status}
      </p>
    </div>
  );
}
