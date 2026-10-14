import { useRef, useState } from 'react';
import { Badge, Button, Icon, Stepper } from '../ds';
import { SEALS } from '../lib/content';
import { prefersReducedMotion, usePlanOptions, useShop, useWide } from '../lib/store';
import { caps, display, mono, sectionWrap } from '../lib/styles';
import { FrequencyPicker } from './QuickBuy';

/** Mist burst from the bottle nozzle, drawn with the Web Animations API. */
function sprayAt(tile: HTMLElement) {
  const tr = tile.getBoundingClientRect();
  const x = tr.width / 2;
  const y = tr.height * 0.13;
  for (let i = 0; i < 16; i++) {
    const d = document.createElement('span');
    const sz = 6 + Math.random() * 18;
    d.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;margin:-${sz / 2}px;border-radius:50%;background:rgba(159,196,209,.75);pointer-events:none;filter:blur(${sz / 6}px)`;
    tile.appendChild(d);
    const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
    const dist = 80 + Math.random() * 180;
    d.animate(
      [
        { transform: 'translate(0,0) scale(.4)', opacity: 0.9 },
        { transform: `translate(${Math.cos(ang) * dist}px,${Math.sin(ang) * dist}px) scale(2.4)`, opacity: 0 },
      ],
      { duration: 1200 + Math.random() * 900, easing: 'cubic-bezier(.16,1,.3,1)' },
    ).onfinish = () => d.remove();
  }
  const ring = document.createElement('span');
  ring.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:40px;height:40px;margin:-20px;border-radius:50%;border:1px solid rgba(40,80,93,.4);pointer-events:none`;
  tile.appendChild(ring);
  ring.animate(
    [
      { transform: 'scale(.3)', opacity: 1 },
      { transform: 'scale(9)', opacity: 0 },
    ],
    { duration: 1600, easing: 'cubic-bezier(.16,1,.3,1)' },
  ).onfinish = () => ring.remove();
}

export function Offer() {
  const wide = useWide();
  const shop = useShop();
  const plans = usePlanOptions();
  const tile = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const [sprays, setSprays] = useState(700);

  const spray = () => {
    if (sprays <= 0) return;
    setSprays((s) => s - 1);
    if (tile.current) sprayAt(tile.current);
  };

  return (
    <section
      id="comprar"
      data-screen-label="Oferta"
      style={{ scrollMarginTop: 60, padding: '0 var(--gutter) var(--section-y)', ...sectionWrap, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,440px),1fr))', gap: 'clamp(28px,4vw,64px)', alignItems: 'start' }}
    >
      <div
        ref={tile}
        role="button"
        tabIndex={0}
        aria-label="Borrifar"
        onClick={spray}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), spray())}
        onMouseMove={(e) => {
          if (prefersReducedMotion() || !img.current) return;
          const r = e.currentTarget.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          img.current.style.transform = `scale(1.08) translate3d(${-px * 18}px,${-py * 12}px,0)`;
        }}
        onMouseLeave={() => img.current && (img.current.style.transform = '')}
        // Sticky only beside the panel; stacked on phones it would cover the plan options.
        style={{ position: wide ? 'sticky' : 'relative', top: 84, height: 'clamp(480px,62vw,720px)', borderRadius: 'var(--radius-xl)', background: 'var(--paper-100)', overflow: 'hidden', cursor: 'pointer' }}
      >
        <img ref={img} src="assets/product-studio.png" alt="Purion GT 60 ml" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.04)', transition: 'transform 1.1s var(--ease-out)', willChange: 'transform' }} />
        <div style={{ position: 'absolute', left: 22, top: 22, display: 'flex', gap: 8 }}>
          <Badge tone="ink">35% off</Badge>
        </div>
        <div style={{ position: 'absolute', left: 22, right: 22, bottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, color: 'var(--ink-600)' }}>
          <span style={{ fontSize: 13, lineHeight: 1.35 }}>
            Toque no frasco
            <br />
            para borrifar
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <span style={{ ...mono(28, 'var(--ink-950)'), letterSpacing: '-.02em' }}>{String(sprays).padStart(3, '0')}</span>
            <span style={{ fontSize: 11, letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase' }}>borrifadas restantes</span>
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 580 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={caps()}>Auto parfum · 60 ml · 2.0 fl oz</span>
          <h2 style={{ margin: 0, ...display('var(--fs-display-l)', 'var(--ls-display)', 'var(--lh-display)') }}>Purion GT</h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--text-secondary)' }}>Frasco de vidro premium, liberação controlada e alta fixação. A diferença que você pode cheirar.</p>
        </div>

        <div role="radiogroup" aria-label="Como você quer o seu" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={caps()}>Como você quer o seu</span>
          {plans.map((pl) => (
            <button
              key={pl.id}
              type="button"
              role="radio"
              aria-checked={pl.on}
              onClick={pl.pick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 18px',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${pl.on ? 'var(--ink-950)' : 'var(--border-strong)'}`,
                background: pl.on ? 'var(--paper-0)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'var(--font-text)',
                color: 'var(--ink-950)',
                transition: 'border-color .3s,background .3s',
              }}
            >
              <span style={{ width: 20, height: 20, borderRadius: '50%', border: `1.5px solid ${pl.on ? 'var(--ink-950)' : 'var(--border-strong)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', boxSizing: 'border-box' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: pl.on ? 'var(--ink-950)' : 'transparent', transition: 'background .3s' }} />
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, fontSize: 15 }}>
                  {pl.t}
                  {pl.badge && <Badge tone={pl.badgeTone}>{pl.badge}</Badge>}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{pl.d}</span>
              </span>
              <span style={mono(15)}>{pl.price}</span>
            </button>
          ))}
          {shop.isSub && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '6px 4px 0', animation: 'pg-fade-up .5s var(--ease-out) both' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Receber a cada</span>
              <FrequencyPicker />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Pause ou cancele quando quiser.</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '20px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ ...mono(44), letterSpacing: '-.04em' }}>{shop.price}</span>
            <span style={{ ...mono(15, 'var(--text-muted)'), textDecoration: 'line-through' }}>{shop.oldPrice}</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{shop.priceNote}</span>
          </div>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            ou até 3× de <span style={{ fontFamily: 'var(--font-mono)' }}>{shop.inst}</span> sem juros
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {shop.showQty && <Stepper value={shop.qty} min={1} max={10} onChange={shop.setQty} />}
          <div style={{ flex: 1, minWidth: 220 }}>
            <Button variant="accent" size="lg" full iconRight="arrow-up-right" onClick={shop.addCart}>
              {shop.ctaLabel}
            </Button>
          </div>
        </div>
        <Button variant="primary" size="lg" full onClick={shop.buyNow}>
          Comprar agora
        </Button>
        <a href="#quiz" style={{ alignSelf: 'flex-start', fontSize: 14, color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Icon name="sparkles" size={16} />
          <span>
            Não tem certeza? <u style={{ textUnderlineOffset: 3, color: 'var(--ink-950)' }}>Descubra seu perfil olfativo em 30s</u>
          </span>
        </a>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '14px 20px', paddingTop: 8 }}>
          {SEALS.map((sl) => (
            <div key={sl.t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, lineHeight: 1.35 }}>
              <Icon name={sl.i} size={16} />
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 500 }}>{sl.t}</span>
                <span style={{ color: 'var(--text-muted)' }}>{sl.d}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
