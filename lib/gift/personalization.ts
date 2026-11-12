// Validação da personalização de presente (dedicatória, ocasião, entrega,
// data desejada). Roda no SERVIDOR — o cliente só pré-valida para UX.
// Nada aqui confia em preço vindo do navegador: o pedido só carrega ids.

export const DEDICATION_MAX = 180;
export const RECIPIENT_NAME_MAX = 40;
export const DESIRED_DATE_MAX_DAYS = 120;

export const KIT_OCCASIONS = [
  { id: "aniversario", label: "Aniversário" },
  { id: "namoro", label: "Namoro" },
  { id: "pai", label: "Pai" },
  { id: "conquista-veiculo", label: "Conquista do veículo" },
  { id: "natal", label: "Natal" },
  { id: "outra", label: "Outra" },
] as const;
export type KitOccasionId = (typeof KIT_OCCASIONS)[number]["id"];

export const DELIVERY_MODES = ["comprador", "presenteado"] as const;
export type DeliveryMode = (typeof DELIVERY_MODES)[number];

export type GiftCartRequest = {
  offerId: string;
  quantity: number;
  occasion: KitOccasionId | null;
  deliveryMode: DeliveryMode;
  dedication: string | null;
  recipientFirstName: string | null;
  desiredDate: string | null; // AAAA-MM-DD
};

export type ValidationError = { field: keyof GiftCartRequest | "body"; message: string };

// Remove caracteres de controle (exceto quebra de linha), normaliza espaços e
// limita quebras de linha seguidas. Mantém acentos/emoji.
export function sanitizeText(raw: string, { multiline }: { multiline: boolean }): string {
  let s = raw.normalize("NFC").replace(/[\u0000-\u0009\u000B-\u001F\u007F​-‏‪-‮⁦-⁩]/g, "");
  s = multiline ? s.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n") : s.replace(/\s+/g, " ");
  return s.replace(/[ \t]+/g, " ").trim();
}

// Comprimento em caracteres visíveis (code points), não em UTF-16.
export const charLength = (s: string) => Array.from(s).length;

function toDateOnly(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function validateDesiredDate(value: string, now = new Date()): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Data inválida.";
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) return "Data inválida.";
  const today = toDateOnly(now);
  const diffDays = Math.round((d.getTime() - today.getTime()) / 86_400_000);
  if (diffDays < 1) return "Escolha uma data a partir de amanhã.";
  if (diffDays > DESIRED_DATE_MAX_DAYS) return `Escolha uma data em até ${DESIRED_DATE_MAX_DAYS} dias.`;
  return null;
}

export function parseGiftCartRequest(
  body: unknown,
  now = new Date()
): { ok: true; value: GiftCartRequest } | { ok: false; errors: ValidationError[] } {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { ok: false, errors: [{ field: "body", message: "Requisição inválida." }] };
  const b = body as Record<string, unknown>;
  const errors: ValidationError[] = [];

  const offerId = typeof b.offerId === "string" ? b.offerId : "";
  if (!offerId) errors.push({ field: "offerId", message: "Escolha um presente." });

  const quantity = b.quantity === undefined ? 1 : b.quantity;
  if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    errors.push({ field: "quantity", message: "Quantidade inválida." });
  }

  let occasion: KitOccasionId | null = null;
  if (b.occasion != null && b.occasion !== "") {
    const found = KIT_OCCASIONS.find((o) => o.id === b.occasion);
    if (!found) errors.push({ field: "occasion", message: "Ocasião inválida." });
    else occasion = found.id;
  }

  const deliveryMode = (b.deliveryMode ?? "comprador") as DeliveryMode;
  if (!DELIVERY_MODES.includes(deliveryMode)) errors.push({ field: "deliveryMode", message: "Forma de entrega inválida." });

  let dedication: string | null = null;
  if (b.dedication != null && b.dedication !== "") {
    if (typeof b.dedication !== "string") errors.push({ field: "dedication", message: "Dedicatória inválida." });
    else {
      const clean = sanitizeText(b.dedication, { multiline: true });
      if (charLength(clean) > DEDICATION_MAX) errors.push({ field: "dedication", message: `A dedicatória pode ter até ${DEDICATION_MAX} caracteres.` });
      else dedication = clean || null;
    }
  }

  let recipientFirstName: string | null = null;
  if (b.recipientFirstName != null && b.recipientFirstName !== "") {
    if (typeof b.recipientFirstName !== "string") errors.push({ field: "recipientFirstName", message: "Nome inválido." });
    else {
      const clean = sanitizeText(b.recipientFirstName, { multiline: false });
      if (charLength(clean) > RECIPIENT_NAME_MAX) errors.push({ field: "recipientFirstName", message: `Use até ${RECIPIENT_NAME_MAX} caracteres.` });
      else recipientFirstName = clean || null;
    }
  }

  let desiredDate: string | null = null;
  if (b.desiredDate != null && b.desiredDate !== "") {
    const err = typeof b.desiredDate === "string" ? validateDesiredDate(b.desiredDate, now) : "Data inválida.";
    if (err) errors.push({ field: "desiredDate", message: err });
    else desiredDate = b.desiredDate as string;
  }

  // Campos de preço/total enviados pelo navegador são IGNORADOS de propósito.
  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    value: { offerId, quantity: quantity as number, occasion, deliveryMode, dedication, recipientFirstName, desiredDate },
  };
}

export function hasPersonalization(r: GiftCartRequest): boolean {
  return Boolean(r.occasion || r.dedication || r.recipientFirstName || r.desiredDate || r.deliveryMode === "presenteado");
}

// Referência curta e legível para a operação (sem 0/O/1/I).
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export function generateReference(random: (n: number) => Uint8Array = (n) => crypto.getRandomValues(new Uint8Array(n))): string {
  const bytes = random(8);
  let out = "";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return `PG-${out}`;
}
