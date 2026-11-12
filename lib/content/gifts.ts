// Conteúdo da landing PURION GIFT (/presentes).
//
// Regra da página: nada aqui inventa produto, preço ou serviço. Cada presente
// aponta para um plano real de lib/content/plans.ts (mesmo preço, mesmo
// checkout, mesmo carrinho do PurionProvider). Ocasiões só *sugerem* um dos
// três presentes reais — não existem filtros nem catálogos por ocasião.
import { PLANS, PLAN_AMOUNT, PLAN_UNITS, fmt, type Plan } from "./plans";

export type GiftId = "individual" | "duo" | "trio";

// Recursos de presente que ainda não existem na operação. Quando um deles
// passar a existir de verdade, basta virar o flag para true — a copy da página
// (Experiência, Como funciona e FAQ) se ajusta sozinha.
export const GIFT_FEATURES = {
  // Cartão com dedicatória impresso e enviado junto do pedido.
  printedDedication: false,
  // Embalagem especial de presente (diferente da caixa original do produto).
  giftWrap: false,
} as const;

type GiftDefinition = {
  id: GiftId;
  planId: Extract<Plan["id"], "un" | "k2" | "k3">;
  name: string;
  tagline: string;
  idealFor: string;
  image: { src: string; alt: string };
  // Disponibilidade: não há controle de estoque no repositório. Todos os
  // planos estão à venda hoje; se algum kit esgotar, marque false aqui e o
  // card passa a aparecer como indisponível (sem botão de compra).
  available: boolean;
};

const GIFT_DEFINITIONS: GiftDefinition[] = [
  {
    id: "individual",
    planId: "un",
    name: "PURION GIFT Individual",
    tagline: "Um frasco. Uma assinatura olfativa para o carro dele.",
    idealFor: "Para uma pessoa especial",
    image: {
      src: "/images/produto/produto-carros-atras.webp",
      alt: "Frasco PURION GT 60 ml sobre superfície escura, carros ao fundo",
    },
    available: true,
  },
  {
    id: "duo",
    planId: "k2",
    name: "PURION GIFT Duo",
    tagline: "Dois frascos. Para o casal, para dois carros ou para reposição.",
    idealFor: "Para dividir a experiência",
    image: {
      src: "/images/kits/kit-2.webp",
      alt: "Dois frascos PURION GT lado a lado em fundo escuro",
    },
    available: true,
  },
  {
    id: "trio",
    planId: "k3",
    name: "PURION GIFT Trio",
    tagline: "Três frascos. Para presentear mais de uma pessoa com o mesmo cuidado.",
    idealFor: "Melhor custo por frasco",
    image: {
      src: "/images/kits/kit-3.webp",
      alt: "Três frascos PURION GT em fundo escuro",
    },
    available: true,
  },
];

export type Gift = GiftDefinition & {
  plan: Plan;
  units: number;
  amount: number;
  price: string;
  perUnit: string;
  installment: string;
  savingsBadge?: string;
};

// Junta a definição editorial com os dados reais do plano (preço, badge).
export const GIFTS: Gift[] = GIFT_DEFINITIONS.map((def) => {
  const plan = PLANS.find((p) => p.id === def.planId)!;
  const amount = PLAN_AMOUNT[def.planId];
  const units = PLAN_UNITS[def.planId];
  return {
    ...def,
    plan,
    units,
    amount,
    price: fmt(amount),
    perUnit: fmt(amount / units),
    installment: fmt(amount / 3),
    savingsBadge: plan.badge,
  };
});

export function getGift(id: GiftId): Gift {
  return GIFTS.find((g) => g.id === id)!;
}

export type Occasion = {
  id: string;
  label: string;
  line: string;
  suggestion: GiftId;
  reason: string;
};

export const OCCASIONS: Occasion[] = [
  {
    id: "aniversario",
    label: "Aniversário",
    line: "Um presente com a cara de quem vive o carro.",
    suggestion: "individual",
    reason: "Pessoal e marcante: um frasco para transformar cada trajeto de quem faz aniversário.",
  },
  {
    id: "dia-dos-pais",
    label: "Dia dos Pais",
    line: "Para quem te ensinou a cuidar do que é seu.",
    suggestion: "duo",
    reason: "Dois frascos: um para o carro dele e outro de reposição — ou para o segundo carro da família.",
  },
  {
    id: "dia-dos-namorados",
    label: "Dia dos Namorados",
    line: "A mesma assinatura olfativa nos dois carros.",
    suggestion: "duo",
    reason: "Um frasco para cada carro do casal. A mesma fragrância, onde quer que vocês estejam.",
  },
  {
    id: "carro-novo",
    label: "Carro novo",
    line: "A primeira memória olfativa do carro novo.",
    suggestion: "individual",
    reason: "O jeito certo de comemorar a conquista: o carro novo já começa com assinatura própria.",
  },
  {
    id: "natal",
    label: "Natal",
    line: "Um cuidado para cada apaixonado por carros da lista.",
    suggestion: "trio",
    reason: "Três frascos com o melhor custo por unidade — ideal para presentear mais de uma pessoa.",
  },
  {
    id: "espontaneo",
    label: "Presente espontâneo",
    line: "Sem data. Só porque ele merece.",
    suggestion: "individual",
    reason: "Os melhores presentes não precisam de motivo. Um frasco basta para surpreender.",
  },
];

export const GIFT_STEPS = [
  {
    title: "Escolha o presente",
    text: "Individual, Duo ou Trio. Os três levam o mesmo PURION GT 60 ml.",
  },
  {
    title: "Personalize",
    text: GIFT_FEATURES.printedDedication
      ? "Escreva a dedicatória que vai junto com o pedido."
      : "Escreva sua dedicatória aqui na página e envie no momento da entrega. O cartão impresso chega em breve.",
  },
  {
    title: "Finalize sua compra",
    text: "Checkout seguro, até 3× sem juros e envio no mesmo dia com rastreio.",
  },
];

export const GIFT_FAQ = [
  {
    q: "O PURION GT é um bom presente para quem ama carros?",
    a: "É um presente pensado exatamente para essa pessoa: um auto parfum premium, com notas reais e fixação longa, feito para o interior do carro. Algo que ela vai sentir em cada trajeto — e lembrar de quem deu.",
  },
  {
    q: "Posso enviar uma dedicatória?",
    a: GIFT_FEATURES.printedDedication
      ? "Sim. Você escreve a dedicatória e ela segue impressa junto com o pedido."
      : "Por enquanto o pedido não inclui cartão impresso. Você pode escrever sua dedicatória aqui na página e enviá-la por WhatsApp ou copiá-la para entregar junto com o presente. Assim que o cartão impresso estiver disponível, ele aparecerá aqui.",
  },
  {
    q: "Posso mandar direto para o endereço de quem vai receber?",
    a: "Sim. No checkout, informe o endereço de entrega de quem vai ganhar o presente. Se tiver qualquer dúvida sobre o pedido, fale com a gente pelo WhatsApp.",
  },
  {
    q: "Qual o prazo de entrega?",
    a: "O envio é feito no mesmo dia da aprovação do pagamento, com código de rastreio liberado na hora. O prazo e o valor do frete são calculados no checkout de acordo com o CEP — vale considerar esse prazo se o presente tiver data marcada.",
  },
  {
    q: "Como o presente chega?",
    a: GIFT_FEATURES.giftWrap
      ? "Na caixa original PURION GT, com embalagem especial de presente."
      : "O frasco de vidro de 60 ml chega na caixa original PURION GT, a mesma de qualquer pedido. Ainda não oferecemos embalagem especial de presente.",
  },
  {
    q: "Qual a diferença entre Individual, Duo e Trio?",
    a: "É o mesmo PURION GT 60 ml em quantidades diferentes. O Duo sai com 10% de desconto e o Trio com 15% — o melhor custo por frasco, ideal para presentear mais de uma pessoa ou garantir reposição.",
  },
  {
    q: "E se a pessoa não gostar? Posso trocar?",
    a: "Sim. Você tem até 7 dias após o recebimento para solicitar a devolução. Após a conferência do produto devolvido, realizamos o reembolso. É só chamar a gente no WhatsApp.",
  },
  {
    q: "Quais as formas de pagamento?",
    a: "Cartão em até 3× sem juros. Compra segura e nota fiscal emitida em todo pedido.",
  },
];
