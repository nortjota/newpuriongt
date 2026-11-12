"use client";

import { useCallback, useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { AlertCircle, Check, MessageCircle, RotateCcw } from "lucide-react";
import { usePurion } from "@/lib/store/PurionProvider";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";
import type { GiftOffer } from "@/lib/gift/catalog";
import { toAnalyticsItem } from "@/lib/gift/catalog";
import type { AvailabilityResponse, KitAvailability } from "@/lib/gift/kits-service";
import { computeSummary, type PriceSummary } from "@/lib/gift/pricing";
import {
  DEDICATION_MAX,
  DESIRED_DATE_MAX_DAYS,
  KIT_OCCASIONS,
  RECIPIENT_NAME_MAX,
  charLength,
  type DeliveryMode,
  type KitOccasionId,
} from "@/lib/gift/personalization";
import { captureTracking, readStoredTracking } from "@/lib/tracking/utm";
import { track } from "@/lib/analytics/events";
import { GiftButton } from "../GiftButton";
import KitComparator from "./KitComparator";
import KitOrderSummary from "./KitOrderSummary";
import QuantityStepper from "./QuantityStepper";

type Load = { state: "loading" } | { state: "error" } | { state: "ready"; data: AvailabilityResponse };
type Submit =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "error"; code: string; message: string; fieldErrors: Record<string, string> }
  | { state: "done"; reference: string | null; summary: PriceSummary };

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

const fieldClass =
  "w-full rounded-[var(--radius-sm)] border border-white/12 bg-white/[0.04] px-4 py-3 text-[15px] text-paper-0 placeholder:text-paper-0/35 transition-colors focus:border-[var(--gift-accent)]/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gift-accent)]/40 disabled:opacity-40 aria-[invalid=true]:border-red-400/70";
const legendClass = "mb-4 text-[11px] uppercase tracking-[var(--ls-caps)] text-paper-0/55";

export default function KitBuilder({ offers }: { offers: GiftOffer[] }) {
  const id = useId();
  const { replaceCart } = usePurion();
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [selected, setSelected] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [occasion, setOccasion] = useState<KitOccasionId | null>(null);
  const [delivery, setDelivery] = useState<DeliveryMode>("comprador");
  const [recipient, setRecipient] = useState("");
  const [dedication, setDedication] = useState("");
  const [desiredDate, setDesiredDate] = useState("");
  const [submit, setSubmit] = useState<Submit>({ state: "idle" });

  const fetchAvailability = useCallback(async () => {
    setLoad({ state: "loading" });
    try {
      const res = await fetch("/api/gift/kits/availability", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as AvailabilityResponse;
      setLoad({ state: "ready", data });
    } catch {
      setLoad({ state: "error" });
    }
  }, []);

  useEffect(() => {
    captureTracking(window.location.search, window.location.pathname);
    // Busca inicial de dado externo (API) — padrão de "fetch on mount".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchAvailability();
  }, [fetchAvailability]);

  const availability = useMemo(() => {
    if (load.state !== "ready") return null;
    return Object.fromEntries(load.data.kits.map((k) => [k.offerId, k])) as Record<string, KitAvailability>;
  }, [load]);

  // Seleção padrão: Duo se disponível, senão a primeira disponível. Se a
  // escolhida ficar indisponível (nova consulta), troca automaticamente.
  const effectiveSelected = useMemo(() => {
    if (!availability) return selected;
    if (selected && availability[selected]?.available) return selected;
    const pref = ["duo", "individual", "trio"].find((o) => availability[o]?.available);
    return pref ?? null;
  }, [availability, selected]);

  const offer = offers.find((o) => o.id === effectiveSelected) ?? null;
  const maxQty = (effectiveSelected && availability?.[effectiveSelected]?.maxQuantity) || 1;
  const qty = Math.min(quantity, maxQty);
  const summary = offer ? computeSummary(offer, qty) : null;
  const personalizationEnabled = load.state === "ready" && load.data.personalizationEnabled;
  const anyAvailable = availability ? Object.values(availability).some((a) => a.available) : false;
  const today = new Date();
  const minDate = isoDate(new Date(today.getTime() + 86_400_000));
  const maxDate = isoDate(new Date(today.getTime() + DESIRED_DATE_MAX_DAYS * 86_400_000));
  const fieldErrors = submit.state === "error" ? submit.fieldErrors : {};
  const dedicationLength = charLength(dedication);

  async function send(withPersonalization: boolean) {
    if (!offer) return;
    setSubmit({ state: "submitting" });
    const body = {
      offerId: offer.id,
      quantity: qty,
      ...(withPersonalization
        ? {
            occasion,
            deliveryMode: delivery,
            dedication: dedication.trim() || null,
            recipientFirstName: delivery === "presenteado" ? recipient.trim() || null : null,
            desiredDate: desiredDate || null,
          }
        : {}),
      tracking: readStoredTracking(),
    };
    try {
      const res = await fetch("/api/gift/kits/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errs: Record<string, string> = {};
        for (const e of (json.errors ?? []) as { field: string; message: string }[]) errs[e.field] = e.message;
        setSubmit({ state: "error", code: json.code ?? "server_error", message: json.message ?? "Não foi possível adicionar agora.", fieldErrors: errs });
        if (res.status === 409) void fetchAvailability();
        return;
      }
      // Valores do SERVIDOR são os que valem daqui em diante.
      replaceCart(json.planId, { giftRef: json.reference });
      track({
        name: "add_to_cart",
        params: { currency: "BRL", value: json.summary.total, items: [{ ...toAnalyticsItem(offer, "PURION GIFT · Kits"), quantity: json.quantity }], occasion: occasion ?? undefined },
      });
      setSubmit({ state: "done", reference: json.reference, summary: json.summary });
    } catch {
      setSubmit({ state: "error", code: "network", message: "Sem conexão com o servidor. Verifique sua internet e tente de novo.", fieldErrors: {} });
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(personalizationEnabled);
  }

  // ── Estados de página ─────────────────────────────────────────
  if (load.state === "error") {
    return (
      <div role="alert" className="flex flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-white/10 bg-ink-900 p-8">
        <AlertCircle size={22} className="text-paper-0/70" aria-hidden />
        <p className="m-0 font-display text-[22px] font-medium text-paper-0">Não conseguimos verificar a disponibilidade agora.</p>
        <p className="m-0 text-[15px] text-paper-0/60">Para não oferecer algo que não podemos enviar, os presentes ficam ocultos até a verificação funcionar.</p>
        <div className="flex flex-wrap gap-3">
          <GiftButton variant="light" onClick={() => void fetchAvailability()}>
            <RotateCcw size={15} aria-hidden />
            Tentar novamente
          </GiftButton>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-medium text-paper-0">
            <MessageCircle size={15} aria-hidden />
            Falar no WhatsApp
          </a>
        </div>
      </div>
    );
  }

  if (load.state === "ready" && !anyAvailable) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-white/10 bg-ink-900 p-8">
        <p className="m-0 font-display text-[22px] font-medium text-paper-0">Nenhum kit disponível no momento.</p>
        <p className="m-0 text-[15px] text-paper-0/60">Estamos repondo o estoque. Fale com a gente para presentear hoje mesmo.</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-medium text-paper-0">
          <MessageCircle size={15} aria-hidden />
          Falar no WhatsApp
        </a>
      </div>
    );
  }

  const disabledPersonalization = !personalizationEnabled;

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={load.state === "loading"} className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
      <div className="flex min-w-0 flex-col gap-12">
        <KitComparator
          offers={offers}
          availability={availability}
          loading={load.state === "loading"}
          selected={effectiveSelected}
          onSelect={(v) => {
            setSelected(v);
            setSubmit({ state: "idle" });
          }}
        />

        <fieldset className="m-0 border-0 p-0">
          <legend className={legendClass}>2 · Quantidade</legend>
          <QuantityStepper value={qty} max={maxQty} onChange={setQuantity} disabled={!offer} />
        </fieldset>

        {disabledPersonalization && load.state === "ready" && (
          <p role="note" className="m-0 rounded-[var(--radius-md)] border border-white/10 bg-white/[0.03] p-4 text-[14px] leading-relaxed text-paper-0/65">
            A personalização (ocasião, dedicatória, entrega ao presenteado e data desejada) está temporariamente indisponível. Você já pode
            escolher e comprar seu presente — e, no checkout, informar o endereço de quem vai receber.
          </p>
        )}

        <fieldset className="m-0 border-0 p-0" disabled={disabledPersonalization}>
          <legend className={legendClass}>3 · Ocasião <span className="normal-case tracking-normal text-paper-0/35">(opcional)</span></legend>
          <div className="flex flex-wrap gap-2">
            {KIT_OCCASIONS.map((o) => {
              const active = occasion === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setOccasion(active ? null : o.id)}
                  className={`min-h-11 rounded-full border px-4 text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--gift-accent)] disabled:opacity-40 ${
                    active ? "border-transparent bg-paper-0 text-ink-950" : "border-white/15 text-paper-0/80 hover:border-white/40"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="m-0 border-0 p-0" disabled={disabledPersonalization}>
          <legend className={legendClass}>4 · Entrega</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ["comprador", "Entregar para mim", "Você recebe e entrega o presente pessoalmente."],
                ["presenteado", "Entregar ao presenteado", "No checkout, informe o endereço de quem vai receber."],
              ] as const
            ).map(([value, label, hint]) => (
              <label
                key={value}
                className={`flex cursor-pointer gap-3 rounded-[var(--radius-md)] border p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--gift-accent)] ${
                  delivery === value ? "border-[var(--gift-accent)]/70 bg-white/[0.05]" : "border-white/12"
                }`}
              >
                <input type="radio" name="delivery" value={value} checked={delivery === value} onChange={() => setDelivery(value)} className="mt-1 accent-[#D4FC3C]" />
                <span className="flex flex-col gap-1">
                  <span className="text-[15px] text-paper-0">{label}</span>
                  <span className="text-[13px] text-paper-0/55">{hint}</span>
                </span>
              </label>
            ))}
          </div>
          {delivery === "presenteado" && (
            <label htmlFor={`${id}-recipient`} className="mt-4 flex flex-col gap-1.5 text-[13px] text-paper-0/60">
              Primeiro nome de quem recebe (opcional)
              <input
                id={`${id}-recipient`}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                maxLength={RECIPIENT_NAME_MAX}
                autoComplete="off"
                aria-invalid={Boolean(fieldErrors.recipientFirstName)}
                className={fieldClass}
              />
              {fieldErrors.recipientFirstName && <span className="text-red-300">{fieldErrors.recipientFirstName}</span>}
            </label>
          )}
        </fieldset>

        <fieldset className="m-0 border-0 p-0" disabled={disabledPersonalization}>
          <legend className={legendClass}>5 · Dedicatória <span className="normal-case tracking-normal text-paper-0/35">(opcional)</span></legend>
          <textarea
            id={`${id}-dedication`}
            aria-label="Dedicatória"
            value={dedication}
            onChange={(e) => setDedication(Array.from(e.target.value).slice(0, DEDICATION_MAX).join(""))}
            rows={4}
            aria-describedby={`${id}-dedication-help ${id}-dedication-count`}
            aria-invalid={Boolean(fieldErrors.dedication)}
            placeholder="Para você, que cuida do carro como cuida de quem ama…"
            className={`${fieldClass} resize-none leading-relaxed`}
          />
          <div className="mt-2 flex items-start justify-between gap-4 text-[12px]">
            <span id={`${id}-dedication-help`} className="text-paper-0/45">
              Fica registrada no pedido e visível para a equipe de expedição. Ainda não há cartão impresso nem embalagem especial.
            </span>
            <span id={`${id}-dedication-count`} className="flex-none font-mono text-paper-0/45">
              {dedicationLength}/{DEDICATION_MAX}
            </span>
          </div>
          {fieldErrors.dedication && <p className="m-0 mt-2 text-[13px] text-red-300">{fieldErrors.dedication}</p>}
        </fieldset>

        <fieldset className="m-0 border-0 p-0" disabled={disabledPersonalization}>
          <legend className={legendClass}>6 · Data desejada de recebimento <span className="normal-case tracking-normal text-paper-0/35">(opcional)</span></legend>
          <input
            type="date"
            aria-label="Data desejada de recebimento"
            value={desiredDate}
            min={minDate}
            max={maxDate}
            onChange={(e) => setDesiredDate(e.target.value)}
            aria-describedby={`${id}-date-help`}
            aria-invalid={Boolean(fieldErrors.desiredDate)}
            className={`${fieldClass} max-w-[240px] [color-scheme:dark]`}
          />
          <p id={`${id}-date-help`} className="m-0 mt-2 text-[12px] text-paper-0/45">
            É uma preferência registrada para a nossa equipe — não garante a entrega nesse dia. O prazo real aparece no checkout pelo CEP.
          </p>
          {fieldErrors.desiredDate && <p className="m-0 mt-2 text-[13px] text-red-300">{fieldErrors.desiredDate}</p>}
        </fieldset>
      </div>

      <aside aria-label="Resumo do presente" className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex flex-col gap-6 rounded-[var(--radius-lg)] border border-white/10 bg-ink-900 p-6 sm:p-7">
          <h2 className="m-0 font-display text-[22px] font-medium tracking-[-0.02em] text-paper-0">Resumo</h2>
          {load.state === "loading" ? (
            <div className="flex flex-col gap-3" aria-hidden>
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-white/10" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/10" />
              <div className="h-8 w-2/3 animate-pulse rounded-full bg-white/10" />
            </div>
          ) : (
            <KitOrderSummary name={offer?.name ?? null} summary={summary} />
          )}

          <GiftButton type="submit" variant="accent" className="w-full" disabled={!offer || load.state !== "ready" || submit.state === "submitting"}>
            {submit.state === "submitting" ? "Adicionando…" : "Adicionar ao carrinho"}
          </GiftButton>

          <div aria-live="assertive" className="empty:hidden">
            {submit.state === "error" && (
              <div role="alert" className="flex flex-col gap-3 rounded-[var(--radius-sm)] border border-red-300/30 bg-red-400/[0.06] p-4 text-[14px] text-paper-0/85">
                <span>{submit.message}</span>
                {submit.code === "personalization_unavailable" && (
                  <button type="button" onClick={() => void send(false)} className="self-start text-[13px] underline underline-offset-4">
                    Adicionar sem personalização
                  </button>
                )}
              </div>
            )}
            {submit.state === "done" && (
              <div role="status" className="flex gap-3 rounded-[var(--radius-sm)] border border-white/10 bg-white/[0.04] p-4 text-[14px] text-paper-0/85">
                <Check size={16} className="mt-0.5 flex-none text-[var(--gift-accent)]" aria-hidden />
                <span>
                  Presente no carrinho. Finalize no checkout para criar o pedido.
                  {submit.reference && (
                    <span className="mt-1 block text-[13px] text-paper-0/60">
                      Referência da personalização: <span className="font-mono text-paper-0">{submit.reference}</span>
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>

          <p className="m-0 text-[12px] leading-relaxed text-paper-0/45">
            Adicionar ao carrinho não cria pedido nem cobra nada. Preço e disponibilidade são confirmados no servidor; o pagamento acontece no checkout seguro.
          </p>
        </div>
      </aside>
    </form>
  );
}
