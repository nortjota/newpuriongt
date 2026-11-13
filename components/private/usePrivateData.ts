"use client";

import { useCallback, useEffect, useState } from "react";
import type { BenefitState, HistoryItem, Policy, Voucher } from "@/lib/private/service";

export type Panel = {
  authenticated: true;
  cliente: { primeiroNome: string | null };
  politicas: Policy[];
  vouchers: Voucher[];
  historico: HistoryItem[];
  estado: { estado: BenefitState; motivo?: string };
  checkoutMode: "off" | "coupon_param";
  consent: { email: boolean; whatsapp: boolean };
};

export type PrivateData =
  | { state: "loading" }
  | { state: "unavailable" }
  | { state: "error" }
  | { state: "anonymous" }
  | { state: "ready"; panel: Panel };

export async function postJson(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, json };
}

export function usePrivateData(autoload = true) {
  const [data, setData] = useState<PrivateData>({ state: "loading" });

  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/private/me", { cache: "no-store" });
      if (res.status === 503) return setData({ state: "unavailable" });
      if (!res.ok) return setData({ state: "error" });
      const json = await res.json();
      setData(json.authenticated ? { state: "ready", panel: json as Panel } : { state: "anonymous" });
    } catch {
      setData({ state: "error" });
    }
  }, []);

  useEffect(() => {
    // Busca inicial de dado externo (API).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (autoload) void reload();
  }, [autoload, reload]);

  return { data, reload, setData };
}

export function usePublicPolicies() {
  const [state, setState] = useState<{ status: "loading" | "ready" | "unavailable" | "error"; politicas: Policy[] }>({ status: "loading", politicas: [] });
  useEffect(() => {
    let alive = true;
    fetch("/api/private/policies", { cache: "no-store" })
      .then(async (res) => {
        if (!alive) return;
        if (res.status === 503) return setState({ status: "unavailable", politicas: [] });
        if (!res.ok) return setState({ status: "error", politicas: [] });
        const json = await res.json();
        setState({ status: "ready", politicas: json.politicas ?? [] });
      })
      .catch(() => alive && setState({ status: "error", politicas: [] }));
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

export const brl = (v: number) => "R$ " + v.toFixed(2).replace(".", ",");
export const dateBR = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

export const INELIGIBLE_REASON: Record<string, string> = {
  sem_compra_paga: "Este benefício é para quem já tem uma compra aprovada da PURION GT.",
  ja_comprou_presente: "Este benefício vale para a primeira compra de presente — e você já fez a sua.",
  politica_inativa: "Este benefício não está mais ativo.",
};

export const PLAN_LABEL: Record<string, string> = { un: "PURION Individual", k2: "PURION Duo", k3: "PURION Trio", desconhecido: "Pedido" };

export const HISTORY_LABEL: Record<string, string> = {
  reservado: "Checkout em andamento",
  confirmado: "Utilizado",
  liberado: "Liberado (pedido não concluído)",
  expirado: "Reserva expirada",
  estornado: "Estornado",
};
