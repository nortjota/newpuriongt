import type { CSSProperties, ReactNode } from "react";
import Header, { type NavLink } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/widgets/CartDrawer";

const STYLE = { "--gift-accent": "#D4FC3C" } as CSSProperties;

// Moldura das páginas do Private Access (mesma linguagem da PURION GIFT).
export default function PrivateLayout({ nav, children }: { nav: NavLink[]; children: ReactNode }) {
  return (
    <div style={STYLE} className="flex min-h-full flex-1 flex-col bg-ink-950 text-paper-0">
      <Header navLinks={nav} tone="dark" />
      <main id="topo" className="flex-1">
        {children}
      </main>
      <Footer hashBase="/" />
      <CartDrawer />
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-2.5 text-[11px] uppercase tracking-[var(--ls-caps)] text-paper-0/60">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--gift-accent)]" />
      {children}
    </span>
  );
}
