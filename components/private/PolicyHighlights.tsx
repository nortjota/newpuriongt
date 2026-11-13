"use client";

import { brl, usePublicPolicies } from "./usePrivateData";

// Explicação dos benefícios a partir das políticas ATIVAS no banco — nada
// é anunciado se não estiver ativo.
export default function PolicyHighlights() {
  const { status, politicas } = usePublicPolicies();
  if (status === "loading") return <div className="h-24 animate-pulse rounded-[var(--radius-lg)] bg-white/[0.04]" aria-hidden />;
  if (status !== "ready" || politicas.length === 0) {
    return (
      <p className="m-0 rounded-[var(--radius-md)] border border-white/10 p-5 text-[15px] text-paper-0/60" data-state="sem_beneficio_publico">
        No momento não há benefício ativo. Quando houver, ele aparece aqui — com regras, validade e valor.
      </p>
    );
  }
  return (
    <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
      {politicas.map((p) => (
        <li key={p.codigo} className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-white/10 bg-white/[0.03] p-5">
          <span className="font-mono text-[28px] tracking-[-0.03em] text-paper-0">{brl(p.valor)}</span>
          <span className="text-[15px] text-paper-0">{p.nome}</span>
          <span className="text-[13px] text-paper-0/55">
            Válido por {p.validade_dias} dias após a ativação · compra mínima {brl(p.compra_minima)} · uso único
          </span>
        </li>
      ))}
    </ul>
  );
}
