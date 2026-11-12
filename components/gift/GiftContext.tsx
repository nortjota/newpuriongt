"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { usePurion } from "@/lib/store/PurionProvider";
import { getGift, OCCASIONS, type GiftId, type Occasion } from "@/lib/content/gifts";

// Estado local da página /presentes: qual ocasião o visitante escolheu (para
// destacar o presente sugerido na seção "Escolha seu presente") e a ação de
// colocar um presente no carrinho real do PurionProvider.
type GiftCtx = {
  occasion: Occasion | null;
  selectOccasion: (id: string | null) => void;
  addGift: (id: GiftId) => void;
};

const Ctx = createContext<GiftCtx | null>(null);

export const CHOOSER_ID = "escolher-presente";

export function scrollToChooser() {
  const el = document.getElementById(CHOOSER_ID);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  // Move o foco para a seção, para quem navega por teclado/leitor de tela
  // continuar a partir dali.
  el.focus({ preventScroll: true });
}

export function GiftProvider({ children }: { children: ReactNode }) {
  const [occasionId, setOccasionId] = useState<string | null>(null);
  const { replaceCart } = usePurion();

  const addGift = useCallback(
    (id: GiftId) => {
      const gift = getGift(id);
      if (!gift.available) return;
      replaceCart(gift.planId);
      // Evento de funil para o Meta Pixel já carregado no layout.
      const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
      fbq?.("track", "AddToCart", {
        content_name: gift.name,
        content_ids: [gift.planId],
        value: gift.amount,
        currency: "BRL",
      });
    },
    [replaceCart]
  );

  const value = useMemo<GiftCtx>(
    () => ({
      occasion: OCCASIONS.find((o) => o.id === occasionId) ?? null,
      selectOccasion: setOccasionId,
      addGift,
    }),
    [occasionId, addGift]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGift() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGift must be used within GiftProvider");
  return ctx;
}
