import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { LIST_PRICE, PLANS, type PlanId } from './content';

export const fmt = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',');

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' });
}

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True at >= 1140px, where the header shows its links and sticky columns are enabled. */
export function useWide() {
  const q = '(min-width: 1140px)';
  const [wide, setWide] = useState(() => typeof window === 'undefined' || window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setWide(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return wide;
}

type Shop = {
  plan: PlanId;
  setPlan: (p: PlanId) => void;
  freq: number;
  setFreq: (f: number) => void;
  qty: number;
  setQty: (n: number) => void;
  cart: number;
  addCart: () => void;
  buyNow: () => void;
  toast: string;
  showToast: (m: string) => void;
  /** Pyramid layer: 0 = complete, 1..3 = Saída/Corpo/Fundo. Shared so the quiz can preselect it. */
  level: number;
  setLevel: (n: number) => void;
  // derived pricing
  isSub: boolean;
  showQty: boolean;
  units: number;
  price: string;
  oldPrice: string;
  inst: string;
  priceNote: string;
  ctaLabel: string;
};

const ShopCtx = createContext<Shop | null>(null);

export function ShopProvider({ children, onBuyNow }: { children: ReactNode; onBuyNow: () => void }) {
  const [plan, setPlan] = useState<PlanId>('un');
  const [freq, setFreq] = useState(60);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState(0);
  const [toast, setToast] = useState('');
  const [level, setLevel] = useState(0);
  const toastT = useRef<number>();

  const showToast = useCallback((m: string) => {
    window.clearTimeout(toastT.current);
    setToast(m);
    toastT.current = window.setTimeout(() => setToast(''), 2800);
  }, []);
  useEffect(() => () => window.clearTimeout(toastT.current), []);

  const pl = PLANS.find((p) => p.id === plan)!;
  const units = pl.fixed ? pl.units! : qty;
  const total = pl.fixed ?? pl.unit! * qty;
  const isSub = plan === 'sub';

  const addCart = useCallback(() => {
    setCart((c) => c + units);
    showToast(isSub ? 'Assinatura adicionada à sacola' : 'Purion GT adicionado à sacola');
  }, [units, isSub, showToast]);

  const value = useMemo<Shop>(
    () => ({
      plan,
      setPlan,
      freq,
      setFreq,
      qty,
      setQty,
      cart,
      addCart,
      buyNow: onBuyNow,
      toast,
      showToast,
      level,
      setLevel,
      isSub,
      showQty: !!pl.qty,
      units,
      price: fmt(total),
      oldPrice: fmt(LIST_PRICE * units),
      inst: fmt(total / 3),
      priceNote: isSub ? `a cada ${freq} dias` : pl.fixed ? `${units} frascos` : '',
      ctaLabel: isSub ? 'Assinar agora' : 'Adicionar ao carrinho',
    }),
    [plan, freq, qty, cart, addCart, onBuyNow, toast, showToast, level, isSub, pl, units, total],
  );
  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>;
}

export function useShop() {
  const s = useContext(ShopCtx);
  if (!s) throw new Error('useShop must be used inside ShopProvider');
  return s;
}

/** View model for the plan pickers shared by the quick-buy block and the offer section. */
export function usePlanOptions() {
  const { plan, setPlan, freq } = useShop();
  return PLANS.map((p) => {
    const on = p.id === plan;
    const per = p.fixed
      ? `${fmt(p.fixed / p.units!)} por frasco · ${p.d.toLowerCase()}`
      : p.id === 'sub'
        ? `a cada ${freq} dias · ${p.d.split(' · ')[0]}`
        : 'Preço de lançamento · 35% off';
    return {
      ...p,
      on,
      per,
      price: p.fixed ? fmt(p.fixed) : fmt(p.unit!) + (p.id === 'sub' ? '/entrega' : ''),
      badgeTone: on ? ('signal' as const) : (p.bt ?? 'ink'),
      pick: () => setPlan(p.id),
    };
  });
}
