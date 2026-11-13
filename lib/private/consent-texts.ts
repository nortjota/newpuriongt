// Textos de consentimento de MARKETING (separados da comunicação transacional
// — rastreio, nota fiscal e atendimento não dependem disto). Mudou o texto →
// nova versão. Módulo puro: usado no navegador e no servidor.
export type ConsentChannel = "email" | "whatsapp";

export const CONSENT_TEXTS: Record<ConsentChannel, { versao: string; texto: string }> = {
  email: {
    versao: "mkt-email-2026-11",
    texto: "Quero receber por e-mail novidades, lançamentos e benefícios da PURION GT. Posso cancelar a qualquer momento.",
  },
  whatsapp: {
    versao: "mkt-whatsapp-2026-11",
    texto: "Quero receber pelo WhatsApp novidades, lançamentos e benefícios da PURION GT. Posso cancelar a qualquer momento.",
  },
};

export const TRANSACTIONAL_NOTE =
  "Mensagens sobre seus pedidos (confirmação, envio, rastreio e atendimento) continuam chegando, independentemente desta escolha.";
