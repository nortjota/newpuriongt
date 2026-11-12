// Estoque real de frascos prontos (tabela estoque_produto do CRM, mesmo
// projeto Supabase). Kits são bundles VIRTUAIS: 1 Duo consome 2 frascos,
// 1 Trio consome 3. A baixa acontece no CRM, no despacho
// (quantidade × frascos_por_unidade) — o site só LÊ.
//
// Sem credencial de servidor configurada, o estoque é "desconhecido" (null)
// e a página não promete quantidade — o limite fica no checkout.
import { getServiceClient, PURION_TENANT_ID } from "./supabase-server";

export type StockReading = { bottles: number | null; source: "crm" | "override" | "unknown" };

export async function readBottleStock(): Promise<StockReading> {
  // Override só fora da Vercel (testes/desenvolvimento).
  const override = process.env.GIFT_STOCK_BOTTLES;
  if (override !== undefined && !process.env.VERCEL) {
    const n = Number(override);
    if (Number.isInteger(n) && n >= 0) return { bottles: n, source: "override" };
  }
  const db = getServiceClient();
  if (!db) return { bottles: null, source: "unknown" };
  const { data, error } = await db
    .from("estoque_produto")
    .select("quantidade_atual")
    .eq("tenant_id", PURION_TENANT_ID)
    .eq("produto", "PURION GT 60ml")
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`estoque indisponível: ${error.message}`);
  if (!data) return { bottles: null, source: "unknown" };
  return { bottles: Math.max(0, Number(data.quantidade_atual) || 0), source: "crm" };
}

// Quantos kits de N frascos o estoque comporta. null = desconhecido.
export function kitsFromStock(bottles: number | null, units: number): number | null {
  if (bottles === null) return null;
  return Math.floor(bottles / units);
}
