// Conteúdo da /presentes/kits. Só afirma o que existe hoje na operação.
import { GIFT_FEATURES } from "./gifts";
import { DEDICATION_MAX } from "@/lib/gift/personalization";

export const KITS_FAQ = [
  {
    q: "Qual a diferença entre Individual, Duo e Trio?",
    a: "É o mesmo PURION GT 60 ml em quantidades diferentes. O desconto do kit já está no preço — ele não se soma a outros descontos nesta página.",
  },
  {
    q: "A dedicatória vai junto com o presente?",
    a: GIFT_FEATURES.printedDedication
      ? "Sim, ela segue impressa junto com o pedido."
      : `Ela é registrada no seu pedido (até ${DEDICATION_MAX} caracteres) e fica visível para a nossa equipe de expedição. Ainda não oferecemos cartão impresso ou embalagem especial — se quiser entregar a mensagem pessoalmente, guarde uma cópia.`,
  },
  {
    q: "Posso enviar direto para quem vai ganhar?",
    a: "Sim. Escolha “entregar ao presenteado” e, no checkout, preencha o endereço de quem vai receber. A forma de entrega fica registrada para a nossa equipe.",
  },
  {
    q: "A data desejada garante a entrega nesse dia?",
    a: "Não. Ela é uma preferência registrada para a nossa equipe priorizar o envio. O prazo real aparece no checkout, calculado pelo CEP — confira antes de finalizar.",
  },
  {
    q: "Quando o pedido é criado?",
    a: "Só quando você finaliza o pagamento no checkout. Adicionar ao carrinho não cria pedido nem cobra nada.",
  },
  {
    q: "Qual o prazo e o valor do frete?",
    a: "O envio acontece no mesmo dia da aprovação do pagamento, com código de rastreio. Prazo e valor do frete são calculados no checkout pelo CEP.",
  },
  {
    q: "E se a pessoa não gostar?",
    a: "Você tem até 7 dias após o recebimento para solicitar a devolução pelo WhatsApp. Após a conferência do produto, realizamos o reembolso.",
  },
];
