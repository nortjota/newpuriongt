"use client";

import { useEffect } from "react";
import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";

// Estado de erro da rota: algo falhou ao montar o catálogo/página.
// O visitante sempre tem uma saída (tentar de novo, home ou WhatsApp).
export default function PresentesError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[presentes] erro ao carregar a página", error.digest ?? error.message);
  }, [error]);

  return (
    <div role="alert" className="flex min-h-[100svh] flex-1 items-center justify-center bg-ink-950 px-6 text-paper-0">
      <div className="flex max-w-[480px] flex-col items-start gap-5">
        <h1 className="m-0 font-display text-[32px] font-medium leading-tight tracking-[-0.03em]">
          Não conseguimos carregar os presentes agora.
        </h1>
        <p className="m-0 text-[15px] leading-relaxed text-paper-0/65">
          Tente novamente em instantes. Se preferir, fale com a gente no WhatsApp e ajudamos você a escolher.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="min-h-12 rounded-full bg-[#D4FC3C] px-6 text-sm font-medium text-ink-950 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D4FC3C]"
          >
            Tentar novamente
          </button>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center rounded-full border border-white/25 px-6 text-sm font-medium"
          >
            Falar no WhatsApp
          </a>
          <Link href="/" className="inline-flex min-h-12 items-center px-2 text-sm text-paper-0/70 underline underline-offset-4">
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
