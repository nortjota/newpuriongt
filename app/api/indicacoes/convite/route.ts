import { createInvite, publicProgram, visitorInvite } from "@/lib/indicacoes/service";
import { ensureVisitor, getReferralCookie, getVisitor } from "@/lib/indicacoes/http";
import { clientIp, currentCliente, getSecrets, handleError, json, limited, sameOrigin, unavailable } from "@/lib/private/http";

const MESSAGES: Record<string, string> = {
  inativo: "Este convite não está mais ativo.",
  invalido: "Não reconhecemos este convite.",
  autoindicacao: "Este é o seu próprio convite — compartilhe com alguém que ainda não conhece a PURION GT.",
  limite: "Muitos convites foram ativados desta rede hoje. Tente novamente amanhã.",
};

// Estado do convite do visitante (só o que é dele: o próprio cupom).
export async function GET() {
  const s = getSecrets();
  if (!s) return unavailable();
  try {
    const [programa, codigo, visitor] = await Promise.all([publicProgram(), getReferralCookie(), getVisitor()]);
    const invite = await visitorInvite(s, visitor);
    return json({
      programa: programa && { ativo: programa.ativo, desconto_indicado: programa.desconto_indicado, compra_minima: programa.compra_minima,
        janela_atribuicao_dias: programa.janela_atribuicao_dias, termos_versao: programa.termos_versao, termos_texto: programa.termos_texto },
      temConvite: Boolean(codigo),
      convite: invite && { cupom: invite.cupom, desconto: invite.desconto, expiraEm: invite.expiraEm },
    });
  } catch (e) {
    return handleError("indicacoes/convite", e);
  }
}

// Ativa o convite: cria a atribuição e o cupom pessoal de uso único.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ code: "origem_invalida" }, 403);
  if (limited(req, "ind-convite", 10)) return json({ code: "limite", message: MESSAGES.limite }, 429);
  const s = getSecrets();
  if (!s) return unavailable();
  try {
    const codigo = await getReferralCookie();
    if (!codigo) return json({ code: "sem_convite", message: "Abra o link de convite que você recebeu." }, 400);
    const visitor = await ensureVisitor(req);
    const sessao = await currentCliente(s);
    const r = await createInvite(s, codigo, visitor, clientIp(req), sessao?.cliente_id ?? null);
    if (r.resultado !== "criado" && r.resultado !== "existente") {
      return json({ code: r.resultado, message: MESSAGES[r.resultado] ?? "Não foi possível ativar o convite." }, r.resultado === "limite" ? 429 : 409);
    }
    const invite = await visitorInvite(s, visitor);
    return json({ code: r.resultado, convite: invite && { cupom: invite.cupom, desconto: invite.desconto, expiraEm: invite.expiraEm } });
  } catch (e) {
    return handleError("indicacoes/convite", e);
  }
}
