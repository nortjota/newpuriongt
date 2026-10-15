import { JOURNEY_STEPS } from "@/lib/content/journey";

// Versão estática (Marco 1). O scrollytelling pinado com partículas, anel de
// progresso animado e crossfade entre os passos vem no Marco 6.
export default function SprayJourney() {
  return (
    <section className="relative m-[10px] overflow-hidden rounded-[var(--radius-lg)] bg-ink-950 text-paper-0">
      <div
        className="absolute inset-0 bg-cover"
        style={{ backgroundImage: "url(/hero-street.png)", backgroundPosition: "center 55%" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg,rgba(11,12,14,.82) 0%,rgba(11,12,14,.5) 55%,rgba(11,12,14,.25) 100%)" }}
      />
      <div className="relative flex flex-col gap-10 px-6 py-24 sm:px-10">
        <div className="flex items-center gap-3.5 text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
          <span>A viagem de uma borrifada</span>
          <span className="h-px flex-1 bg-[var(--border-inverse)]" />
          <span className="font-mono">GT · 60 ml</span>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {JOURNEY_STEPS.map((step) => (
            <div key={step.label} className="flex flex-col gap-4">
              <span className="font-mono text-[13px] text-signal-400">{step.time}</span>
              <span
                className="font-display text-[clamp(32px,4vw,56px)] font-medium leading-[0.9] tracking-[-0.045em]"
                style={{ fontVariationSettings: "'wdth' 88" }}
              >
                {step.title}
              </span>
              <span className="max-w-[300px] text-sm leading-relaxed text-[var(--text-inverse-muted)]">{step.body}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
