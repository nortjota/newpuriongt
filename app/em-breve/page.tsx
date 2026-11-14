import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";

// Destino de todos os botões de compra enquanto as vendas estiverem pausadas
// (CHECKOUT_PAUSED em lib/content/checkout-links.ts).
export const metadata: Metadata = {
  title: "Em breve — PURION GT",
  description: "O estoque do PURION GT esgotou. Estamos preparando o próximo lote.",
  alternates: { canonical: "/em-breve" },
  robots: { index: false, follow: true },
};

const NOTIFY_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  "Olá! Quero ser avisado quando o PURION GT voltar ao estoque."
)}`;

export default function EmBrevePage() {
  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink-950 px-6 py-8 text-paper-0">
      <Link href="/" className="relative z-10 self-center" aria-label="PURION GT — página inicial">
        <Image src="/logo-white.png" alt="PURION GT" width={160} height={37} className="h-8 w-auto" priority />
      </Link>

      <div className="relative z-10 mx-auto my-auto grid w-full max-w-5xl items-center gap-10 py-12 md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-paper-0/70">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-400" aria-hidden />
            Estoque esgotado
          </span>
          <h1 className="m-0 font-display text-[clamp(72px,16vw,168px)] font-medium leading-[0.85] tracking-[-0.06em]">
            Em breve.
          </h1>
          <p className="m-0 max-w-md text-[17px] leading-relaxed text-paper-0/70">
            O PURION GT esgotou. Estamos preparando o próximo lote e avisamos você assim que ele estiver disponível.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={NOTIFY_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-signal-400 px-7 text-sm font-medium text-ink-950 transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle size={16} aria-hidden />
              Quero ser avisado
            </a>
            <Link
              href="/"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-7 text-sm font-medium text-paper-0"
            >
              <ArrowLeft size={16} aria-hidden />
              Voltar ao site
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
          <div className="absolute inset-x-[12%] bottom-[6%] h-[18%] rounded-full bg-signal-400/20 blur-3xl" aria-hidden />
          <Image src="/bottle.png" alt="Frasco PURION GT" fill sizes="(min-width: 768px) 384px, 80vw" className="object-contain opacity-90" />
        </div>
      </div>
    </main>
  );
}
