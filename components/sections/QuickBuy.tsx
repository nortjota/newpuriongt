"use client";

import Image from "next/image";
import { Check, Minus, Plus, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
import { PLANS } from "@/lib/content/plans";
import { CHECKOUT_URL } from "@/lib/content/checkout";
import { usePurion } from "@/lib/store/PurionProvider";

export default function QuickBuy() {
  const { state, plan, total, oldPrice, installment, ctaLabel, showQty, setPlan, setQty, addToCart } = usePurion();

  return (
    <section id="comprar-topo" className="mx-auto max-w-[var(--content-max)] px-6">
      <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr))]">
        {/* Foto do produto */}
        <div
          className="relative overflow-hidden rounded-[var(--radius-xl)] bg-paper-100"
          style={{ minHeight: "clamp(420px,52vw,680px)" }}
        >
          <Image src="/product-studio.png" alt="Purion GT 60 ml" fill className="object-cover" />
          <div className="absolute left-5 top-5 flex gap-2">
            <span className="rounded-full bg-ink-950 px-3.5 py-1.5 text-xs font-medium text-paper-0">35% off</span>
            <span className="flex items-center gap-1.5 rounded-full bg-signal-400 px-3.5 py-1.5 text-xs font-medium text-ink-950">
              <span className="h-1.5 w-1.5 rounded-full bg-ink-950" />
              Envio hoje
            </span>
          </div>
          <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/72 px-3.5 py-2 font-mono text-xs backdrop-blur-md">60 ml · 2.0 fl oz</span>
              <span className="rounded-full bg-white/72 px-3.5 py-2 font-mono text-xs backdrop-blur-md">700 borrifadas</span>
            </div>
            <a href="#fragrancia" className="rounded-full bg-ink-950 px-3.5 py-2 text-xs font-medium text-paper-0">
              Ver notas olfativas
            </a>
          </div>
        </div>

        {/* Painel de compra */}
        <div className="flex flex-col gap-5 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-paper-0 p-6 sm:p-10">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
                Auto parfum de alta performance
              </span>
              <span className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </span>
                <span className="font-mono text-ink-950">4.9</span>
                <a href="#avaliacoes" className="underline underline-offset-[3px]">
                  100+ avaliações
                </a>
              </span>
            </div>
            <h2
              className="m-0 font-display text-[clamp(56px,6vw,96px)] font-medium leading-[0.86] tracking-[-0.055em]"
              style={{ fontVariationSettings: "'wdth' 88" }}
            >
              Purion GT
            </h2>
            <p className="m-0 max-w-[440px] text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Fragrância de assinatura para quem vive a estrada. Saída frutada, corpo floral, fundo de couro e âmbar.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-semibold uppercase text-ink-950 tracking-[var(--ls-caps)]">
                1 · Escolha sua opção
              </span>
              <span className="text-xs text-[var(--text-muted)]">Preço por frasco cai no kit</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PLANS.map((p) => {
                const selected = p.id === plan.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPlan(p.id)}
                    className={`relative flex flex-col gap-2.5 rounded-[var(--radius-md)] border-[1.5px] p-4 text-left transition-transform hover:-translate-y-0.5 ${
                      selected
                        ? "border-ink-950 bg-paper-0 text-ink-950"
                        : "border-[var(--border-strong)] bg-paper-50 text-ink-950"
                    }`}
                  >
                    <div className="flex min-h-[22px] items-center justify-between gap-2">
                      <span className="text-[15px] font-semibold">{p.title}</span>
                      {p.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] ${
                            p.badgeTone === "signal" ? "bg-signal-400 text-ink-950" : "bg-ink-950 text-paper-0"
                          }`}
                        >
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-2xl leading-none tracking-[-0.03em]">{p.price}</span>
                    <span className="text-xs leading-snug text-[var(--text-muted)]">{p.perQuickBuy}</span>
                    {selected && (
                      <span className="absolute bottom-3.5 right-3.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-signal-400 text-ink-950">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 border-y border-[var(--border-subtle)] py-4.5">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase text-ink-950 tracking-[var(--ls-caps)]">2 · Total</span>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-[clamp(36px,3.6vw,48px)] leading-none tracking-[-0.04em]">{total}</span>
                <span className="font-mono text-sm text-[var(--text-muted)] line-through">{oldPrice}</span>
              </div>
              <span className="text-sm text-[var(--text-secondary)]">
                ou 3× de <span className="font-mono">{installment}</span> sem juros
              </span>
            </div>
            {showQty && (
              <div className="flex h-11 items-center gap-3 rounded-[var(--radius-pill)] border border-[var(--border-strong)] px-3 font-mono text-sm">
                <button aria-label="Diminuir" onClick={() => setQty(state.qty - 1)}>
                  <Minus size={14} />
                </button>
                <span className="w-4 text-center">{state.qty}</span>
                <button aria-label="Aumentar" onClick={() => setQty(state.qty + 1)}>
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={addToCart}
              className="w-full rounded-[var(--radius-pill)] bg-signal-400 py-4 text-sm font-medium text-ink-950"
            >
              {ctaLabel}
            </button>
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full rounded-[var(--radius-pill)] bg-ink-950 py-4 text-center text-sm font-medium text-paper-0"
            >
              Comprar agora
            </a>
          </div>

          <div className="mt-auto grid grid-cols-3 gap-2.5">
            <div className="flex flex-col gap-1.5 text-xs leading-tight">
              <Truck size={16} />
              <span className="font-medium">Envio no mesmo dia</span>
              <span className="text-[var(--text-muted)]">Rastreio imediato</span>
            </div>
            <div className="flex flex-col gap-1.5 text-xs leading-tight">
              <RotateCcw size={16} />
              <span className="font-medium">Garantia de 7 dias</span>
              <span className="text-[var(--text-muted)]">100% de volta</span>
            </div>
            <div className="flex flex-col gap-1.5 text-xs leading-tight">
              <ShieldCheck size={16} />
              <span className="font-medium">Compra segura</span>
              <span className="text-[var(--text-muted)]">Nota fiscal emitida</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
