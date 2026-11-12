"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";
import { usePurion } from "@/lib/store/PurionProvider";
import CarIcon from "@/components/icons/CarIcon";

export type NavLink = { href: string; label: string; primary?: boolean };

const NAV_LINKS: NavLink[] = [
  { href: "#fragrancia", label: "Fragrância" },
  { href: "#comparativo", label: "Comparativo" },
  { href: "#quiz", label: "Quiz" },
  { href: "#videos", label: "Vídeos" },
  { href: "#avaliacoes", label: "Avaliações" },
  { href: "#faq", label: "FAQ" },
  { href: "#comprar", label: "Comprar", primary: true },
];

// Props opcionais usadas por landings secundárias (ex: /presentes). Sem props,
// o comportamento é exatamente o da homepage.
//  - navLinks: troca os links (o item `primary` vira o destaque do menu mobile
//    e some da nav desktop, como o "Comprar" da home).
//  - tone="dark": ao rolar, mantém o vidro escuro e o logo branco em vez de
//    virar claro (para páginas de fundo preto).
export default function Header({
  navLinks = NAV_LINKS,
  tone = "light",
}: {
  navLinks?: NavLink[];
  tone?: "light" | "dark";
} = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { state, toggleCart } = usePurion();
  const dark = tone === "dark";
  const lightSurface = scrolled && !dark;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-3 transition-colors duration-500 ${
        lightSurface
          ? "bg-paper-0/35 text-ink-950 border-b border-white/25 backdrop-blur-2xl backdrop-saturate-150"
          : scrolled
            ? "bg-ink-950/70 text-paper-0 border-b border-white/10 backdrop-blur-2xl backdrop-saturate-150"
            : "bg-transparent text-paper-0 border-b border-transparent"
      }`}
    >
      <div className="flex items-center">
        <nav className="hidden [@media(min-width:1140px)]:flex gap-6 text-[13px] font-medium">
          {navLinks.filter((l) => !l.primary).map((link) => (
            <a key={link.href} href={link.href} className="opacity-90 hover:opacity-100">
              {link.label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          className="flex h-9 w-9 items-center justify-center rounded-full [@media(min-width:1140px)]:hidden"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <a href="#topo" className="flex items-center gap-2 justify-self-center">
        <Image
          src={lightSurface ? "/logo-black.png" : "/logo-white.png"}
          alt="PURION GT"
          width={160}
          height={37}
          className="h-7 w-auto sm:h-8"
          priority
        />
      </a>

      <div className="flex justify-end items-center gap-4">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="hidden [@media(min-width:1140px)]:inline text-sm opacity-90 hover:opacity-100"
        >
          WhatsApp
        </a>
        <button
          onClick={toggleCart}
          aria-label={`Carrinho, ${state.cart} ${state.cart === 1 ? "item" : "itens"}`}
          aria-expanded={state.cartOpen}
          className={`relative flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-colors ${
            state.cartOpen
              ? "border-transparent bg-signal-400 text-ink-950"
              : lightSurface
                ? "border-ink-950/15 bg-ink-950/8 text-ink-950"
                : "border-white/28 bg-white/14 text-paper-0"
          }`}
        >
          <CarIcon size={22} />
          {state.cart > 0 && (
            <span
              className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-mono text-[9px] ${
                state.cartOpen ? "bg-ink-950 text-paper-0" : "bg-signal-400 text-ink-950"
              }`}
            >
              {state.cart}
            </span>
          )}
        </button>
      </div>

      {/* Menu rápido pra mobile/tablet — os links de texto do header somem
          abaixo de 1140px, então sem isso não dava pra pular direto pra
          nenhuma seção a partir do cabeçalho em telas menores. */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full z-50 grid grid-cols-2 gap-2 border-t border-[var(--border-subtle)] bg-paper-0 p-4 text-ink-950 shadow-[var(--shadow-lg)] [@media(min-width:1140px)]:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`rounded-[var(--radius-md)] px-4 py-3 text-sm font-medium ${
                link.primary ? "bg-signal-400 text-ink-950" : "bg-paper-50"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            className="col-span-2 rounded-[var(--radius-md)] bg-paper-50 px-4 py-3 text-center text-sm font-medium"
          >
            Falar no WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
