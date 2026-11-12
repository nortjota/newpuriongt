"use client";

import { useEffect, useState } from "react";
import { CHOOSER_ID } from "./ids";
import { giftButtonClass } from "./GiftButton";

// CTA fixo no mobile: aparece depois do hero e some enquanto a seção de
// presentes (ou o rodapé) está na tela, para não competir com os cards.
// Deixa espaço à direita para o botão flutuante do WhatsApp.
export default function GiftStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const chooser = document.getElementById(CHOOSER_ID);
    const footer = document.querySelector("footer");

    const update = () => {
      const vh = window.innerHeight;
      const pastHero = window.scrollY > vh * 0.85;
      const c = chooser?.getBoundingClientRect();
      const inChooser = c ? c.top < vh && c.bottom > 0 : false;
      const f = footer?.getBoundingClientRect();
      const atFooter = f ? f.top < vh : false;
      setVisible(pastHero && !inChooser && !atFooter);
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
      aria-hidden={!visible}
      className={`fixed bottom-5 left-4 right-[92px] z-[70] transition-[transform,opacity] duration-500 ease-[var(--ease-out)] lg:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[140%] opacity-0"
      }`}
    >
      <a
        href={`#${CHOOSER_ID}`}
        tabIndex={visible ? 0 : -1}
        className={giftButtonClass("accent", "w-full shadow-[0_20px_40px_-12px_rgba(0,0,0,.6)]")}
      >
        Escolher meu presente
      </a>
    </div>
  );
}
