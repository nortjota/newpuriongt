// Persistência da origem de campanha (UTM + IDs de clique).
//
// Regra de atribuição: "last non-direct touch" com validade de 30 dias.
// Uma visita que chega SEM parâmetros de campanha não apaga a origem salva;
// uma visita com novos parâmetros substitui a anterior inteira (não mistura
// utm_source de uma campanha com utm_campaign de outra).

export const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

export type TrackingKey = (typeof TRACKING_KEYS)[number];
export type TrackingParams = Partial<Record<TrackingKey, string>>;

export const UTM_STORAGE_KEY = "purion_utm_v1";
export const UTM_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_VALUE_LENGTH = 150;

type Stored = { params: TrackingParams; capturedAt: number; landing: string };

// Extrai apenas as chaves conhecidas, com valores limpos e limitados.
export function parseTrackingParams(search: string): TrackingParams {
  const sp = new URLSearchParams(search);
  const out: TrackingParams = {};
  for (const key of TRACKING_KEYS) {
    const raw = sp.get(key);
    if (!raw) continue;
    const value = raw.trim().slice(0, MAX_VALUE_LENGTH);
    if (value) out[key] = value;
  }
  return out;
}

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readStoredTracking(now = Date.now(), store: Storage | null = storage()): TrackingParams {
  if (!store) return {};
  try {
    const raw = store.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Stored;
    if (!parsed?.params || typeof parsed.capturedAt !== "number") return {};
    if (now - parsed.capturedAt > UTM_TTL_MS) {
      store.removeItem(UTM_STORAGE_KEY);
      return {};
    }
    // Revalida as chaves — o storage pode ter sido editado.
    return parseTrackingParams(new URLSearchParams(parsed.params as Record<string, string>).toString());
  } catch {
    return {};
  }
}

// Captura a origem da URL atual. Retorna os parâmetros vigentes após a captura.
export function captureTracking(
  search: string,
  pathname: string,
  now = Date.now(),
  store: Storage | null = storage()
): TrackingParams {
  const incoming = parseTrackingParams(search);
  if (Object.keys(incoming).length === 0) return readStoredTracking(now, store);
  if (store) {
    try {
      const value: Stored = { params: incoming, capturedAt: now, landing: pathname };
      store.setItem(UTM_STORAGE_KEY, JSON.stringify(value));
    } catch {
      // storage cheio/bloqueado — segue sem persistir
    }
  }
  return incoming;
}

// Anexa parâmetros a uma URL sem sobrescrever chaves que ela já tenha
// (ex.: o script da Utmify, carregado no layout, também decora links).
export function appendTracking(url: string, params: Record<string, string | undefined>): string {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return url;
  }
  for (const [key, value] of Object.entries(params)) {
    if (!value) continue;
    if (!u.searchParams.has(key)) u.searchParams.set(key, value);
  }
  return u.toString();
}
