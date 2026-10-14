import { useState } from 'react';
import { Button, Icon, RevealText } from '../ds';
import { LEVELS, NOTE_COLORS, QUIZ, QUIZ_RESULTS } from '../lib/content';
import { scrollToId, useShop } from '../lib/store';
import { caps, display, ghostDark, mono, sectionWrap } from '../lib/styles';

export function Quiz() {
  const { setLevel } = useShop();
  const [answers, setAnswers] = useState<(1 | 2 | 3)[]>([]);
  const step = answers.length;
  const done = step >= QUIZ.length;

  const cnt = { 1: 0, 2: 0, 3: 0 };
  answers.forEach((v) => cnt[v]++);
  // Ties resolve toward the deeper layer (Fundo > Corpo > Saída).
  const win = ([3, 2, 1] as const).reduce<1 | 2 | 3>((b, k) => (cnt[k] > cnt[b] ? k : b), 3);
  const res = QUIZ_RESULTS[win];

  return (
    <section id="quiz" data-screen-label="Quiz" style={{ scrollMarginTop: 60, padding: '0 var(--gutter) var(--section-y)', ...sectionWrap }}>
      <div
        style={{ borderRadius: 'var(--radius-xl)', background: 'var(--paper-0)', border: '1px solid var(--border-subtle)', padding: 'clamp(24px,4vw,56px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))', gap: 'clamp(28px,4vw,64px)' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, ...caps() }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--signal-400)' }} />
            <span>Quiz · 30 segundos</span>
          </div>
          <div style={{ fontSize: 'var(--fs-display-l)' }}>
            <RevealText as="h2" text="Descubra seu" lineStyle={ghostDark} />
            <RevealText as="div" text="perfil olfativo." delay={120} />
          </div>
          <p style={{ margin: 0, maxWidth: 400, fontSize: 15, lineHeight: 1.5, color: 'var(--text-secondary)' }}>Cinco perguntas sobre como você dirige e vive o carro. No fim, a camada do Purion GT que mais combina com você.</p>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {QUIZ.map((q, i) => (
                <span key={q.q} style={{ flex: 1, height: 4, borderRadius: 2, background: i < step || done ? 'var(--ink-950)' : i === step ? 'var(--signal-400)' : 'var(--border-strong)', transition: 'background .5s var(--ease-out)' }} />
              ))}
            </div>
            <span style={mono(12, 'var(--text-muted)')}>{done ? 'Resultado' : `0${step + 1} / 0${QUIZ.length}`}</span>
          </div>
        </div>

        <div style={{ minHeight: 440, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {!done ? (
            <div key={step} style={{ display: 'flex', flexDirection: 'column', gap: 22, animation: 'pg-fade-up .7s var(--ease-out) both' }}>
              <h3 style={{ margin: 0, ...display('clamp(36px,4vw,56px)', '-.045em', 0.95) }}>{QUIZ[step].q}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {QUIZ[step].o.map(([label, icon, val]) => (
                  <button
                    key={label}
                    type="button"
                    className="h-quiz-opt"
                    onClick={() => setAnswers((a) => [...a, val])}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '14px 18px 14px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-strong)',
                      background: 'var(--paper-50)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-text)',
                      fontSize: 16,
                      color: 'var(--ink-950)',
                      transition: 'background .4s var(--ease-out),transform .4s var(--ease-out),border-color .4s',
                    }}
                  >
                    <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--paper-0)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                      <Icon name={icon} size={18} />
                    </span>
                    <span style={{ flex: 1 }}>{label}</span>
                    <Icon name="arrow-right" size={16} />
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setAnswers((a) => a.slice(0, -1))}
                  style={{ alignSelf: 'flex-start', border: 0, background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-text)', fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 6, alignItems: 'center' }}
                >
                  <Icon name="arrow-left" size={14} />
                  Voltar
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24, alignItems: 'center', animation: 'pg-fade-up .8s var(--ease-out) both' }}>
              <div role="img" aria-label="Frasco Purion GT" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-lg)', background: 'var(--paper-100) center/auto 86% no-repeat url(assets/bottle.png)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <span style={caps()}>Compatibilidade {80 + cnt[win] * 4}%</span>
                <h3 style={{ margin: 0, ...display(44, '-.045em', 0.92) }}>{res.title}</h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--text-secondary)' }}>{res.body}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {LEVELS[win - 1].notes.map((n) => (
                    <span key={n} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px 6px 8px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)', fontSize: 13 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: NOTE_COLORS[n] }} />
                      {n}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 6 }}>
                  <Button
                    variant="primary"
                    iconRight="arrow-up-right"
                    onClick={() => {
                      setLevel(win);
                      scrollToId('comprar');
                    }}
                  >
                    Escolher o Purion GT
                  </Button>
                  <Button variant="secondary" onClick={() => setAnswers([])}>
                    Refazer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
