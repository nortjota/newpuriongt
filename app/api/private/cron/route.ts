import { safeEqual } from "@/lib/private/crypto";
import { maintenance } from "@/lib/private/service";
import { getSecrets, handleError, json, unavailable } from "@/lib/private/http";

// Rotina periódica (Vercel Cron envia Authorization: Bearer CRON_SECRET):
// expira reservas/vouchers vencidos e despacha a outbox para o CRM.
// A expiração também acontece sob demanda em cada leitura/ação, então um
// atraso do cron não libera nem prende benefício indevidamente.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || !getSecrets()) return unavailable();
  if (!safeEqual(req.headers.get("authorization") ?? "", `Bearer ${secret}`)) return json({ code: "nao_autorizado" }, 401);
  try {
    return json({ code: "ok", ...(await maintenance()) });
  } catch (e) {
    return handleError("cron", e);
  }
}
