import { useRef } from 'react';
import { Button, RevealText } from '../ds';
import { INSTAGRAM_URL, WHATSAPP_URL } from '../lib/content';
import { prefersReducedMotion, scrollToId } from '../lib/store';
import { ghostLight } from '../lib/styles';
import { useScrollFrame } from '../lib/useScrollFrame';

export function FinalCta() {
  const img = useRef<HTMLDivElement>(null);
  useScrollFrame(() => {
    const el = img.current;
    if (!el || prefersReducedMotion()) return;
    const r = el.parentElement!.getBoundingClientRect();
    el.style.transform = `translate3d(0,${(r.top + r.height / 2 - window.innerHeight / 2) * -0.18}px,0)`;
  });
  return (
    <section
      data-screen-label="CTA final"
      style={{ position: 'relative', margin: 10, borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--ink-900)', color: 'var(--paper-0)', padding: 'clamp(100px,14vw,180px) var(--gutter)', textAlign: 'center' }}
    >
      <div ref={img} style={{ position: 'absolute', inset: '-15% 0', background: 'center 70%/cover url(/assets/hero-street.png)', opacity: 0.42, willChange: 'transform' }} />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
        <img src="/assets/logo-mark.png" alt="" style={{ height: 28 }} />
        <div style={{ fontSize: 'var(--fs-display-l)' }}>
          <RevealText as="h2" text="Seu carro nunca mais" lineStyle={ghostLight} />
          <RevealText as="div" delay={120} text="vai cheirar ao mesmo." />
        </div>
        <p style={{ margin: 0, maxWidth: 440, color: 'var(--text-inverse-muted)', fontSize: 15, lineHeight: 1.5 }}>Junte-se a mais de 100 motoristas que elevaram o padrão.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="accent" size="lg" iconRight="arrow-up-right" onClick={() => scrollToId('comprar')}>
            Quero o meu Purion GT
          </Button>
          <Button variant="glass" size="lg" onClick={() => scrollToId('quiz')}>
            Descobrir meu perfil
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer style={{ background: 'var(--ink-950)', color: 'var(--paper-0)', margin: 10, borderRadius: 'var(--radius-lg)', overflow: 'hidden', padding: '64px var(--gutter) 0' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 32, maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 340 }}>
          <img src="/assets/logo-mark.png" alt="PURION GT" style={{ height: 22, alignSelf: 'flex-start' }} />
          <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text-inverse-muted)' }}>Exala presença. Deixa memória.</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, fontSize: 14 }}>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener" style={{ color: 'var(--paper-0)' }}>
            Instagram @puriongt
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener" style={{ color: 'var(--paper-0)' }}>
            WhatsApp
          </a>
          {/* TODO: link the privacy policy and terms pages once they exist */}
          <a href="#" style={{ color: 'var(--text-inverse-muted)' }}>
            Política de Privacidade
          </a>
          <a href="#" style={{ color: 'var(--text-inverse-muted)' }}>
            Termos
          </a>
        </div>
      </div>
      <div style={{ maxWidth: 'var(--content-max)', margin: '40px auto 0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: 12, color: 'var(--text-inverse-muted)', borderTop: '1px solid var(--border-inverse)', paddingTop: 18 }}>
        <span>© {new Date().getFullYear()} Purion GT. Todos os direitos reservados.</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>Feito no Brasil</span>
      </div>
      <div
        aria-hidden="true"
        style={{ fontFamily: 'var(--font-display)', fontVariationSettings: "'wdth' 88", fontWeight: 500, fontSize: 'clamp(120px,24vw,400px)', letterSpacing: '-.07em', lineHeight: 0.78, color: 'var(--ink-800)', textAlign: 'center', whiteSpace: 'nowrap', marginTop: 24, marginBottom: '-.12em' }}
      >
        PURION GT
      </div>
    </footer>
  );
}
