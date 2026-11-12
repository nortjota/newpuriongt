"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";

// Accordion acessível (botão com aria-expanded/aria-controls + região
// rotulada). Vários itens podem ficar abertos ao mesmo tempo.
export default function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const baseId = useId();

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="flex flex-col border-t border-white/10">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const btnId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <div key={item.q} className="border-b border-white/10">
            <h3 className="m-0">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex w-full items-center gap-5 py-6 text-left text-paper-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gift-accent)]"
              >
                <span className="flex-1 font-display text-[clamp(17px,1.6vw,21px)] font-medium leading-snug tracking-[-0.015em]">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out)] ${
                    isOpen ? "rotate-45 border-transparent bg-[var(--gift-accent)] text-ink-950" : "border-white/20 text-paper-0"
                  }`}
                >
                  <Plus size={16} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="pb-6 pr-14 text-[15px] leading-relaxed text-paper-0/65"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
