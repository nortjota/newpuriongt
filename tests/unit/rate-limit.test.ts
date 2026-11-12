import { describe, expect, it } from "vitest";
import { checkRateLimit } from "@/lib/gift/rate-limit";

describe("checkRateLimit", () => {
  it("bloqueia depois do limite e libera após a janela", () => {
    const key = `t-${Math.random()}`;
    for (let i = 0; i < 3; i++) expect(checkRateLimit(key, 1000, 3)).toBe(true);
    expect(checkRateLimit(key, 1000, 3)).toBe(false);
    expect(checkRateLimit(key, 62_000, 3)).toBe(true);
  });
});
