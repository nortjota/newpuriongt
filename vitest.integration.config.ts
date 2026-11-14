import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Testes de integração contra um PostgreSQL REAL e efêmero (scripts/test-db.mjs),
// com as migrations de db/migrations aplicadas. Rodar: npm run test:integration
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
  test: {
    include: ["tests/integration/**/*.test.ts"],
    environment: "node",
    globalSetup: ["tests/integration/global-setup.ts"],
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 60_000,
    env: {
      DATABASE_URL: "postgres://postgres@127.0.0.1:54329/purion_test",
      DATABASE_POOL_MAX: "20",
      PRIVATE_ACCESS_PEPPER: "teste-pepper-com-pelo-menos-32-caracteres-xx",
      BENEFITS_CODE_KEY: Buffer.alloc(32, 7).toString("base64"),
      BENEFITS_CHECKOUT_MODE: "coupon_param",
      APPMAX_COUPON_PARAM: "coupon",
      NEXT_PUBLIC_CHECKOUT_PAUSED: "false",
    },
  },
});
