"use client";

import { useReducer, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { JOURNEY_STEPS } from "@/lib/content/journey";
import Reveal from "@/components/ui/Reveal";

const RING_CIRCUMFERENCE = 339.3;

// 16 particulas com posicao/tamanho pseudo-aleatorios fixos (mesma formula do
// protótipo, com menos particulas - ver nota de simplificacao no plano).
const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin(i * 99.13 + n * 7.7) * 10000;
    return x - Math.floor(x);
  };
  return {
    left: `${(r(1) * 100).toFixed(1)}%`,
    top: `${(30 + r(2) * 90).toFixed(1)}%`,
    size: Math.round(6 + r(3) * 26),
    drift: 0.4 + r(4) * 1.6,
    blur: Math.round(r(5) * 7),
  };
});

function Particle({ p, progress }: { p: (typeof PARTICLES)[number]; progress: MotionValue<number> }) {
  const y = useTransform(progress, (v) => -v * p.drift * 220);
  return (
    <motion.span
      style={{
        position: "absolute",
        left: p.left,
        top: p.top,
        width: p.size,
        height: p.size,
        marginLeft: -p.size / 2,
        marginTop: -p.size / 2,
        borderRadius: "50%",
        background: "rgba(214,255,61,.5)",
        filter: `blur(${p.blur}px)`,
        y,
      }}
    />
  );
}

export default function SprayJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const imageScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1.3, 1]);
  const imageX = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["0%", "-3%"]);
  const ringOffset = useTransform(scrollYProgress, [0, 1], [RING_CIRCUMFERENCE, 0]);
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const km = useTransform(scrollYProgress, (p) => Math.round(p * 120));

  const stepRef = useRef(0);
  const [, forceUpdate] = useReducer((c: number) => c + 1, 0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(3, Math.floor(p * 4.0001));
    if (next !== stepRef.current) {
      stepRef.current = next;
      forceUpdate();
    }
  });
  const currentStep = stepRef.current;

  return (
    <>
      {/* Mobile/tablet: o efeito pinado de 340dvh depende de vh/toolbar do
          navegador de um jeito que nunca ficou estável no celular (vão
          branco, animação que não termina) - ver histórico de tentativas.
          Abaixo de lg, troca pra uma lista simples que rola normalmente. */}
      <section className="m-[10px] overflow-hidden rounded-[var(--radius-lg)] bg-ink-950 text-paper-0 lg:hidden">
        <div className="relative h-[220px] sm:h-[280px]">
          <Image src="/hero-street.png" alt="" fill className="object-cover" style={{ objectPosition: "center 55%" }} sizes="100vw" />
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

      {/* Desktop: o scrollytelling pinado original. */}
      <section ref={ref} className="relative hidden lg:block" style={{ height: "340dvh" }}>
      <div className="sticky top-0 p-[10px]" style={{ height: "100dvh" }}>
        <div className="relative h-full overflow-hidden rounded-[var(--radius-lg)] bg-ink-950 text-paper-0">
          <motion.div className="absolute inset-0 will-change-transform" style={{ scale: imageScale, x: imageX }}>
            <Image src="/hero-street.png" alt="" fill className="object-cover" style={{ objectPosition: "center 55%" }} sizes="100vw" />
          </motion.div>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg,rgba(11,12,14,.78) 0%,rgba(11,12,14,.35) 55%,rgba(11,12,14,.1) 100%)" }}
          />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {PARTICLES.map((p, i) => (
              <Particle key={i} p={p} progress={scrollYProgress} />
            ))}
          </div>

          <div className="absolute inset-x-6 top-24 flex items-center gap-3.5 text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
            <span>A viagem de uma borrifada</span>
            <span className="h-px flex-1 bg-[var(--border-inverse)]" />
            <span className="font-mono">GT · 60 ml</span>
          </div>

          <div className="absolute left-6 top-1/2 grid max-w-[min(640px,62vw)] -translate-y-1/2 sm:max-w-[min(640px,86vw)]">
            {JOURNEY_STEPS.map((step, i) => (
              <div
                key={step.label}
                className="col-start-1 row-start-1 flex flex-col gap-5 transition-[opacity,transform] duration-700"
                style={{
                  opacity: i === currentStep ? 1 : 0,
                  transform: i === currentStep ? "translateY(0)" : i < currentStep ? "translateY(-40px)" : "translateY(40px)",
                }}
              >
                <span className="font-mono text-[13px] text-signal-400">{step.time}</span>
                <span
                  className="font-display text-[var(--fs-display-xl)] font-medium leading-[0.86] tracking-[-0.055em]"
                  style={{ fontVariationSettings: "'wdth' 88" }}
                >
                  {step.title}
                </span>
                <span className="max-w-[440px] text-[17px] leading-relaxed text-[var(--text-inverse-muted)]">{step.body}</span>
              </div>
            ))}
          </div>

          <div className="absolute right-4 top-1/2 hidden aspect-square w-[clamp(90px,14vw,180px)] -translate-y-1/2 items-center justify-center sm:right-6 sm:flex">
            <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="3" />
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="var(--signal-400)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                style={{ strokeDashoffset: ringOffset }}
              />
            </svg>
            <div className="flex flex-col items-center gap-0.5">
              <motion.span
                className="font-display text-[clamp(36px,4vw,56px)] font-medium leading-none tracking-[-0.05em]"
                style={{ fontVariationSettings: "'wdth' 88" }}
              >
                {km}
              </motion.span>
              <span className="font-mono text-[11px] text-[var(--text-inverse-muted)]">km</span>
            </div>
          </div>

          <div className="absolute inset-x-6 bottom-6 flex flex-col gap-3.5">
            <div className="grid grid-cols-4 gap-3 text-xs">
              {JOURNEY_STEPS.map((step, i) => (
                <span key={step.label} style={{ color: i <= currentStep ? "var(--paper-0)" : "var(--text-inverse-muted)" }}>
                  {step.label}
                </span>
              ))}
            </div>
            <div className="h-[3px] overflow-hidden rounded bg-white/14">
              <motion.div className="h-full rounded bg-signal-400" style={{ width: barWidth }} />
            </div>
          </div>
        </div>
      </div>
      </section>
    </>
  );
}
