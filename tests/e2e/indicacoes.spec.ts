import { expect, test, type APIRequestContext, type BrowserContext } from "@playwright/test";
import { createHmac, randomUUID } from "node:crypto";
import { Client } from "pg";
import { E2E_SECRETS } from "../../playwright.config";

// E2E contra backend REAL (Next → PostgreSQL local).
const DB = "postgres://postgres@127.0.0.1:54329/purion_test";
const sql = async (q: string, p: unknown[] = []) => {
  const c = new Client({ connectionString: DB });
  await c.connect();
  try {
    return (await c.query(q, p)).rows;
  } finally {
    await c.end();
  }
};
const email = (p: string) => `${p}-${randomUUID().slice(0, 8)}@exemplo.com`;
const ADMIN = { authorization: `Bearer ${E2E_SECRETS.PRIVATE_ACCESS_ADMIN_SECRET}` };

async function isolate(context: BrowserContext) {
  const r = () => Math.floor(Math.random() * 250);
  await context.setExtraHTTPHeaders({ "x-forwarded-for": `10.${r()}.${r()}.${r()}` });
  await context.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
  await context.addInitScript(() => localStorage.setItem("purion_email_v1", "1"));
}

async function accessUrl(request: APIRequestContext, mail: string) {
  await sql(`INSERT INTO vendas (cliente_email, status) VALUES ($1, 'aprovado')`, [mail]);
  const res = await request.post("/api/private/admin/tokens", { headers: ADMIN, data: { email: mail, primeiroNome: "Ana", origem: "crm" } });
  return ((await res.json()).url as string).replace("https://www.puriongt.com.br", "");
}

function signed(body: object) {
  const raw = JSON.stringify(body);
  const ts = Math.floor(Date.now() / 1000);
  const sig = createHmac("sha256", E2E_SECRETS.BENEFITS_WEBHOOK_SECRET).update(`${ts}.${raw}`).digest("hex");
  return { data: raw, headers: { "content-type": "application/json", "x-purion-timestamp": String(ts), "x-purion-signature": sig } };
}

test.beforeEach(async ({ context }) => isolate(context));

test("visitante: hero, 3 etapas, condições do banco, acesso e FAQ", async ({ page }) => {
  await page.goto("/indicacoes");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Uma experiência que vale compartilhar.");
  await expect(page.getByText("Etapa 1:", { exact: false })).toHaveCount(1);
  await expect(page.locator("#como-funciona li")).toHaveCount(3);
  await expect(page.locator("dd", { hasText: /R\$ 10,00 de desconto na primeira compra/ })).toBeVisible();
  await expect(page.locator("dd", { hasText: /R\$ 10,00 de crédito por compra válida/ })).toBeVisible();
  await expect(page.locator('[data-state="anonimo"]')).toBeVisible();
  await expect(page.getByRole("button", { name: "Consigo ver quem comprou pelo meu link?" })).toBeVisible();
  expect(await (await page.request.get("/api/indicacoes/me")).json()).toEqual({ authenticated: false });
});

test("fluxo completo: link → WhatsApp → convite → checkout real → compra validada → crédito", async ({ page, browser, request }) => {
  // Indicador
  await page.goto(await accessUrl(request, email("indicador")));
  await expect(page.getByText("Olá, Ana.")).toBeVisible();
  await page.goto("/indicacoes");
  await page.getByRole("button", { name: "Gerar meu link" }).click();
  const linkInput = page.getByLabel("Seu link", { exact: true });
  await expect(linkInput).toHaveValue(/\/i\/[2-9A-HJ-NP-Z]{8}$/);
  const link = await linkInput.inputValue();
  const code = link.split("/i/")[1];
  const wa = page.getByRole("link", { name: "Compartilhar no WhatsApp" });
  const waUrl = new URL((await wa.getAttribute("href"))!);
  expect(waUrl.host).toBe("wa.me");
  expect(waUrl.searchParams.get("text")).toContain(`/i/${code}`);

  // Indicado (outro navegador, sem login)
  const friendCtx = await browser.newContext();
  await isolate(friendCtx);
  const friend = await friendCtx.newPage();
  await friend.goto(`/i/${code}`);
  await expect(friend).toHaveURL(/\/indicacoes\/convite$/);
  await friend.getByRole("button", { name: "Ativar meu desconto" }).click();
  const cupom = (await friend.getByLabel("Seu cupom de desconto").textContent())!;
  expect(cupom).toMatch(/^PGI-/);
  await friend.locator("label", { hasText: "PURION Duo" }).click();
  const checkoutReq = friend.waitForRequest((r) => r.url().startsWith("https://pay.puriongt.com.br/"));
  await friend.getByRole("button", { name: /Ir para o checkout/ }).click();
  const checkout = new URL((await checkoutReq).url());
  expect(checkout.searchParams.get("product")).toBe("5611c8a9-946a-11f1-a1eb-46da4690ad53");
  expect(checkout.searchParams.get("coupon")).toBe(cupom);
  expect(checkout.searchParams.get("indicacao")).toMatch(/^[0-9a-f-]{36}$/);
  await friendCtx.close();

  // Pedido pago no Appmax → CRM grava a venda → webhook assinado
  const pedido = `APX-IND-${Date.now()}`;
  const amigo = email("amigo");
  await sql(`INSERT INTO vendas (cliente_email, status, pedido_appmax, valor_total) VALUES ($1,'aprovado',$2,166.22)`, [amigo, pedido]);
  const ev = await request.post("/api/private/payment-events", signed({ event_id: `evt-${randomUUID()}`, tipo: "pago", pedido_ref: pedido, codigo: cupom, valor_pedido: 166.22 }));
  expect(await ev.json()).toMatchObject({ code: "ok", resultado: "qualificada" });

  await page.reload();
  await expect(page.getByTestId("saldo-pendente")).toHaveText("R$ 10,00");
  await expect(page.locator('[data-status="em_validacao"]')).toBeVisible();
  const html = await page.content();
  expect(html).not.toContain(amigo); // nenhum dado do indicado
  expect(html).not.toContain(pedido);

  // Janela de validação vence → cron aprova
  await sql(`UPDATE indicacao_atribuicoes SET validar_apos = now() - interval '1 second' WHERE pedido_ref = $1`, [pedido]);
  const cron = await request.get("/api/private/cron", { headers: { authorization: "Bearer cron-e2e-segredo" } });
  expect((await cron.json()).indicacoes.aprovadas).toBeGreaterThanOrEqual(1);
  await page.reload();
  await expect(page.getByTestId("saldo-disponivel")).toHaveText("R$ 10,00");
  await page.getByRole("button", { name: "Gerar código com meu crédito" }).click();
  await expect(page.getByLabel("Seu código de crédito")).toHaveText(/^PGC-/);
  await expect(page.getByTestId("saldo-disponivel")).toHaveText("R$ 0,00");
});

test("autoindicação pelo próprio navegador é bloqueada", async ({ page, request }) => {
  await page.goto(await accessUrl(request, email("auto")));
  await expect(page.getByText("Olá, Ana.")).toBeVisible();
  const res = await page.request.post("/api/indicacoes/link", { headers: { origin: new URL(page.url()).origin } });
  const link = (await res.json()).link as string;
  await page.goto(link.replace(/^https?:\/\/[^/]+/, ""));
  await page.getByRole("button", { name: "Ativar meu desconto" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "seu próprio convite" })).toBeVisible();
});

test("link inválido leva a um estado claro, sem quebrar", async ({ page }) => {
  await page.goto("/i/ABCDEFGH");
  await expect(page).toHaveURL(/estado=invalido/);
  await expect(page.locator('[data-state="convite_invalido"]')).toBeVisible();
  await page.goto("/i/..%2Fadmin");
  await expect(page).toHaveURL(/estado=invalido/);
});

test.describe("API do programa", () => {
  test("rotas do indicador exigem sessão; admin exige segredo", async ({ request, baseURL }) => {
    const headers = { origin: baseURL! };
    expect((await request.post("/api/indicacoes/link", { headers })).status()).toBe(401);
    expect((await request.post("/api/indicacoes/credito", { headers })).status()).toBe(401);
    expect((await request.post("/api/indicacoes/link")).status()).toBe(403); // sem Origin
    expect((await request.get("/api/indicacoes/admin/metricas")).status()).toBe(401);
    expect((await request.patch("/api/indicacoes/admin/programa", { data: { campos: { ativo: false } } })).status()).toBe(401);
  });

  test("admin lê métricas e valida ajustes", async ({ request }) => {
    const m = await request.get("/api/indicacoes/admin/metricas?dias=30", { headers: ADMIN });
    expect(m.status()).toBe(200);
    const json = await m.json();
    for (const k of ["visitantes", "compradores_novos", "receita_atribuida", "descontos_concedidos", "margem_contribuicao", "custo_aquisicao_por_cliente"]) {
      expect(json.metricas).toHaveProperty(k);
    }
    const bad = await request.patch("/api/indicacoes/admin/programa", { headers: ADMIN, data: { campos: { credito_indicador: 12 } } });
    expect(await bad.json()).toMatchObject({ resultado: "termos_versao_obrigatoria" });
  });

  test("convite sem link de indicação não cria atribuição", async ({ request, baseURL }) => {
    const r = await request.post("/api/indicacoes/convite", { headers: { origin: baseURL! } });
    expect(r.status()).toBe(400);
  });
});
