"use client";

import type { ProgramaPublico } from "@/lib/indicacoes/service";
import { brl, useJson } from "./useReferralData";

export function ConditionsList({ p }: { p: ProgramaPublico }) {
  const rows: [string, string][] = [
    ["Quem é indicado", `${brl(p.desconto_indicado)} de desconto na primeira compra, a partir de ${brl(p.compra_minima)}`],
    ["Quem indica", `${brl(p.credito_indicador)} de crédito por compra válida`],
    ["Validação", `${p.janela_validacao_dias} dias após a confirmação do pagamento (arrependimento e estorno)`],
    ["Convite", `válido por ${p.janela_atribuicao_dias} dias; vale o primeiro convite ativado`],
    ["Limite", `até ${p.max_recompensas_por_indicador} recompensas por pessoa`],
    ["Crédito", `vira um código de uso único válido por ${p.validade_credito_dias} dias; não é convertido em dinheiro`],
    ["Não vale", "autoindicação (mesmo e-mail, CPF, telefone ou endereço), quem já é cliente, pedidos cancelados ou devolvidos"],
  ];
  return (
    <dl className="m-0 grid gap-x-8 gap-y-3 text-[14px] sm:grid-cols-[180px_1fr]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-paper-0/50">{k}</dt>
          <dd className="m-0 text-paper-0/85">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

// Condições lidas do programa no banco. Inativo → nada é anunciado.
export default function ReferralConditions() {
  const { load } = useJson<{ programa: ProgramaPublico | null }>("/api/indicacoes/programa");
  if (load.state === "loading") return <div className="h-40 animate-pulse rounded-[var(--radius-lg)] bg-white/[0.04]" aria-hidden />;
  const p = load.state === "ready" ? load.data.programa : null;
  if (!p || !p.ativo) {
    return (
      <p className="m-0 rounded-[var(--radius-md)] border border-white/10 p-5 text-[15px] text-paper-0/60" data-state="programa_em_preparacao">
        As condições serão publicadas aqui quando o programa abrir.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-5">
      <ConditionsList p={p} />
      <details className="border-t border-white/10 pt-4">
        <summary className="cursor-pointer text-[13px] text-paper-0/60 hover:text-paper-0">Regulamento (versão {p.termos_versao})</summary>
        <p className="m-0 mt-3 text-[13px] leading-relaxed text-paper-0/60">{p.termos_texto}</p>
      </details>
    </div>
  );
}
