import type { Metadata } from "next";
import PrivateLayout, { Eyebrow } from "@/components/private/PrivateLayout";
import BenefitsPanel, { type OfferOption } from "@/components/private/BenefitsPanel";
import type { NavLink } from "@/components/layout/Header";
import { getGiftCatalog, isAvailable } from "@/lib/gift/catalog";

export const metadata: Metadata = {
  title: "Benefícios — PURION GT",
  description: "Benefícios ativos para clientes PURION GT: regras, validade, valor e compra mínima.",
  alternates: { canonical: "/beneficios" },
  referrer: "no-referrer",
};

const NAV: NavLink[] = [
  { href: "/private-access", label: "Private Access" },
  { href: "/presentes", label: "Presentes" },
  { href: "/", label: "Conheça a PURION GT" },
  { href: "/private-access#ativar", label: "Meu acesso", primary: true },
];

export default async function BeneficiosPage() {
  // Opções de resgate = ofertas reais disponíveis (o servidor revalida tudo).
  const offers: OfferOption[] = (await getGiftCatalog())
    .filter(isAvailable)
    .map((o) => ({ id: o.id, planId: o.planId, name: o.name, price: o.price, amount: o.amount }));

  return (
    <PrivateLayout nav={NAV}>
      <section aria-labelledby="ben-title" className="mx-auto max-w-[var(--content-max)] px-6 pb-10 pt-28 sm:px-10 sm:pt-36">
        <div className="flex max-w-[760px] flex-col gap-5">
          <Eyebrow>PURION PRIVATE ACCESS · Benefícios</Eyebrow>
          <h1
            id="ben-title"
            className="m-0 text-balance font-display text-[clamp(36px,5.4vw,72px)] font-medium leading-[0.96] tracking-[-0.04em]"
            style={{ fontVariationSettings: "'wdth' 88" }}
          >
            Benefícios ativos.
          </h1>
          <p className="m-0 max-w-[52ch] text-[16px] leading-relaxed text-paper-0/65 sm:text-[18px]">
            Só aparecem aqui benefícios reais e em vigor, com todas as regras. Código, resgate e histórico ficam visíveis apenas para o
            cliente identificado.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-[880px] px-6 pb-[var(--section-y)] sm:px-10">
        <BenefitsPanel offers={offers} />
      </section>
    </PrivateLayout>
  );
}
