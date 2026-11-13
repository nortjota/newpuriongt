// Cookies anônimos do indicado. Só servidor.
//  • pg_vis: id aleatório do visitante (no banco vai só o HMAC)
//  • pg_ind: código do link clicado
// Nenhum dado pessoal; HttpOnly; expiram com a janela de atribuição.
import { cookies } from "next/headers";
import { randomToken, isWellFormedToken } from "@/lib/private/crypto";
import { normalizeReferralCode } from "./service";

export const VISITOR_COOKIE = "pg_vis";
export const REFERRAL_COOKIE = "pg_ind";
const MAX_AGE = 30 * 86_400;

function secureFor(req: Request) {
  return new URL(req.url).protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";
}

export async function getVisitor(): Promise<string | undefined> {
  const v = (await cookies()).get(VISITOR_COOKIE)?.value;
  return v && isWellFormedToken(v) ? v : undefined;
}

export async function ensureVisitor(req: Request): Promise<string> {
  const existing = await getVisitor();
  if (existing) return existing;
  const id = randomToken();
  (await cookies()).set(VISITOR_COOKIE, id, { httpOnly: true, secure: secureFor(req), sameSite: "lax", path: "/", maxAge: MAX_AGE });
  return id;
}

export async function getReferralCookie(): Promise<string | null> {
  return normalizeReferralCode((await cookies()).get(REFERRAL_COOKIE)?.value);
}

export async function setReferralCookie(req: Request, code: string) {
  (await cookies()).set(REFERRAL_COOKIE, code, { httpOnly: true, secure: secureFor(req), sameSite: "lax", path: "/", maxAge: MAX_AGE });
}
