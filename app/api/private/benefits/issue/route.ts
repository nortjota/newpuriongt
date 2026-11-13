import { issueVoucher } from "@/lib/private/service";
import { clientIp, currentCliente, getSecrets, handleError, json, limited, readJson, sameOrigin, unavailable } from "@/lib/private/http";

const MESSAGES: Record<string, string> = {
  emitido: "Benefício ativado.",
  ja_emitido: "Você já ativou este benefício.",
  nao_elegivel: "Este benefício não está disponível para o seu cadastro.",
  politica_inexistente: "Benefício não encontrado.",
};

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ code: "origem_invalida" }, 403);
  if (limited(req, "pa-issue", 10)) return json({ code: "limite", message: "Muitas tentativas. Aguarde um instante." }, 429);
  const s = getSecrets();
  if (!s) return unavailable();
  try {
    const cliente = await currentCliente(s);
    if (!cliente) return json({ code: "nao_autenticado", message: "Ative seu acesso para continuar." }, 401);
    const body = (await readJson(req)) as { politica?: unknown };
    if (typeof body?.politica !== "string" || !/^[A-Z0-9_]{3,40}$/.test(body.politica)) {
      return json({ code: "requisicao_invalida", message: "Requisição inválida." }, 400);
    }
    const r = await issueVoucher(s, cliente, body.politica, clientIp(req));
    const status = r.resultado === "emitido" || r.resultado === "ja_emitido" ? 200 : r.resultado === "nao_elegivel" ? 403 : 404;
    return json({ code: r.resultado, motivo: r.motivo, message: MESSAGES[r.resultado] ?? "Não foi possível ativar." }, status);
  } catch (e) {
    return handleError("issue", e);
  }
}
