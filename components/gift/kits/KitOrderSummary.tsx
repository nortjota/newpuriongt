import { fmt } from "@/lib/content/plans";
import type { PriceSummary } from "@/lib/gift/pricing";

// Resumo dinâmico. Frete nunca é inventado: aparece como "no checkout".
export default function KitOrderSummary({ name, summary }: { name: string | null; summary: PriceSummary | null }) {
  if (!name || !summary) {
    return <p className="m-0 text-[14px] text-paper-0/55">Escolha um presente para ver o resumo.</p>;
  }
  const row = "flex items-baseline justify-between gap-4 text-[14px]";
  return (
    <dl className="m-0 flex flex-col gap-2.5" aria-live="polite">
      <div className={row}>
        <dt className="text-paper-0/70">
          {summary.quantity}× {name}
          <span className="block text-[12px] text-paper-0/45">{summary.totalBottles} {summary.totalBottles === 1 ? "frasco" : "frascos"} · 60 ml</span>
        </dt>
        <dd className="m-0 font-mono text-paper-0/70">{fmt(summary.listPrice)}</dd>
      </div>
      <div className={row}>
        <dt className="text-paper-0/70">Desconto do kit</dt>
        <dd className="m-0 font-mono text-paper-0">{summary.discount > 0 ? `− ${fmt(summary.discount)}` : "—"}</dd>
      </div>
      <div className={row}>
        <dt className="text-paper-0/70">Frete</dt>
        <dd className="m-0 text-right text-[13px] text-paper-0/60">Calculado no checkout pelo CEP</dd>
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-white/10 pt-4">
        <dt className="text-[14px] text-paper-0">Total sem frete</dt>
        <dd className="m-0 font-mono text-[26px] tracking-[-0.03em] text-paper-0">{fmt(summary.total)}</dd>
      </div>
      <p className="m-0 text-[12px] text-paper-0/45">ou 3× de {fmt(summary.total / 3)} sem juros no cartão.</p>
    </dl>
  );
}
