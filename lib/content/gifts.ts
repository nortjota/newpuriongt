// Conteúdo editorial da landing PURION GIFT (/presentes).
//
// PURION GIFT é uma experiência comercial da PURION GT, não uma marca nova.
// Nada aqui cria produto, preço ou SKU: cada oferta aponta para um plano real
// de lib/content/plans.ts, e a disponibilidade é calculada em
// lib/gift/catalog.ts a partir do checkout confirmado (lib/content/checkout-links.ts).
import type { Plan } from "./plans";

export type GiftId = "individual" | "duo" | "trio";
export type GiftPlanId = Extract<Plan["id"], "un" | "k2" | "k3">;

// Descrição fiel do produto (usada em alt text e dados estruturados).
export const PRODUCT_DESCRIPTION =
  "Perfume automotivo PURION GT: frasco cilíndrico de vidro de 60 ml, líquido champagne quase transparente e tampa metálica prateada.";

// Recursos de presente que ainda NÃO existem na operação. Ficam false até
// existirem de verdade — a copy da página se ajusta sozinha.
export const GIFT_FEATURES = {
  printedDedication: false, // cartão com dedicatória impresso no pedido
  giftWrap: false, // embalagem especial de presente
} as const;

export type GiftDefinition = {
  id: GiftId;
  planId: GiftPlanId;
  name: string;
  tagline: string;
  idealFor: string;
  image: { src: string; alt: string };
};

export const GIFT_DEFINITIONS: GiftDefinition[] = [
  {
    id: "individual",
    planId: "un",
    name: "PURION Individual",
    tagline: "Um frasco. A assinatura olfativa do carro de quem você ama.",
    idealFor: "Para uma pessoa especial",
    image: {
      src: "/images/produto/produto-carros-atras.webp",
      alt: "Frasco cilíndrico PURION GT 60 ml, tampa metálica prateada, sobre superfície escura com carros ao fundo",
    },
  },
  {
    id: "duo",
    planId: "k2",
    name: "PURION Duo",
    tagline: "Dois frascos. Para o casal, para dois carros ou para garantir a reposição.",
    idealFor: "Para dividir a experiência",
    image: {
      src: "/images/kits/kit-2.webp",
      alt: "Dois frascos PURION GT 60 ml lado a lado em fundo escuro",
    },
  },
  {
    id: "trio",
    planId: "k3",
    name: "PURION Trio",
    tagline: "Três frascos. Para presentear mais de uma pessoa com o mesmo cuidado.",
    idealFor: "Melhor custo por frasco",
    image: {
      src: "/images/kits/kit-3.webp",
      alt: "Três frascos PURION GT 60 ml em fundo escuro",
    },
  },
];

export type Occasion = {
  id: string; // também é o valor de ?ocasiao= na URL
  label: string;
  line: string;
  // Ordem de preferência. A sugestão final é a primeira oferta DISPONÍVEL —
  // nunca direcionamos para uma oferta inativa.
  preferences: GiftId[];
  reasons: Record<GiftId, string>;
};

const DEFAULT_REASONS: Record<GiftId, string> = {
  individual: "Um frasco basta para surpreender — e para transformar cada trajeto.",
  duo: "Dois frascos: um para o carro e outro de reposição, ou um para cada carro.",
  trio: "Três frascos com o melhor custo por unidade — para mais de uma pessoa.",
};

export const OCCASIONS: Occasion[] = [
  {
    id: "aniversario",
    label: "Aniversário",
    line: "Um presente com a cara de quem vive o carro.",
    preferences: ["individual", "duo"],
    reasons: { ...DEFAULT_REASONS, individual: "Pessoal e marcante: um frasco para quem faz aniversário sentir a cada trajeto." },
  },
  {
    id: "dia-dos-pais",
    label: "Dia dos Pais",
    line: "Para quem te ensinou a cuidar do que é seu.",
    preferences: ["duo", "individual"],
    reasons: { ...DEFAULT_REASONS, duo: "Dois frascos: um para o carro dele e outro de reposição — ou para o segundo carro da família." },
  },
  {
    id: "dia-dos-namorados",
    label: "Dia dos Namorados",
    line: "A mesma assinatura olfativa nos dois carros.",
    preferences: ["duo", "individual"],
    reasons: { ...DEFAULT_REASONS, duo: "Um frasco para cada carro do casal. A mesma fragrância, onde vocês estiverem." },
  },
  {
    id: "carro-novo",
    label: "Conquista do carro novo",
    line: "A primeira memória olfativa do carro novo.",
    preferences: ["individual", "duo"],
    reasons: { ...DEFAULT_REASONS, individual: "O carro novo já começa com assinatura própria. O jeito certo de celebrar a conquista." },
  },
  {
    id: "natal",
    label: "Natal",
    line: "Um cuidado para cada apaixonado por carros da lista.",
    preferences: ["trio", "duo", "individual"],
    reasons: {
      ...DEFAULT_REASONS,
      trio: "Três frascos com o melhor custo por unidade — ideal para presentear mais de uma pessoa.",
      duo: "Dois frascos para presentear duas pessoas da lista com o mesmo cuidado.",
    },
  },
  {
    id: "espontaneo",
    label: "Presente espontâneo",
    line: "Sem data. Só porque ele merece.",
    preferences: ["individual", "duo"],
    reasons: { ...DEFAULT_REASONS, individual: "Os melhores presentes não precisam de motivo. Um frasco basta para surpreender." },
  },
];

export function getOccasion(id: string | null | undefined): Occasion | null {
  if (!id) return null;
  return OCCASIONS.find((o) => o.id === id) ?? null;
}

export const GIFT_STEPS = [
  { title: "Escolha", text: "Individual, Duo ou Trio — os três levam o mesmo PURION GT 60 ml." },
  {
    title: "Personalize",
    text: GIFT_FEATURES.printedDedication
      ? "Escreva a dedicatória que segue impressa com o pedido."
      : "Se quiser, escreva sua dedicatória aqui e envie no momento da entrega.",
  },
  { title: "Confira a disponibilidade", text: "Cada opção mostra se está disponível agora. Frete e prazo aparecem no checkout pelo CEP." },
  { title: "Finalize", text: "Checkout seguro em até 3× sem juros, com envio no mesmo dia e rastreio." },
];

export const GIFT_FAQ = [
  {
    q: "O PURION GT é indicado para presentear?",
    a: "Sim. É um perfume automotivo premium, pensado para quem tem uma relação especial com o próprio carro: notas reais, fixação longa e presença discreta. Um presente que a pessoa sente em cada trajeto — e associa a quem deu.",
  },
  {
    q: "Posso escrever uma dedicatória?",
    a: GIFT_FEATURES.printedDedication
      ? "Sim. Você escreve a dedicatória e ela segue impressa junto com o pedido."
      : "Pode, de forma opcional. O pedido ainda não inclui cartão impresso, então você escreve a mensagem aqui na página e a envia por WhatsApp ou a entrega junto com o presente.",
  },
  {
    q: "Qual o prazo de entrega?",
    a: "O envio acontece no mesmo dia da aprovação do pagamento, com código de rastreio liberado na hora. O prazo e o valor do frete são calculados no checkout de acordo com o CEP — se o presente tem data marcada, confira o prazo antes de finalizar.",
  },
  {
    q: "Posso enviar diretamente ao presenteado?",
    a: "Sim. O endereço de entrega é preenchido por você no checkout — basta informar o endereço de quem vai receber. Se tiver qualquer dúvida antes de finalizar, fale com a gente no WhatsApp.",
  },
  {
    q: "Como funcionam trocas e devoluções?",
    a: "Você tem até 7 dias após o recebimento para solicitar a devolução. Após a conferência do produto devolvido, realizamos o reembolso. O pedido é feito pelo WhatsApp.",
  },
];
