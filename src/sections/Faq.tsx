import { useState } from 'react';
import { ArrowLink, Icon, RevealText } from '../ds';
import { FAQ, WHATSAPP_URL } from '../lib/content';
import { useWide } from '../lib/store';
import { caps, ghostDark, sectionWrap } from '../lib/styles';

export function Faq() {
  const wide = useWide();
  const [open, setOpen] = useState(0);
  return (
    <section
      id="faq"
      data-screen-label="FAQ"
      style={{ scrollMarginTop: 60, padding: '0 var(--gutter) var(--section-y)', ...sectionWrap, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,360px),1fr))', gap: 'clamp(32px,5vw,80px)', alignItems: 'start' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: wide ? 'sticky' : 'relative', top: 110 }}>
        <span style={caps()}>FAQ · {String(FAQ.length).padStart(2, '0')} perguntas</span>
        <div style={{ fontSize: 'var(--fs-display-l)' }}>
          <RevealText as="h2" text="Perguntas" lineStyle={ghostDark} />
          <RevealText as="div" text="frequentes." delay={120} />
        </div>
        <p style={{ margin: 0, maxWidth: 360, fontSize: 15, lineHeight: 1.5, color: 'var(--text-secondary)' }}>Não encontrou o que procura? A gente responde rápido no WhatsApp.</p>
        <ArrowLink tone="dark" href={WHATSAPP_URL} target="_blank" rel="noopener" style={{ alignSelf: 'flex-start' }}>
          Falar no WhatsApp
        </ArrowLink>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {FAQ.map(([q, a], i) => {
          const on = open === i;
          return (
            <div
              key={q}
              style={{
                borderRadius: 'var(--radius-md)',
                background: on ? 'var(--ink-950)' : 'var(--paper-0)',
                color: on ? 'var(--paper-0)' : 'var(--ink-950)',
                border: `1px solid ${on ? 'var(--ink-950)' : 'var(--border-subtle)'}`,
                overflow: 'hidden',
                transition: 'background .6s var(--ease-out),color .6s var(--ease-out),border-color .6s',
              }}
            >
              <button
                type="button"
                className="h-faq"
                aria-expanded={on}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(on ? -1 : i)}
                style={{ width: '100%', border: 0, background: 'transparent', padding: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 18, textAlign: 'left', color: 'inherit', fontFamily: 'var(--font-text)', transition: 'padding .5s var(--ease-out)' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.55, flex: 'none' }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontVariationSettings: "'wdth' 100", fontWeight: 500, fontSize: 'clamp(18px,1.6vw,22px)', letterSpacing: '-.02em', lineHeight: 1.2 }}>{q}</span>
                <span
                  style={{
                    flex: 'none',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: on ? 'var(--signal-400)' : 'var(--paper-100)',
                    color: 'var(--ink-950)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `rotate(${on ? 135 : 0}deg)`,
                    transition: 'transform .7s var(--ease-out),background .5s',
                  }}
                >
                  <Icon name="plus" size={16} />
                </span>
              </button>
              <div id={`faq-${i}`} role="region" style={{ display: 'grid', gridTemplateRows: on ? '1fr' : '0fr', transition: 'grid-template-rows .7s var(--ease-out)' }}>
                <div style={{ overflow: 'hidden' }}>
                  <p
                    style={{
                      margin: 0,
                      padding: '0 72px 24px 56px',
                      fontSize: 15,
                      lineHeight: 1.6,
                      opacity: on ? 1 : 0,
                      transform: `translateY(${on ? 0 : -8}px)`,
                      transition: 'opacity .6s var(--ease-out) .1s,transform .7s var(--ease-out) .1s',
                    }}
                  >
                    {a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
