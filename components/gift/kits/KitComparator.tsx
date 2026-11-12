"use client";

import Image from "next/image";
import type { GiftOffer } from "@/lib/gift/catalog";
import type { KitAvailability } from "@/lib/gift/kits-service";
import { computeSummary } from "@/lib/gift/pricing";
import { fmt } from "@/lib/content/plans";

const REASON_LABEL: Record<NonNullable<KitAvailability["reason"]>, string> = {
  checkout_unconfirmed: "Em preparação",
  disabled_by_ops: "Indisponível",
  out_of_stock: "Esgotado",
};

// Comparador Individual × Duo × Trio como grupo de rádio nativo
// (teclado: setas alternam entre as opções disponíveis).
export default function KitComparator({
  offers,
  availability,
  loading,
  selected,
  onSelect,
}: {
  offers: GiftOffer[];
  availability: Record<string, KitAvailability> | null;
  loading: boolean;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-4 text-[11px] uppercase tracking-[var(--ls-caps)] text-paper-0/55">1 · Escolha o presente</legend>
      <div className="grid gap-3 md:grid-cols-3">
        {offers.map((offer) => {
          const a = availability?.[offer.id];
          const available = Boolean(a?.available);
          const checked = selected === offer.id;
          const s = computeSummary(offer, 1);
          return (
            <label
              key={offer.id}
              data-offer={offer.id}
              className={`group relative flex cursor-pointer flex-row overflow-hidden md:flex-col rounded-[var(--radius-md)] border bg-ink-900 transition-[border-color,box-shadow] duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--gift-accent)] ${
                checked ? "border-[var(--gift-accent)]/80 shadow-[0_0_0_1px_rgba(212,252,60,.2)]" : "border-white/10 hover:border-white/25"
              } ${!available && !loading ? "cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name="kit"
                value={offer.id}
                checked={checked}
                disabled={loading || !available}
                onChange={() => onSelect(offer.id)}
                className="sr-only"
                aria-describedby={`kit-${offer.id}-status`}
              />
              <div className="relative w-[34%] max-w-[150px] flex-none overflow-hidden bg-ink-800 md:aspect-[4/3.4] md:w-auto md:max-w-none">
                <Image
                  src={offer.image.src}
                  alt={offer.image.alt}
                  fill
                  sizes="(min-width: 768px) 30vw, 150px"
                  className={`object-cover object-[50%_30%] ${available || loading ? "" : "opacity-50 grayscale-[60%]"}`}
                />
                <span
                  aria-hidden
                  className={`absolute left-3 top-3 flex h-6 w-6 md:left-auto md:right-3 items-center justify-center rounded-full border ${
                    checked ? "border-transparent bg-[var(--gift-accent)]" : "border-white/40 bg-ink-950/50"
                  }`}
                >
                  {checked && <span className="h-2 w-2 rounded-full bg-ink-950" />}
                </span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-4 md:gap-3 md:p-5">
                <span className="font-display text-[19px] md:text-[22px] font-medium leading-tight tracking-[-0.02em] text-paper-0">{offer.name}</span>
                <dl className="m-0 grid grid-cols-2 gap-x-3 gap-y-1 text-[12px] md:gap-y-1.5 md:text-[13px]">
                  <dt className="text-paper-0/50">Frascos</dt>
                  <dd className="m-0 text-right font-mono text-paper-0">{offer.units} × 60 ml</dd>
                  <dt className="text-paper-0/50">Preço</dt>
                  <dd className="m-0 text-right font-mono text-paper-0">{offer.price}</dd>
                  <dt className="text-paper-0/50">Por frasco</dt>
                  <dd className="m-0 text-right font-mono text-paper-0">{offer.perUnit}</dd>
                  <dt className="text-paper-0/50">Economia</dt>
                  <dd className="m-0 text-right font-mono text-paper-0">{s.discount > 0 ? fmt(s.discount) : "—"}</dd>
                </dl>
                <span id={`kit-${offer.id}-status`} className="mt-auto flex items-center gap-2 pt-1 text-[12px] text-paper-0/60">
                  {loading ? (
                    <>
                      <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/40" />
                      Verificando disponibilidade…
                    </>
                  ) : available ? (
                    <>
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--gift-accent)]" />
                      Disponível
                    </>
                  ) : (
                    <>
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white/30" />
                      {a?.reason ? REASON_LABEL[a.reason] : "Indisponível"}
                    </>
                  )}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
