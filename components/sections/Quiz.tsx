import { ArrowRight, Building2, Route, Moon } from "lucide-react";
import { QUIZ_QUESTIONS } from "@/lib/content/quiz";

const ICONS = { "building-2": Building2, route: Route, moon: Moon } as const;

// Estado padrão (Marco 1): primeira pergunta, como no carregamento inicial do protótipo.
export default function Quiz() {
  const firstQuestion = QUIZ_QUESTIONS[0];

  return (
    <section id="quiz" className="mx-auto max-w-[var(--content-max)] px-6 pb-[var(--section-y)]">
      <div className="grid gap-10 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-paper-0 p-6 sm:p-14 [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2.5 text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
            <span className="h-2 w-2 rounded-full bg-signal-400" />
            <span>Quiz · 30 segundos</span>
          </div>
          <div className="font-display text-[var(--fs-display-l)] font-medium leading-[0.9] tracking-[var(--ls-display)] text-steel-300">
            <div>Descubra seu</div>
            <div>perfil olfativo.</div>
          </div>
          <p className="m-0 max-w-[400px] text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Cinco perguntas sobre como você dirige e vive o carro. No fim, a camada do Purion GT que mais combina com
            você.
          </p>
          <div className="mt-auto flex flex-col gap-2.5">
            <div className="flex gap-1.5">
              {QUIZ_QUESTIONS.map((_, i) => (
                <span key={i} className={`h-1 flex-1 rounded ${i === 0 ? "bg-signal-400" : "bg-[var(--border-strong)]"}`} />
              ))}
            </div>
            <span className="font-mono text-xs text-[var(--text-muted)]">01 / 0{QUIZ_QUESTIONS.length}</span>
          </div>
        </div>

        <div className="flex min-h-[440px] flex-col justify-center gap-5.5">
          <h3
            className="m-0 font-display text-[clamp(36px,4vw,56px)] font-medium leading-[0.95] tracking-[-0.045em]"
            style={{ fontVariationSettings: "'wdth' 88" }}
          >
            {firstQuestion.q}
          </h3>
          <div className="flex flex-col gap-2.5">
            {firstQuestion.options.map((opt) => {
              const Icon = ICONS[opt.icon as keyof typeof ICONS] ?? ArrowRight;
              return (
                <div
                  key={opt.label}
                  className="flex items-center gap-4 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-paper-50 py-3.5 pl-3.5 pr-4.5 text-base text-ink-950"
                >
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-paper-0">
                    <Icon size={18} />
                  </span>
                  <span className="flex-1">{opt.label}</span>
                  <ArrowRight size={16} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
