import { prepareGiftCart } from "@/lib/gift/kits-service";
import { checkRateLimit } from "@/lib/gift/rate-limit";

const MAX_BODY_BYTES = 4_096;

// Prepara o item de presente para o carrinho: valida no servidor, revalida
// preço/estoque e grava a personalização. NÃO cria pedido nem cobrança —
// o pedido nasce no checkout do Appmax.
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return Response.json({ code: "forbidden_origin", message: "Origem não autorizada." }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!checkRateLimit(`gift-cart:${ip}`)) {
    return Response.json({ code: "rate_limited", message: "Muitas tentativas. Aguarde um instante." }, { status: 429 });
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return Response.json({ code: "too_large", message: "Requisição muito grande." }, { status: 413 });
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ code: "invalid_json", message: "Requisição inválida." }, { status: 400 });
  }

  try {
    const referer = request.headers.get("referer");
    const search = referer ? new URL(referer).search : "";
    const result = await prepareGiftCart(body, search);
    return Response.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("[gift/kits/cart]", e instanceof Error ? e.message : e);
    return Response.json({ code: "server_error", message: "Não foi possível adicionar agora. Tente novamente." }, { status: 500 });
  }
}
