// Primitivas de segurança do Private Access. Só servidor.
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export class ConfigError extends Error {}

export type Secrets = {
  pepper: string; // HMAC dos tokens/sessões/códigos/IP (nunca vai para o banco)
  codeKey: Buffer; // AES-256-GCM do código do voucher (32 bytes)
};

export function loadSecrets(env: NodeJS.ProcessEnv = process.env): Secrets | null {
  const pepper = env.PRIVATE_ACCESS_PEPPER;
  const key = env.BENEFITS_CODE_KEY;
  if (!pepper || !key) return null;
  if (pepper.length < 32) throw new ConfigError("PRIVATE_ACCESS_PEPPER precisa de 32+ caracteres");
  const codeKey = Buffer.from(key, "base64");
  if (codeKey.length !== 32) throw new ConfigError("BENEFITS_CODE_KEY precisa ser 32 bytes em base64");
  return { pepper, codeKey };
}

// 256 bits, base64url (43 caracteres).
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function hmacHex(pepper: string, purpose: string, value: string): string {
  return createHmac("sha256", pepper).update(`${purpose}\u0000${value}`).digest("hex");
}

export const hashToken = (s: Secrets, token: string) => hmacHex(s.pepper, "pa-token", token);
export const hashSession = (s: Secrets, id: string) => hmacHex(s.pepper, "pa-session", id);
export const hashVoucherCode = (s: Secrets, code: string) => hmacHex(s.pepper, "voucher", normalizeVoucherCode(code));
export const hashUnsubscribe = (s: Secrets, token: string) => hmacHex(s.pepper, "unsubscribe", token);
export const hashIp = (s: Secrets, ip: string) => hmacHex(s.pepper, "ip", ip).slice(0, 32);

export const sha256Hex = (text: string) => createHash("sha256").update(text, "utf8").digest("hex");

export function isWellFormedToken(t: unknown): t is string {
  return typeof t === "string" && /^[A-Za-z0-9_-]{43}$/.test(t);
}

// Código de voucher legível: PG15-XXXX-XXXX-XXXX (alfabeto sem 0/O/1/I).
// 12 símbolos de 32 = 60 bits; só tem efeito com sessão + regras + checkout.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export function generateVoucherCode(prefix = "PG15"): string {
  const chars = Array.from(randomBytes(12), (b) => ALPHABET[b & 31]).join("");
  return `${prefix}-${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}`;
}
export function normalizeVoucherCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function encrypt(key: Buffer, plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return ["v1", iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), ct.toString("base64url")].join(".");
}

export function decrypt(key: Buffer, payload: string): string {
  const [v, iv, tag, ct] = payload.split(".");
  if (v !== "v1" || !iv || !tag || !ct) throw new Error("formato cifrado inválido");
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "base64url"));
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(ct, "base64url")), decipher.final()]).toString("utf8");
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

// Eventos de pagamento: hex(HMAC-SHA256(secret, `${ts}.${body}`)), janela de
// 5 minutos contra replay (a idempotência por event_id cobre o resto).
export function signWebhook(secret: string, timestamp: number, body: string): string {
  return createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
}

export function verifyWebhook(secret: string, timestampHeader: string | null, signature: string | null, body: string, now = Date.now()): boolean {
  if (!timestampHeader || !signature || !/^\d{10}$/.test(timestampHeader)) return false;
  const ts = Number(timestampHeader);
  if (Math.abs(now / 1000 - ts) > 300) return false;
  return safeEqual(signWebhook(secret, ts, body), signature);
}
