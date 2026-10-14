import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Dialog, Icon, Input } from '../ds';
import { REVIEWS, type Review } from '../lib/content';
import { useShop } from '../lib/store';
import { caps, display, mono } from '../lib/styles';
import { Stars } from './QuickBuy';

const STORAGE_KEY = 'purion_reviews';
const SPOT_MS = 6000;

// Reviews written in the form are kept only in this visitor's browser (no backend yet).
function loadMine(): Review[] {
  try {
    const m = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(m) ? m : [];
  } catch {
    return [];
  }
}

export function Reviews() {
  const { showToast } = useShop();
  const [mine, setMine] = useState<Review[]>(loadMine);
  const revs = [...mine, ...REVIEWS];
  const [spot, setSpot] = useState(0);
  const timer = useRef<number>();

  const restart = useCallback(() => {
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => setSpot((s) => s + 1), SPOT_MS);
  }, []);
  useEffect(() => {
    restart();
    return () => window.clearInterval(timer.current);
  }, [restart]);
  const cur = spot % revs.length;

  const [formOpen, setFormOpen] = useState(false);
  const [rv, setRv] = useState({ n: '', c: '', q: '', s: 5 });
  const submit = () => {
    if (!rv.n.trim() || !rv.q.trim()) return;
    const next = [{ n: rv.n.trim(), c: rv.c.trim() || 'Brasil', q: rv.q.trim(), s: rv.s, tag: 'Novo' }, ...mine];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
    setMine(next);
    setFormOpen(false);
    setRv({ n: '', c: '', q: '', s: 5 });
    setSpot(0);
    restart();
    showToast('Obrigado pelo seu depoimento');
  };

  const rowA = revs;
  const rowB = [...revs].reverse();

  return (
    <section id="avaliacoes" data-screen-label="Avaliações" style={{ scrollMarginTop: 60, padding: 'var(--section-y) 0' }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '0 var(--gutter)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))', gap: 'clamp(32px,5vw,80px)', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={caps()}>Avaliações verificadas</span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18 }}>
              <span style={display('clamp(120px,14vw,200px)', '-.07em', 0.8)}>4.9</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 10 }}>
                <div style={{ display: 'flex', gap: 3, color: 'var(--ink-950)' }}>
                  <Stars size={18} />
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>de 5 · mais de 100 avaliações</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              ['92%', 'taxa de recompra'],
              ['100+', 'motoristas satisfeitos'],
            ].map(([v, l]) => (
              <div key={l} style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={display(56, '-.05em', 0.9)}>{v}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{l}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button variant="primary" iconLeft="pen-line" onClick={() => setFormOpen(true)}>
              Deixar meu depoimento
            </Button>
          </div>
        </div>

        {/* Spotlight */}
        <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', background: 'var(--ink-950)', color: 'var(--paper-0)', padding: 'clamp(28px,4vw,48px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 36, minHeight: 440, overflow: 'hidden' }}>
          <span aria-hidden="true" style={{ position: 'absolute', right: 24, top: -30, ...display(280, 'normal', 1), color: 'var(--ink-800)', pointerEvents: 'none' }}>
            ”
          </span>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 3, color: 'var(--signal-400)' }}>
              <Stars size={16} />
            </div>
            <span style={mono(12, 'var(--text-inverse-muted)')}>
              {String(cur + 1).padStart(2, '0')} / {String(revs.length).padStart(2, '0')}
            </span>
          </div>
          <div style={{ position: 'relative', display: 'grid' }}>
            {revs.map((r, i) => (
              <figure
                key={i}
                aria-hidden={i !== cur}
                style={{ gridArea: '1/1', margin: 0, display: 'flex', flexDirection: 'column', gap: 28, opacity: i === cur ? 1 : 0, transform: `translateY(${i === cur ? 0 : 20}px)`, transition: 'opacity .9s var(--ease-out),transform 1.1s var(--ease-out)', pointerEvents: i === cur ? 'auto' : 'none' }}
              >
                <blockquote style={{ margin: 0, ...display('clamp(24px,2.4vw,34px)', '-.025em', 1.18), fontVariationSettings: "'wdth' 100" }}>“{r.q}”</blockquote>
                <figcaption style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--signal-400)', color: 'var(--ink-950)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{r.n[0]}</span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontWeight: 500 }}>{r.n}</span>
                    <span style={mono(12, 'var(--text-inverse-muted)')}>{r.c} · foto enviada pelo cliente</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div style={{ position: 'relative', display: 'flex', gap: 6 }}>
            {revs.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ver depoimento ${i + 1}`}
                onClick={() => {
                  setSpot(i);
                  restart();
                }}
                style={{ flex: 1, height: 18, border: 0, padding: '7px 0', background: 'transparent', cursor: 'pointer' }}
              >
                <span style={{ display: 'block', height: 4, borderRadius: 2, background: 'rgba(255,255,255,.16)', overflow: 'hidden' }}>
                  {/* key forces a fresh fill animation each time this segment becomes current */}
                  <span
                    key={i === cur ? `on-${spot}` : 'off'}
                    style={{
                      display: 'block',
                      height: '100%',
                      width: i < cur ? '100%' : '0%',
                      background: 'var(--paper-0)',
                      animation: i === cur ? `pg-fill ${SPOT_MS}ms linear forwards` : undefined,
                    }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Moving rows */}
      <div style={{ marginTop: 'clamp(48px,6vw,80px)', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
        {[
          { items: rowA, dur: '70s', dir: 'normal' as const },
          { items: rowB, dur: '80s', dir: 'reverse' as const },
        ].map((row, ri) => (
          <div key={ri} className="h-pause" style={{ display: 'flex', gap: 12, width: 'max-content', animation: `pg-marquee ${row.dur} linear infinite`, animationDirection: row.dir }}>
            {[...row.items, ...row.items, ...row.items].map((r, i) => (
              <div
                key={i}
                className="h-rev-card"
                aria-hidden={i >= row.items.length || undefined}
                style={{ width: 340, flex: 'none', background: 'var(--paper-0)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14, transition: 'transform .6s var(--ease-out),border-color .4s', boxSizing: 'border-box' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 2 }} aria-label={`${r.s} estrelas`}>
                    {Array.from({ length: r.s || 5 }, (_, k) => (
                      <Icon key={k} name="star" size={12} />
                    ))}
                  </div>
                  <span style={mono(11, 'var(--text-muted)')}>{r.tag || 'Novo'}</span>
                </div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-800)' }}>“{r.q}”</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto' }}>
                  <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--paper-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{r.n[0]}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{r.n}</span>
                  <span style={mono(11, 'var(--text-muted)')}>{r.c}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} title="Seu depoimento" width={520}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 6 }} role="radiogroup" aria-label="Nota">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rv.s === n}
                aria-label={`${n} estrela${n > 1 ? 's' : ''}`}
                className="h-star"
                onClick={() => setRv((v) => ({ ...v, s: n }))}
                style={{ border: 0, background: 'transparent', padding: 2, cursor: 'pointer', color: n <= rv.s ? 'var(--ink-950)' : 'var(--steel-300)', transition: 'transform .3s var(--ease-out)' }}
              >
                <Icon name="star" size={28} />
              </button>
            ))}
          </div>
          <Input label="Nome" value={rv.n} onChange={(e) => setRv((v) => ({ ...v, n: e.target.value }))} />
          <Input label="Cidade/UF" placeholder="São Paulo/SP" value={rv.c} onChange={(e) => setRv((v) => ({ ...v, c: e.target.value }))} />
          <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ ...caps('var(--text-secondary)'), fontWeight: 500 }}>Comentário</span>
            <textarea
              value={rv.q}
              onChange={(e) => setRv((v) => ({ ...v, q: e.target.value }))}
              rows={4}
              placeholder="Como o Purion GT mudou o seu carro?"
              style={{ padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)', fontFamily: 'var(--font-text)', fontSize: 15, resize: 'vertical', background: 'var(--paper-0)', color: 'var(--ink-950)' }}
            />
          </label>
          <Button variant="primary" size="lg" full onClick={submit}>
            Publicar depoimento
          </Button>
        </div>
      </Dialog>
    </section>
  );
}
