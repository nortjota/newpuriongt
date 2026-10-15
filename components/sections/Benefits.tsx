import { Droplet, Gem, ShieldCheck, Truck } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const CARDS = [
  {
    n: "#01",
    icon: Droplet,
    tone: "signal" as const,
    big: "700",
    bigLabel: "borrifadas",
    title: "Liberação controlada",
    body: "Cada borrifada dosada para durar meses.",
  },
  {
    n: "#02",
    icon: Gem,
    tone: "ink" as const,
    big: "R$ 800+",
    bigLabel: "linha de inspiração",
    title: "Alta perfumaria",
    body: "Inspirada na linha dos perfumes de R$ 800+.",
  },
  {
    n: "#03",
    icon: ShieldCheck,
    tone: "ink" as const,
    big: "7 dias",
    bigLabel: "garantia total",
    title: "100% de volta",
    body: "Sem perguntas. Se não for para você, devolvemos.",
  },
  {
    n: "#04",
    icon: Truck,
    tone: "ink" as const,
    big: "Hoje",
    bigLabel: "envio no mesmo dia",
    title: "Rastreio imediato",
    body: "Código enviado logo após a aprovação do pagamento.",
  },
];

export default function Benefits() {
  return (
    <section className="mx-auto grid max-w-[var(--content-max)] gap-3.5 px-6 pb-[var(--section-y)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,270px),1fr))]">
      {CARDS.map((card, i) => {
        const Icon = card.icon;
        const signal = card.tone === "signal";
        return (
          <Reveal
            key={card.n}
            delay={(i % 4) * 70}
            className={`relative flex min-h-[380px] flex-col justify-between gap-10 overflow-hidden rounded-[var(--radius-lg)] p-7 transition-transform hover:-translate-y-2 ${
              signal ? "bg-signal-400 text-ink-950" : "bg-ink-950 text-paper-0"
            }`}
          >
            <Icon
              size={220}
              className="pointer-events-none absolute -right-7 -bottom-7 opacity-[0.07]"
            />
            <div className="relative flex items-center justify-between">
              <span className={`font-mono text-[13px] ${signal ? "text-ink-700" : "text-[var(--text-inverse-muted)]"}`}>
                {card.n}
              </span>
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full border ${
                  signal ? "border-ink-950/18" : "border-[var(--border-inverse)]"
                }`}
              >
                <Icon size={18} />
              </span>
            </div>
            <div className="relative flex flex-col gap-4.5">
              <div className="flex flex-col gap-1.5">
                <span
                  className="font-display text-[clamp(56px,6vw,96px)] font-medium leading-[0.85] tracking-[-0.06em]"
                  style={{ fontVariationSettings: "'wdth' 88" }}
                >
                  {card.big}
                </span>
                <span
                  className={`text-[11px] uppercase tracking-[var(--ls-caps)] ${
                    signal ? "text-ink-700" : "text-[var(--text-inverse-muted)]"
                  }`}
                >
                  {card.bigLabel}
                </span>
              </div>
              <div
                className={`flex flex-col gap-1.5 border-t pt-4 ${
                  signal ? "border-ink-950/18" : "border-[var(--border-inverse)]"
                }`}
              >
                <h3
                  className="m-0 font-display text-[26px] font-medium leading-none tracking-[-0.03em]"
                  style={{ fontVariationSettings: "'wdth' 88" }}
                >
                  {card.title}
                </h3>
                <p className={`m-0 text-sm leading-relaxed ${signal ? "text-ink-700" : "text-[var(--text-inverse-muted)]"}`}>
                  {card.body}
                </p>
              </div>
            </div>
          </Reveal>
        );
      })}
    </section>
  );
}
