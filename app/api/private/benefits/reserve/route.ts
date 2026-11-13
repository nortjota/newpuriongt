import { reserve } from "@/lib/private/service";
import { clientIp, currentCliente, getSecrets, handleError, json, limited, readJson, sameOrigin, unavailable } from "@/lib/private/http";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const MESSAGES: Record<string, string> = {
  acesso_negado: "Este benefício não pertence à sua conta.",
  expirado: "Este benefício expirou.",
  utilizado: "Este benefício já foi utilizado.",
  cancelado: "Este benefício foi cancelado.",
  reserva_em_andamento: "Já existe um checkout em andamento com este benefício.",
  plano_nao_permitido: "Este benefício não vale para a opção escolhida.",
  somente_presente: "Este benefício vale apenas para compras de presente.",
  compra_minima: "O pedido não atinge a compra mínima do benefício.",
  nao_cumulativo: "Este benefício não é cumulativo com outro benefício em uso.",
  sem_compra_paga: "O benefício exige uma compra anterior aprovada.",
  ja_comprou_presente: "O benefício vale apenas para a primeira compra de presente.",
  politica_inativa: "Este benefício não está mais ativo.",
  oferta_indisponivel: "Esta opção de presente está indisponível no momento.",
  valor_invalido: "Valor do pedido inválido.",
};

// Reserva o benefício para um checkout. Valor do pedido vem do catálogo do
// servidor; a reserva expira sozinha e é idempotente por chave do cliente.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ code: "origem_invalida" }, 403);
  if (limited(req, "pa-reserve", 15)) return json({ code: "limite", message: "Muitas tentativas. Aguarde um instante." }, 429);
  const s = getSecrets();
  if (!s) return unavailable();
  try {
    const cliente = await currentCliente(s);
    if (!cliente) return json({ code: "nao_autenticado", message: "Ative seu acesso para continuar." }, 401);
    const b = (await readJson(req)) as Record<string, unknown>;
    const ok =
      typeof b?.voucherId === "string" && UUID.test(b.voucherId) &&
      typeof b.offerId === "string" && /^[a-z]{2,20}$/.test(b.offerId) &&
      typeof b.idempotencyKey === "string" && /^[\w-]{16,100}$/.test(b.idempotencyKey);
    if (!ok) return json({ code: "requisicao_invalida", message: "Requisição inválida." }, 400);
    const r = await reserve(
      s,
      cliente,
      { voucherId: b.voucherId as string, offerId: b.offerId as string, presente: b.presente === true, idempotencyKey: b.idempotencyKey as string },
      clientIp(req)
    );
    if (!r.ok) return json({ code: r.motivo, message: MESSAGES[r.motivo] ?? "Não foi possível usar o benefício." }, r.motivo === "acesso_negado" ? 403 : 409);
    return json({ code: "reservado", ...r });
  } catch (e) {
    return handleError("reserve", e);
  }
}
