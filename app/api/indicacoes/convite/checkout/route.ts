import { inviteCheckout } from "@/lib/indicacoes/service";
import { getVisitor } from "@/lib/indicacoes/http";
import { getSecrets, handleError, json, limited, readJson, sameOrigin, unavailable } from "@/lib/private/http";

const MESSAGES: Record<string, string> = {
  sem_convite: "Ative seu convite antes de ir ao checkout.",
  inativo: "O programa de indicação não está ativo.",
  oferta_indisponivel: "Esta opção está indisponível no momento.",
  compra_minima: "Esta opção não atinge a compra mínima do convite.",
  checkout_desligado: "O desconto direto no checkout está sendo habilitado. Seu cupom continua válido.",
};

// Link do checkout REAL (Appmax) com o cupom pessoal do indicado.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ code: "origem_invalida" }, 403);
  if (limited(req, "ind-checkout", 20)) return json({ code: "limite" }, 429);
  const s = getSecrets();
  if (!s) return unavailable();
  try {
    const b = (await readJson(req)) as { offerId?: unknown };
    const r = await inviteCheckout(s, await getVisitor(), b?.offerId);
    if (!r.ok) return json({ code: r.motivo, message: MESSAGES[r.motivo] }, 409);
    return json({ code: "ok", checkoutUrl: r.checkoutUrl });
  } catch (e) {
    return handleError("indicacoes/convite/checkout", e);
  }
}
