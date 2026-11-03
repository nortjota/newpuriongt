"use client";

import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
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
    <div className="flex flex-col gap-2.5">
      <div
        className="relative aspect-square max-h-[680px] overflow-hidden rounded-[var(--radius-xl)] bg-paper-100"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {current.type === "video" ? (
          <video
            key={current.src}
            src={current.src}
            poster={current.poster}
            muted
            autoPlay
            loop
            playsInline
            preload="none"
            className="h-full w-full object-cover"
          />
        ) : (
          <Image key={current.src} src={current.src} alt={current.alt} fill className="object-cover" sizes="(min-width: 640px) 460px, 100vw" />
        )}
        {children}
      </div>

      {!kitImage && (
        <>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PRODUCT_GALLERY.map((item, i) => (
              <button
                key={item.src}
                onClick={() => setActive(i)}
                aria-label={item.alt}
                className={`relative aspect-square w-11 flex-none overflow-hidden rounded-[var(--radius-sm)] transition-opacity ${
                  active === i ? "opacity-100 ring-1 ring-ink-950" : "opacity-50 hover:opacity-80"
                }`}
              >
                <Image
                  src={item.type === "video" ? item.poster : item.src}
                  alt=""
                  fill
                  className="object-cover bg-paper-100"
                  sizes="44px"
                />
                {item.type === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-ink-950/20">
                    <Play size={10} className="fill-paper-0 text-paper-0" />
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center gap-1.5">
            {PRODUCT_GALLERY.map((item, i) => (
              <button
                key={item.src}
                onClick={() => setActive(i)}
                aria-label={`Ver mídia ${i + 1}`}
                className="flex h-3 w-3 items-center justify-center"
              >
                <span className={`block rounded-full transition-all ${active === i ? "h-1.5 w-3.5 bg-ink-950" : "h-1.5 w-1.5 bg-ink-950/20"}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
