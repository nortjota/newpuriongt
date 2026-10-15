"use client";

import type { ReactNode } from "react";
import { useRevealOnView } from "@/lib/hooks/useRevealOnView";

export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useRevealOnView<HTMLDivElement>();

  // Uma vez visível, paramos de forçar opacity/transform inline para não
  // conflitar com transformações de hover definidas via className (ex: Benefits).
  return (
    <div
      ref={ref}
      className={className}
      style={
        visible
          ? { transition: `opacity .9s var(--ease-out) ${delay}ms, transform .9s var(--ease-out) ${delay}ms` }
          : {
              opacity: 0,
              transform: "translate3d(0,24px,0)",
              transition: `opacity .9s var(--ease-out) ${delay}ms, transform .9s var(--ease-out) ${delay}ms`,
            }
      }
    >
      {children}
    </div>
  );
}
