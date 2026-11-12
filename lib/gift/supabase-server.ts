// Cliente Supabase com a chave de SERVIÇO — usar só em route handlers.
// A chave nunca tem prefixo NEXT_PUBLIC_ e nunca chega ao navegador.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Tenant único da PURION no CRM (mesmo valor usado pelo webhook Appmax do
// purion-os). Com a chave de serviço o DEFAULT meu_tenant_id() não dispara.
export const PURION_TENANT_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

let cached: SupabaseClient | null | undefined;

export function getServiceClient(): SupabaseClient | null {
  if (typeof window !== "undefined") throw new Error("getServiceClient é só de servidor");
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  cached = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return cached;
}
