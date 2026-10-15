"use client";

import { useEffect, useState } from "react";
import Dialog from "@/components/ui/Dialog";
import { useExitIntent } from "@/lib/hooks/useExitIntent";
import { readFlag, setFlag } from "@/lib/hooks/useLocalStorageFlag";
import { supabase } from "@/lib/supabase/client";

const SEEN_KEY = "purion_email_v1";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailCaptureModal() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const show = () => {
    if (shown || readFlag(SEEN_KEY)) return;
    setShown(true);
    setFlag(SEEN_KEY);
    setOpen(true);
  };

  useEffect(() => {
    const t = setTimeout(show, 15000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useExitIntent(show, !shown);

  async function submit() {
    if (!EMAIL_RE.test(email)) {
      setError("Digite um e-mail válido.");
      return;
    }
    setError("");
    setDone(true);
    if (supabase) {
      await supabase.from("leads_site").insert({ email, pagina: "home" });
    }
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} width={500}>
      <div className="flex flex-col gap-4.5">
        <div
          className="-mx-6 -mt-6 mb-1 h-[180px] bg-cover sm:-mx-8 sm:-mt-8"
          style={{ backgroundImage: "url(/hero-banner.png)", backgroundPosition: "center 45%" }}
        />
        {!done ? (
          <div className="flex flex-col gap-4">
            <span className="text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
              Lista Purion
            </span>
            <h3
              className="m-0 font-display text-[40px] font-medium leading-[0.92] tracking-[-0.045em]"
              style={{ fontVariationSettings: "'wdth' 88" }}
            >
              Chegue antes de todo mundo.
            </h3>
            <p className="m-0 text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Lançamentos, kits e condições exclusivas direto no seu e-mail.
            </p>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="rounded-[var(--radius-md)] border border-[var(--border-strong)] px-4.5 py-4 text-[15px]"
            />
            {error && <span className="text-sm text-[var(--danger-500)]">{error}</span>}
            <button
              onClick={submit}
              className="w-full rounded-[var(--radius-pill)] bg-signal-400 py-4 text-sm font-medium text-ink-950"
            >
              Quero receber
            </button>
            <span className="text-center text-xs text-[var(--text-muted)]">Sem spam. Saia quando quiser.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            <h3
              className="m-0 font-display text-[40px] font-medium leading-[0.92] tracking-[-0.045em]"
              style={{ fontVariationSettings: "'wdth' 88" }}
            >
              Pronto. Você está na lista.
            </h3>
            <p className="m-0 text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Fique de olho na caixa de entrada.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="w-fit rounded-[var(--radius-pill)] bg-ink-950 px-5.5 py-3 text-sm font-medium text-paper-0"
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </Dialog>
  );
}
