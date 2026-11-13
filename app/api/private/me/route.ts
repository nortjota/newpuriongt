import { panel } from "@/lib/private/service";
import { currentCliente, getSecrets, handleError, json, unavailable } from "@/lib/private/http";

// Painel do cliente autenticado (benefícios, código, histórico, consentimento).
// Sem sessão válida, nenhum dado pessoal ou benefício privado é retornado.
export async function GET() {
  const s = getSecrets();
  if (!s) return unavailable();
  try {
    const cliente = await currentCliente(s);
    if (!cliente) return json({ authenticated: false });
    return json({ authenticated: true, ...(await panel(s, cliente)) });
  } catch (e) {
    return handleError("me", e);
  }
}
