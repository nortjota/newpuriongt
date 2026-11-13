import { unsubscribe } from "@/lib/private/service";
import { clientIp, getSecrets, handleError, json, limited, readJson, sameOrigin, unavailable } from "@/lib/private/http";

// Descadastro de marketing pelo link do e-mail (sem login).
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ code: "origem_invalida" }, 403);
  if (limited(req, "pa-unsub", 10)) return json({ code: "limite" }, 429);
  const s = getSecrets();
  if (!s) return unavailable();
  try {
    const b = (await readJson(req)) as { token?: unknown };
    const r = await unsubscribe(s, b?.token, clientIp(req));
    return json({ code: r.resultado }, r.resultado === "ok" ? 200 : 400);
  } catch (e) {
    return handleError("unsubscribe", e);
  }
}
