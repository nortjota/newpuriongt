import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Icon, RevealText } from '../ds';
import { COMPARE_ROWS } from '../lib/content';
import { scrollToId } from '../lib/store';
import { caps, display, ghostDark, sectionWrap } from '../lib/styles';

type Mode = 'a' | 'b'; // a = "Cheirinho comum", b = Purion GT

const THEMES = {
  b: { panelBg: 'var(--ink-950)', fg: 'var(--paper-0)', mut: 'var(--text-inverse-muted)', tileBg: 'var(--ink-800)', tileBorder: 'var(--border-inverse)', deco: 'none', icon: 'check', label: 'Purion GT', title: '“Que cheiro é esse?”', sub: 'Vidro colecionável, alta perfumaria e uma fragrância só sua.', track: 'rgba(255,255,255,.1)', accent: 'var(--signal-400)', pct: '98%', btn: 'accent' as const, foot: 'Junte-se a mais de 100 motoristas que elevaram o padrão.' },
  a: { panelBg: 'var(--paper-200)', fg: 'var(--ink-600)', mut: 'var(--steel-500)', tileBg: 'rgba(255,255,255,.45)', tileBorder: 'var(--border-subtle)', deco: 'line-through', icon: 'x', label: 'Cheirinho comum', title: 'Esquecível.', sub: 'Papelão no retrovisor, cheiro artificial e igual a todo carro.', track: 'rgba(11,12,14,.08)', accent: 'var(--steel-400)', pct: '22%', btn: 'primary' as const, foot: 'Evapora em horas. Você compra de novo na semana seguinte.' },
};

export function Compare() {
  const sec = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<Mode>('b');
  const [score, setScore] = useState(98);
  const scoreRef = useRef(98);
  const raf = useRef(0);
  const demoT = useRef<number>();

  const pick = useCallback((m: Mode) => {
    window.clearTimeout(demoT.current);
    setMode(m);
    const from = scoreRef.current;
    const to = m === 'b' ? 98 : 22;
    const t0 = performance.now();
    cancelAnimationFrame(raf.current);
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 1100);
      const e = 1 - Math.pow(1 - k, 4);
      scoreRef.current = Math.round(from + (to - from) * e);
      setScore(scoreRef.current);
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, []);

  // First time the panel is seen: show the common option, then flip to Purion GT.
  useEffect(() => {
    const el = sec.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        pick('a');
        demoT.current = window.setTimeout(() => pick('b'), 1600);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(demoT.current);
      cancelAnimationFrame(raf.current);
    };
  }, [pick]);

  const t = THEMES[mode];
  const on = mode === 'b';

  return (
    <section ref={sec} id="comparativo" data-screen-label="Comparativo" style={{ scrollMarginTop: 60, padding: 'var(--section-y) var(--gutter)', ...sectionWrap }}>
      <div style={{ textAlign: 'center', fontSize: 'var(--fs-display-l)', marginBottom: 40 }}>
        <RevealText as="h2" text="Seu carro diz quem você é." lineStyle={ghostDark} />
        <RevealText as="div" delay={120} text="Qual dos dois quer ser?" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div role="radiogroup" aria-label="Comparar" style={{ display: 'flex', gap: 4, padding: 5, borderRadius: 'var(--radius-pill)', background: 'var(--paper-200)' }}>
          {(
            [
              ['a', 'Cheirinho comum'],
              ['b', 'Purion GT'],
            ] as [Mode, string][]
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => pick(m)}
              style={{
                border: 0,
                cursor: 'pointer',
                padding: '14px 26px',
                borderRadius: 'var(--radius-pill)',
                background: mode === m ? 'var(--ink-950)' : 'transparent',
                color: mode === m ? 'var(--paper-0)' : 'var(--ink-600)',
                fontFamily: 'var(--font-text)',
                fontSize: 15,
                fontWeight: 500,
                transition: 'background .5s var(--ease-out),color .5s var(--ease-out)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Toque e veja a diferença</span>
      </div>

      <div
        style={{ borderRadius: 'var(--radius-xl)', background: t.panelBg, color: t.fg, padding: 'clamp(24px,4vw,56px)', transition: 'background .9s var(--ease-out),color .9s var(--ease-out)', display: 'flex', flexDirection: 'column', gap: 'clamp(28px,4vw,48px)', overflow: 'hidden', position: 'relative' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 560 }}>
            <span style={caps(t.mut)}>{t.label}</span>
            <span style={display('var(--fs-display-l)', 'var(--ls-display)', 0.9)}>{t.title}</span>
            <span style={{ fontSize: 15, lineHeight: 1.5, color: t.mut }}>{t.sub}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 260, flex: '0 1 360px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={caps(t.mut)}>Índice de presença</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: t.mut }}>/ 100</span>
            </div>
            <span style={display('clamp(96px,11vw,168px)', '-.07em', 0.8)}>{score}</span>
            <span style={{ height: 8, borderRadius: 4, background: t.track, overflow: 'hidden', display: 'block' }}>
              <span style={{ display: 'block', height: '100%', width: t.pct, background: t.accent, borderRadius: 4, transition: 'width 1.2s var(--ease-out),background .9s' }} />
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap: 10 }}>
          {COMPARE_ROWS.map(([k, common, purion, commonScore]) => {
            const n = on ? 5 : commonScore;
            return (
              <div
                key={k}
                className="h-lift4"
                style={{ background: t.tileBg, border: `1px solid ${t.tileBorder}`, borderRadius: 'var(--radius-md)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14, transition: 'background .9s var(--ease-out),transform .6s var(--ease-out)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: t.mut }}>{k}</span>
                  <Icon name={t.icon} size={14} />
                </div>
                <span style={{ ...display(24, '-.025em', 1.05), textDecoration: t.deco, textDecorationThickness: 1 }}>{on ? purion : common}</span>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      style={{
                        flex: 1,
                        height: 5,
                        borderRadius: 3,
                        background: i < n ? (on ? 'var(--signal-400)' : 'var(--steel-400)') : on ? 'rgba(255,255,255,.1)' : 'rgba(11,12,14,.08)',
                        transition: `background .6s var(--ease-out) ${i * 80}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, color: t.mut }}>{t.foot}</span>
          <Button variant={t.btn} size="lg" iconRight="arrow-up-right" onClick={() => scrollToId('comprar')}>
            Escolher o Purion GT
          </Button>
        </div>
      </div>
    </section>
  );
}
