import { myLink } from "@/lib/indicacoes/service";
import { currentCliente, getSecrets, handleError, json, limited, sameOrigin, unavailable } from "@/lib/private/http";

const MESSAGES: Record<string, string> = {
  nao_elegivel: "O link de indicação é liberado para quem já tem uma compra aprovada.",
  programa_inativo: "O programa de indicação ainda não está aberto.",
  bloqueado: "Seu link de indicação está suspenso. Fale com a gente no WhatsApp.",
};

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ code: "origem_invalida" }, 403);
  if (limited(req, "ind-link", 10)) return json({ code: "limite" }, 429);
  const s = getSecrets();
  if (!s) return unavailable();
  try {
    const cliente = await currentCliente(s);
    if (!cliente) return json({ code: "nao_autenticado", message: "Acesse com seu link pessoal para indicar." }, 401);
    const r = await myLink(cliente, process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin);
    if (!r.codigo) return json({ code: r.resultado, message: MESSAGES[r.resultado] ?? "Não foi possível gerar o link." }, 403);
    return json({ code: r.resultado, link: r.link });
  } catch (e) {
    return handleError("indicacoes/link", e);
  }
}
