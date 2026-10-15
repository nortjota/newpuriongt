"use client";

import { useEffect } from "react";

// Dispara quando o mouse sai por cima da janela (gesto clássico de "vou fechar a aba").
export function useExitIntent(onExit: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) onExit();
    };
    document.addEventListener("mouseout", handler);
    return () => document.removeEventListener("mouseout", handler);
  }, [onExit, enabled]);
}
