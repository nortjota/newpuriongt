// Checkout real (Appmax/Nuvemshop). ID de produto confirmado pelo usuário em 2026-10-14.
// Todos os planos levam ao mesmo checkout por ora — não há variantes por plano ainda.
export const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL ||
  "https://pay.puriongt.com.br/checkout?product=12c09776-a3c7-11f1-a1eb-46da4690ad53";
