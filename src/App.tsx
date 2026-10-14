import { useEffect } from 'react';
import { WHATSAPP_URL } from './lib/content';
import { prefersReducedMotion, ShopProvider } from './lib/store';
import { Benefits } from './sections/Benefits';
import { FinalCta, Footer } from './sections/Closing';
import { Compare } from './sections/Compare';
import { DriveScene } from './sections/DriveScene';
import { Faq } from './sections/Faq';
import { EmailPopup, QuizTab, ToastLayer, WhatsAppBubble } from './sections/Floating';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Manifesto } from './sections/Manifesto';
import { Offer } from './sections/Offer';
import { Pyramid } from './sections/Pyramid';
import { QuickBuy } from './sections/QuickBuy';
import { Quiz } from './sections/Quiz';
import { Reviews } from './sections/Reviews';
import { Story } from './sections/Story';
import { Videos } from './sections/Videos';

// TODO: "Comprar agora" opens WhatsApp until a checkout exists.
const buyNow = () => window.open(WHATSAPP_URL, '_blank', 'noopener');

/** Fades `[data-reveal]` blocks up and grows `[data-bar]` bars when they scroll into view. */
function useRevealOnScroll() {
  useEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    let bio: IntersectionObserver | undefined;
    let io: IntersectionObserver | undefined;
    const t = window.setTimeout(() => {
      const vh = window.innerHeight;
      bio = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target as HTMLElement;
            el.style.width = el.dataset.target || '';
            bio!.unobserve(el);
          }),
        { threshold: 0.2 },
      );
      document.querySelectorAll<HTMLElement>('[data-bar]').forEach((el, i) => {
        if (el.getBoundingClientRect().top < vh) return;
        el.style.width = '0';
        el.style.transitionDelay = (i % 9) * 60 + 'ms';
        bio!.observe(el);
      });
      io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target as HTMLElement;
            el.style.opacity = '1';
            el.style.transform = 'none';
            io!.unobserve(el);
          }),
        { threshold: 0.12 },
      );
      let k = 0;
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        if (el.getBoundingClientRect().top < vh) return;
        const d = (k++ % 4) * 70 + 'ms';
        el.style.opacity = '0';
        el.style.transform = 'translate3d(0,24px,0)';
        el.style.transition = `opacity .9s var(--ease-out) ${d}, transform .9s var(--ease-out) ${d}, background .5s`;
        io!.observe(el);
      });
    }, 300);
    return () => {
      window.clearTimeout(t);
      bio?.disconnect();
      io?.disconnect();
    };
  }, []);
}

export function App() {
  useRevealOnScroll();
  return (
    <ShopProvider onBuyNow={buyNow}>
      <Header />
      <main id="topo">
        <Hero />
        <QuickBuy />
        <Manifesto />
        <Benefits />
        <DriveScene />
        <Pyramid />
        <Compare />
        <Quiz />
        <Story />
        <Videos />
        <Reviews />
        <Offer />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <ToastLayer />
      <QuizTab />
      <WhatsAppBubble />
      <EmailPopup />
    </ShopProvider>
  );
}
