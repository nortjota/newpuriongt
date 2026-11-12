import { getKitAvailability } from "@/lib/gift/kits-service";

// Disponibilidade em tempo real (estoque do CRM + checkout confirmado).
export async function GET() {
  try {
    const data = await getKitAvailability();
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("[gift/kits/availability]", e instanceof Error ? e.message : e);
    return Response.json({ code: "availability_error", message: "Não foi possível consultar a disponibilidade." }, { status: 503 });
  }
}
