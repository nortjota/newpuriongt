"use client";

import { useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";
import { isAvailable, toAnalyticsItem } from "@/lib/gift/catalog";
import { track } from "@/lib/analytics/events";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "./SectionHeading";
import GiftCard from "./GiftCard";
import { GiftLink } from "./GiftButton";
import { useGift } from "./GiftContext";
import { CHOOSER_ID } from "./ids";

// 4. Vitrine — Individual, Duo e Trio a partir do catálogo real.
export default function GiftChooser() {
  const { offers, occasion, suggestion, selectOccasion, addGift } = useGift();
  const available = offers.filter(isAvailable);
  const ref = useRef<HTMLElement>(null);

  // view_item_list: uma vez, quando a vitrine entra na tela.
  useEffect(() => {
    const el = ref.current;
    if (!el || available.length === 0) return;
    const items = available.map((o) => toAnalyticsItem(o));
    const send = () => track({ name: "view_item_list", params: { item_list_name: "PURION GIFT", items } });
    if (!("IntersectionObserver" in window)) {
      send();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          send();
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
    // Ofertas vêm do servidor e não mudam durante a visita.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={ref}
      id={CHOOSER_ID}
      tabIndex={-1}
      aria-labelledby="gift-chooser-title"
      className="mx-auto max-w-[var(--content-max)] scroll-mt-20 px-6 pb-[var(--section-y)] outline-none sm:px-10"
    >
      {/* Âncoras de compatibilidade dos widgets globais (Toast "Ver" e
          carrinho vazio "Ver o produto"). */}
      <span id="comprar" aria-hidden className="block scroll-mt-20" />
      <span id="comprar-topo" aria-hidden className="block scroll-mt-20" />

      <Reveal>
        <SectionHeading id="gift-chooser-title" eyebrow="Escolha seu presente" title="Três formas de presentear.">
          <p className="m-0">O mesmo PURION GT 60 ml — você escolhe quantos frascos vão no presente.</p>
        </SectionHeading>
      </Reveal>

      <div aria-live="polite" className="mt-8">
        {occasion && (
          <div className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="m-0 text-[15px] leading-relaxed text-paper-0/80">
              <span className="font-medium text-paper-0">{occasion.label}:</span>{" "}
              {suggestion ? occasion.reasons[suggestion.id] : "nenhuma opção disponível para esta ocasião agora."}
            </p>
            <button
              type="button"
              onClick={() => selectOccasion(null)}
              className="inline-flex flex-none items-center gap-1.5 self-start rounded-full px-3 py-2 text-[13px] text-paper-0/60 transition-colors hover:text-paper-0 focus-visible:outline-2 focus-visible:outline-[var(--gift-accent)] sm:self-auto"
            >
              <X size={14} aria-hidden />
              Limpar ocasião
            </button>
          </div>
        )}
      </div>

      {available.length === 0 ? (
        <div role="status" className="mt-8 flex flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-white/10 bg-ink-900 p-8">
          <p className="m-0 font-display text-[22px] font-medium text-paper-0">Nenhuma opção de presente disponível agora.</p>
          <p className="m-0 max-w-[52ch] text-[15px] leading-relaxed text-paper-0/60">
            Estamos repondo as opções desta página. Fale com a gente para presentear hoje mesmo.
          </p>
          <GiftLink href={WHATSAPP_URL} target="_blank" rel="noreferrer" variant="ghost">
            <MessageCircle size={16} aria-hidden />
            Falar no WhatsApp
          </GiftLink>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {offers.map((offer, i) => (
            <Reveal key={offer.id} delay={i * 60} className="h-full">
              <GiftCard
                offer={offer}
                highlighted={suggestion?.id === offer.id}
                highlightLabel={occasion ? `Sugerido para ${occasion.label}` : undefined}
                onChoose={() => addGift(offer.id)}
              />
            </Reveal>
          ))}
        </div>
      )}

      <p className="m-0 mt-6 text-center text-[13px] text-paper-0/45">
        Envio no mesmo dia · Rastreio liberado na hora · Garantia de 7 dias
      </p>
    </section>
  );
}
