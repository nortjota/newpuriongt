"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePurion } from "@/lib/store/PurionProvider";
import { getOccasion, type GiftId, type Occasion } from "@/lib/content/gifts";
import { isAvailable, offerById, suggestOffer, toAnalyticsItem, type GiftOffer } from "@/lib/gift/catalog";
import { captureTracking } from "@/lib/tracking/utm";
import { track } from "@/lib/analytics/events";
import { CHOOSER_ID, OCCASION_PARAM } from "./ids";

// Estado da /presentes:
//  • ofertas reais (vindas do servidor)
//  • ocasião escolhida — sincronizada com ?ocasiao= para links de campanha
//  • ação de presentear (carrinho real do PurionProvider) + eventos analíticos
type GiftCtx = {
  offers: GiftOffer[];
  occasion: Occasion | null;
  suggestion: GiftOffer | null;
  selectOccasion: (id: string | null, opts?: { scroll?: boolean }) => void;
  addGift: (id: GiftId) => void;
};

const Ctx = createContext<GiftCtx | null>(null);


function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToId(id: string, focus = true) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  if (focus) el.focus({ preventScroll: true });
}

function writeOccasionToUrl(id: string | null) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set(OCCASION_PARAM, id);
  else url.searchParams.delete(OCCASION_PARAM);
  window.history.replaceState(window.history.state, "", url);
}

export function GiftProvider({ offers, children }: { offers: GiftOffer[]; children: ReactNode }) {
  const [occasionId, setOccasionId] = useState<string | null>(null);
  const { state, replaceCart } = usePurion();
  const occasion = getOccasion(occasionId);
  const suggestion = occasion ? suggestOffer(occasion, offers) : null;

  // Ref para os handlers globais lerem o estado atual sem re-registrar.
  const live = useRef({ occasion, planId: state.planId, cart: state.cart });
  useEffect(() => {
    live.current = { occasion, planId: state.planId, cart: state.cart };
  });

  // Na montagem: persiste a origem de campanha e aplica ?ocasiao= (deep link).
  useEffect(() => {
    captureTracking(window.location.search, window.location.pathname);
    const fromUrl = getOccasion(new URLSearchParams(window.location.search).get(OCCASION_PARAM));
    if (fromUrl) {
      // Estado vindo de uma API externa ao React (a URL) — leitura única.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOccasionId(fromUrl.id);
    }
  }, []);

  // begin_checkout: o link "Finalizar compra" mora no carrinho global; em vez
  // de alterar o componente compartilhado, observamos cliques no checkout.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      let host = "";
      try {
        host = new URL(a.href).hostname;
      } catch {
        return;
      }
      if (host !== "pay.puriongt.com.br") return;
      const offer = offers.find((o) => o.planId === live.current.planId);
      if (!offer || live.current.cart === 0) return;
      track({
        name: "begin_checkout",
        params: { currency: "BRL", value: offer.amount, items: [toAnalyticsItem(offer)], occasion: live.current.occasion?.id },
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [offers]);

  const selectOccasion = useCallback(
    (id: string | null, { scroll = true }: { scroll?: boolean } = {}) => {
      const next = getOccasion(id);
      setOccasionId(next?.id ?? null);
      writeOccasionToUrl(next?.id ?? null);
      if (!next) return;
      const suggested = suggestOffer(next, offers);
      track({ name: "select_occasion", params: { occasion: next.id, suggested_item_id: suggested?.planId ?? null } });
      if (scroll) scrollToId(suggested ? `oferta-${suggested.id}` : CHOOSER_ID);
    },
    [offers]
  );

  const addGift = useCallback(
    (id: GiftId) => {
      const offer = offerById(offers, id);
      if (!offer || !isAvailable(offer)) return; // nunca ativa oferta indisponível
      const item = toAnalyticsItem(offer);
      const occ = live.current.occasion?.id;
      track({ name: "select_item", params: { item_list_name: "PURION GIFT", items: [item], occasion: occ } });
      replaceCart(offer.planId);
      track({ name: "add_to_cart", params: { currency: "BRL", value: offer.amount, items: [item], occasion: occ } });
    },
    [offers, replaceCart]
  );

  const value = useMemo<GiftCtx>(
    () => ({ offers, occasion, suggestion, selectOccasion, addGift }),
    [offers, occasion, suggestion, selectOccasion, addGift]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGift() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGift must be used within GiftProvider");
  return ctx;
}
