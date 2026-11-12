import type { ReactNode } from "react";

// Cabeçalho editorial reutilizado pelas seções da PURION GIFT: eyebrow em
// caixa alta, título em Archivo comprimido e um parágrafo opcional.
export default function SectionHeading({
  id,
  eyebrow,
  title,
  children,
  align = "left",
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <div className={`flex flex-col gap-5 ${centered ? "items-center text-center" : ""}`}>
      <span className="flex items-center gap-2.5 text-[11px] uppercase tracking-[var(--ls-caps)] text-[var(--text-inverse-muted)]">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--gift-accent)]" />
        {eyebrow}
      </span>
      <h2
        id={id}
        className="m-0 max-w-[16ch] text-balance font-display text-[clamp(36px,6vw,72px)] font-medium leading-[0.95] tracking-[-0.035em] text-paper-0"
        style={{ fontVariationSettings: "'wdth' 88" }}
      >
        {title}
      </h2>
      {children && (
        <div className={`max-w-[52ch] text-[16px] leading-relaxed text-paper-0/70 sm:text-[17px] ${centered ? "mx-auto" : ""}`}>
          {children}
        </div>
      )}
    </div>
  );
}
