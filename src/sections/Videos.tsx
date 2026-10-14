import { useRef, useState } from 'react';
import { Dialog, Icon, IconButton, RevealText, Segment } from '../ds';
import { VIDEO_TABS, VIDEOS } from '../lib/content';
import { display, ghostDark, mono } from '../lib/styles';

const glass = { background: 'var(--surface-glass)', border: '1px solid var(--border-glass)', backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)' } as const;

export function Videos() {
  const rail = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState('Todos');
  const [open, setOpen] = useState(-1);
  const vis = VIDEOS.map((v, idx) => ({ ...v, idx })).filter((v) => tab === 'Todos' || v.t === tab);
  const cur = VIDEOS[open] ?? VIDEOS[0];

  return (
    <section id="videos" data-screen-label="Vídeos" style={{ scrollMarginTop: 60, padding: 'var(--section-y) 0 0 var(--gutter)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, paddingRight: 'var(--gutter)', marginBottom: 32 }}>
        <div style={{ fontSize: 'var(--fs-display-l)' }}>
          <RevealText as="h2" text="Quem usa," lineStyle={ghostDark} />
          <RevealText as="div" text="mostra." delay={120} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-end' }}>
          <Segment options={VIDEO_TABS} value={tab} onChange={setTab} style={{ flexWrap: 'wrap' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <IconButton icon="arrow-left" size={40} label="Anterior" onClick={() => rail.current?.scrollBy({ left: -312, behavior: 'smooth' })} />
            <IconButton icon="arrow-right" size={40} label="Próximo" onClick={() => rail.current?.scrollBy({ left: 312, behavior: 'smooth' })} />
          </div>
        </div>
      </div>
      <div
        ref={rail}
        className="no-scrollbar"
        style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'min(300px,72vw)', gap: 12, overflowX: 'auto', scrollSnapType: 'x mandatory', paddingRight: 'var(--gutter)' }}
      >
        {vis.map((v) => (
          <button
            key={v.idx}
            type="button"
            className="media-card"
            aria-label={`Assistir: ${v.title}`}
            onClick={() => setOpen(v.idx)}
            style={{ position: 'relative', aspectRatio: '9/16', border: 0, padding: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--ink-900)', cursor: 'pointer', scrollSnapAlign: 'start', textAlign: 'left', color: 'var(--paper-0)' }}
          >
            <span className="media-card__bg" style={{ position: 'absolute', inset: 0, background: `${v.pos}/cover url(${v.img})`, transition: 'transform 1.1s var(--ease-out)' }} />
            <span style={{ position: 'absolute', inset: 0, background: 'var(--scrim-bottom)', pointerEvents: 'none' }} />
            <span style={{ position: 'absolute', left: 14, top: 14, padding: '6px 12px', borderRadius: 'var(--radius-pill)', ...glass, letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', fontSize: 10, pointerEvents: 'none' }}>{v.t}</span>
            <span style={{ position: 'absolute', left: '50%', top: '50%', width: 64, height: 64, margin: -32, borderRadius: '50%', ...glass, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <Icon name="play" size={20} />
            </span>
            <span style={{ position: 'absolute', left: 18, right: 18, bottom: 18, display: 'flex', flexDirection: 'column', gap: 6, pointerEvents: 'none' }}>
              <span style={display(24, '-.03em', 1)}>{v.title}</span>
              <span style={{ ...mono(12), opacity: 0.75 }}>{v.h}</span>
            </span>
          </button>
        ))}
      </div>

      <Dialog open={open >= 0} onClose={() => setOpen(-1)} width={420}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ position: 'relative', aspectRatio: '9/16', maxHeight: '70vh', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--ink-900)', color: 'var(--paper-0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {cur.src ? (
              <video src={cur.src} controls autoPlay playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center', padding: 24 }}>
                <Icon name="video" size={28} />
                <span style={{ fontSize: 14 }}>Espaço para o vídeo</span>
                <span style={{ ...mono(11), opacity: 0.6 }}>MP4 vertical · 9:16</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, color: 'var(--ink-950)' }}>
            <span style={display(24, '-.03em', 1.1)}>{cur.title}</span>
            <span style={mono(12, 'var(--text-muted)')}>{cur.h}</span>
          </div>
        </div>
      </Dialog>
    </section>
  );
}
