"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({
  value,
  max,
  onChange,
  disabled,
}: {
  value: number;
  max: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full text-paper-0 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[var(--gift-accent)] disabled:cursor-not-allowed disabled:opacity-30";
  return (
    <div className="flex flex-col gap-2">
      <div role="group" aria-label="Quantidade" className="inline-flex items-center gap-1 self-start rounded-full border border-white/15 p-0.5">
        <button type="button" className={btn} aria-label="Diminuir quantidade" disabled={disabled || value <= 1} onClick={() => onChange(value - 1)}>
          <Minus size={14} aria-hidden />
        </button>
        <output aria-live="polite" className="w-8 text-center font-mono text-[15px] text-paper-0">
          {value}
        </output>
        <button type="button" className={btn} aria-label="Aumentar quantidade" disabled={disabled || value >= max} onClick={() => onChange(value + 1)}>
          <Plus size={14} aria-hidden />
        </button>
      </div>
      {max <= 1 && !disabled && (
        <span className="text-[12px] text-paper-0/50">1 kit por pedido no checkout atual. Para mais unidades, faça um novo pedido ou fale no WhatsApp.</span>
      )}
    </div>
  );
}
