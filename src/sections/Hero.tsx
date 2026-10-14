import { useEffect, useRef } from 'react';
import { Icon, Marquee } from '../ds';
import { MARQUEE } from '../lib/content';
import { prefersReducedMotion, useWide } from '../lib/store';

export function Hero() {
  const wide = useWide();
  const img = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (img.current && y < window.innerHeight * 1.5) img.current.style.transform = `translate3d(0,${y * 0.2}px,0)`;
      });
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => {
      window.removeEventListener('scroll', on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <section
        data-screen-label="Hero"
        // Explicit width keeps min-height from widening the box past the viewport on phones.
        style={{ position: 'relative', margin: 10, width: 'calc(100% - 20px)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--ink-900)', aspectRatio: '1672/941', minHeight: 420 }}
      >
        <div ref={img} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'center/cover url(/assets/hero-banner.png)', animation: 'pg-scale-in 2.2s var(--ease-out)' }} />
          {/* Click target over the "Conheça" button painted into the banner artwork */}
          <a href="#comprar" aria-label="Conheça o Purion GT" style={{ position: 'absolute', left: '5.2%', top: '56.6%', width: '16.8%', height: '7%', borderRadius: 'var(--radius-pill)' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--scrim-top)', pointerEvents: 'none' }} />
        {wide && (
          <div
            style={{
              position: 'absolute',
              right: 'var(--gutter)',
              bottom: 'var(--gutter)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--surface-glass-dark)',
              border: '1px solid var(--border-glass)',
              backdropFilter: 'var(--glass-blur)',
              WebkitBackdropFilter: 'var(--glass-blur)',
              fontSize: 13,
              color: 'var(--paper-0)',
              animation: 'pg-fade-up 1s var(--ease-out) 1.1s both',
            }}
          >
            <Icon name="star" size={14} />
            <span style={{ fontFamily: 'var(--font-mono)' }}>4.9</span>
            <span style={{ opacity: 0.8 }}>· 100+ avaliações verificadas</span>
          </div>
        )}
      </section>
      <div style={{ padding: '26px 0' }}>
        <Marquee items={MARQUEE} size={40} />
      </div>
    </>
  );
}
