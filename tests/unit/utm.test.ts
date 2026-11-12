import { describe, expect, it } from "vitest";
import { UTM_STORAGE_KEY, UTM_TTL_MS, appendTracking, captureTracking, parseTrackingParams, readStoredTracking } from "@/lib/tracking/utm";
import { memoryStorage } from "./memory-storage";

describe("parseTrackingParams", () => {
  it("extrai só chaves conhecidas, com trim e limite de tamanho", () => {
    const p = parseTrackingParams(`?utm_source=meta&utm_campaign=%20natal%20&foo=bar&gclid=${"x".repeat(300)}`);
    expect(p).toEqual({ utm_source: "meta", utm_campaign: "natal", gclid: "x".repeat(150) });
  });
  it("ignora valores vazios", () => {
    expect(parseTrackingParams("?utm_source=&utm_medium=%20")).toEqual({});
  });
});

describe("captureTracking / readStoredTracking", () => {
  it("persiste a origem e a mantém em visitas diretas", () => {
    const s = memoryStorage();
    captureTracking("?utm_source=google&utm_medium=cpc", "/presentes", 1000, s);
    expect(captureTracking("", "/presentes", 2000, s)).toEqual({ utm_source: "google", utm_medium: "cpc" });
  });
  it("nova campanha substitui a anterior inteira (sem misturar)", () => {
    const s = memoryStorage();
    captureTracking("?utm_source=google&utm_campaign=pais", "/presentes", 1000, s);
    captureTracking("?utm_source=meta", "/presentes", 2000, s);
    expect(readStoredTracking(3000, s)).toEqual({ utm_source: "meta" });
  });
  it("expira após 30 dias", () => {
    const s = memoryStorage();
    captureTracking("?utm_source=google", "/presentes", 0, s);
    expect(readStoredTracking(UTM_TTL_MS + 1, s)).toEqual({});
    expect(s.getItem(UTM_STORAGE_KEY)).toBeNull();
  });
  it("tolera storage corrompido ou indisponível", () => {
    const s = memoryStorage();
    s.setItem(UTM_STORAGE_KEY, "{not json");
    expect(readStoredTracking(0, s)).toEqual({});
    expect(captureTracking("?utm_source=x", "/", 0, null)).toEqual({ utm_source: "x" });
  });
});

describe("appendTracking", () => {
  it("anexa parâmetros sem sobrescrever os existentes", () => {
    const url = appendTracking("https://pay.example.com/checkout?product=1&utm_source=utmify", {
      utm_source: "meta",
      utm_campaign: "natal",
      ref: undefined,
    });
    const u = new URL(url);
    expect(u.searchParams.get("product")).toBe("1");
    expect(u.searchParams.get("utm_source")).toBe("utmify");
    expect(u.searchParams.get("utm_campaign")).toBe("natal");
    expect(u.searchParams.has("ref")).toBe(false);
  });
  it("devolve a URL original se for inválida", () => {
    expect(appendTracking("not a url", { utm_source: "x" })).toBe("not a url");
  });
});
