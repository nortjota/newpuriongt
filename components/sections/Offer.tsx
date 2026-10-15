import Image from "next/image";
import { MapPin, Receipt, RotateCcw, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { DEFAULT_INSTALLMENT, DEFAULT_OLD_PRICE, DEFAULT_TOTAL, PLANS, TRUST_SEALS } from "@/lib/content/plans";
import { CHECKOUT_URL } from "@/lib/content/checkout";

const SEAL_ICONS = {
  "shield-check": ShieldCheck,
  truck: Truck,
  "map-pin": MapPin,
  "rotate-ccw": RotateCcw,
  receipt: Receipt,
} as const;

const selectedPlanId = "un";

export default function Offer() {
  return (
    <section
      id="comprar"
      className="mx-auto grid max-w-[var(--content-max)] items-start gap-14 px-6 pb-[var(--section-y)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr))]"
    >
      <div
        className="relative overflow-hidden rounded-[var(--radius-xl)] bg-paper-100 sm:sticky sm:top-[84px]"
        style={{ height: "clamp(480px,62vw,720px)" }}
      >
        <Image src="/product-studio.png" alt="Purion GT 60 ml" fill className="object-cover" />
        <div className="absolute left-5.5 top-5.5">
          <span className="rounded-full bg-ink-950 px-4 py-1.5 text-xs font-medium text-paper-0">35% off</span>
        </div>
        <div className="absolute inset-x-5.5 bottom-5.5 flex items-end justify-between gap-4 text-ink-600">
          <span className="text-[13px] leading-snug">
            Toque no frasco
            <br />
            para borrifar
          </span>
          <span className="flex flex-col items-end gap-0.5">
            <span className="font-mono text-[28px] tracking-[-0.02em] text-ink-950">700</span>
            <span className="text-[11px] uppercase tracking-[var(--ls-caps)]">borrifadas restantes</span>
          </span>
        </div>
      </div>

      <div className="flex max-w-[580px] flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
            Auto parfum · 60 ml · 2.0 fl oz
          </span>
          <h2
            className="m-0 font-display text-[var(--fs-display-l)] font-medium leading-[var(--lh-display)] tracking-[var(--ls-display)]"
            style={{ fontVariationSettings: "'wdth' 88" }}
          >
            Purion GT
          </h2>
          <p className="m-0 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Frasco de vidro premium, liberação controlada e alta fixação. A diferença que você pode cheirar.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
            Como você quer o seu
          </span>
          {PLANS.map((plan) => {
            const selected = plan.id === selectedPlanId;
            return (
              <div
                key={plan.id}
                className={`flex items-center gap-3.5 rounded-[var(--radius-md)] border-[1.5px] px-4.5 py-4 text-ink-950 ${
                  selected ? "border-ink-950 bg-paper-0" : "border-[var(--border-strong)] bg-transparent"
                }`}
              >
                <span
                  className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border-[1.5px] ${
                    selected ? "border-ink-950" : "border-[var(--border-strong)]"
                  }`}
                >
                  {selected && <span className="h-2.5 w-2.5 rounded-full bg-ink-950" />}
                </span>
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="flex items-center gap-2 text-[15px] font-medium">
                    {plan.title}
                    {plan.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] ${
                          plan.badgeTone === "signal" ? "bg-signal-400 text-ink-950" : "bg-ink-950 text-paper-0"
                        }`}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </span>
                  <span className="text-[13px] text-[var(--text-muted)]">{plan.description}</span>
                </span>
                <span className="font-mono text-[15px]">{plan.price}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-1.5 border-y border-[var(--border-subtle)] py-5">
          <div className="flex flex-wrap items-baseline gap-3.5">
            <span className="font-mono text-[44px] tracking-[-0.04em]">{DEFAULT_TOTAL}</span>
            <span className="font-mono text-[15px] text-[var(--text-muted)] line-through">{DEFAULT_OLD_PRICE}</span>
          </div>
          <span className="text-sm text-[var(--text-secondary)]">
            ou até 3× de <span className="font-mono">{DEFAULT_INSTALLMENT}</span> sem juros
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-11 items-center gap-3 rounded-[var(--radius-pill)] border border-[var(--border-strong)] px-3 font-mono text-sm">
            <span>−</span>
            <span>1</span>
            <span>+</span>
          </div>
          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noreferrer"
            className="flex-1 min-w-[220px] rounded-[var(--radius-pill)] bg-signal-400 py-4 text-center text-sm font-medium text-ink-950"
          >
            Adicionar ao carrinho
          </a>
        </div>
        <a
          href={CHECKOUT_URL}
          target="_blank"
          rel="noreferrer"
          className="w-full rounded-[var(--radius-pill)] bg-ink-950 py-4 text-center text-sm font-medium text-paper-0"
        >
          Comprar agora
        </a>
        <a href="#quiz" className="flex items-center gap-2 self-start text-sm text-[var(--text-secondary)]">
          <Sparkles size={16} />
          <span>
            Não tem certeza?{" "}
            <u className="text-ink-950 underline-offset-[3px]">Descubra seu perfil olfativo em 30s</u>
          </span>
        </a>
        <div className="grid gap-3.5 gap-x-5 pt-2 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
          {TRUST_SEALS.map((seal) => {
            const Icon = SEAL_ICONS[seal.icon];
            return (
              <div key={seal.title} className="flex items-start gap-2.5 text-[13px] leading-snug">
                <Icon size={16} className="flex-none" />
                <span className="flex flex-col">
                  <span className="font-medium">{seal.title}</span>
                  <span className="text-[var(--text-muted)]">{seal.desc}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
