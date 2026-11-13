import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

// Rodar: npm run build && npm run test:e2e
// Ambientes com Chromium pré-instalado fora do cache do Playwright podem
// apontar o binário com PW_CHROMIUM_PATH.
const preinstalled = "/opt/pw-browsers/chromium";
const executablePath = process.env.PW_CHROMIUM_PATH || (existsSync(preinstalled) ? preinstalled : undefined);
const PORT = Number(process.env.E2E_PORT || 3100);

// Segredos SÓ de teste (o banco também é efêmero e local).
export const E2E_SECRETS = {
  PRIVATE_ACCESS_ADMIN_SECRET: "admin-e2e-segredo-com-mais-de-32-caracteres",
  BENEFITS_WEBHOOK_SECRET: "webhook-e2e-segredo-com-mais-de-32-caracteres",
};

export default defineConfig({
  testDir: "tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "off",
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/presentes`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    // Personalização em memória e estoque fixo só para os testes (os dois
    // overrides são ignorados na Vercel — ver lib/gift/*).
    env: {
      GIFT_PERSONALIZATION_STORE: "memory",
      GIFT_STOCK_BOTTLES: "10",
      DATABASE_URL: "postgres://postgres@127.0.0.1:54329/purion_test",
      PRIVATE_ACCESS_PEPPER: "e2e-pepper-com-pelo-menos-32-caracteres-xxxx",
      BENEFITS_CODE_KEY: Buffer.alloc(32, 9).toString("base64"),
      BENEFITS_CHECKOUT_MODE: "coupon_param",
      APPMAX_COUPON_PARAM: "coupon",
      CRON_SECRET: "cron-e2e-segredo",
      ...E2E_SECRETS,
    },
  },
});
