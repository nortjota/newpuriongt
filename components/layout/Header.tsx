"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";
import { usePurion } from "@/lib/store/PurionProvider";

const NAV_LINKS = [
  { href: "#fragrancia", label: "Fragrância" },
  { href: "#comparativo", label: "Comparativo" },
  { href: "#quiz", label: "Quiz" },
  { href: "#videos", label: "Vídeos" },
  { href: "#avaliacoes", label: "Avaliações" },
  { href: "#faq", label: "FAQ" },
  { href: "#comprar", label: "Comprar" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { state } = usePurion();

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
        scrolled
          ? "bg-paper-0/90 text-ink-950 border-b border-[var(--border-subtle)] backdrop-blur-md"
          : "bg-transparent text-paper-0 border-b border-transparent"
      }`}
    >
      <div className="flex items-center">
        <nav className="hidden [@media(min-width:1140px)]:flex gap-6 text-[13px] font-medium">
          {NAV_LINKS.filter((l) => l.href !== "#comprar").map((link) => (
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
          src={scrolled ? "/logo-black.png" : "/logo-white.png"}
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
        <a
          href="#comprar"
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            scrolled ? "bg-ink-950 text-paper-0" : "bg-paper-0 text-ink-950"
          }`}
        >
          Sacola · {state.cart}
        </a>
      </div>

      {/* Menu rápido pra mobile/tablet — os links de texto do header somem
          abaixo de 1140px, então sem isso não dava pra pular direto pra
          nenhuma seção a partir do cabeçalho em telas menores. */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full z-50 grid grid-cols-2 gap-2 border-t border-[var(--border-subtle)] bg-paper-0 p-4 text-ink-950 shadow-[var(--shadow-lg)] [@media(min-width:1140px)]:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`rounded-[var(--radius-md)] px-4 py-3 text-sm font-medium ${
                link.href === "#comprar" ? "bg-signal-400 text-ink-950" : "bg-paper-50"
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
