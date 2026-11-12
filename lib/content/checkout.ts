"use client";

import { useEffect, useState } from "react";
import { getStoredReferral } from "@/lib/referral";
import { usePurion } from "@/lib/store/PurionProvider";
import { readStoredTracking } from "@/lib/tracking/utm";
import { baseCheckoutUrl, buildCheckoutUrl } from "./checkout-links";

export { CHECKOUT_URL } from "./checkout-links";

// Link de checkout do plano atualmente selecionado (ver PurionProvider), com
// ?ref=<slug> anexado quando a visita veio de um link de afiliado (ver
// lib/referral.ts). Só resolve o referral depois de montar no cliente
// (localStorage não existe no SSR), então o primeiro render usa o link base
// e atualiza em seguida.
export function useCheckoutUrl(): string {
  const { plan, state } = usePurion();
  const base = baseCheckoutUrl(plan.id);
  const [url, setUrl] = useState(base);

  useEffect(() => {
    // Leitura de localStorage só existe no cliente — por isso o efeito.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(
      buildCheckoutUrl(plan.id, {
        referralSlug: getStoredReferral()?.slug,
        tracking: readStoredTracking(),
        giftRef: state.giftRef,
      })
    );
    // Recalcula também ao abrir o carrinho: a origem de campanha pode ter
    // sido capturada depois da montagem deste hook.
  }, [base, plan.id, state.cartOpen, state.giftRef]);

  return url;
}
