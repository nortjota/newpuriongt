import { generateCredit } from "@/lib/indicacoes/service";
import { currentCliente, getSecrets, handleError, json, limited, sameOrigin, unavailable } from "@/lib/private/http";

// Converte o saldo disponível em um código de uso único (não vira dinheiro).
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ code: "origem_invalida" }, 403);
  if (limited(req, "ind-credito", 10)) return json({ code: "limite" }, 429);
  const s = getSecrets();
  if (!s) return unavailable();
  try {
    const cliente = await currentCliente(s);
    if (!cliente) return json({ code: "nao_autenticado" }, 401);
    const r = await generateCredit(s, cliente);
    const msg: Record<string, string> = { sem_saldo: "Você ainda não tem crédito disponível.", ja_existe: "Você já tem um código de crédito ativo." };
    return json({ code: r.resultado, message: msg[r.resultado] }, r.resultado === "criado" || r.resultado === "ja_existe" ? 200 : 409);
  } catch (e) {
    return handleError("indicacoes/credito", e);
  }
}
