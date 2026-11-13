import { metrics } from "@/lib/indicacoes/service";
import { isAdmin } from "@/lib/indicacoes/admin";
import { getSecrets, handleError, json, unavailable } from "@/lib/private/http";

// Mensuração do programa (CRM/operação, Bearer). ?dias=90 (1–365).
export async function GET(req: Request) {
  if (!getSecrets()) return unavailable();
  if (!isAdmin(req)) return json({ code: "nao_autorizado" }, 401);
  try {
    const dias = Math.min(365, Math.max(1, Number(new URL(req.url).searchParams.get("dias")) || 90));
    return json({ dias, metricas: await metrics(new Date(Date.now() - dias * 86_400_000)) });
  } catch (e) {
    return handleError("indicacoes/admin/metricas", e);
  }
}
