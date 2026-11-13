// Acesso às funções do banco (db/migrations/20261113_private_access_beneficios.sql).
// Duas conexões REAIS possíveis, chamando as mesmas funções SQL:
//   • DATABASE_URL → Postgres direto (pooler do Supabase em produção; banco local nos testes)
//   • NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY → RPC do Supabase
// Sem nenhuma das duas, o Private Access fica desligado (503) — nunca simulado.
import { Pool } from "pg";
import { getServiceClient } from "@/lib/gift/supabase-server";

export class BackendUnavailable extends Error {}

let pool: Pool | null | undefined;

function getPool(): Pool | null {
  if (pool !== undefined) return pool;
  const url = process.env.DATABASE_URL;
  pool = url
    ? new Pool({
        connectionString: url,
        max: Number(process.env.DATABASE_POOL_MAX || 3),
        ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false },
      })
    : null;
  // Sem isto, uma conexão ociosa derrubada (failover, reinício do banco)
  // vira uncaughtException e derruba o processo. O pool reconecta sozinho.
  pool?.on("error", (e) => console.error("[private-access/db] conexão perdida:", e.message));
  return pool;
}

export function backendConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL) || getServiceClient() !== null;
}

const NAME = /^[a-z_][a-z0-9_]*$/;

export async function callFn<T = unknown>(name: string, args: Record<string, unknown>): Promise<T> {
  if (!NAME.test(name)) throw new Error("nome de função inválido");
  const p = getPool();
  if (p) {
    const keys = Object.keys(args);
    for (const k of keys) if (!NAME.test(k)) throw new Error("argumento inválido");
    const sql = `select public.${name}(${keys.map((k, i) => `${k} => $${i + 1}`).join(", ")}) as r`;
    const res = await p.query(sql, keys.map((k) => args[k]));
    return res.rows[0]?.r as T;
  }
  const db = getServiceClient();
  if (!db) throw new BackendUnavailable("Private Access sem backend configurado");
  const { data, error } = await db.rpc(name, args);
  if (error) throw new Error(error.message);
  return data as T;
}
