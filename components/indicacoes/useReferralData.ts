"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProgramaPublico } from "@/lib/indicacoes/service";

export type ReferralPanel = {
  authenticated: true;
  programa: ProgramaPublico | null;
  podeIndicar: boolean;
  codigo: string | null;
  link: string | null;
  whatsapp: string | null;
  saldo: { pendente: number; disponivel: number };
  resumo: { visitantes: number; convites: number; em_validacao: number; aprovadas: number };
  indicacoes: { status: string; data: string; recompensa: number | null; liberacao_prevista: string | null }[];
  extrato: { tipo: string; bucket: string; valor: number; data: string }[];
  creditos: { id: string; valor: number; status: string; codigo: string | null; codigo_final: string; expira_em: string }[];
  checkoutMode: "off" | "coupon_param";
};

export type Load<T> = { state: "loading" } | { state: "unavailable" } | { state: "error" } | { state: "ready"; data: T };

export function useJson<T>(url: string) {
  const [load, setLoad] = useState<Load<T>>({ state: "loading" });
  const reload = useCallback(async () => {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.status === 503) return setLoad({ state: "unavailable" });
      if (!res.ok) return setLoad({ state: "error" });
      setLoad({ state: "ready", data: (await res.json()) as T });
    } catch {
      setLoad({ state: "error" });
    }
  }, [url]);
  useEffect(() => {
    // Busca inicial de dado externo (API).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
  }, [reload]);
  return { load, reload };
}

export const brl = (v: number) => (v < 0 ? "− " : "") + "R$ " + Math.abs(v).toFixed(2).replace(".", ",");
export const dia = (iso: string) => new Date(`${iso.slice(0, 10)}T12:00:00`).toLocaleDateString("pt-BR");

// O indicador vê só o andamento — nunca quem comprou nem por quê não valeu.
export const STATUS_LABEL: Record<string, string> = {
  convite_ativo: "Convite ativado",
  compra_em_analise: "Compra em análise",
  em_validacao: "Compra confirmada · em validação",
  aprovada: "Recompensa liberada",
  nao_elegivel: "Não elegível pelas regras",
  revertida: "Revertida (pedido cancelado ou devolvido)",
  expirado: "Convite expirado",
};

export const EXTRATO_LABEL: Record<string, string> = {
  pendente: "Recompensa em validação",
  aprovacao_saida: "Validação concluída",
  aprovacao_entrada: "Crédito liberado",
  reversao_pendente: "Recompensa revertida",
  reversao_aprovada: "Crédito revertido",
  conversao_codigo: "Convertido em código",
  codigo_expirado: "Código expirado · saldo devolvido",
};
