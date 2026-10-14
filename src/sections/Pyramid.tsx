import { Icon, RevealText, Tabs } from '../ds';
import { ACCORDS, LEVELS, NOTE_COLORS, PERFORMANCE, SEASONS } from '../lib/content';
import { useShop } from '../lib/store';
import { caps, display, ghostInk, mono } from '../lib/styles';

const note = (n: string, i: number) => ({ name: n, c: NOTE_COLORS[n], i: '0' + (i + 1) });

function PanelHead({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...caps('var(--text-inverse-muted)') }}>
      <Icon name={icon} size={14} />
      <span>{label}</span>
      <span style={{ flex: 1, height: 1, background: 'var(--border-inverse)' }} />
    </div>
  );
}

const panel = { background: 'var(--ink-900)', border: '1px solid var(--border-inverse)', borderRadius: 'var(--radius-lg)', padding: 28, display: 'flex', flexDirection: 'column', gap: 22 } as const;

export function Pyramid() {
  const { level, setLevel } = useShop();
  const all = level === 0;
  const lv = all ? null : LEVELS[level - 1];
  const tabs = ['Completo', ...LEVELS.map((l) => l.k)];
  const glow = lv ? lv.glow : `linear-gradient(90deg,${LEVELS.map((l) => l.glow).join(',')})`;

  return (
    <section
      id="fragrancia"
      data-screen-label="Pirâmide olfativa"
      style={{ scrollMarginTop: 60, margin: 10, borderRadius: 'var(--radius-lg)', background: 'var(--ink-950)', color: 'var(--paper-0)', padding: 'var(--section-y) var(--gutter)', overflow: 'hidden' }}
    >
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: 'clamp(32px,5vw,72px)', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span style={caps('var(--text-inverse-muted)')}>Pirâmide olfativa</span>
          <div style={{ fontSize: 'var(--fs-display-l)' }}>
            <RevealText as="h2" text="Construído" lineStyle={ghostInk} />
            <RevealText as="div" text="em três tempos." delay={120} />
          </div>
          <p style={{ margin: 0, maxWidth: 360, color: 'var(--text-inverse-muted)', fontSize: 15, lineHeight: 1.5 }}>Inspirada nas grandes casas de perfumaria. Toque em cada camada do frasco ou veja a pirâmide completa.</p>
        </div>

        {/* Bottle with clickable layers */}
        <div style={{ position: 'relative', height: 540, display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', height: '100%', aspectRatio: '300/540', borderRadius: 'var(--radius-xl)', background: 'var(--ink-800)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 1 }}>
              {LEVELS.map((l, i) => {
                const on = all || level === i + 1;
                return (
                  <button
                    key={l.k}
                    type="button"
                    aria-pressed={level === i + 1}
                    onClick={() => setLevel(level === i + 1 ? 0 : i + 1)}
                    style={{
                      flex: 1,
                      border: 0,
                      borderTop: '1px solid var(--border-inverse)',
                      background: on ? l.band : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      color: 'var(--paper-0)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      letterSpacing: '.08em',
                      textTransform: 'uppercase',
                      transition: 'background var(--dur-slow) var(--ease-out)',
                    }}
                  >
                    <span>0{i + 1}</span>
                    <span style={{ opacity: on ? 1 : 0.4, transition: 'opacity var(--dur-slow)' }}>{l.k}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ position: 'absolute', left: '12%', right: '12%', bottom: '9%', height: '16%', borderRadius: '50%', background: glow, filter: 'blur(26px)', opacity: 0.95, zIndex: 2, pointerEvents: 'none', transition: 'background .8s var(--ease-out)' }} />
            <img
              src="assets/bottle.png"
              alt="Frasco Purion GT"
              style={{ position: 'absolute', left: '50%', top: '50%', height: '86%', transform: 'translate(-50%,-50%)', zIndex: 3, pointerEvents: 'none', filter: 'drop-shadow(0 30px 24px rgba(0,0,0,.45))' }}
            />
          </div>
        </div>

        {/* Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <Tabs tone="dark" tabs={tabs} value={lv ? lv.k : 'Completo'} onChange={(k) => setLevel(k === 'Completo' ? 0 : LEVELS.findIndex((l) => l.k === k) + 1)} />
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.45, color: 'var(--text-inverse-muted)', minHeight: 50 }}>{lv ? lv.t : 'A pirâmide inteira: da abertura frutada ao fundo de couro e âmbar.'}</p>
          {all ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {LEVELS.map((l, gi) => (
                <div key={l.k} style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 18, borderBottom: '1px solid var(--border-inverse)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={display(24, '-.03em', 1.1)}>{l.k}</span>
                    <span style={mono(11, 'var(--text-inverse-muted)')}>
                      0{gi + 1} · {l.notes.length} notas
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {l.notes.map(note).map((nt) => (
                      <span key={nt.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px 7px 9px', borderRadius: 'var(--radius-pill)', background: 'rgba(255,255,255,.06)', border: '1px solid var(--border-inverse)', fontSize: 14 }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: nt.c }} />
                        {nt.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {lv!.notes.map(note).map((nt) => (
                <div key={nt.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 0', borderBottom: '1px solid var(--border-inverse)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: nt.c, flex: 'none', boxShadow: '0 0 0 4px rgba(255,255,255,.06)' }} />
                    <span style={display('clamp(28px,3vw,40px)', '-.04em', 1)}>{nt.name}</span>
                  </span>
                  <span style={mono(12, 'var(--text-inverse-muted)')}>{nt.i}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fragrantica-style panels */}
      <div style={{ maxWidth: 'var(--content-max)', margin: 'clamp(56px,7vw,96px) auto 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: 14 }}>
        <div style={panel}>
          <PanelHead icon="layers" label="Acordes principais" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ACCORDS.map(([k, w, c, darkText]) => (
              <div key={k} style={{ height: 34, display: 'flex' }}>
                <div
                  data-bar="1"
                  data-target={w + '%'}
                  style={{ width: w + '%', background: c, color: darkText ? 'var(--ink-950)' : 'var(--paper-0)', borderRadius: '0 12px 12px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', transition: 'width 1.4s var(--ease-out)' }}
                >
                  {k}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={panel}>
          <PanelHead icon="calendar" label="Quando usar" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '22px 16px' }}>
            {SEASONS.map(([k, i, w, c]) => (
              <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
                <span style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,.06)', color: c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={i} size={20} />
                </span>
                <span style={{ fontSize: 13 }}>{k}</span>
                <span style={{ width: '100%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,.1)', overflow: 'hidden', display: 'block' }}>
                  <span data-bar="1" data-target={w + '%'} style={{ display: 'block', height: '100%', width: w + '%', background: c, borderRadius: 3, transition: 'width 1.4s var(--ease-out)' }} />
                </span>
                <span style={mono(11, 'var(--text-inverse-muted)')}>{w}%</span>
              </div>
            ))}
          </div>
        </div>

        <div style={panel}>
          <PanelHead icon="gauge" label="Performance" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {PERFORMANCE.map(([k, l, n]) => (
              <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 14 }}>{k}</span>
                  <span style={mono(12, 'var(--text-inverse-muted)')}>{l}</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }} aria-label={`${n} de 5`}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < n ? 'var(--signal-400)' : 'rgba(255,255,255,.1)' }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 18, borderTop: '1px solid var(--border-inverse)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
            <span style={caps('var(--text-inverse-muted)')}>Família</span>
            <span style={display(26, '-.03em', 1.1)}>Amadeirado frutado</span>
          </div>
        </div>
      </div>
    </section>
  );
}
