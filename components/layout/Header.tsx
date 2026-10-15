"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";
import { usePurion } from "@/lib/store/PurionProvider";

const NAV_LINKS = [
  { href: "#fragrancia", label: "Fragrância" },
  { href: "#comparativo", label: "Comparativo" },
  { href: "#quiz", label: "Quiz" },
  { href: "#videos", label: "Vídeos" },
  { href: "#avaliacoes", label: "Avaliações" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { state } = usePurion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-3 transition-colors duration-500 ${
        scrolled
          ? "bg-paper-0/90 text-ink-950 border-b border-[var(--border-subtle)] backdrop-blur-md"
          : "bg-transparent text-paper-0 border-b border-transparent"
      }`}
    >
      <nav className="hidden [@media(min-width:1140px)]:flex gap-6 text-[13px] font-medium">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="opacity-90 hover:opacity-100">
            {link.label}
          </a>
        ))}
      </nav>

      <a href="#topo" className="flex items-center gap-2 justify-self-center">
        <Image
          src="/logo-mark.png"
          alt="PURION GT"
          width={42}
          height={42}
          className={`h-[42px] w-auto transition-[filter] duration-500 ${
            scrolled ? "" : "invert brightness-0 saturate-0 contrast-200"
          }`}
          style={scrolled ? undefined : { filter: "invert(1)" }}
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
    </header>
  );
}
