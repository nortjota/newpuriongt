// Autorização servidor-a-servidor do admin (CRM/operação).
import { safeEqual } from "@/lib/private/crypto";

export function isAdmin(req: Request): boolean {
  const admin = process.env.PRIVATE_ACCESS_ADMIN_SECRET;
  if (!admin || admin.length < 32) return false;
  return safeEqual(req.headers.get("authorization") ?? "", `Bearer ${admin}`);
}
