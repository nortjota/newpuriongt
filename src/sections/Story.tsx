import { useRef, useState } from 'react';
import { Tag } from '../ds';
import { useWide } from '../lib/store';
import { caps, display, mono } from '../lib/styles';
import { useScrollFrame } from '../lib/useScrollFrame';

const NUM_H = 'clamp(140px,16vw,240px)';
const article = { minHeight: '72vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24, padding: '40px 0' } as const;
const h3 = { margin: 0, ...display('var(--fs-h1)', '-.04em', 0.95) };
const body = { margin: 0, maxWidth: 520, fontSize: 17, lineHeight: 1.55, color: 'var(--text-secondary)' };

export function Story() {
  const wide = useWide();
  const list = useRef<HTMLDivElement>(null);
  const [ch, setCh] = useState(0);

  useScrollFrame(() => {
    let c = 0;
    list.current?.querySelectorAll<HTMLElement>('[data-ch]').forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.5) c = Number(el.dataset.ch);
    });
    setCh(c);
  });

  return (
    <section id="historia" data-screen-label="História" style={{ scrollMarginTop: 60, margin: 10, borderRadius: 'var(--radius-lg)', background: 'var(--paper-100)', padding: 'var(--section-y) var(--gutter)' }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 'clamp(40px,6vw,96px)', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 380px', position: wide ? 'sticky' : 'relative', top: 110, display: 'flex', flexDirection: 'column', gap: 28 }}>
          <span style={caps()}>A história por trás do melhor cheiro que seu carro já teve</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18 }}>
            <div aria-hidden="true" style={{ height: NUM_H, overflow: 'hidden', ...display(NUM_H, '-.07em', 1) }}>
              <div style={{ transform: `translateY(calc(${-ch} * ${NUM_H}))`, transition: 'transform var(--dur-reveal) var(--ease-out)' }}>
                {['01', '02', '03'].map((n) => (
                  <div key={n} style={{ height: NUM_H }}>
                    {n}
                  </div>
                ))}
              </div>
            </div>
            <span style={{ ...mono(13, 'var(--text-muted)'), paddingBottom: 18 }}>/ 03</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= ch ? 'var(--ink-950)' : 'var(--border-strong)', transition: 'background var(--dur-slow)' }} />
            ))}
          </div>
        </div>
        <div ref={list} style={{ flex: '1 1 480px', display: 'flex', flexDirection: 'column' }}>
          <article data-ch="0" style={article}>
            <span style={mono(12, 'var(--text-muted)')}>Capítulo 1</span>
            <h3 style={h3}>O problema que ninguém queria resolver.</h3>
            <p style={body}>
              Você investe R$ 80 mil, R$ 150 mil, R$ 300 mil num carro. Polimento cerâmico, bancos de couro, som premium. E no retrovisor, um papelão em forma de árvore. A Purion GT nasceu da raiva saudável de quem ama carros demais para aceitar isso.
            </p>
            <div style={{ height: 300, borderRadius: 'var(--radius-lg)', background: 'center 60%/cover url(/assets/hero-street.png)' }} />
          </article>
          <article data-ch="1" style={article}>
            <span style={mono(12, 'var(--text-muted)')}>Capítulo 2</span>
            <h3 style={h3}>Dois anos de obsessão.</h3>
            <p style={body}>
              Estudamos as notas olfativas de casas como Creed, Tom Ford e Maison Margiela. A ciência da fixação, da difusão e da memória olfativa. Testamos e reformulamos dezenas de vezes, até chegar numa fragrância que cria uma atmosfera.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <Tag>Fixação</Tag>
              <Tag>Difusão</Tag>
              <Tag>Memória olfativa</Tag>
            </div>
          </article>
          <article data-ch="2" style={article}>
            <span style={mono(12, 'var(--text-muted)')}>Capítulo 3</span>
            <h3 style={h3}>O interior, enfim, combina com o exterior.</h3>
            <p style={body}>Um frasco de vidro que você vai querer exibir. Até 700 borrifadas. Um produto à altura do carro que você escolheu.</p>
            <div role="img" aria-label="Frasco Purion GT" style={{ height: 300, borderRadius: 'var(--radius-lg)', background: 'var(--paper-100) center/auto 86% no-repeat url(/assets/bottle.png)' }} />
          </article>
        </div>
      </div>
    </section>
  );
}
