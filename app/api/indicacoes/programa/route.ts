import { publicProgram } from "@/lib/indicacoes/service";
import { getSecrets, handleError, json, unavailable } from "@/lib/private/http";

// Condições públicas do programa (sem dados pessoais).
export async function GET() {
  if (!getSecrets()) return unavailable();
  try {
    return json({ programa: await publicProgram() });
  } catch (e) {
    return handleError("indicacoes/programa", e);
  }
}
