// Utilitários HTTP das rotas /api/private/*. Só servidor.
import { cookies } from "next/headers";
import { checkRateLimit } from "@/lib/gift/rate-limit";
import { ConfigError, loadSecrets, type Secrets } from "./crypto";
import { BackendUnavailable, backendConfigured } from "./db";
import { sessionCliente, SESSION_DAYS, type Cliente } from "./service";

export const SESSION_COOKIE = "pa_session";

const NO_STORE = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" };

export function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...NO_STORE, ...extra } });
}

export const unavailable = () =>
  json({ code: "indisponivel", message: "O Private Access está temporariamente indisponível. Tente novamente mais tarde." }, 503);

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

// Mutações só a partir do próprio site (o cookie é SameSite=Lax; isto é a
// segunda barreira contra CSRF).
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return req.method === "GET";
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

export function limited(req: Request, bucket: string, max: number) {
  return !checkRateLimit(`${bucket}:${clientIp(req)}`, Date.now(), max);
}

export function getSecrets(): Secrets | null {
  try {
    if (!backendConfigured()) return null;
    return loadSecrets();
  } catch (e) {
    if (e instanceof ConfigError) {
      console.error("[private-access] configuração inválida:", e.message);
      return null;
    }
    throw e;
  }
}

export async function readSessionId(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function currentCliente(s: Secrets): Promise<Cliente | null> {
  return sessionCliente(s, await readSessionId());
}

export async function setSessionCookie(req: Request, sessionId: string) {
  const secure = new URL(req.url).protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";
  (await cookies()).set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function readJson(req: Request, maxBytes = 4096): Promise<unknown> {
  const text = await req.text();
  if (text.length > maxBytes) throw new RangeError("corpo muito grande");
  return JSON.parse(text);
}

export function handleError(scope: string, e: unknown) {
  if (e instanceof BackendUnavailable) return unavailable();
  if (e instanceof SyntaxError || e instanceof RangeError) return json({ code: "requisicao_invalida", message: "Requisição inválida." }, 400);
  console.error(`[private-access/${scope}]`, e instanceof Error ? e.message : e);
  return json({ code: "erro", message: "Não foi possível concluir agora. Tente novamente." }, 500);
}
