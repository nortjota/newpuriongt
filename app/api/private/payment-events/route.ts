import { verifyWebhook } from "@/lib/private/crypto";
import { applyPaymentEvent, parsePaymentEvent } from "@/lib/private/service";
import { getSecrets, handleError, json, unavailable } from "@/lib/private/http";

// Eventos de pagamento (pago, falhou, cancelado, estornado, chargeback),
// encaminhados pelo webhook Appmax do CRM com assinatura HMAC. Idempotente
// por event_id; o efeito acontece numa transação no banco.
export async function POST(req: Request) {
  const secret = process.env.BENEFITS_WEBHOOK_SECRET;
  const s = getSecrets();
  if (!secret || secret.length < 32 || !s) return unavailable();
  const body = await req.text();
  if (body.length > 8192) return json({ code: "muito_grande" }, 413);
  if (!verifyWebhook(secret, req.headers.get("x-purion-timestamp"), req.headers.get("x-purion-signature"), body)) {
    return json({ code: "assinatura_invalida" }, 401);
  }
  try {
    const parsed = parsePaymentEvent(JSON.parse(body));
    if (!parsed.ok) return json({ code: "evento_invalido" }, 400);
    const r = await applyPaymentEvent(s, parsed.value);
    return json({ code: "ok", ...r });
  } catch (e) {
    return handleError("payment-events", e);
  }
}
