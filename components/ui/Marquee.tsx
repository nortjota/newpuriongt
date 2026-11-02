"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Mede quantas vezes `items` precisa se repetir pra preencher a largura
// visível (pelo menos 1x) antes de duplicar esse bloco pra fazer o loop sem
// costura. Com poucos itens (ex: poucos depoimentos reais), repete o
// suficiente pra não deixar vão; com muitos itens, não duplica além do
// necessário — resolve o pedido de não "inflar" artificialmente a lista.
export default function Marquee<T>({
  items,
  renderItem,
  duration = "38s",
  reverse = false,
  className,
  itemClassName,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  duration?: string;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const unitRef = useRef<HTMLDivElement>(null);
  const [repeat, setRepeat] = useState(1);

  useEffect(() => {
    function measure() {
      const container = containerRef.current;
      const unit = unitRef.current;
      if (!container || !unit || items.length === 0) return;
      const containerWidth = container.offsetWidth;
      const unitWidth = unit.scrollWidth;
      if (unitWidth === 0) return;
      setRepeat(Math.max(1, Math.ceil(containerWidth / unitWidth)));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div
        className={`marquee-track flex w-max gap-10 ${className ?? ""}`}
        style={{ animationDuration: duration, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {/* As duas cópias do "bloco" são necessárias pro loop (0% -> -50%)
            ficar sem costura — o que muda com a quantidade de itens é
            quantas vezes `items` se repete DENTRO de cada bloco. */}
        {[0, 1].map((copy) => (
          <div key={copy} ref={copy === 0 ? unitRef : undefined} className={`flex gap-10 ${itemClassName ?? ""}`}>
            {Array.from({ length: repeat }).flatMap((_, r) =>
              items.map((item, i) => renderItem(item, r * items.length + i))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
