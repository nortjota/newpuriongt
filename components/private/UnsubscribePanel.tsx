"use client";

import { useEffect, useRef, useState } from "react";
import { TRANSACTIONAL_NOTE } from "@/lib/private/consent-texts";
import { GiftButton } from "@/components/gift/GiftButton";
import { postJson } from "./usePrivateData";

// Descadastro em um clique (token no fragmento #u=, fora de logs). Pede
// confirmação para que pré-carregamentos de links não descadastrem sozinhos.
export default function UnsubscribePanel() {
  const token = useRef<string | null>(null);
  const [state, setState] = useState<"ready" | "missing" | "sending" | "done" | "invalid" | "error">("ready");

  useEffect(() => {
    const t = new URLSearchParams(window.location.hash.slice(1)).get("u");
    window.history.replaceState(window.history.state, "", window.location.pathname);
    token.current = t;
    // Leitura única do fragmento da URL (API do navegador).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!t) setState("missing");
  }, []);

  async function confirm() {
    setState("sending");
    const r = await postJson("/api/private/unsubscribe", { token: token.current }).catch(() => null);
    setState(!r ? "error" : r.ok ? "done" : r.status === 400 ? "invalid" : "error");
  }

  const box = "rounded-[var(--radius-lg)] border border-white/10 bg-ink-900 p-6 sm:p-8 text-[15px] leading-relaxed text-paper-0/75";
  if (state === "done")
    return (
      <div className={box} role="status">
        <p className="m-0 text-paper-0">Pronto. Você não receberá mais novidades da PURION GT por e-mail ou WhatsApp.</p>
        <p className="m-0 mt-3 text-[13px] text-paper-0/50">{TRANSACTIONAL_NOTE}</p>
      </div>
    );
  if (state === "missing" || state === "invalid")
    return (
      <div className={box} role="alert">
        Link de descadastro inválido. Use o link mais recente do e-mail ou, se tiver acesso, ajuste suas preferências no Private Access.
      </div>
    );
  return (
    <div className={box}>
      <p className="m-0">Confirme para parar de receber novidades e benefícios da PURION GT por e-mail e WhatsApp.</p>
      <p className="m-0 mt-3 text-[13px] text-paper-0/50">{TRANSACTIONAL_NOTE}</p>
      {state === "error" && (
        <p role="alert" className="m-0 mt-3 text-red-300">
          Não foi possível concluir agora. Tente novamente.
        </p>
      )}
      <GiftButton variant="light" className="mt-5" onClick={() => void confirm()} disabled={state === "sending"}>
        {state === "sending" ? "Cancelando…" : "Confirmar descadastro"}
      </GiftButton>
    </div>
  );
}
