"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { PLANS, PLAN_AMOUNT, PLAN_UNITS, type Plan } from "@/lib/content/plans";

type State = {
  planId: Plan["id"];
  qty: number;
  cart: number;
  cartOpen: boolean;
  toast: string;
  // 0 = "Completo" (todas as camadas). Fica no contexto só porque o resultado
  // do Quiz precisa "empurrar" esse valor para a Pirâmide, que fica muito
  // distante no DOM — ver nota no plano sobre essa única ligação cruzada.
  pyramidLevel: 0 | 1 | 2 | 3;
  // Referência da personalização de presente (/presentes/kits) — vai para o
  // link de checkout. Some se o plano do carrinho mudar.
  giftRef: string | null;
};

type Action =
  | { type: "SET_PLAN"; id: Plan["id"] }
  | { type: "SET_QTY"; qty: number }
  | { type: "ADD_TO_CART" }
  | { type: "REPLACE_CART"; id: Plan["id"]; giftRef?: string | null }
  | { type: "TOGGLE_CART" }
  | { type: "CLOSE_CART" }
  | { type: "CLEAR_TOAST" }
  | { type: "SET_PYRAMID_LEVEL"; level: 0 | 1 | 2 | 3 };

const initialState: State = { planId: "un", qty: 1, cart: 0, cartOpen: false, toast: "", pyramidLevel: 0, giftRef: null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PLAN":
      return { ...state, planId: action.id, giftRef: action.id === state.planId ? state.giftRef : null };
    case "SET_QTY":
      return { ...state, qty: Math.min(10, Math.max(1, action.qty)) };
    case "ADD_TO_CART": {
      const plan = PLANS.find((p) => p.id === state.planId)!;
      const units = plan.isSubscription || plan.id === "un" ? state.qty : unitsForPlan(plan.id);
      return {
        ...state,
        giftRef: null,
        cart: state.cart + units,
        toast: plan.isSubscription ? "Assinatura adicionada à sacola" : "Purion GT adicionado à sacola",
      };
    }
    // O carrinho só representa um plano por vez (um único link de checkout).
    // Usado pela /presentes: escolher outro presente substitui o anterior em
    // vez de somar unidades que não iriam para o checkout.
    case "REPLACE_CART": {
      const plan = PLANS.find((p) => p.id === action.id)!;
      return {
        ...state,
        planId: plan.id,
        qty: 1,
        cart: unitsForPlan(plan.id),
        cartOpen: true,
        giftRef: action.giftRef ?? null,
        toast: "Presente adicionado à sacola",
      };
    }
    case "TOGGLE_CART":
      return { ...state, cartOpen: !state.cartOpen };
    case "CLOSE_CART":
      return { ...state, cartOpen: false };
    case "CLEAR_TOAST":
      return { ...state, toast: "" };
    case "SET_PYRAMID_LEVEL":
      return { ...state, pyramidLevel: action.level };
    default:
      return state;
  }
}

function unitsForPlan(id: Plan["id"]) {
  return PLAN_UNITS[id];
}

function fmt(v: number) {
  return "R$ " + v.toFixed(2).replace(".", ",");
}

const UNIT_PRICE = PLAN_AMOUNT;

type Ctx = {
  state: State;
  plan: Plan;
  units: number;
  total: string;
  installment: string;
  ctaLabel: string;
  showQty: boolean;
  setPlan: (id: Plan["id"]) => void;
  setQty: (qty: number) => void;
  addToCart: () => void;
  replaceCart: (id: Plan["id"], opts?: { giftRef?: string | null }) => void;
  toggleCart: () => void;
  closeCart: () => void;
  clearToast: () => void;
  setPyramidLevel: (level: 0 | 1 | 2 | 3) => void;
};

const PurionContext = createContext<Ctx | null>(null);

export function PurionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo<Ctx>(() => {
    const plan = PLANS.find((p) => p.id === state.planId)!;
    const isFixedKit = plan.id === "k2" || plan.id === "k3";
    const units = isFixedKit ? unitsForPlan(plan.id) : state.qty;
    const total = isFixedKit ? UNIT_PRICE[plan.id] : UNIT_PRICE[plan.id] * state.qty;

    return {
      state,
      plan,
      units,
      total: fmt(total),
      installment: fmt(total / 3),
      ctaLabel: plan.isSubscription ? "Assinar agora" : "Adicionar ao carrinho",
      showQty: !isFixedKit,
      setPlan: (id) => dispatch({ type: "SET_PLAN", id }),
      setQty: (qty) => dispatch({ type: "SET_QTY", qty }),
      addToCart: () => dispatch({ type: "ADD_TO_CART" }),
      replaceCart: (id, opts) => dispatch({ type: "REPLACE_CART", id, giftRef: opts?.giftRef ?? null }),
      toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
      closeCart: () => dispatch({ type: "CLOSE_CART" }),
      clearToast: () => dispatch({ type: "CLEAR_TOAST" }),
      setPyramidLevel: (level) => dispatch({ type: "SET_PYRAMID_LEVEL", level }),
    };
  }, [state]);

  return <PurionContext.Provider value={value}>{children}</PurionContext.Provider>;
}

export function usePurion() {
  const ctx = useContext(PurionContext);
  if (!ctx) throw new Error("usePurion must be used within PurionProvider");
  return ctx;
}
