import { expect, test, type Page } from "@playwright/test";

const dataLayer = (page: Page) =>
  page.evaluate(() => ((window as unknown as { dataLayer?: { event: string }[] }).dataLayer ?? []).map((e) => e.event));

test.beforeEach(async ({ context }) => {
  await context.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
  await context.addInitScript(() => localStorage.setItem("purion_email_v1", "1"));
});

const summary = (page: Page) => page.getByRole("complementary", { name: "Resumo do presente" });

test("comparador com dados reais; Trio inativo; resumo dinâmico sem frete inventado", async ({ page }) => {
  await page.goto("/presentes/kits");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Monte o presente para quem ama carros.");
  await expect(page.locator('label[data-offer="trio"]')).toContainText("Em preparação");
  await expect(page.getByRole("radio", { name: /PURION Trio/ })).toBeDisabled();

  const duo = page.getByRole("radio", { name: /PURION Duo/ });
  await expect(duo).toBeChecked(); // padrão
  await expect(summary(page)).toContainText("R$ 176,22");
  await expect(summary(page)).toContainText("− R$ 19,58");
  await expect(summary(page)).toContainText("Calculado no checkout pelo CEP");

  await page.locator('label[data-offer="individual"]').click();
  await expect(summary(page)).toContainText("R$ 97,90");
  await expect(summary(page).getByText("Desconto do kit").locator("..")).toContainText("—");

  // Limite atual do checkout: 1 kit por pedido.
  await expect(page.getByRole("button", { name: "Aumentar quantidade" })).toBeDisabled();
});

test("personalização completa: grava referência, abre o carrinho real e leva gift_ref ao checkout", async ({ page }) => {
  await page.goto("/presentes/kits?utm_source=meta&utm_campaign=natal-kits");
  await expect(page.getByRole("radio", { name: /PURION Duo/ })).toBeChecked();

  await page.getByRole("button", { name: "Pai", exact: true }).click();
  await page.getByText("Entregar ao presenteado", { exact: true }).click();
  await page.getByLabel("Primeiro nome de quem recebe (opcional)").fill("Carlos");
  const ded = page.getByRole("textbox", { name: "Dedicatória", exact: true });
  await ded.fill("x".repeat(200));
  await expect(ded).toHaveValue("x".repeat(180)); // corte em 180
  await expect(page.getByText("180/180")).toBeVisible();
  await ded.fill("Pai, obrigado por me ensinar a cuidar do que é meu.");
  const tomorrow = new Date(Date.now() + 2 * 86_400_000).toISOString().slice(0, 10);
  await page.getByLabel("Data desejada de recebimento").fill(tomorrow);

  await page.getByRole("button", { name: "Adicionar ao carrinho" }).click();

  const drawer = page.getByRole("dialog", { name: "Carrinho" });
  await expect(drawer).toBeVisible();
  await expect(drawer).toContainText("Kit 2 frascos");
  const href = (await drawer.getByRole("link", { name: "Finalizar compra" }).getAttribute("href"))!;
  const u = new URL(href);
  expect(u.searchParams.get("product")).toBe("5611c8a9-946a-11f1-a1eb-46da4690ad53");
  expect(u.searchParams.get("gift_ref")).toMatch(/^PG-[2-9A-HJ-NP-Z]{8}$/);
  expect(u.searchParams.get("utm_source")).toBe("meta");

  await page.keyboard.press("Escape");
  await expect(summary(page).getByText(/Referência da personalização/)).toContainText(u.searchParams.get("gift_ref")!);
  expect(await dataLayer(page)).toContain("add_to_cart");
});

test("erro ao consultar disponibilidade: oculta ofertas e permite tentar de novo", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/gift/kits/availability", async (route) => {
    calls += 1;
    if (calls === 1) return route.fulfill({ status: 503, body: "{}" });
    return route.continue();
  });
  await page.goto("/presentes/kits");
  const alert = page.getByRole("alert").filter({ hasText: "Não conseguimos verificar a disponibilidade agora." });
  await expect(alert).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(0);
  await alert.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(page.getByRole("radio", { name: /PURION Duo/ })).toBeChecked();
});

test("sem nenhum kit disponível: estado vazio com saída pelo WhatsApp", async ({ page }) => {
  await page.route("**/api/gift/kits/availability", (route) =>
    route.fulfill({
      json: {
        checkoutMaxQuantity: 1,
        personalizationEnabled: true,
        kits: ["individual", "duo", "trio"].map((offerId) => ({ offerId, available: false, reason: "out_of_stock", maxQuantity: 0, stockKnown: true })),
      },
    })
  );
  await page.goto("/presentes/kits");
  await expect(page.getByRole("status").filter({ hasText: "Nenhum kit disponível" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Falar no WhatsApp" }).first()).toHaveAttribute("href", /wa\.me/);
});

test("personalização indisponível: campos desligados, compra segue sem referência", async ({ page }) => {
  await page.route("**/api/gift/kits/availability", async (route) => {
    const res = await route.fetch();
    const json = await res.json();
    await route.fulfill({ json: { ...json, personalizationEnabled: false } });
  });
  await page.goto("/presentes/kits");
  await expect(page.getByRole("note")).toContainText("temporariamente indisponível");
  await expect(page.getByRole("textbox", { name: "Dedicatória", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).click();
  const href = await page.getByRole("dialog", { name: "Carrinho" }).getByRole("link", { name: "Finalizar compra" }).getAttribute("href");
  expect(href).not.toContain("gift_ref");
});

test("falha ao salvar personalização: avisa e oferece seguir sem ela", async ({ page }) => {
  let first = true;
  await page.route("**/api/gift/kits/cart", async (route) => {
    if (first) {
      first = false;
      return route.fulfill({ status: 503, json: { code: "personalization_unavailable", message: "Não conseguimos salvar a personalização agora." } });
    }
    return route.continue();
  });
  await page.goto("/presentes/kits");
  await page.getByRole("textbox", { name: "Dedicatória", exact: true }).fill("Parabéns!");
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Não conseguimos salvar a personalização" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Carrinho" })).toBeHidden(); // nada foi para o carrinho
  await page.getByRole("button", { name: "Adicionar sem personalização" }).click();
  await expect(page.getByRole("dialog", { name: "Carrinho" })).toBeVisible();
});

test.describe("API — o servidor é a fonte de verdade", () => {
  test("ignora preço do navegador e recalcula", async ({ request }) => {
    const res = await request.post("/api/gift/kits/cart", { data: { offerId: "duo", price: 0.01, total: 0.01 } });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.summary.total).toBe(176.22);
    expect(json.reference).toBeNull();
  });
  test("recusa Trio sem checkout confirmado, quantidade acima do limite e dedicatória longa", async ({ request }) => {
    expect((await request.post("/api/gift/kits/cart", { data: { offerId: "trio" } })).status()).toBe(409);
    expect((await request.post("/api/gift/kits/cart", { data: { offerId: "duo", quantity: 5 } })).status()).toBe(409);
    expect((await request.post("/api/gift/kits/cart", { data: { offerId: "duo", dedication: "a".repeat(181) } })).status()).toBe(400);
  });
  test("recusa origem externa e JSON inválido", async ({ request }) => {
    const cross = await request.post("/api/gift/kits/cart", { data: { offerId: "duo" }, headers: { origin: "https://evil.example" } });
    expect(cross.status()).toBe(403);
    const bad = await request.post("/api/gift/kits/cart", { data: "{oops", headers: { "content-type": "application/json" } });
    expect(bad.status()).toBe(400);
  });
  test("disponibilidade não é cacheada", async ({ request }) => {
    const res = await request.get("/api/gift/kits/availability");
    expect(res.headers()["cache-control"]).toContain("no-store");
    expect((await res.json()).kits).toHaveLength(3);
  });
});
