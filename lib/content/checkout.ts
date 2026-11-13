"use client";

import { useEffect, useState } from "react";
import { getTracking } from "@/lib/tracking";
import { usePurion } from "@/lib/store/PurionProvider";
import { readStoredTracking, type TrackingParams } from "@/lib/tracking/utm";
import { baseCheckoutUrl, buildCheckoutUrl } from "./checkout-links";

export { CHECKOUT_URL } from "./checkout-links";

// Link de checkout do plano atualmente selecionado (ver PurionProvider).
// Origem até o checkout (regra do PURION OS, lib/tracking.ts):
//   • ref = afiliado; utm_* = campanha (primeiro toque com UTM, 30 dias);
//   • utm_content recebe o afiliado quando não há outro valor — é o campo que
//     o webhook do CRM usa para atribuir a venda ao parceiro.
// Complementos: gclid/fbclid guardados pela /presentes e a referência da
// personalização de presente (gift_ref). Só resolve no cliente
// (localStorage não existe no SSR): o primeiro render usa o link base.
export function useCheckoutUrl(): string {
  const { plan, state } = usePurion();
  const base = baseCheckoutUrl(plan.id);
  const [url, setUrl] = useState(base);

  useEffect(() => {
    const { utm, ref } = getTracking();
    const tracking: TrackingParams = {};
    for (const [k, v] of Object.entries(utm)) if (v) tracking[`utm_${k}` as keyof TrackingParams] = v;
    if (ref && !utm.content) tracking.utm_content = ref;
    const extra = readStoredTracking();
    if (extra.gclid) tracking.gclid = extra.gclid;
    if (extra.fbclid) tracking.fbclid = extra.fbclid;
    // Leitura de localStorage só existe no cliente — por isso o efeito.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(buildCheckoutUrl(plan.id, { referralSlug: ref, tracking, giftRef: state.giftRef }));
    // Recalcula também ao abrir o carrinho: a origem pode ter sido capturada
    // depois da montagem deste hook.
  }, [base, plan.id, state.cartOpen, state.giftRef]);

  return url;
}
