import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gift, Users } from "lucide-react";
import PrivateLayout, { Eyebrow } from "@/components/private/PrivateLayout";
import PrivateAccessPanel from "@/components/private/PrivateAccessPanel";
import PolicyHighlights from "@/components/private/PolicyHighlights";
import Accordion from "@/components/gift/Accordion";
import type { NavLink } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "PURION PRIVATE ACCESS",
  description: "Um relacionamento contínuo com quem já experimentou a PURION GT.",
  alternates: { canonical: "/private-access" },
  // Área pessoal: fora dos buscadores.
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const NAV: NavLink[] = [
  { href: "#ativar", label: "Meu acesso" },
  { href: "/beneficios", label: "Benefícios" },
  { href: "/presentes", label: "Presentes" },
  { href: "#duvidas", label: "Dúvidas" },
  { href: "#ativar", label: "Acessar", primary: true },
];

// Programa de indicação: a página /indicacoes mostra "em preparação" enquanto
// o programa estiver inativo (sem anunciar valores).
const REFERRALS_URL = process.env.NEXT_PUBLIC_REFERRALS_URL || "/indicacoes";

const FAQ = [
  {
    q: "O que é o PURION PRIVATE ACCESS?",
    a: "Um espaço para quem já comprou PURION GT acompanhar benefícios pessoais, presentear com facilidade e escolher se quer receber novidades.",
  },
  {
    q: "Como recebo meu acesso?",
    a: "Por um link ou QR Code individual enviado pela PURION GT. Ele não contém seus dados pessoais, vale por tempo limitado e pode ser usado uma única vez para identificar este navegador.",
  },
  {
    q: "Preciso aceitar receber marketing para usar o benefício ou ser atendido?",
    a: "Não. Novidades por e-mail ou WhatsApp são opcionais, começam desmarcadas e podem ser canceladas a qualquer momento. Mensagens sobre seus pedidos continuam chegando normalmente.",
  },
  {
    q: "O benefício vira dinheiro ou crédito?",
    a: "Não. Ele vale apenas como desconto, dentro das regras e da validade informadas, e não é convertido em dinheiro nem em crédito.",
  },
  {
    q: "E se o pagamento não for aprovado?",
    a: "Se o pedido não for concluído, o benefício volta a ficar disponível dentro da validade. Em caso de estorno ou chargeback de um pedido que usou o benefício, ele é cancelado.",
  },
  {
    q: "Como saio ou removo este acesso do navegador?",
    a: "Use o botão “Sair” no seu painel. Para receber um novo link, fale com a gente no WhatsApp.",
  },
];

export default function PrivateAccessPage() {
  return (
    <PrivateLayout nav={NAV}>
      <section aria-labelledby="pa-title" className="mx-auto max-w-[var(--content-max)] px-6 pb-14 pt-28 sm:px-10 sm:pt-36">
        <div className="flex max-w-[820px] flex-col gap-6">
          <Eyebrow>PURION PRIVATE ACCESS</Eyebrow>
          <h1
            id="pa-title"
            className="m-0 text-balance font-display text-[clamp(40px,6.4vw,88px)] font-medium leading-[0.95] tracking-[-0.045em]"
            style={{ fontVariationSettings: "'wdth' 86" }}
          >
            Sua experiência PURION GT é apenas o começo.
          </h1>
          <p className="m-0 max-w-[52ch] text-[17px] leading-relaxed text-paper-0/65 sm:text-[19px]">
            Um relacionamento contínuo com quem já experimentou a marca: benefícios pessoais, presentes pensados para quem ama carros e
            novidades só se você quiser.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[var(--content-max)] gap-10 px-6 pb-[var(--section-y)] sm:px-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <h2 className="m-0 font-display text-[28px] font-medium tracking-[-0.03em]">Benefícios ativos</h2>
          <PolicyHighlights />
          <p className="m-0 text-[14px] leading-relaxed text-paper-0/55">
            Benefícios são pessoais e intransferíveis, liberados apenas para clientes identificados pelo link individual.
          </p>
        </div>
        <div id="ativar" className="scroll-mt-24">
          <PrivateAccessPanel />
        </div>
      </section>

      <section aria-label="Atalhos" className="mx-auto grid max-w-[var(--content-max)] gap-3 px-6 pb-[var(--section-y)] sm:grid-cols-2 sm:px-10">
        <Link href="/presentes" className="group flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/25">
          <span className="flex items-center gap-4">
            <Gift size={20} aria-hidden className="text-paper-0/70" />
            <span className="flex flex-col">
              <span className="text-[17px] text-paper-0">Presentes</span>
              <span className="text-[13px] text-paper-0/55">Para quem ama carros, um presente à altura.</span>
            </span>
          </span>
          <ArrowRight size={18} aria-hidden className="text-paper-0/50 transition-transform group-hover:translate-x-0.5" />
        </Link>
        {REFERRALS_URL ? (
          <a href={REFERRALS_URL} className="group flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/25">
            <span className="flex items-center gap-4">
              <Users size={20} aria-hidden className="text-paper-0/70" />
              <span className="flex flex-col">
                <span className="text-[17px] text-paper-0">Programa de indicações</span>
                <span className="text-[13px] text-paper-0/55">Indique a PURION GT para quem ama carros.</span>
              </span>
            </span>
            <ArrowRight size={18} aria-hidden className="text-paper-0/50" />
          </a>
        ) : (
          <div className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-dashed border-white/12 p-6" data-state="indicacoes_em_preparacao">
            <Users size={20} aria-hidden className="text-paper-0/40" />
            <span className="flex flex-col">
              <span className="text-[17px] text-paper-0/70">Programa de indicações</span>
              <span className="text-[13px] text-paper-0/45">Em preparação. Avisaremos aqui quando abrir.</span>
            </span>
          </div>
        )}
      </section>

      <section
        id="duvidas"
        aria-labelledby="pa-faq"
        className="mx-auto grid max-w-[var(--content-max)] scroll-mt-20 gap-12 border-t border-white/10 px-6 py-[var(--section-y)] sm:px-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20"
      >
        <div className="flex flex-col gap-4">
          <Eyebrow>Dúvidas e termos</Eyebrow>
          <h2 id="pa-faq" className="m-0 font-display text-[clamp(32px,4.6vw,56px)] font-medium leading-[0.98] tracking-[-0.035em]">
            Como funciona.
          </h2>
          <p className="m-0 text-[15px] text-paper-0/60">
            Termos completos de cada benefício estão em{" "}
            <Link href="/beneficios" className="underline underline-offset-4">
              Benefícios
            </Link>
            . Tratamento de dados conforme a{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
        <Accordion items={FAQ} />
      </section>
    </PrivateLayout>
  );
}
