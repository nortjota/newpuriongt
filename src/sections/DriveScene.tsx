import { useRef, useState } from 'react';
import { DRIVE_PALETTE, DRIVE_STEPS } from '../lib/content';
import { prefersReducedMotion } from '../lib/store';
import { caps, display, mono } from '../lib/styles';
import { useScrollFrame } from '../lib/useScrollFrame';

// Deterministic pseudo-random particles (stable across renders).
const DOTS = Array.from({ length: 34 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin(i * 99.13 + n * 7.7) * 10000;
    return x - Math.floor(x);
  };
  return { l: (r(1) * 100).toFixed(1) + '%', t: (30 + r(2) * 90).toFixed(1) + '%', s: Math.round(6 + r(3) * 26) + 'px', d: 0.4 + r(4) * 1.6, b: Math.round(r(5) * 7) + 'px' };
});
const RING = 339.3; // 2πr for r=54

/** "A viagem de uma borrifada": a 340vh scroll track with a sticky scene. */
export function DriveScene() {
  const sec = useRef<HTMLElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const dots = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const km = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useScrollFrame(() => {
    const sc = sec.current;
    if (!sc) return;
    const rm = prefersReducedMotion();
    const r = sc.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
    if (!rm && img.current) img.current.style.transform = `scale(${1.3 - 0.3 * p}) translate3d(${-p * 3}%,0,0)`;
    if (!rm && dots.current)
      dots.current.querySelectorAll<HTMLElement>('[data-dot]').forEach((el, i) => {
        el.style.transform = `translate3d(${Math.sin(p * 6 + i) * 30}px,${-p * DOTS[i].d * 900}px,0)`;
      });
    if (ring.current) ring.current.style.strokeDashoffset = String(RING * (1 - p));
    if (km.current) km.current.textContent = String(Math.round(p * 120));
    if (bar.current) bar.current.style.width = p * 100 + '%';
    setStep(Math.min(3, Math.floor(p * 4.0001)));
  });

  return (
    <section ref={sec} data-screen-label="A viagem" style={{ position: 'relative', height: '340vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', padding: 10, boxSizing: 'border-box' }}>
        <div style={{ position: 'relative', height: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--ink-950)', color: 'var(--paper-0)' }}>
          <div ref={img} style={{ position: 'absolute', inset: 0, background: 'center 55%/cover url(assets/hero-street.png)', transform: 'scale(1.3)', willChange: 'transform' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(11,12,14,.78) 0%,rgba(11,12,14,.35) 55%,rgba(11,12,14,.1) 100%)' }} />
          <div ref={dots} aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {DOTS.map((d, i) => (
              <span
                key={i}
                data-dot="1"
                style={{ position: 'absolute', left: d.l, top: d.t, width: d.s, height: d.s, borderRadius: '50%', background: DRIVE_PALETTE[step][i % 3], filter: `blur(${d.b})`, opacity: 0.85, transition: 'background 1s var(--ease-out)', willChange: 'transform' }}
              />
            ))}
          </div>
          <div style={{ position: 'absolute', left: 'var(--gutter)', top: 96, right: 'var(--gutter)', display: 'flex', alignItems: 'center', gap: 14, ...caps('var(--text-inverse-muted)') }}>
            <span>A viagem de uma borrifada</span>
            <span style={{ flex: 1, height: 1, background: 'var(--border-inverse)' }} />
            <span style={{ fontFamily: 'var(--font-mono)' }}>GT · 60 ml</span>
          </div>
          <div aria-live="polite" style={{ position: 'absolute', left: 'var(--gutter)', top: '50%', transform: 'translateY(-50%)', display: 'grid', maxWidth: 'min(640px,86vw)' }}>
            {DRIVE_STEPS.map((st, i) => (
              <div
                key={st.label}
                aria-hidden={i !== step}
                style={{
                  gridArea: '1/1',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                  opacity: i === step ? 1 : 0,
                  transform: `translateY(${i === step ? '0px' : i < step ? '-40px' : '40px'})`,
                  transition: 'opacity .8s var(--ease-out),transform 1s var(--ease-out)',
                }}
              >
                <span style={mono(13, 'var(--signal-400)')}>{st.time}</span>
                <span style={display('var(--fs-display-xl)', '-.055em', 0.86)}>{st.title}</span>
                <span style={{ fontSize: 17, lineHeight: 1.5, color: 'var(--text-inverse-muted)', maxWidth: 440 }}>{st.body}</span>
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', right: 'var(--gutter)', top: '50%', transform: 'translateY(-50%)', width: 'clamp(120px,14vw,180px)', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 120 120" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="3" />
              <circle ref={ring} cx="60" cy="60" r="54" fill="none" stroke="var(--signal-400)" strokeWidth="3" strokeLinecap="round" strokeDasharray={RING} strokeDashoffset={RING} />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span ref={km} style={display('clamp(36px,4vw,56px)', '-.05em', 1)}>
                0
              </span>
              <span style={mono(11, 'var(--text-inverse-muted)')}>km</span>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 'var(--gutter)', right: 'var(--gutter)', bottom: 'var(--gutter)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 12, fontSize: 12 }}>
              {DRIVE_STEPS.map((st, i) => (
                <span key={st.label} style={{ color: i <= step ? 'var(--paper-0)' : 'var(--text-inverse-muted)', transition: 'color .6s' }}>
                  {st.label}
                </span>
              ))}
            </div>
            <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,.14)', overflow: 'hidden' }}>
              <div ref={bar} style={{ height: '100%', width: 0, background: 'var(--signal-400)', borderRadius: 2 }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
