"use client";

import Marquee from "@/components/ui/Marquee";

// Wrapper client-side só pra poder passar `renderItem` (função) pro Marquee
// sem cruzar a fronteira Server -> Client Component (page.tsx é Server
// Component; funções não são serializáveis nessa fronteira).
export default function TaglineMarquee({ items }: { items: string[] }) {
  return (
    <Marquee
      items={items}
      itemClassName="whitespace-nowrap font-mono text-sm"
      renderItem={(item, i) => <span key={i}>{item}</span>}
    />
  );
}
