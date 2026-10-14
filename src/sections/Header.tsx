import { useEffect, useState } from 'react';
import { ArrowLink, Button } from '../ds';
import { WHATSAPP_URL } from '../lib/content';
import { scrollToId, useShop, useWide } from '../lib/store';

const LINKS: [string, string][] = [
  ['#fragrancia', 'Fragrância'],
  ['#comparativo', 'Comparativo'],
  ['#quiz', 'Quiz'],
  ['#videos', 'Vídeos'],
  ['#avaliacoes', 'Avaliações'],
  ['#faq', 'FAQ'],
];

export function Header() {
  const wide = useWide();
  const { cart } = useShop();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const hdr = scrolled
    ? { color: 'var(--ink-950)', bg: 'rgba(247,246,242,.8)', blur: 'blur(16px) saturate(140%)', border: 'var(--border-subtle)', logoFilter: 'brightness(0)', linkTone: 'dark' as const, btn: 'primary' as const }
    : { color: 'var(--paper-0)', bg: 'transparent', blur: 'none', border: 'transparent', logoFilter: 'none', linkTone: 'light' as const, btn: 'glass' as const };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '12px calc(var(--gutter) + 10px)',
        color: hdr.color,
        background: hdr.bg,
        backdropFilter: hdr.blur,
        WebkitBackdropFilter: hdr.blur,
        borderBottom: `1px solid ${hdr.border}`,
        transition: 'background var(--dur-slow) var(--ease-out),color var(--dur-slow) var(--ease-out)',
      }}
    >
      <nav style={{ display: 'flex', gap: 26, fontSize: 13, fontWeight: 500 }}>
        {wide &&
          LINKS.map(([href, label]) => (
            <a key={href} href={href} style={{ color: 'inherit', opacity: 0.86 }}>
              {label}
            </a>
          ))}
      </nav>
      <a href="#topo" style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'inherit' }}>
        <img src="/assets/logo-mark.png" alt="PURION GT" style={{ height: 42, filter: hdr.logoFilter, transition: 'filter var(--dur-slow)' }} />
      </a>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 14 }}>
        {wide && (
          <ArrowLink tone={hdr.linkTone} size="sm" href={WHATSAPP_URL} target="_blank" rel="noopener">
            WhatsApp
          </ArrowLink>
        )}
        <Button variant={hdr.btn} size="sm" iconLeft="shopping-bag" onClick={() => scrollToId('comprar')}>
          Sacola · {cart}
        </Button>
      </div>
    </header>
  );
}
