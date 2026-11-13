import { publicPolicies } from "@/lib/private/service";
import { getSecrets, handleError, json, unavailable } from "@/lib/private/http";

// Benefícios ATIVOS (regras públicas, sem dados pessoais).
export async function GET() {
  if (!getSecrets()) return unavailable();
  try {
    return json({ politicas: await publicPolicies() });
  } catch (e) {
    return handleError("policies", e);
  }
}
