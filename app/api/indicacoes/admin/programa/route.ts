import { publicProgram, updateProgram } from "@/lib/indicacoes/service";
import { isAdmin } from "@/lib/indicacoes/admin";
import { getSecrets, handleError, json, readJson, unavailable } from "@/lib/private/http";

// Admin (CRM/operação, Bearer): consulta e ajusta valores, limites, janelas,
// validade e ativação do programa. Toda mudança é auditada e vai à outbox.
export async function GET(req: Request) {
  if (!getSecrets()) return unavailable();
  if (!isAdmin(req)) return json({ code: "nao_autorizado" }, 401);
  try {
    return json({ programa: await publicProgram() });
  } catch (e) {
    return handleError("indicacoes/admin/programa", e);
  }
}

export async function PATCH(req: Request) {
  if (!getSecrets()) return unavailable();
  if (!isAdmin(req)) return json({ code: "nao_autorizado" }, 401);
  try {
    const b = (await readJson(req, 16_384)) as { campos?: unknown; por?: unknown };
    if (!b?.campos || typeof b.campos !== "object" || Array.isArray(b.campos)) return json({ code: "requisicao_invalida" }, 400);
    const r = await updateProgram(b.campos as Record<string, unknown>, typeof b.por === "string" ? b.por.slice(0, 60) : "admin");
    return json(r, r.resultado === "ok" ? 200 : 400);
  } catch (e) {
    return handleError("indicacoes/admin/programa", e);
  }
}
