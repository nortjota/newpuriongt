// Origem da visita (UTMs + afiliado), guardada na chegada e reaproveitada
// no lead, no clique de afiliado e no link do checkout — é assim que o CRM
// sabe de onde veio cada venda e cada contato.
// Regra: o primeiro toque com UTM vale por 30 dias; uma nova visita com UTM substitui.

import { getStoredReferral } from "./referral";

const KEY = "purion_origem";
const VALIDADE_MS = 30 * 24 * 60 * 60 * 1000;
const CAMPOS = ["source", "medium", "campaign", "content", "term"] as const;

export type Utm = Partial<Record<(typeof CAMPOS)[number], string>>;

interface Origem { utm: Utm; landing: string; em: number }

/** Chamar uma vez ao carregar o site (ver TrackingCapture). */
export function capturarOrigem() {
  try {
    const params = new URLSearchParams(location.search);
    const utm: Utm = {};
    for (const c of CAMPOS) {
      const v = params.get(`utm_${c}`);
      if (v) utm[c] = v.slice(0, 120);
    }
    // gclid/fbclid sem UTM: ainda dá para saber o canal
    if (!utm.source && params.get("fbclid")) utm.source = "facebook";
    if (!utm.source && params.get("gclid")) utm.source = "google";
    if (Object.keys(utm).length === 0) return;
    const origem: Origem = { utm, landing: location.pathname, em: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(origem));
  } catch {
    // localStorage indisponível — segue sem origem
  }
}

export function getTracking(): { utm: Utm; ref: string | null } {
  // garante a origem da URL atual mesmo se quem lê rodar antes do TrackingCapture
  capturarOrigem();
  let utm: Utm = {};
  try {
    const bruto = localStorage.getItem(KEY);
    if (bruto) {
      const o = JSON.parse(bruto) as Origem;
      if (Date.now() - o.em < VALIDADE_MS) utm = o.utm;
    }
  } catch {
    // idem
  }
  return { utm, ref: getStoredReferral()?.slug ?? null };
}
