"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShieldCheck, Truck, X } from "lucide-react";
import { usePurion } from "@/lib/store/PurionProvider";
import { CHECKOUT_URL } from "@/lib/content/checkout";
import CarIcon from "@/components/icons/CarIcon";

export default function CartDrawer() {
  const { state, plan, total, installment, showQty, setQty, closeCart } = usePurion();

  useEffect(() => {
    if (!state.cartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [state.cartOpen, closeCart]);

  return (
    <AnimatePresence>
      {state.cartOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[100] bg-ink-950/55"
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-[420px] flex-col overflow-hidden bg-paper-0 shadow-[var(--shadow-lg)]"
          >
            <div className="flex flex-none items-center justify-between border-b border-[var(--border-subtle)] px-6 py-5">
              <div className="flex items-center gap-2.5">
                <h2 className="m-0 font-display text-xl font-medium tracking-[-0.02em] text-ink-950">Seu carrinho</h2>
                {state.cart > 0 && (
                  <span className="rounded-full bg-paper-100 px-2 py-0.5 font-mono text-xs text-[var(--text-muted)]">{state.cart}</span>
                )}
              </div>
              <button
                onClick={closeCart}
                aria-label="Fechar carrinho"
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-paper-100 text-ink-950 transition-colors hover:bg-paper-50"
              >
                <X size={14} />
              </button>
            </div>

            {state.cart === 0 ? (
              <div className="relative flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-400/18 blur-[90px]" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-paper-50">
                  <CarIcon size={34} className="text-ink-950" />
                </div>
                <div className="relative flex flex-col gap-1.5">
                  <span className="font-display text-xl font-medium tracking-[-0.02em] text-ink-950">Sua sacola está vazia</span>
                  <span className="text-sm text-[var(--text-muted)]">Adicione o Purion GT e turbine seu carro.</span>
                </div>
                <a
                  href="#comprar-topo"
                  onClick={closeCart}
                  className="relative mt-2 rounded-[var(--radius-pill)] bg-signal-400 px-6 py-3 text-sm font-medium text-ink-950 transition-transform hover:-translate-y-0.5"
                >
                  Ver o produto
                </a>
              </div>
            ) : (
              <div className="flex flex-1 flex-col overflow-y-auto">
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex gap-3.5 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-3.5">
                    <div className="relative h-16 w-16 flex-none overflow-hidden rounded-[var(--radius-md)] bg-paper-100">
                      <Image src="/product-studio.png" alt="" fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-ink-950">{plan.title}</span>
                        <span className="text-xs text-[var(--text-muted)]">Purion GT · 60 ml</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        {showQty ? (
                          <div className="flex h-8 flex-none items-center gap-2.5 rounded-[var(--radius-pill)] border border-[var(--border-strong)] px-2.5 font-mono text-xs">
                            <button aria-label="Diminuir" onClick={() => setQty(state.qty - 1)}>
                              <Minus size={11} />
                            </button>
                            <span className="w-3 text-center">{state.qty}</span>
                            <button aria-label="Aumentar" onClick={() => setQty(state.qty + 1)}>
                              <Plus size={11} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--text-muted)]">
                            {state.cart} {state.cart === 1 ? "item" : "itens"}
                          </span>
                        )}
                        <span className="font-mono text-sm text-ink-950">{total}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="flex items-center gap-2 rounded-[var(--radius-md)] bg-paper-50 px-3 py-2.5 text-xs text-ink-950">
                      <Truck size={14} className="flex-none text-signal-500" />
                      <span>Envio no mesmo dia</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-[var(--radius-md)] bg-paper-50 px-3 py-2.5 text-xs text-ink-950">
                      <ShieldCheck size={14} className="flex-none text-signal-500" />
                      <span>Garantia de 7 dias</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-none flex-col gap-2.5 border-t border-[var(--border-subtle)] p-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">Total</span>
                    <span className="font-mono text-2xl tracking-[-0.03em] text-ink-950">{total}</span>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">
                    ou 3× de <span className="font-mono">{installment}</span> sem juros
                  </span>
                  <a
                    href={CHECKOUT_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 w-full rounded-[var(--radius-pill)] bg-ink-950 py-4 text-center text-sm font-medium text-paper-0 transition-transform hover:-translate-y-0.5"
                  >
                    Finalizar compra
                  </a>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
