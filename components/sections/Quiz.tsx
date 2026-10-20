"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Armchair,
  Briefcase,
  Building2,
  Crown,
  Flame,
  Flower2,
  Gem,
  Moon,
  MoonStar,
  RotateCcw,
  Route,
  Sparkles,
  Sunrise,
  Sunset,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { QUIZ_QUESTIONS, QUIZ_RESULTS, type QuizLayer } from "@/lib/content/quiz";
import { FRAGRANCE_LAYERS, NOTE_COLORS } from "@/lib/content/fragrance";
import { usePurion } from "@/lib/store/PurionProvider";

const ICONS: Record<string, LucideIcon> = {
  "building-2": Building2,
  route: Route,
  moon: Moon,
  wind: Wind,
  "flower-2": Flower2,
  flame: Flame,
  briefcase: Briefcase,
  armchair: Armchair,
  crown: Crown,
  sunrise: Sunrise,
  sunset: Sunset,
  "moon-star": MoonStar,
  sparkles: Sparkles,
  gem: Gem,
  zap: Zap,
};

const RING_R = 26;
const RING_C = 2 * Math.PI * RING_R;

export default function Quiz() {
  const { setPyramidLevel } = usePurion();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizLayer[]>([]);

  const done = step >= QUIZ_QUESTIONS.length;
  const question = !done ? QUIZ_QUESTIONS[step] : null;
  const progress = done ? 1 : step / QUIZ_QUESTIONS.length;

  function answer(layer: QuizLayer) {
    setAnswers((prev) => [...prev, layer]);
    setStep((s) => s + 1);
  }

  function back() {
    setAnswers((prev) => prev.slice(0, -1));
    setStep((s) => Math.max(0, s - 1));
  }

  function restart() {
    setStep(0);
    setAnswers([]);
  }

  const counts: Record<QuizLayer, number> = { 1: 0, 2: 0, 3: 0 };
  answers.forEach((a) => counts[a]++);
  const winner = ([3, 2, 1] as QuizLayer[]).reduce((best, k) => (counts[k] > counts[best] ? k : best), 3 as QuizLayer);
  const result = QUIZ_RESULTS[winner];
  const matchPct = 80 + counts[winner] * 4;
  const winnerGlow = FRAGRANCE_LAYERS[winner - 1].glow;

  function chooseResult() {
    setPyramidLevel(winner);
    document.getElementById("comprar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section id="quiz" className="mx-auto max-w-[var(--content-max)] px-6 pb-[var(--section-y)]">
      <div className="grid overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
        <div className="relative flex flex-col gap-6 overflow-hidden bg-ink-950 p-6 text-paper-0 sm:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-signal-400/15 blur-[70px]"
          />
          <div className="relative flex items-center gap-2.5 text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
            <span className="h-2 w-2 rounded-full bg-signal-400" />
            <span>Quiz · 30 segundos</span>
          </div>
          <div className="relative font-display text-[var(--fs-display-l)] font-medium leading-[0.9] tracking-[var(--ls-display)]">
            <div>Descubra seu</div>
            <div>perfil olfativo.</div>
          </div>
          <p className="relative m-0 max-w-[400px] text-[15px] leading-relaxed text-[var(--text-inverse-muted)]">
            Cinco perguntas sobre como você dirige e vive o carro. No fim, a camada do Purion GT que mais combina com
            você.
          </p>
          <div className="relative mt-auto flex items-center gap-4">
            <div className="relative flex h-16 w-16 flex-none items-center justify-center">
              <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx="32" cy="32" r={RING_R} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="4" />
                <circle
                  cx="32"
                  cy="32"
                  r={RING_R}
                  fill="none"
                  stroke="var(--signal-400)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={RING_C * (1 - progress)}
                  style={{ transition: "stroke-dashoffset .6s var(--ease-out)" }}
                />
              </svg>
              <span className="font-mono text-sm">{done ? "100%" : `0${step + 1}/0${QUIZ_QUESTIONS.length}`}</span>
            </div>
            <span className="text-sm text-[var(--text-inverse-muted)]">
              {done ? "Resultado pronto" : "Continue respondendo"}
            </span>
          </div>
        </div>

        <div className="flex min-h-[440px] flex-col justify-center bg-paper-0 p-6 sm:p-14">
          {!done && question ? (
            <div className="flex flex-col gap-5.5 animate-[pg-fade-up_.7s_var(--ease-out)_both]">
              <h3
                className="m-0 font-display text-[clamp(32px,4vw,56px)] font-medium leading-[0.95] tracking-[-0.045em]"
                style={{ fontVariationSettings: "'wdth' 88" }}
              >
                {question.q}
              </h3>
              <div className="flex flex-col gap-2.5">
                {question.options.map((opt) => {
                  const Icon = ICONS[opt.icon] ?? ArrowRight;
                  const layerColor = FRAGRANCE_LAYERS[opt.layer - 1].glow;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => answer(opt.layer)}
                      className="group flex items-center gap-4 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-paper-50 py-3.5 pl-3.5 pr-4.5 text-left text-base text-ink-950 transition-all hover:-translate-y-0.5 hover:border-ink-950 hover:bg-paper-0 hover:shadow-[var(--shadow-md)] active:scale-[0.98]"
                    >
                      <span
                        className="flex h-11 w-11 flex-none items-center justify-center rounded-xl text-ink-950 transition-transform group-hover:scale-110"
                        style={{ background: `color-mix(in oklch, ${layerColor} 30%, white)` }}
                      >
                        <Icon size={18} />
                      </span>
                      <span className="flex-1">{opt.label}</span>
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  );
                })}
              </div>
              {step > 0 && (
                <button onClick={back} className="flex items-center gap-1.5 self-start text-[13px] text-[var(--text-muted)]">
                  <ArrowLeft size={14} />
                  Voltar
                </button>
              )}
            </div>
          ) : (
            <div className="grid items-center gap-6 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] animate-[pg-fade-up_.8s_var(--ease-out)_both]">
              <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-[var(--radius-lg)] bg-paper-100">
                <div
                  aria-hidden
                  className="absolute h-[70%] w-[70%] rounded-full blur-[50px] opacity-70"
                  style={{ background: winnerGlow }}
                />
                <div
                  className="relative h-[86%] w-full bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: "url(/bottle.png)" }}
                />
              </div>
              <div className="flex flex-col gap-4">
                <span className="flex w-fit items-center gap-2 rounded-[var(--radius-pill)] bg-paper-100 px-3 py-1.5 text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: winnerGlow }} />
                  Compatibilidade {matchPct}%
                </span>
                <h3
                  className="m-0 font-display text-[44px] font-medium leading-[0.92] tracking-[-0.045em]"
                  style={{ fontVariationSettings: "'wdth' 88" }}
                >
                  {result.title}
                </h3>
                <p className="m-0 text-[15px] leading-relaxed text-[var(--text-secondary)]">{result.body}</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.notes.map((note) => (
                    <span
                      key={note}
                      className="flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] py-1.5 pl-2 pr-3 text-[13px]"
                    >
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: NOTE_COLORS[note] }} />
                      {note}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2.5 pt-1.5">
                  <button
                    onClick={chooseResult}
                    className="flex items-center gap-2 rounded-[var(--radius-pill)] bg-ink-950 px-5 py-3 text-sm font-medium text-paper-0 transition-transform hover:-translate-y-0.5"
                  >
                    Escolher o Purion GT
                  </button>
                  <button
                    onClick={restart}
                    className="flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--border-strong)] px-5 py-3 text-sm font-medium text-ink-950"
                  >
                    <RotateCcw size={14} />
                    Refazer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
