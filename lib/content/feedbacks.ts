// Prints reais de conversas de clientes — não inventar nomes nem textos aqui.
export const FEEDBACKS = Array.from({ length: 17 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/images/feedbacks/feedback-${n}.webp`,
    alt: `Feedback de cliente PURION GT ${n}`,
  };
});
