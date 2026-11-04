import { notFound } from "next/navigation";
import { REFERRALS } from "@/lib/referral";
import AffiliateRedirect from "./AffiliateRedirect";

// Rota única pra todos os links de afiliado (/marcelo10, /cristiano10,
// /jujuba10, ...) — qualquer segmento que não bata com REFERRALS cai no
// 404 padrão do Next.js, então isso não conflita com rotas estáticas como
// /privacy ou /terms (o App Router prioriza rotas mais específicas).
export default async function AffiliatePage({
  params,
}: {
  params: Promise<{ affiliate: string }>;
}) {
  const { affiliate } = await params;
  if (!REFERRALS[affiliate]) notFound();

  return <AffiliateRedirect slug={affiliate} />;
}
