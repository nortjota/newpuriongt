"use client";

import { useRevealOnView } from "@/lib/hooks/useRevealOnView";

export default function RevealBar({
  targetWidth,
  className,
  style,
  children,
}: {
  targetWidth: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const { ref, visible } = useRevealOnView<HTMLDivElement>(0.2);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        width: visible ? targetWidth : "0%",
        transition: "width 1.4s var(--ease-out)",
      }}
    >
      {children}
    </div>
  );
}
