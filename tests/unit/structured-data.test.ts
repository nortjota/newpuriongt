import { describe, expect, it } from "vitest";
import { buildGiftCatalog } from "@/lib/gift/catalog";
import { buildGiftJsonLd, serializeJsonLd } from "@/lib/gift/structured-data";

const meta = { title: "t", description: "d" };

describe("JSON-LD", () => {
  it("anuncia só ofertas disponíveis, com preço real", () => {
    const ld = buildGiftJsonLd(buildGiftCatalog(), meta);
    const list = ld["@graph"].find((n) => n["@type"] === "ItemList") as { itemListElement: { item: { name: string; offers: { price: string } } }[] };
    expect(list.itemListElement.map((e) => e.item.name)).toEqual(["PURION Individual", "PURION Duo"]);
    expect(list.itemListElement.map((e) => e.item.offers.price)).toEqual(["97.90", "176.22"]);
  });
  it("escapa '<' para não fechar a tag script", () => {
    expect(serializeJsonLd({ a: "</script>" })).not.toContain("</script>");
  });
});
