"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";
import { useCheckoutUrl } from "@/lib/content/checkout";

function buildCategories(checkoutUrl: string) {
  return [
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
}

// Único pedaço do rodapé que precisa de client: o acordeão (estado `open`) e
// o link de checkout (depende do plano selecionado + atribuição de UTM/
// referral via `useCheckoutUrl`, resolvida no cliente). Todo o resto do
// Footer é estático e vive em components/layout/Footer.tsx (Server Component).
export default function FooterCategories() {
  const [open, setOpen] = useState(-1);
  const checkoutUrl = useCheckoutUrl();
  const categories = buildCategories(checkoutUrl);

  return (
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
  );
}
