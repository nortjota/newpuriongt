"use client";

import { useEffect } from "react";
import { capturarOrigem } from "@/lib/tracking";

/** Guarda UTMs/fbclid/gclid da chegada para o CRM saber a origem de leads e vendas. */
export default function TrackingCapture() {
  useEffect(() => {
    capturarOrigem();
  }, []);
  return null;
}
