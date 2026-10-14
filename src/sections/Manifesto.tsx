import { useRef } from 'react';
import { RevealText } from '../ds';
import { MANIFESTO_WORDS } from '../lib/content';
import { prefersReducedMotion } from '../lib/store';
import { caps, display, ghostDark, sectionWrap } from '../lib/styles';
import { useScrollFrame } from '../lib/useScrollFrame';

export function Manifesto() {
  const sec = useRef<HTMLElement>(null);
  const tile = useRef<HTMLDivElement>(null);
  const bottle = useRef<HTMLImageElement>(null);

  useScrollFrame(() => {
    const man = sec.current;
    if (!man) return;
    const vh = window.innerHeight;
    const r = man.getBoundingClientRect();
    // Words light up one by one as the section scrolls through the viewport.
    const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height * 0.7)));
    const ws = man.querySelectorAll<HTMLElement>('[data-w]');
    ws.forEach((w, i) => (w.style.color = (i + 1) / ws.length <= p ? 'var(--ink-950)' : 'var(--steel-300)'));
    if (!prefersReducedMotion() && tile.current && bottle.current) {
      const c = r.top + r.height / 2 - vh / 2;
      tile.current.style.transform = `translate3d(0,${c * -0.08}px,0) rotate(${-6 + c * 0.006}deg)`;
      bottle.current.style.transform = `translate3d(0,${c * -0.1}px,0)`;
    }
  });

  return (
    <section
      ref={sec}
      data-screen-label="Manifesto"
      style={{ padding: 'var(--section-y) var(--gutter)', ...sectionWrap, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: 'clamp(40px,6vw,96px)', alignItems: 'center' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...caps() }}>
          <span>Sobre a marca</span>
          <span style={{ flex: 1, height: 1, background: 'var(--border-strong)' }} />
          <span style={{ fontFamily: 'var(--font-mono)' }}>BR</span>
        </div>
        <div style={{ fontSize: 'var(--fs-display-l)' }}>
          <RevealText as="h2" text="Nascemos da" lineStyle={ghostDark} />
          <RevealText as="div" delay={120} text="insatisfação." />
        </div>
        <p style={{ margin: 0, display: 'flex', flexWrap: 'wrap', columnGap: '.26em', ...display('clamp(22px,2.2vw,32px)', '-.02em', 1.22), fontVariationSettings: "'wdth' 100" }}>
          {MANIFESTO_WORDS.map((w, i) => (
            <span key={i} data-w="1" style={{ color: 'var(--steel-300)', transition: 'color .5s var(--ease-out)' }}>
              {w}
            </span>
          ))}
        </p>
        <p data-reveal="1" style={{ margin: 0, maxWidth: 440, fontSize: 15, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          Somos brasileiros, apaixonados por carros e pela ciência das fragrâncias. O Purion GT finalmente está à altura do cuidado que você tem com o seu veículo.
        </p>
      </div>
      <div style={{ position: 'relative', minHeight: 560, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          ref={tile}
          style={{ width: 'min(380px,80%)', aspectRatio: '380/500', borderRadius: 'var(--radius-xl)', background: 'var(--paper-0)', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', willChange: 'transform', transform: 'rotate(-6deg)' }}
        >
          <img ref={bottle} src="assets/bottle.png" alt="Frasco Purion GT" style={{ height: '84%', filter: 'drop-shadow(0 30px 30px rgba(11,12,14,.25))', willChange: 'transform' }} />
        </div>
        <div
          style={{ position: 'absolute', left: 0, bottom: 24, width: 168, height: 168, borderRadius: '50%', background: 'var(--paper-0)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20, gap: 2, boxSizing: 'border-box' }}
        >
          <span style={display(44, '-.05em', 1)}>0%</span>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>resíduo no retrovisor</span>
        </div>
      </div>
    </section>
  );
}
