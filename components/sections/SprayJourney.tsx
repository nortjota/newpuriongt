import Image from "next/image";
import { JOURNEY_STEPS } from "@/lib/content/journey";
import Reveal from "@/components/ui/Reveal";

export default function SprayJourney() {
  // Por pedido do usuário, essa seção some no desktop (o scrollytelling
  // pinado de 340dvh virou mais uma dor de cabeça que valia a pena — ver
  // histórico de tentativas de estabilizar). No mobile/tablet continua a
  // lista simples abaixo, inalterada.
  return (
    <section className="m-[10px] overflow-hidden rounded-[var(--radius-lg)] bg-ink-950 text-paper-0 lg:hidden">
      <div className="relative h-[220px] sm:h-[280px]">
        <Image src="/hero-street.png" alt="Estrada à noite vista de dentro do carro" fill className="object-cover" style={{ objectPosition: "center 55%" }} sizes="100vw" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(0deg,rgba(11,12,14,.85) 0%,rgba(11,12,14,.25) 60%,rgba(11,12,14,.1) 100%)" }}
        />
      </div>
      <div className="flex flex-col gap-1 px-6 pb-2 pt-6">
        <div className="mb-4 flex items-center gap-3.5 text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
          <span>A viagem de uma borrifada</span>
          <span className="h-px flex-1 bg-[var(--border-inverse)]" />
          <span className="font-mono">GT · 60 ml</span>
        </div>
        {JOURNEY_STEPS.map((step, i) => (
          <Reveal
            key={step.label}
            delay={i * 60}
            className={`flex flex-col gap-2 py-5 ${i < JOURNEY_STEPS.length - 1 ? "border-b border-[var(--border-inverse)]" : ""}`}
          >
            <span className="font-mono text-[13px] text-signal-400">{step.time}</span>
            <span
              className="font-display text-3xl font-medium leading-[0.9] tracking-[-0.03em]"
              style={{ fontVariationSettings: "'wdth' 88" }}
            >
              {step.title}
            </span>
            <span className="text-sm leading-relaxed text-[var(--text-inverse-muted)]">{step.body}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
