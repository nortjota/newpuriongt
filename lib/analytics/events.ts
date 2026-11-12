// Eventos analíticos de e-commerce, no formato GA4 (gtag já carregado no
// layout) com espelho no Meta Pixel (fbq, também no layout). Nenhum dado
// pessoal é enviado — só ids/nomes de oferta, valores e ocasião.

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_category?: string;
  item_list_name?: string;
};

export type AnalyticsEvent =
  | { name: "view_item_list"; params: { item_list_name: string; items: AnalyticsItem[] } }
  | { name: "select_occasion"; params: { occasion: string; suggested_item_id: string | null } }
  | { name: "select_item"; params: { item_list_name: string; items: AnalyticsItem[]; occasion?: string } }
  | { name: "add_to_cart"; params: { currency: "BRL"; value: number; items: AnalyticsItem[]; occasion?: string } }
  | { name: "begin_checkout"; params: { currency: "BRL"; value: number; items: AnalyticsItem[]; occasion?: string } };

type Gtag = (...args: unknown[]) => void;
type Fbq = (...args: unknown[]) => void;
type AnalyticsWindow = Window & { gtag?: Gtag; fbq?: Fbq; dataLayer?: unknown[] };

// Mapeamento para eventos padrão do Meta. Os que não têm equivalente vão
// como trackCustom.
const META_STANDARD: Partial<Record<AnalyticsEvent["name"], string>> = {
  view_item_list: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
};

export function toMetaPayload(event: AnalyticsEvent): Record<string, unknown> {
  const items = "items" in event.params ? event.params.items : [];
  const base: Record<string, unknown> = {
    content_ids: items.map((i) => i.item_id),
    content_type: "product",
  };
  if ("value" in event.params) {
    base.value = event.params.value;
    base.currency = event.params.currency;
  }
  if ("occasion" in event.params && event.params.occasion) base.occasion = event.params.occasion;
  return base;
}

export function track(event: AnalyticsEvent, win: AnalyticsWindow | undefined = typeof window === "undefined" ? undefined : (window as AnalyticsWindow)) {
  if (!win) return;
  try {
    // dataLayer: útil para GTM e para os testes e2e.
    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push({ event: event.name, ...event.params });
    win.gtag?.("event", event.name, event.params);
    const meta = META_STANDARD[event.name];
    if (meta) win.fbq?.("track", meta, toMetaPayload(event));
    else win.fbq?.("trackCustom", event.name, toMetaPayload(event));
  } catch {
    // Analytics nunca pode quebrar a página.
  }
}
