import { panel } from "@/lib/indicacoes/service";
import { currentCliente, getSecrets, handleError, json, unavailable } from "@/lib/private/http";

const site = (req: Request) => process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

// Painel do indicador (link, saldo, indicações e extrato). Exige sessão do
// Private Access. Nunca contém dados do indicado.
export async function GET(req: Request) {
  const s = getSecrets();
  if (!s) return unavailable();
  try {
    const cliente = await currentCliente(s);
    if (!cliente) return json({ authenticated: false });
    return json({ authenticated: true, ...(await panel(s, cliente, site(req))) });
  } catch (e) {
    return handleError("indicacoes/me", e);
  }
}
