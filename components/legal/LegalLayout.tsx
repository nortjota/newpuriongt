import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

export default function LegalLayout({
  icon: Icon,
  eyebrow,
  title,
  updatedAt,
  intro,
  sections,
}: {
  icon: ComponentType<{ size?: number }>;
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <main className="mx-auto max-w-[var(--content-max)] px-6 py-24 sm:py-32">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-ink-950"
      >
        <ArrowLeft size={15} />
        Voltar para o site
      </Link>

      <div className="mt-8 flex flex-col gap-5 border-b border-[var(--border-subtle)] pb-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-950 text-paper-0">
          <Icon size={20} />
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">{eyebrow}</span>
          <h1
            className="m-0 font-display text-[clamp(32px,5vw,56px)] font-medium leading-[0.95] tracking-[-0.03em] text-ink-950"
            style={{ fontVariationSettings: "'wdth' 88" }}
          >
            {title}
          </h1>
        </div>
        <span className="font-mono text-xs text-[var(--text-muted)]">Última atualização: {updatedAt}</span>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[220px_minmax(0,680px)]">
        <nav className="hidden lg:block">
          <div className="sticky top-28 flex flex-col gap-1">
            <span className="mb-2 text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
              Nesta página
            </span>
            <ol className="flex flex-col gap-1">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-1.5 text-[13px] leading-snug text-[var(--text-secondary)] transition-colors hover:bg-paper-100 hover:text-ink-950"
                  >
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="flex flex-col gap-10 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          <div className="flex flex-col gap-3 [&_a]:text-ink-950 [&_a]:underline">{intro}</div>

          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-[var(--border-subtle)] pt-8">
              <div className="flex items-center gap-3.5">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-paper-100 font-mono text-xs text-ink-950">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2
                  className="m-0 font-display text-xl font-medium tracking-[-0.01em] text-ink-950"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  {s.title}
                </h2>
              </div>
              <div className="mt-4 flex flex-col gap-3 pl-[46px] [&_a]:text-ink-950 [&_a]:underline [&_li]:leading-relaxed [&_strong]:text-ink-950 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
                {s.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
