"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, X } from "lucide-react";
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
            className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-[400px] flex-col bg-paper-0 p-6 shadow-[var(--shadow-lg)]"
          >
            <div className="flex items-center justify-between">
              <h2 className="m-0 font-display text-xl font-medium tracking-[-0.02em] text-ink-950">Seu carrinho</h2>
              <button
                onClick={closeCart}
                aria-label="Fechar carrinho"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-paper-100 text-ink-950"
              >
                <X size={14} />
              </button>
            </div>

            {state.cart === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <CarIcon size={32} className="text-[var(--text-muted)]" />
                <p className="m-0 text-sm text-[var(--text-muted)]">Sua sacola está vazia.</p>
                <a
                  href="#comprar-topo"
                  onClick={closeCart}
                  className="rounded-[var(--radius-pill)] bg-signal-400 px-5 py-2.5 text-sm font-medium text-ink-950 transition-transform hover:-translate-y-0.5"
                >
                  Ver o produto
                </a>
              </div>
            ) : (
              <div className="mt-6 flex flex-1 flex-col gap-5">
                <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-ink-950">{plan.title}</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {state.cart} {state.cart === 1 ? "item" : "itens"} na sacola
                    </span>
                  </div>
                  {showQty && (
                    <div className="flex h-9 flex-none items-center gap-2.5 rounded-[var(--radius-pill)] border border-[var(--border-strong)] px-2.5 font-mono text-sm">
                      <button aria-label="Diminuir" onClick={() => setQty(state.qty - 1)}>
                        <Minus size={12} />
                      </button>
                      <span className="w-4 text-center">{state.qty}</span>
                      <button aria-label="Aumentar" onClick={() => setQty(state.qty + 1)}>
                        <Plus size={12} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-auto flex flex-col gap-2.5 border-t border-[var(--border-subtle)] pt-5">
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
                    className="mt-2 w-full rounded-[var(--radius-pill)] bg-ink-950 py-4 text-center text-sm font-medium text-paper-0"
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
