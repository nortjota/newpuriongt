"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, MessageCircle, ShieldCheck, Star, Truck, BadgeCheck } from "lucide-react";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
import { WHATSAPP_URL } from "@/lib/content/whatsapp";
import { useCheckoutUrl } from "@/lib/content/checkout";
import { COMPANY } from "@/lib/config/company";

const PARTNER_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  "Olá! Quero saber mais sobre me tornar parceiro/revendedor do Purion GT."
)}`;

function buildCategories(checkoutUrl: string, hashBase: string) {
  const categories = [
    {
      title: "Comprar",
      links: [
        { href: "#comprar", label: "Produto e planos" },
        { href: "#fragrancia", label: "Pirâmide olfativa" },
        { href: checkoutUrl, label: "Comprar agora", external: true },
      ],
    },
    {
      title: "Ajuda e Suporte",
      links: [
        { href: WHATSAPP_URL, label: "Falar no WhatsApp", external: true },
        { href: "#faq", label: "Perguntas frequentes" },
        { href: "mailto:puriongt@gmail.com", label: "puriongt@gmail.com" },
      ],
    },
    {
      title: "Institucional",
      links: [
        { href: "#historia", label: "Nossa história" },
        { href: "#avaliacoes", label: "Avaliações" },
        { href: "/privacy", label: "Política de Privacidade" },
        { href: "/terms", label: "Termos de Uso" },
      ],
    },
  ];
  // Em páginas fora da home (ex: /presentes), âncoras como "#fragrancia"
  // precisam apontar para a home ("/#fragrancia").
  if (!hashBase) return categories;
  return categories.map((cat) => ({
    ...cat,
    links: cat.links.map((l) => (l.href.startsWith("#") ? { ...l, href: `${hashBase}${l.href}` } : l)),
  }));
}

const PAYMENTS = ["visa", "mastercard", "amex", "elo", "hipercard", "discover", "aura", "boleto", "pix"];

const BENEFITS = [
  { icon: Truck, title: "Envio no mesmo dia", desc: "Rastreio liberado na hora." },
  { icon: ShieldCheck, title: "Garantia de 7 dias", desc: "100% do dinheiro de volta." },
  { icon: BadgeCheck, title: "Compra segura", desc: "Dados protegidos, nota fiscal em todo pedido." },
  { icon: Star, title: "+450 motoristas", desc: "4.9 de nota em avaliações reais." },
];

export default function Footer({ hashBase = "" }: { hashBase?: string } = {}) {
  const [open, setOpen] = useState(-1);
  const checkoutUrl = useCheckoutUrl();
  const categories = buildCategories(checkoutUrl, hashBase);

  return (
    <footer className="m-[10px] overflow-hidden rounded-[var(--radius-lg)] bg-ink-950 px-6 pt-14 text-paper-0">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-12 lg:grid-cols-[minmax(0,300px)_1fr]">
        <div className="flex flex-col items-start gap-5">
          <Image src="/logo-white.png" alt="PURION GT" width={150} height={37} className="h-7 w-auto flex-none" />
          <span className="max-w-[260px] text-sm leading-relaxed text-[var(--text-inverse-muted)]">
            Exala presença. Deixa memória.
          </span>
        </div>

        <div className="flex flex-col divide-y divide-[var(--border-inverse)] border-t border-[var(--border-inverse)]">
          {categories.map((cat, i) => {
            const isOpen = open === i;
            return (
              <div key={cat.title}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between py-4 text-left text-sm font-medium"
                >
                  {cat.title}
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-500"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-3 pb-4">
                      {cat.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target={"external" in link && link.external ? "_blank" : undefined}
                          rel={"external" in link && link.external ? "noreferrer" : undefined}
                          className="text-sm text-paper-0/80 hover:text-paper-0"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[var(--content-max)] justify-center">
        <a
          href={PARTNER_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-[var(--radius-pill)] bg-signal-400 px-6 py-3 text-sm font-medium text-ink-950 transition-transform hover:-translate-y-0.5"
        >
          Quer revender o Purion GT? Seja um parceiro
        </a>
      </div>

      <div className="mx-auto mt-10 flex max-w-[var(--content-max)] flex-wrap items-center justify-between gap-6 border-t border-[var(--border-inverse)] pt-8">
        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com/puriongt"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-inverse)] text-paper-0/80 transition-colors hover:text-paper-0"
          >
            <InstagramIcon size={16} />
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-inverse)] text-paper-0/80 transition-colors hover:text-paper-0"
          >
            <MessageCircle size={16} />
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PAYMENTS.map((p) => (
            <div key={p} className="flex h-7 w-11 flex-none items-center justify-center rounded-[6px] bg-white p-1">
              <Image src={`/images/pagamento/${p}.webp`} alt={p} width={36} height={22} className="h-full w-full object-contain" />
            </div>
          ))}
          <div className="flex h-7 w-7 flex-none items-center justify-center" title="Site seguro">
            <Image src="/images/pagamento/selo-seguro.webp" alt="Site seguro, certificado SSL" width={28} height={28} className="h-full w-full object-contain" />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-[var(--content-max)] flex-wrap justify-between gap-3 text-xs text-[var(--text-inverse-muted)]">
        <span>© 2026 Purion GT. Todos os direitos reservados. · CNPJ: {COMPANY.cnpj}</span>
        <span className="font-mono">Feito no Brasil</span>
      </div>

      <div className="mx-auto mt-10 grid max-w-[var(--content-max)] gap-x-8 gap-y-5 border-t border-[var(--border-inverse)] pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon size={18} className="mt-0.5 flex-none text-signal-400" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{title}</span>
              <span className="text-xs text-[var(--text-inverse-muted)]">{desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-6 flex max-w-[var(--content-max)] items-start gap-3 border-t border-[var(--border-inverse)] pt-6">
        <MessageCircle size={18} className="mt-0.5 flex-none text-signal-400" />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">Atendimento Humanizado</span>
          <span className="text-xs text-[var(--text-inverse-muted)]">Segunda a sexta das 9h às 18h</span>
        </div>
      </div>

      <div
        aria-hidden
        className="mt-6 -mb-[0.12em] whitespace-nowrap text-center font-display text-[clamp(120px,24vw,400px)] leading-[0.78] tracking-[-0.07em] text-ink-800"
        style={{ fontVariationSettings: "'wdth' 88" }}
      >
        PURION GT
      </div>
    </footer>
  );
}
