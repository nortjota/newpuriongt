import { cancelReservation } from "@/lib/private/service";
import { clientIp, currentCliente, getSecrets, handleError, json, limited, readJson, sameOrigin, unavailable } from "@/lib/private/http";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// O cliente desiste do checkout: libera o benefício na hora.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ code: "origem_invalida" }, 403);
  if (limited(req, "pa-cancel", 15)) return json({ code: "limite" }, 429);
  const s = getSecrets();
  if (!s) return unavailable();
  try {
    const cliente = await currentCliente(s);
    if (!cliente) return json({ code: "nao_autenticado" }, 401);
    const b = (await readJson(req)) as { resgateId?: unknown };
    if (typeof b?.resgateId !== "string" || !UUID.test(b.resgateId)) return json({ code: "requisicao_invalida" }, 400);
    const r = await cancelReservation(s, cliente, b.resgateId, clientIp(req));
    return json({ code: r.resultado }, r.resultado === "acesso_negado" ? 403 : 200);
  } catch (e) {
    return handleError("cancel", e);
  }
}
