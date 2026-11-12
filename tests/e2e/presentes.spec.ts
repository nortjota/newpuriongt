import { expect, test, type Page } from "@playwright/test";

type DL = { event: string; [k: string]: unknown };
const events = (page: Page) => page.evaluate(() => ((window as unknown as { dataLayer?: DL[] }).dataLayer ?? []).map((e) => e.event));

test.beforeEach(async ({ page, context }) => {
  // Isola o teste de serviços externos (pixels, fontes, checkout).
  await context.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
  // Não abrir o pop-up global de e-mail durante os testes.
  await context.addInitScript(() => localStorage.setItem("purion_email_v1", "1"));
  await page.goto("/presentes");
});

test("hero com copy, CTAs e imagem que não toma a primeira dobra", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Para quem ama carros, um presente à altura.");
  await expect(page.getByText("Transforme cada trajeto em uma experiência especial. Presenteie com PURION GT.")).toBeVisible();
  const hero = page.locator("section[aria-labelledby=gift-hero-title]");
  const cta = hero.getByRole("link", { name: "Escolher meu presente" });
  await expect(cta).toBeVisible();
  await expect(hero.getByRole("link", { name: "Conhecer a experiência" })).toBeVisible();

  const img = hero.locator("img");
  await expect(img).toHaveAttribute("fetchpriority", "high");
  const { h, vh } = await img.evaluate((el) => ({ h: el.getBoundingClientRect().height, vh: window.innerHeight }));
  expect(h).toBeLessThan(vh * 0.8);

  await cta.click();
  await expect(page.locator("#escolher-presente")).toBeInViewport();
});

test("seletor de ocasião direciona para oferta real e grava ?ocasiao=", async ({ page }) => {
  const btn = page.getByRole("button", { name: /Dia dos Pais/ });
  await btn.click();
  await expect(btn).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/ocasiao=dia-dos-pais/);
  const duo = page.locator("#oferta-duo");
  await expect(duo.getByText("Sugerido para Dia dos Pais")).toBeVisible();
  await expect(duo).toBeInViewport();
  expect(await events(page)).toContain("select_occasion");
});

test("deep link de Natal cai no Duo enquanto o Trio não tem checkout confirmado", async ({ page }) => {
  await page.goto("/presentes?ocasiao=natal");
  await expect(page.locator("#oferta-duo").getByText("Sugerido para Natal")).toBeVisible();
  const trio = page.locator("#oferta-trio");
  await expect(trio).toHaveAttribute("data-available", "false");
  await expect(trio.getByText("Indisponível para presente no momento.")).toBeVisible();
  await expect(trio.getByRole("button")).toHaveCount(0);
  await expect(trio.getByRole("link", { name: "Avisar quando disponível" })).toHaveAttribute("href", /wa\.me/);
});

test("UTM persiste até o checkout real e eventos de conversão disparam", async ({ page }) => {
  await page.goto("/presentes?utm_source=meta&utm_medium=paid&utm_campaign=natal-2026");
  await page.waitForFunction(() => localStorage.getItem("purion_utm_v1") !== null);
  await page.goto("/presentes"); // segunda visita sem UTM — origem continua salva
  await page.locator("#escolher-presente").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /Presentear com PURION Duo/ }).click();

  const drawer = page.getByRole("dialog", { name: "Carrinho" });
  await expect(drawer).toBeVisible();
  await expect(drawer).toContainText("Kit 2 frascos");
  await expect(drawer).toContainText("R$ 176,22");
  const checkout = drawer.getByRole("link", { name: "Finalizar compra" });
  await expect(checkout).toHaveAttribute("href", /product=5611c8a9-946a-11f1-a1eb-46da4690ad53/);
  const href = (await checkout.getAttribute("href"))!;
  const u = new URL(href);
  expect(u.searchParams.get("utm_source")).toBe("meta");
  expect(u.searchParams.get("utm_campaign")).toBe("natal-2026");

  await page.evaluate(() => document.addEventListener("click", (e) => e.preventDefault()));
  await checkout.click();
  const ev = await events(page);
  expect(ev).toEqual(expect.arrayContaining(["view_item_list", "select_item", "add_to_cart", "begin_checkout"]));
});

test("FAQ com as perguntas pedidas e acessível por teclado", async ({ page }) => {
  for (const q of [
    "O PURION GT é indicado para presentear?",
    "Posso escrever uma dedicatória?",
    "Qual o prazo de entrega?",
    "Posso enviar diretamente ao presenteado?",
    "Como funcionam trocas e devoluções?",
  ]) {
    await expect(page.getByRole("button", { name: q })).toBeVisible();
  }
  const q = page.getByRole("button", { name: "Qual o prazo de entrega?" });
  await q.focus();
  await page.keyboard.press("Enter");
  await expect(q).toHaveAttribute("aria-expanded", "true");
});

test("dados estruturados anunciam só ofertas ativas", async ({ page }) => {
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const ld = JSON.parse(raw!);
  const list = ld["@graph"].find((n: { "@type": string }) => n["@type"] === "ItemList");
  expect(list.itemListElement.map((e: { item: { name: string } }) => e.item.name)).toEqual(["PURION Individual", "PURION Duo"]);
  await expect(page).toHaveTitle(/PURION GIFT/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/presentes$/);
});

test("layout sem rolagem horizontal e imagens com texto alternativo", async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  const missingAlt = await page.locator("main img:not([alt])").count();
  expect(missingAlt).toBe(0);
  // Regressão: constantes de módulo "use client" viravam "#function(){…}" em hrefs.
  const badHrefs = await page.locator('a[href*="function"]').count();
  expect(badHrefs).toBe(0);
  for (const href of await page.locator('a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")!))) {
    if (href === "#") continue;
    expect(await page.locator(href).count(), `âncora ${href}`).toBeGreaterThan(0);
  }
});

test("homepage continua com o menu original", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
  // Links do Header da home (padrão, sem as props da /presentes).
  await expect(page.locator('header a[href="#fragrancia"]')).toHaveCount(1);
  await expect(page.locator('header a[href="#ocasioes"]')).toHaveCount(0);
});
