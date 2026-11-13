import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
    // Os testes cobrem o checkout real (Appmax); o modo "em breve" tem teste
    // próprio em checkout-paused.test.ts.
    env: { NEXT_PUBLIC_CHECKOUT_PAUSED: "false" },
  },
});
