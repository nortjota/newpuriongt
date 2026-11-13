import type { Metadata } from "next";
import PrivateLayout, { Eyebrow } from "@/components/private/PrivateLayout";
import ReferralPanel from "@/components/indicacoes/ReferralPanel";
import ReferralConditions from "@/components/indicacoes/ReferralConditions";
import Accordion from "@/components/gift/Accordion";
import type { NavLink } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Indicações — PURION GT",
  description: "Indique a PURION GT para quem ama carros: seu amigo ganha desconto na primeira compra e você ganha crédito.",
  alternates: { canonical: "/indicacoes" },
  referrer: "no-referrer",
  // Fora do Google até a validação comercial do programa.
  robots: { index: false, follow: false },
};

const NAV: NavLink[] = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#meu-link-area", label: "Meu link" },
  { href: "#condicoes", label: "Condições" },
  { href: "/private-access", label: "Private Access" },
  { href: "#meu-link-area", label: "Indicar agora", primary: true },
];

const STEPS = [
  { t: "Compartilhe seu link", d: "Gere seu link pessoal e envie para quem ama carros — pelo WhatsApp ou como preferir." },
  { t: "Seu amigo ganha desconto", d: "Na primeira compra, com um cupom pessoal de uso único." },
  { t: "Você ganha crédito", d: "Depois que a compra dele é confirmada e passa pelo prazo de validação." },
];

const FAQ = [
  {
    q: "Quem pode indicar?",
    a: "Quem já tem uma compra aprovada da PURION GT e acessa pelo Private Access. O link é pessoal e não mostra seu nome, e-mail ou telefone.",
  },
  {
    q: "Quando recebo meu crédito?",
    a: "A recompensa fica em validação depois que a compra do seu indicado é paga e é liberada ao fim do prazo de validação (arrependimento e estorno). Se o pedido for cancelado ou devolvido, a recompensa é revertida.",
  },
  {
    q: "Consigo ver quem comprou pelo meu link?",
    a: "Não. Por privacidade, você vê apenas o andamento de cada indicação e o valor das recompensas — nunca dados da pessoa indicada.",
  },
  {
    q: "Posso indicar a mim mesmo ou alguém da minha casa?",
    a: "Não vale autoindicação: compras com o mesmo e-mail, CPF, telefone ou endereço do indicador não geram recompensa.",
  },
  {
    q: "E se a pessoa clicar no link de duas pessoas?",
    a: "Vale o primeiro convite que ela ativar, enquanto ele estiver válido.",
  },
  {
    q: "O crédito pode virar dinheiro?",
    a: "Não. O crédito vira um código de uso único para usar em uma compra, dentro da validade.",
  },
];

export default function IndicacoesPage() {
  return (
    <PrivateLayout nav={NAV}>
      <section aria-labelledby="ind-title" className="mx-auto max-w-[var(--content-max)] px-6 pb-14 pt-28 sm:px-10 sm:pt-36">
        <div className="flex max-w-[820px] flex-col gap-6">
          <Eyebrow>Programa de indicação PURION GT</Eyebrow>
          <h1
            id="ind-title"
            className="m-0 text-balance font-display text-[clamp(40px,6.4vw,88px)] font-medium leading-[0.95] tracking-[-0.045em]"
            style={{ fontVariationSettings: "'wdth' 86" }}
          >
            Uma experiência que vale compartilhar.
          </h1>
          <p className="m-0 max-w-[50ch] text-[17px] leading-relaxed text-paper-0/65 sm:text-[19px]">
            Indique a PURION GT para quem ama carros. Seu amigo ganha desconto na primeira compra e você ganha crédito.
          </p>
        </div>
      </section>

      <section id="como-funciona" aria-label="Como funciona" className="mx-auto max-w-[var(--content-max)] scroll-mt-20 px-6 pb-16 sm:px-10">
        <ol className="m-0 grid list-none gap-3 p-0 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.t} className="flex flex-col gap-6 rounded-[var(--radius-md)] border border-white/10 p-6">
              <span aria-hidden className="font-mono text-[13px] text-[var(--gift-accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex flex-col gap-2">
                <span className="font-display text-[22px] font-medium tracking-[-0.02em] text-paper-0">
                  <span className="sr-only">Etapa {i + 1}: </span>
                  {s.t}
                </span>
                <span className="text-[14px] leading-relaxed text-paper-0/60">{s.d}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section id="meu-link-area" className="mx-auto grid max-w-[var(--content-max)] scroll-mt-20 gap-10 px-6 pb-[var(--section-y)] sm:px-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <ReferralPanel />
        <div id="condicoes" className="flex scroll-mt-24 flex-col gap-5">
          <h2 className="m-0 font-display text-[28px] font-medium tracking-[-0.03em]">Condições</h2>
          <ReferralConditions />
        </div>
      </section>

      <section aria-labelledby="ind-faq" className="mx-auto grid max-w-[var(--content-max)] gap-12 border-t border-white/10 px-6 py-[var(--section-y)] sm:px-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="flex flex-col gap-4">
          <Eyebrow>Dúvidas</Eyebrow>
          <h2 id="ind-faq" className="m-0 font-display text-[clamp(32px,4.6vw,56px)] font-medium leading-[0.98] tracking-[-0.035em]">
            Perguntas frequentes.
          </h2>
        </div>
        <Accordion items={FAQ} />
      </section>
    </PrivateLayout>
  );
}
