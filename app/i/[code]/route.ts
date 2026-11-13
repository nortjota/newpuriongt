import { normalizeReferralCode, registerClick } from "@/lib/indicacoes/service";
import { ensureVisitor, setReferralCookie } from "@/lib/indicacoes/http";
import { clientIp, getSecrets, limited } from "@/lib/private/http";

// Link curto de indicação: /i/<código>. Registra o clique (anônimo), guarda
// o código em cookie e leva ao convite. Sempre redireciona — um link
// inválido ou um backend fora do ar não deixam o visitante sem saída.
export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const code = normalizeReferralCode(raw);
  const to = (path: string) =>
    new Response(null, { status: 303, headers: { Location: new URL(path, req.url).toString(), "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });

  if (!code) return to("/indicacoes/convite?estado=invalido");
  const s = getSecrets();
  if (!s) return to("/presentes");
  try {
    const visitor = await ensureVisitor(req);
    if (!limited(req, "ind-click", 60)) {
      const r = await registerClick(s, code, visitor, clientIp(req));
      if (r.resultado === "invalido" || r.resultado === "inativo") return to(`/indicacoes/convite?estado=${r.resultado}`);
    }
    await setReferralCookie(req, code);
    return to("/indicacoes/convite");
  } catch (e) {
    console.error("[indicacoes/clique]", e instanceof Error ? e.message : e);
    return to("/presentes");
  }
}
