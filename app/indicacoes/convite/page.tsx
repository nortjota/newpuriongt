import type { Metadata } from "next";
import PrivateLayout, { Eyebrow } from "@/components/private/PrivateLayout";
import InvitePanel, { type InviteOffer } from "@/components/indicacoes/InvitePanel";
import { getGiftCatalog, isAvailable } from "@/lib/gift/catalog";

export const metadata: Metadata = {
  title: "Seu convite PURION GT",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ConvitePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const estado = typeof sp.estado === "string" ? sp.estado : null;
  const offers: InviteOffer[] = (await getGiftCatalog())
    .filter(isAvailable)
    .map((o) => ({ id: o.id, name: o.name, price: o.price, amount: o.amount }));

  return (
    <PrivateLayout nav={[{ href: "/presentes", label: "Presentes" }, { href: "/", label: "Conheça a PURION GT", primary: true }]}>
      <section className="mx-auto flex max-w-[720px] flex-col gap-6 px-6 pb-[var(--section-y)] pt-28 sm:pt-36">
        <Eyebrow>Convite PURION GT</Eyebrow>
        <h1
          className="m-0 text-balance font-display text-[clamp(36px,6vw,72px)] font-medium leading-[0.96] tracking-[-0.04em]"
          style={{ fontVariationSettings: "'wdth' 88" }}
        >
          Alguém que ama carros lembrou de você.
        </h1>
        <p className="m-0 text-[17px] leading-relaxed text-paper-0/65">
          PURION GT é um perfume automotivo premium: notas reais, fixação longa e presença discreta.
        </p>
        <InvitePanel offers={offers} estado={estado} />
      </section>
    </PrivateLayout>
  );
}
