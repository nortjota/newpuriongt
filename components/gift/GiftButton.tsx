import type { ComponentPropsWithoutRef, ReactNode } from "react";

// Botões/links da PURION GIFT. "accent" (verde-limão) é reservado para a ação
// principal de cada vista; "ghost" para ações secundárias.
type Variant = "accent" | "ghost" | "light";

const BASE =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-7 py-3.5 text-sm font-medium transition-[transform,background-color,border-color] duration-300 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--gift-accent)] motion-safe:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0";

const VARIANTS: Record<Variant, string> = {
  accent: "bg-[var(--gift-accent)] text-ink-950 hover:brightness-95",
  ghost: "border border-white/25 bg-white/[0.06] text-paper-0 backdrop-blur-md hover:border-white/50 hover:bg-white/10",
  light: "bg-paper-0 text-ink-950 hover:bg-paper-100",
};

export function giftButtonClass(variant: Variant = "accent", extra = "") {
  return `${BASE} ${VARIANTS[variant]} ${extra}`;
}

export function GiftLink({
  variant = "accent",
  className = "",
  children,
  ...props
}: ComponentPropsWithoutRef<"a"> & { variant?: Variant; children: ReactNode }) {
  return (
    <a {...props} className={giftButtonClass(variant, className)}>
      {children}
    </a>
  );
}

export function GiftButton({
  variant = "accent",
  className = "",
  children,
  type = "button",
  ...props
}: ComponentPropsWithoutRef<"button"> & { variant?: Variant; children: ReactNode }) {
  return (
    <button type={type} {...props} className={giftButtonClass(variant, className)}>
      {children}
    </button>
  );
}
