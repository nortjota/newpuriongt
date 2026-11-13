import { expect, test, type APIRequestContext, type BrowserContext } from "@playwright/test";
import { createHmac, randomUUID } from "node:crypto";
import { Client } from "pg";
import { E2E_SECRETS } from "../../playwright.config";

// E2E contra backend REAL: Next (rotas /api/private) → PostgreSQL local.
const DB = "postgres://postgres@127.0.0.1:54329/purion_test";

async function sql(q: string, params: unknown[] = []) {
  const c = new Client({ connectionString: DB });
  await c.connect();
  try {
    return (await c.query(q, params)).rows;
  } finally {
    await c.end();
  }
}

const uniqueEmail = (p: string) => `${p}-${randomUUID().slice(0, 8)}@exemplo.com`;

async function issueToken(request: APIRequestContext, email: string, { paid = true } = {}) {
  if (paid) await sql(`INSERT INTO vendas (cliente_email, status) VALUES ($1, 'aprovado')`, [email]);
  const res = await request.post("/api/private/admin/tokens", {
    headers: { authorization: `Bearer ${E2E_SECRETS.PRIVATE_ACCESS_ADMIN_SECRET}` },
    data: { email, primeiroNome: "Ana", origem: "crm", emitidoPor: "e2e" },
  });
  expect(res.status()).toBe(201);
  const json = await res.json();
  expect(json.qrSvg).toContain("<svg");
  return json.url as string;
}

function signed(body: object) {
  const raw = JSON.stringify(body);
  const ts = Math.floor(Date.now() / 1000);
  const sig = createHmac("sha256", E2E_SECRETS.BENEFITS_WEBHOOK_SECRET).update(`${ts}.${raw}`).digest("hex");
  return { data: raw, headers: { "content-type": "application/json", "x-purion-timestamp": String(ts), "x-purion-signature": sig } };
}

async function isolate(context: BrowserContext) {
  // IP próprio por teste (o limite anti força bruta é por IP).
  await context.setExtraHTTPHeaders({ "x-forwarded-for": `10.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` });
  await context.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
  await context.addInitScript(() => localStorage.setItem("purion_email_v1", "1"));
}

test.beforeEach(async ({ context }) => isolate(context));

test("visitante: hero, benefício ativo, ativação, atalhos e FAQ — sem dados privados", async ({ page }) => {
  await page.goto("/private-access");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sua experiência PURION GT é apenas o começo.");
  await expect(page.getByText("R$ 15 na sua primeira compra de presente")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ative seu acesso" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Presentes/ }).last()).toHaveAttribute("href", "/presentes");
  await expect(page.getByRole("link", { name: /Programa de indicações/ })).toHaveAttribute("href", "/indicacoes");
  await expect(page.getByRole("button", { name: "O benefício vira dinheiro ou crédito?" })).toBeVisible();
  const me = await page.request.get("/api/private/me");
  expect(await me.json()).toEqual({ authenticated: false });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("link/QR: ativa, remove o token da URL, identifica o cliente e ativa o benefício", async ({ page, request }) => {
  const url = await issueToken(request, uniqueEmail("ana"));
  await page.goto(url.replace("https://www.puriongt.com.br", ""));
  await expect(page.getByText("Olá, Ana.")).toBeVisible();
  expect(page.url()).not.toContain("#t=");
  await expect(page.locator('[data-state="pode_ativar"]')).toBeVisible();
  await page.getByRole("button", { name: "Ativar meu benefício" }).click();
  await expect(page.locator('[data-state="disponivel"]')).toBeVisible();
  await expect(page.getByText("Benefício disponível")).toBeVisible();

  // Marketing: opcional e desmarcado; mudança persiste.
  const email = page.getByRole("checkbox", { name: /por e-mail novidades/ });
  await expect(email).not.toBeChecked();
  await expect(page.getByRole("checkbox", { name: /pelo WhatsApp/ })).not.toBeChecked();
  await email.check();
  await expect(page.getByText("Preferência salva.")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("checkbox", { name: /por e-mail novidades/ })).toBeChecked();
});

test("token já utilizado, inválido e expirado mostram o estado certo", async ({ page, request, browser }) => {
  const email = uniqueEmail("bia");
  const url = await issueToken(request, email);
  const path = url.replace("https://www.puriongt.com.br", "");
  await page.goto(path);
  await expect(page.getByText("Olá, Ana.")).toBeVisible();

  const other = await browser.newContext();
  await isolate(other);
  const p2 = await other.newPage();
  await p2.goto(path);
  await expect(p2.getByRole("alert").filter({ hasText: "já foi usado" })).toBeVisible();
  await p2.getByLabel("Link ou código de acesso").fill("https://www.puriongt.com.br/private-access#t=" + "A".repeat(43));
  await p2.getByRole("button", { name: "Ativar acesso" }).click();
  await expect(p2.getByRole("alert").filter({ hasText: "Não reconhecemos" })).toBeVisible();

  const crisEmail = uniqueEmail("cris");
  const url2 = await issueToken(request, crisEmail);
  await sql(
    `UPDATE pa_tokens SET expira_em = now() - interval '1 minute'
      WHERE cliente_id = (SELECT id FROM pa_clientes WHERE email_norm = $1) AND usado_em IS NULL`,
    [crisEmail]
  );
  await p2.goto("about:blank");
  await p2.goto(url2.replace("https://www.puriongt.com.br", ""));
  await expect(p2.getByRole("alert").filter({ hasText: "expirou" })).toBeVisible();
  await other.close();
});

test("cliente sem compra aprovada vê 'não elegível'", async ({ page, request }) => {
  const url = await issueToken(request, uniqueEmail("dani"), { paid: false });
  await page.goto(url.replace("https://www.puriongt.com.br", ""));
  await expect(page.locator('[data-state="nao_elegivel"]')).toBeVisible();
  await page.goto("/beneficios");
  await expect(page.locator('[data-state="nao_elegivel"]')).toContainText("compra aprovada");
});

test("/beneficios: visitante vê regras; cliente reserva, paga (webhook assinado) e vê o histórico", async ({ page, request }) => {
  await page.goto("/beneficios");
  await expect(page.getByRole("heading", { name: "R$ 15 na sua primeira compra de presente" })).toBeVisible();
  await expect(page.getByText("até 20% do pedido")).toBeVisible();
  await expect(page.getByText("60 dias após a ativação")).toBeVisible();
  await expect(page.locator("code")).toHaveCount(0); // nenhum código sem sessão

  const url = await issueToken(request, uniqueEmail("edu"));
  await page.goto(url.replace("https://www.puriongt.com.br", ""));
  await page.getByRole("button", { name: "Ativar meu benefício" }).click();
  await page.getByRole("link", { name: /Ver meu benefício/ }).click();
  await expect(page).toHaveURL(/\/beneficios$/);
  const code = (await page.getByLabel("Seu código de resgate").textContent())!;
  expect(code).toMatch(/^PG15-/);

  const use = page.getByRole("button", { name: "Usar benefício no checkout" });
  await expect(use).toBeDisabled(); // exige confirmar que é presente
  await page.getByRole("checkbox", { name: "Confirmo que esta compra é um presente." }).check();
  await use.click();
  const go = page.getByRole("link", { name: /Ir para o checkout/ });
  await expect(go).toBeVisible();
  const checkout = new URL((await go.getAttribute("href"))!);
  expect(checkout.hostname).toBe("pay.puriongt.com.br");
  expect(checkout.searchParams.get("coupon")).toBe(code);
  const resgateId = checkout.searchParams.get("beneficio")!;

  const ev = { event_id: `evt-${randomUUID()}`, tipo: "pago", pedido_ref: `APX-${Date.now()}`, resgate_id: resgateId, valor_pedido: 97.9 };
  const res = await request.post("/api/private/payment-events", signed(ev));
  expect(await res.json()).toMatchObject({ code: "ok", resultado: "confirmado" });
  const again = await request.post("/api/private/payment-events", signed(ev));
  expect(await again.json()).toMatchObject({ resultado: "confirmado", repetido: true });

  await page.reload();
  await expect(page.locator('[data-voucher-status="resgatado"]')).toBeVisible();
  await expect(page.getByRole("region", { name: "Histórico de uso" }).or(page.locator("section", { hasText: "Histórico de uso" })).first()).toContainText("Utilizado");
  await expect(page.getByLabel("Seu código de resgate")).toHaveCount(0); // código some após uso
});

test("reserva cancelada pelo cliente libera o benefício", async ({ page, request }) => {
  const url = await issueToken(request, uniqueEmail("fabi"));
  await page.goto(url.replace("https://www.puriongt.com.br", ""));
  await page.getByRole("button", { name: "Ativar meu benefício" }).click();
  await page.goto("/beneficios");
  await page.getByRole("checkbox", { name: "Confirmo que esta compra é um presente." }).check();
  await page.getByRole("button", { name: "Usar benefício no checkout" }).click();
  await page.getByRole("button", { name: "Cancelar reserva" }).click();
  await expect(page.getByText("Reserva cancelada. O benefício continua disponível.")).toBeVisible();
  await expect(page.locator('[data-voucher-status="disponivel"]')).toBeVisible();
});

test.describe("API — segurança", () => {
  test("rotas privadas exigem sessão; admin exige segredo; webhook exige assinatura", async ({ request, baseURL }) => {
    const headers = { origin: baseURL! };
    // Sem Origin (fora do navegador) as mutações são recusadas antes de tudo.
    expect((await request.post("/api/private/benefits/issue", { data: { politica: "PILOTO_PRESENTE_15" } })).status()).toBe(403);
    expect((await request.post("/api/private/benefits/reserve", { headers, data: { voucherId: randomUUID(), offerId: "individual", idempotencyKey: randomUUID() } })).status()).toBe(401);
    expect((await request.post("/api/private/benefits/issue", { headers, data: { politica: "PILOTO_PRESENTE_15" } })).status()).toBe(401);
    expect((await request.post("/api/private/consent", { headers, data: { canal: "email", concedido: true } })).status()).toBe(401);
    expect((await request.post("/api/private/admin/tokens", { data: { email: "x@y.com", origem: "crm" } })).status()).toBe(401);
    expect((await request.post("/api/private/admin/tokens", { headers: { authorization: "Bearer errado" }, data: { email: "x@y.com", origem: "crm" } })).status()).toBe(401);
    expect((await request.get("/api/private/cron")).status()).toBe(401);
    const ev = { event_id: "evt-forjado", tipo: "pago", pedido_ref: "APX-1", codigo: "PG15-AAAA-BBBB-CCCC" };
    expect((await request.post("/api/private/payment-events", { data: ev })).status()).toBe(401);
    const bad = signed(ev);
    bad.headers["x-purion-signature"] = "0".repeat(64);
    expect((await request.post("/api/private/payment-events", bad)).status()).toBe(401);
  });

  test("ativação de outra origem é recusada (CSRF) e respostas não são cacheadas", async ({ request }) => {
    const cross = await request.post("/api/private/activate", { headers: { origin: "https://evil.example" }, data: { token: "A".repeat(43) } });
    expect(cross.status()).toBe(403);
    const me = await request.get("/api/private/me");
    expect(me.headers()["cache-control"]).toContain("no-store");
  });

  test("cron autorizado processa manutenção e outbox", async ({ request }) => {
    const r = await request.get("/api/private/cron", { headers: { authorization: "Bearer cron-e2e-segredo" } });
    expect(r.status()).toBe(200);
    expect(await r.json()).toMatchObject({ code: "ok" });
  });
});

test("descadastro com link inválido explica o que fazer", async ({ page }) => {
  await page.goto("/private-access/descadastro#u=invalido");
  await expect(page.getByRole("button", { name: "Confirmar descadastro" })).toBeVisible();
  await page.getByRole("button", { name: "Confirmar descadastro" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Link de descadastro inválido" })).toBeVisible();
});
