import type { Metadata } from "next";
import PrivateLayout, { Eyebrow } from "@/components/private/PrivateLayout";
import UnsubscribePanel from "@/components/private/UnsubscribePanel";

export const metadata: Metadata = {
  title: "Cancelar novidades — PURION GT",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function DescadastroPage() {
  return (
    <PrivateLayout nav={[{ href: "/", label: "PURION GT" }, { href: "/private-access", label: "Private Access", primary: true }]}>
      <section className="mx-auto flex max-w-[640px] flex-col gap-6 px-6 pb-[var(--section-y)] pt-32 sm:pt-40">
        <Eyebrow>Preferências de comunicação</Eyebrow>
        <h1 className="m-0 font-display text-[clamp(32px,5vw,56px)] font-medium leading-[1] tracking-[-0.04em]">Cancelar novidades.</h1>
        <UnsubscribePanel />
      </section>
    </PrivateLayout>
  );
}
