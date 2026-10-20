import Image from "next/image";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";

const INSTITUCIONAL = [
  { href: "#historia", label: "Nossa história" },
  { href: "#fragrancia", label: "Fragrância" },
  { href: "#avaliacoes", label: "Avaliações" },
  { href: "#parceiros", label: "Seja um parceiro" },
  { href: "/privacy", label: "Política de Privacidade" },
  { href: "/terms", label: "Termos de Uso" },
];

const ATENDIMENTO = [
  { href: WHATSAPP_URL, label: "Falar no WhatsApp", external: true },
  { href: "#faq", label: "Perguntas frequentes" },
  { href: "https://instagram.com/puriongt", label: "Instagram @puriongt", external: true },
  { href: "mailto:puriongt@gmail.com", label: "puriongt@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="m-[10px] overflow-hidden rounded-[var(--radius-lg)] bg-ink-950 px-6 pt-16 text-paper-0">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-10 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
        <div className="flex max-w-[340px] flex-col items-start gap-3">
          <Image src="/logo-white.png" alt="PURION GT" width={150} height={37} className="h-7 w-auto flex-none" />
          <span className="text-sm leading-relaxed text-[var(--text-inverse-muted)]">
            Exala presença. Deixa memória.
          </span>
        </div>

        <div className="flex flex-col gap-3.5">
          <span className="text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
            Institucional
          </span>
          {INSTITUCIONAL.map((link) => (
            <a key={link.label} href={link.href} className="text-sm text-paper-0/90 hover:text-paper-0">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-3.5">
          <span className="text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
            Central de Atendimento
          </span>
          {ATENDIMENTO.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="text-sm text-paper-0/90 hover:text-paper-0"
            >
              {link.label}
            </a>
          ))}
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
