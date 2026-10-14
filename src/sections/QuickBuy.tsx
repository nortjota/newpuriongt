import { Badge, Button, Icon, Stepper, Tag } from '../ds';
import { FREQUENCIES } from '../lib/content';
import { usePlanOptions, useShop } from '../lib/store';
import { caps, display, mono, sectionWrap } from '../lib/styles';

const pill = { padding: '8px 14px', borderRadius: 'var(--radius-pill)', background: 'rgba(255,255,255,.72)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', ...mono(12) } as const;
const stepLabel = { ...caps('var(--ink-950)'), fontWeight: 600 } as const;

export function Stars({ size }: { size: number }) {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <Icon key={i} name="star" size={size} />
      ))}
    </>
  );
}

export function FrequencyPicker() {
  const { freq, setFreq } = useShop();
  return (
    <>
      {FREQUENCIES.map((f) => (
        <Tag key={f} selected={freq === f} onClick={() => setFreq(f)}>
          {f} dias
        </Tag>
      ))}
    </>
  );
}

export function QuickBuy() {
  const shop = useShop();
  const plans = usePlanOptions();
  return (
    <section id="comprar-topo" data-screen-label="Compra rápida" style={{ scrollMarginTop: 60, padding: '0 var(--gutter)', ...sectionWrap }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,460px),1fr))', gap: 14, alignItems: 'stretch' }}>
        {/* Photo */}
        <div style={{ position: 'relative', minHeight: 'clamp(420px,52vw,680px)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--paper-100)' }}>
          <img
            className="h-zoom105"
            src="assets/product-studio.png"
            alt="Purion GT 60 ml"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1.4s var(--ease-out)' }}
          />
          <div style={{ position: 'absolute', left: 20, top: 20, display: 'flex', gap: 8 }}>
            <Badge tone="ink">35% off</Badge>
            <Badge tone="signal" dot>
              Envio hoje
            </Badge>
          </div>
          <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={pill}>60 ml · 2.0 fl oz</span>
              <span style={pill}>700 borrifadas</span>
            </div>
            <a href="#fragrancia" style={{ padding: '8px 14px', borderRadius: 'var(--radius-pill)', background: 'var(--ink-950)', color: 'var(--paper-0)', fontSize: 12, fontWeight: 500 }}>
              Ver notas olfativas
            </a>
          </div>
        </div>

        {/* Purchase panel */}
        <div style={{ borderRadius: 'var(--radius-xl)', background: 'var(--paper-0)', border: '1px solid var(--border-subtle)', padding: 'clamp(22px,3vw,40px)', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={caps()}>Auto parfum de alta performance</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', gap: 2 }}>
                  <Stars size={12} />
                </span>
                <span style={mono(13, 'var(--ink-950)')}>4.9</span>
                <a href="#avaliacoes" style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  100+ avaliações
                </a>
              </span>
            </div>
            <h2 style={{ margin: 0, ...display('clamp(56px,6vw,96px)', '-.055em', 0.86) }}>Purion GT</h2>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--text-secondary)', maxWidth: 440 }}>
              Fragrância de assinatura para quem vive a estrada. Saída frutada, corpo floral, fundo de couro e âmbar.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={stepLabel}>1 · Escolha sua opção</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Preço por frasco cai no kit</span>
            </div>
            <div role="radiogroup" aria-label="Opção de compra" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 8 }}>
              {plans.map((pl) => (
                <button
                  key={pl.id}
                  type="button"
                  role="radio"
                  aria-checked={pl.on}
                  className="h-lift3"
                  onClick={pl.pick}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    padding: 16,
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${pl.on ? 'var(--ink-950)' : 'var(--border-strong)'}`,
                    background: pl.on ? 'var(--ink-950)' : 'var(--paper-50)',
                    color: pl.on ? 'var(--paper-0)' : 'var(--ink-950)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-text)',
                    transition: 'background .5s var(--ease-out),color .5s var(--ease-out),border-color .3s,transform .5s var(--ease-out)',
                  }}
                >
                  <span style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8, minHeight: 22 }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{pl.t}</span>
                    {pl.badge && <Badge tone={pl.badgeTone}>{pl.badge}</Badge>}
                  </span>
                  <span style={{ ...mono(24), letterSpacing: '-.03em', lineHeight: 1 }}>{pl.price}</span>
                  <span style={{ fontSize: 12, lineHeight: 1.35, color: pl.on ? 'var(--text-inverse-muted)' : 'var(--text-muted)' }}>{pl.per}</span>
                  <span
                    style={{
                      position: 'absolute',
                      right: 14,
                      bottom: 14,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: pl.on ? 'var(--signal-400)' : 'transparent',
                      color: 'var(--ink-950)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background .4s',
                    }}
                  >
                    <Icon name="check" size={12} />
                  </span>
                </button>
              ))}
            </div>
            {shop.isSub && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--paper-100)', animation: 'pg-fade-up .5s var(--ease-out) both' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Receber a cada</span>
                <FrequencyPicker />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, padding: '18px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={stepLabel}>2 · Total</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ ...mono(0), fontSize: 'clamp(36px,3.6vw,48px)', letterSpacing: '-.04em', lineHeight: 1 }}>{shop.price}</span>
                <span style={{ ...mono(14, 'var(--text-muted)'), textDecoration: 'line-through' }}>{shop.oldPrice}</span>
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                ou 3× de <span style={{ fontFamily: 'var(--font-mono)' }}>{shop.inst}</span> sem juros {shop.priceNote}
              </span>
            </div>
            {shop.showQty && <Stepper value={shop.qty} min={1} max={10} onChange={shop.setQty} />}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button variant="accent" size="lg" full iconRight="arrow-up-right" onClick={shop.addCart}>
              {shop.ctaLabel}
            </Button>
            <Button variant="primary" size="lg" full onClick={shop.buyNow}>
              Comprar agora
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 10, marginTop: 'auto' }}>
            {[
              ['truck', 'Envio no mesmo dia', 'Rastreio imediato'],
              ['rotate-ccw', 'Garantia de 7 dias', '100% de volta'],
              ['shield-check', 'Compra segura', 'Nota fiscal emitida'],
            ].map(([i, t, d]) => (
              <div key={t} style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, lineHeight: 1.3 }}>
                <Icon name={i} size={16} />
                <span style={{ fontWeight: 500 }}>{t}</span>
                <span style={{ color: 'var(--text-muted)' }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
