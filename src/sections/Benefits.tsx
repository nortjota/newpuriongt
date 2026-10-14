import { Icon } from '../ds';
import { caps, display, mono, sectionWrap } from '../lib/styles';

const CARDS = [
  { n: '#01', icon: 'droplet', big: '700', unit: 'borrifadas', title: 'Liberação controlada', body: 'Cada borrifada dosada para durar meses.', accent: true },
  { n: '#02', icon: 'gem', big: 'R$ 800+', unit: 'linha de inspiração', title: 'Alta perfumaria', body: 'Inspirada na linha dos perfumes de R$ 800+.' },
  { n: '#03', icon: 'shield-check', big: '7 dias', unit: 'garantia total', title: '100% de volta', body: 'Sem perguntas. Se não for para você, devolvemos.' },
  { n: '#04', icon: 'truck', big: 'Hoje', unit: 'envio no mesmo dia', title: 'Rastreio imediato', body: 'Código enviado logo após a aprovação do pagamento.' },
];

export function Benefits() {
  return (
    <section data-screen-label="Benefícios" style={{ padding: '0 var(--gutter) var(--section-y)', ...sectionWrap, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,270px),1fr))', gap: 14 }}>
      {CARDS.map((c) => {
        const mut = c.accent ? 'var(--ink-700)' : 'var(--text-inverse-muted)';
        const rule = c.accent ? 'rgba(11,12,14,.18)' : 'var(--border-inverse)';
        return (
          <div
            key={c.n}
            data-reveal="1"
            className={c.accent ? 'h-card-signal' : 'h-card-ink'}
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: c.accent ? 'var(--signal-400)' : 'var(--ink-950)',
              color: c.accent ? 'var(--ink-950)' : 'var(--paper-0)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              minHeight: 380,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 40,
              transition: 'transform .8s var(--ease-out),background .5s var(--ease-out)',
            }}
          >
            <div style={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.07, pointerEvents: 'none' }}>
              <Icon name={c.icon} size={220} />
            </div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={mono(13, mut)}>{c.n}</span>
              <span style={{ width: 44, height: 44, borderRadius: '50%', border: `1px solid ${rule}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={c.icon} size={18} />
              </span>
            </div>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={display('clamp(56px,6vw,96px)', '-.06em', 0.85)}>{c.big}</span>
                <span style={caps(mut)}>{c.unit}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: `1px solid ${rule}`, paddingTop: 16 }}>
                <h3 style={{ margin: 0, ...display(26, '-.03em', 1) }}>{c.title}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: mut }}>{c.body}</p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
