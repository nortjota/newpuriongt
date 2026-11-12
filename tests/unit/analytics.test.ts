import { describe, expect, it, vi } from "vitest";
import { toMetaPayload, track } from "@/lib/analytics/events";

const item = { item_id: "k2", item_name: "PURION Duo", price: 176.22, quantity: 1 };

describe("track", () => {
  it("envia para dataLayer, gtag e evento padrão do Meta", () => {
    const win = { gtag: vi.fn(), fbq: vi.fn() } as unknown as Window & { dataLayer?: unknown[] };
    track({ name: "add_to_cart", params: { currency: "BRL", value: 176.22, items: [item], occasion: "natal" } }, win);
    expect(win.dataLayer).toEqual([expect.objectContaining({ event: "add_to_cart", value: 176.22 })]);
    expect((win as unknown as { gtag: ReturnType<typeof vi.fn> }).gtag).toHaveBeenCalledWith("event", "add_to_cart", expect.any(Object));
    expect((win as unknown as { fbq: ReturnType<typeof vi.fn> }).fbq).toHaveBeenCalledWith(
      "track",
      "AddToCart",
      expect.objectContaining({ content_ids: ["k2"], value: 176.22, currency: "BRL", occasion: "natal" })
    );
  });
  it("eventos sem equivalente vão como trackCustom", () => {
    const fbq = vi.fn();
    track({ name: "select_occasion", params: { occasion: "natal", suggested_item_id: "k2" } }, { fbq } as unknown as Window);
    expect(fbq).toHaveBeenCalledWith("trackCustom", "select_occasion", expect.any(Object));
  });
  it("nunca quebra sem window ou com pixel com erro", () => {
    expect(() => track({ name: "view_item_list", params: { item_list_name: "x", items: [] } }, undefined)).not.toThrow();
    const win = { fbq: () => { throw new Error("boom"); } } as unknown as Window;
    expect(() => track({ name: "view_item_list", params: { item_list_name: "x", items: [item] } }, win)).not.toThrow();
  });
  it("payload do Meta não inclui dados pessoais", () => {
    const p = toMetaPayload({ name: "begin_checkout", params: { currency: "BRL", value: 1, items: [item] } });
    expect(Object.keys(p).sort()).toEqual(["content_ids", "content_type", "currency", "value"]);
  });
});
