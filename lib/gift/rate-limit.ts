// Limite simples por instância (janela deslizante em memória). Em serverless
// cada instância tem a sua janela — é uma barreira contra abuso casual, não
// uma garantia. Para limite global, usar Upstash (como no CRM).
const WINDOW_MS = 60_000;
const MAX_HITS = 20;
const hits = new Map<string, number[]>();

export function checkRateLimit(key: string, now = Date.now(), max = MAX_HITS): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5_000) hits.clear();
  return true;
}
