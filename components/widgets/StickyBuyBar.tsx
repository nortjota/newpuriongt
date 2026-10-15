"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePurion } from "@/lib/store/PurionProvider";
import { CHECKOUT_URL } from "@/lib/content/checkout";

// Barra fixa só no mobile (lg:hidden) — aparece depois que o usuário passa da
// Oferta (#comprar) e some quando ele volta pra lá ou chega no rodapé, pra
// não competir com os próprios botões de compra da seção.
export default function StickyBuyBar() {
  const { plan, total } = usePurion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const offer = document.getElementById("comprar");
    const footer = document.querySelector("footer");
    if (!offer) return;

    const update = () => {
      const offerRect = offer.getBoundingClientRect();
      const pastOffer = offerRect.bottom < 0;
      const footerRect = footer?.getBoundingClientRect();
      const reachedFooter = footerRect ? footerRect.top < window.innerHeight : false;
      setVisible(pastOffer && !reachedFooter);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-[var(--border-subtle)] bg-paper-0/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 lg:hidden"
      style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 flex-none overflow-hidden rounded-xl bg-paper-100">
          <Image src="/product-studio.png" alt="" fill className="object-cover" />
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-xs font-medium">{plan.title}</span>
          <span className="font-mono text-sm">{total}</span>
        </div>
        <a
          href={CHECKOUT_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-[var(--radius-pill)] bg-ink-950 px-5 py-3 text-sm font-medium text-paper-0"
        >
          Comprar agora
        </a>
      </div>
    </div>
  );
}
