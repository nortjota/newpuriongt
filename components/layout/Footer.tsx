import Image from "next/image";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";

export default function Footer() {
  return (
    <footer className="m-[10px] overflow-hidden rounded-[var(--radius-lg)] bg-ink-950 px-6 pt-16 text-paper-0">
      <div className="mx-auto flex max-w-[var(--content-max)] flex-wrap justify-between gap-8">
        <div className="flex max-w-[340px] flex-col gap-3">
          <Image src="/logo-mark.png" alt="PURION GT" width={22} height={22} className="h-[22px] w-auto" />
          <span className="text-sm leading-relaxed text-[var(--text-inverse-muted)]">
            Exala presença. Deixa memória.
          </span>
        </div>
        <div className="flex flex-wrap gap-7 text-sm">
          <a href="https://instagram.com/puriongt" target="_blank" rel="noreferrer" className="text-paper-0">
            Instagram @puriongt
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-paper-0">
            WhatsApp
          </a>
          <a href="/privacy" className="text-[var(--text-inverse-muted)]">
            Política de Privacidade
          </a>
          <a href="/terms" className="text-[var(--text-inverse-muted)]">
            Termos
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[var(--content-max)] flex-wrap justify-between gap-3 border-t border-[var(--border-inverse)] pt-[18px] text-xs text-[var(--text-inverse-muted)]">
        <span>© 2026 Purion GT. Todos os direitos reservados.</span>
        <span className="font-mono">Feito no Brasil</span>
      </div>

      <div
        aria-hidden
        className="mt-6 -mb-[0.12em] whitespace-nowrap text-center font-display text-[clamp(120px,24vw,400px)] leading-[0.78] tracking-[-0.07em] text-ink-800"
        style={{ fontVariationSettings: "'wdth' 88" }}
      >
        PURION GT
      </div>
    </footer>
  );
}
