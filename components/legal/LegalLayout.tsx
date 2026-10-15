import type { ReactNode } from "react";
import Link from "next/link";

export default function LegalLayout({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-[720px] px-6 py-28 sm:py-36">
      <Link href="/" className="text-sm text-[var(--text-muted)] underline">
        ← Voltar para o site
      </Link>
      <h1
        className="mt-6 font-display text-[clamp(32px,5vw,56px)] font-medium leading-[0.95] tracking-[-0.03em]"
        style={{ fontVariationSettings: "'wdth' 88" }}
      >
        {title}
      </h1>
      <p className="mt-3 font-mono text-xs text-[var(--text-muted)]">Última atualização: {updatedAt}</p>
      <div className="prose-legal mt-10 flex flex-col gap-8 text-[15px] leading-relaxed text-[var(--text-secondary)]">
        {children}
      </div>
    </main>
  );
}
