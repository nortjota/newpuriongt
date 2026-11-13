import { activateToken } from "@/lib/private/service";
import { clientIp, getSecrets, handleError, json, limited, readJson, sameOrigin, setSessionCookie, unavailable } from "@/lib/private/http";

const MESSAGES: Record<string, string> = {
  invalido: "Não reconhecemos este código de acesso. Confira o link ou o QR Code.",
  expirado: "Este código de acesso expirou. Fale com a gente no WhatsApp para receber um novo.",
  utilizado: "Este código de acesso já foi usado. Se não foi você, fale com a gente no WhatsApp.",
  revogado: "Este código foi substituído por um mais recente. Use o último link que você recebeu.",
  bloqueado: "Muitas tentativas. Aguarde alguns minutos antes de tentar de novo.",
};

// Troca um token de ativação (do QR/link) por uma sessão (cookie HttpOnly).
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ code: "origem_invalida", message: "Origem não autorizada." }, 403);
  if (limited(req, "pa-activate", 10)) return json({ code: "bloqueado", message: MESSAGES.bloqueado }, 429);
  const s = getSecrets();
  if (!s) return unavailable();
  try {
    const body = (await readJson(req)) as { token?: unknown };
    const r = await activateToken(s, body?.token, clientIp(req));
    if (r.resultado !== "ok" || !r.sessionId) {
      return json({ code: r.resultado, message: MESSAGES[r.resultado] }, r.resultado === "bloqueado" ? 429 : 400);
    }
    await setSessionCookie(req, r.sessionId);
    return json({ code: "ok" });
  } catch (e) {
    return handleError("activate", e);
  }
}
