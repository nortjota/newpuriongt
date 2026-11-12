// Persistência da personalização de presente (tabela gift_personalizations —
// ver db/migrations/20261112_gift_personalizations.sql).
//
// Não é um pedido: é uma intenção "pendente de checkout" com referência
// (PG-XXXXXXXX). O pedido real nasce no Appmax; o vínculo com vendas é feito
// no CRM (pela referência repassada ao checkout ou manualmente no Despacho).
import { getServiceClient, PURION_TENANT_ID } from "./supabase-server";
import type { GiftCartRequest } from "./personalization";
import type { PriceSummary } from "./pricing";

export const PERSONALIZATION_TTL_DAYS = 30;

export type PersonalizationRecord = {
  reference: string;
  offer_id: string;
  plan_id: string;
  quantity: number;
  units_per_kit: number;
  kit_price: number;
  list_price: number;
  discount: number;
  occasion: string | null;
  delivery_mode: string;
  dedication: string | null;
  recipient_first_name: string | null;
  desired_date: string | null;
  tracking: Record<string, string>;
  status: "pendente_checkout";
  expires_at: string;
};

export interface PersonalizationStore {
  kind: "supabase" | "memory";
  insert(record: PersonalizationRecord): Promise<void>;
}

export function buildRecord(
  reference: string,
  req: GiftCartRequest,
  plan: { offerId: string; planId: string },
  summary: PriceSummary,
  tracking: Record<string, string>,
  now = new Date()
): PersonalizationRecord {
  return {
    reference,
    offer_id: plan.offerId,
    plan_id: plan.planId,
    quantity: summary.quantity,
    units_per_kit: summary.units,
    kit_price: summary.kitPrice,
    list_price: summary.listPrice,
    discount: summary.discount,
    occasion: req.occasion,
    delivery_mode: req.deliveryMode,
    dedication: req.dedication,
    recipient_first_name: req.recipientFirstName,
    desired_date: req.desiredDate,
    tracking,
    status: "pendente_checkout",
    expires_at: new Date(now.getTime() + PERSONALIZATION_TTL_DAYS * 86_400_000).toISOString(),
  };
}

class SupabaseStore implements PersonalizationStore {
  kind = "supabase" as const;
  async insert(record: PersonalizationRecord) {
    const db = getServiceClient();
    if (!db) throw new Error("armazenamento indisponível");
    const { error } = await db.from("gift_personalizations").insert({ ...record, tenant_id: PURION_TENANT_ID });
    if (error) throw new Error(error.message);
  }
}

export class MemoryStore implements PersonalizationStore {
  kind = "memory" as const;
  records: PersonalizationRecord[] = [];
  async insert(record: PersonalizationRecord) {
    if (this.records.some((r) => r.reference === record.reference)) throw new Error("referência duplicada");
    this.records.push(record);
  }
}

const memory = new MemoryStore();

// Supabase quando há credencial de servidor; memória só fora da Vercel e com
// opt-in explícito (testes/dev). Caso contrário: null → personalização off.
export function getPersonalizationStore(): PersonalizationStore | null {
  if (getServiceClient()) return new SupabaseStore();
  if (process.env.GIFT_PERSONALIZATION_STORE === "memory" && !process.env.VERCEL) return memory;
  return null;
}
