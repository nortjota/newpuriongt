import { notFound } from "next/navigation";
import { REFERRALS } from "@/lib/referral";
import { afiliadoValidoNoCrm } from "@/lib/crm";
import AffiliateRedirect from "./AffiliateRedirect";

// Rota única pra todos os links de afiliado (/marcelo10, /cristiano10, ...).
// Vale o afiliado da lista fixa (REFERRALS) OU qualquer afiliado ATIVO cadastrado
// no CRM (módulo Afiliados) — assim um parceiro novo funciona sem mexer no site.
// Segmento que não bate com nenhum cai no 404 padrão; rotas estáticas como
// /privacy ou /terms têm prioridade no App Router.
export default async function AffiliatePage({
  params,
}: {
  params: Promise<{ affiliate: string }>;
}) {
  const { affiliate } = await params;
  const slug = affiliate.toLowerCase();
  if (REFERRALS[slug]) return <AffiliateRedirect slug={slug} />;

  const crm = await afiliadoValidoNoCrm(slug);
  if (!crm.valido) notFound();
  return <AffiliateRedirect slug={slug} nome={crm.nome ?? ""} />;
}
