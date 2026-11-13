import { setConsent } from "@/lib/private/service";
import { clientIp, currentCliente, getSecrets, handleError, json, limited, readJson, sameOrigin, unavailable } from "@/lib/private/http";

// Liga/desliga marketing por canal. Opcional; nunca condição para atendimento
// ou benefício. Cada mudança é registrada com versão e hash do texto exibido.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ code: "origem_invalida" }, 403);
  if (limited(req, "pa-consent", 20)) return json({ code: "limite" }, 429);
  const s = getSecrets();
  if (!s) return unavailable();
  try {
    const cliente = await currentCliente(s);
    if (!cliente) return json({ code: "nao_autenticado" }, 401);
    const b = (await readJson(req)) as { canal?: unknown; concedido?: unknown };
    if ((b?.canal !== "email" && b?.canal !== "whatsapp") || typeof b.concedido !== "boolean") return json({ code: "requisicao_invalida" }, 400);
    await setConsent(s, cliente, b.canal, b.concedido, clientIp(req));
    return json({ code: "ok" });
  } catch (e) {
    return handleError("consent", e);
  }
}
