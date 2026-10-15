"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { PLANS, SUBSCRIPTION_FREQUENCIES, type Plan } from "@/lib/content/plans";

type State = {
  planId: Plan["id"];
  qty: number;
  freq: number;
  cart: number;
  toast: string;
};

type Action =
  | { type: "SET_PLAN"; id: Plan["id"] }
  | { type: "SET_QTY"; qty: number }
  | { type: "SET_FREQ"; freq: number }
  | { type: "ADD_TO_CART" }
  | { type: "CLEAR_TOAST" };

const initialState: State = { planId: "un", qty: 1, freq: 60, cart: 0, toast: "" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PLAN":
      return { ...state, planId: action.id };
    case "SET_QTY":
      return { ...state, qty: Math.min(10, Math.max(1, action.qty)) };
    case "SET_FREQ":
      return { ...state, freq: action.freq };
    case "ADD_TO_CART": {
      const plan = PLANS.find((p) => p.id === state.planId)!;
      const units = plan.isSubscription || plan.id === "un" ? state.qty : unitsForPlan(plan.id);
      return {
        ...state,
        cart: state.cart + units,
        toast: plan.isSubscription ? "Assinatura adicionada à sacola" : "Purion GT adicionado à sacola",
      };
    }
    case "CLEAR_TOAST":
      return { ...state, toast: "" };
    default:
      return state;
  }
}

function unitsForPlan(id: Plan["id"]) {
  if (id === "k2") return 2;
  if (id === "k3") return 3;
  return 1;
}

function fmt(v: number) {
  return "R$ " + v.toFixed(2).replace(".", ",");
}

const UNIT_PRICE: Record<Plan["id"], number> = { un: 97.9, k2: 176.22, k3: 249.65, sub: 83.22 };
const BASE_REFERENCE_PRICE = 149.9;

type Ctx = {
  state: State;
  plan: Plan;
  units: number;
  total: string;
  oldPrice: string;
  installment: string;
  ctaLabel: string;
  showQty: boolean;
  setPlan: (id: Plan["id"]) => void;
  setQty: (qty: number) => void;
  setFreq: (freq: number) => void;
  addToCart: () => void;
  clearToast: () => void;
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
      oldPrice: fmt(BASE_REFERENCE_PRICE * units),
      installment: fmt(total / 3),
      ctaLabel: plan.isSubscription ? "Assinar agora" : "Adicionar ao carrinho",
      showQty: !isFixedKit,
      setPlan: (id) => dispatch({ type: "SET_PLAN", id }),
      setQty: (qty) => dispatch({ type: "SET_QTY", qty }),
      setFreq: (freq) => dispatch({ type: "SET_FREQ", freq }),
      addToCart: () => dispatch({ type: "ADD_TO_CART" }),
      clearToast: () => dispatch({ type: "CLEAR_TOAST" }),
    };
  }, [state]);

  return <PurionContext.Provider value={value}>{children}</PurionContext.Provider>;
}

export function usePurion() {
  const ctx = useContext(PurionContext);
  if (!ctx) throw new Error("usePurion must be used within PurionProvider");
  return ctx;
}

export { SUBSCRIPTION_FREQUENCIES };
