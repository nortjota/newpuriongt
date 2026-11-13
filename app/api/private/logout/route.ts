import { endSession } from "@/lib/private/service";
import { clearSessionCookie, getSecrets, handleError, json, readSessionId, sameOrigin } from "@/lib/private/http";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ code: "origem_invalida" }, 403);
  try {
    const s = getSecrets();
    const id = await readSessionId();
    if (s && id) await endSession(s, id);
    await clearSessionCookie();
    return json({ code: "ok" });
  } catch (e) {
    return handleError("logout", e);
  }
}
