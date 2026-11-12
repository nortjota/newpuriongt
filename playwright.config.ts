import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

// Rodar: npm run build && npm run test:e2e
// Ambientes com Chromium pré-instalado fora do cache do Playwright podem
// apontar o binário com PW_CHROMIUM_PATH.
const preinstalled = "/opt/pw-browsers/chromium";
const executablePath = process.env.PW_CHROMIUM_PATH || (existsSync(preinstalled) ? preinstalled : undefined);
const PORT = Number(process.env.E2E_PORT || 3100);

export default defineConfig({
  testDir: "tests/e2e",
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
  },
});
