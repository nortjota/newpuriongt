"use client";

// Lê/grava uma flag booleana simples no localStorage (ex: "já viu o popup de e-mail").
export function readFlag(key: string): boolean {
  try {
    return !!localStorage.getItem(key);
  } catch {
    return false;
  }
}

export function setFlag(key: string) {
  try {
    localStorage.setItem(key, "1");
  } catch {
    // localStorage indisponível (modo privado, etc.) — segue sem persistir.
  }
}
