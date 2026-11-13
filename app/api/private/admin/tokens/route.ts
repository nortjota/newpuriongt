import { safeEqual } from "@/lib/private/crypto";
import { issueAccessToken } from "@/lib/private/service";
import { getSecrets, handleError, json, readJson, unavailable } from "@/lib/private/http";

const ORIGENS = ["qr_embalagem", "whatsapp", "email", "crm"] as const;

// Emissão de token de acesso individual (servidor-a-servidor: CRM ou
// operação). Retorna o link e o QR Code (SVG) — exibidos uma única vez.
export async function POST(req: Request) {
  const admin = process.env.PRIVATE_ACCESS_ADMIN_SECRET;
  const s = getSecrets();
  if (!admin || admin.length < 32 || !s) return unavailable();
  const auth = req.headers.get("authorization") ?? "";
  if (!safeEqual(auth, `Bearer ${admin}`)) return json({ code: "nao_autorizado" }, 401);
  try {
    const b = (await readJson(req)) as Record<string, unknown>;
    const email = typeof b?.email === "string" ? b.email.trim().toLowerCase() : "";
    const origem = ORIGENS.find((o) => o === b.origem);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200 || !origem) return json({ code: "requisicao_invalida" }, 400);
    const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    const r = await issueAccessToken(
      s,
      {
        email,
        documento: typeof b.documento === "string" ? b.documento : null,
        primeiroNome: typeof b.primeiroNome === "string" ? b.primeiroNome.slice(0, 40) : null,
        origem,
        validadeDias: typeof b.validadeDias === "number" ? b.validadeDias : undefined,
        emitidoPor: typeof b.emitidoPor === "string" ? b.emitidoPor.slice(0, 60) : "api",
      },
      site
    );
    return json({ code: "ok", ...r }, 201);
  } catch (e) {
    return handleError("admin/tokens", e);
  }
}
