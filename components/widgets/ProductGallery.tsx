"use client";

import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from "react";
import Image from "next/image";
import { PRODUCT_GALLERY, PLAN_GALLERY_IMAGE } from "@/lib/content/product-gallery";
import type { Plan } from "@/lib/content/plans";

export default function ProductGallery({ planId, children }: { planId: Plan["id"]; children?: ReactNode }) {
  const kitImage = PLAN_GALLERY_IMAGE[planId];
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    setActive(0);
  }, [planId]);

  const current = kitImage ?? PRODUCT_GALLERY[active];

  function onTouchStart(e: TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: TouchEvent) {
    if (touchX.current == null || kitImage) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 40) return;
    const dir = dx < 0 ? 1 : -1;
    setActive((i) => (i + dir + PRODUCT_GALLERY.length) % PRODUCT_GALLERY.length);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-square max-h-[680px] overflow-hidden rounded-[var(--radius-xl)] bg-paper-100"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image key={current.src} src={current.src} alt={current.alt} fill className="object-cover" sizes="(min-width: 640px) 460px, 100vw" />
        {children}
      </div>
      {!kitImage && (
        <div className="flex gap-2">
          {PRODUCT_GALLERY.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setActive(i)}
              aria-label={img.alt}
              className={`relative aspect-square w-16 flex-none overflow-hidden rounded-[var(--radius-md)] border-2 transition-colors ${
                active === i ? "border-ink-950" : "border-transparent"
              }`}
            >
              <Image src={img.src} alt="" fill className="object-cover bg-paper-100" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
