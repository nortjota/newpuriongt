// Links de afiliados (ex: puriongt.com.br/marcelo10) — ao acessar, guardamos
// de qual parceiro veio o clique. Não dá desconto nenhum: serve só pra
// identificar a venda depois (o slug é anexado como ?ref= no link de checkout).
// Portado do site antigo (perfumed-canvas-lab/src/lib/referral.ts).
const REFERRAL_KEY = "purion_referral";

export interface Referral {
  slug: string;
  affiliateName: string;
}

export const REFERRALS: Record<string, Referral> = {
  marcelo10: { slug: "marcelo10", affiliateName: "Marcelo" },
  cristiano10: { slug: "cristiano10", affiliateName: "Cristiano" },
  jujuba10: { slug: "jujuba10", affiliateName: "Jujuba" },
};

export function saveReferral(slug: string, affiliateName?: string) {
  // Lista fixa acima OU afiliado cadastrado no CRM (validado na rota /[affiliate])
  const ref: Referral | undefined = REFERRALS[slug] ?? (affiliateName !== undefined ? { slug, affiliateName } : undefined);
  if (!ref) return;
  try {
    localStorage.setItem(REFERRAL_KEY, JSON.stringify(ref));
  } catch {
    // localStorage indisponível (modo privado etc.) — sem referral, sem problema
  }
}

export function getStoredReferral(): Referral | null {
  try {
    const raw = localStorage.getItem(REFERRAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Referral;
  } catch {
    return null;
  }
}
