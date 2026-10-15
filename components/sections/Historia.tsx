"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const CHAPTERS = [
  {
    n: "Capítulo 1",
    title: "O problema que ninguém queria resolver.",
    body:
      "Você investe R$ 80 mil, R$ 150 mil, R$ 300 mil num carro. Polimento cerâmico, bancos de couro, som premium. E no retrovisor, um papelão em forma de árvore. A Purion GT nasceu da raiva saudável de quem ama carros demais para aceitar isso.",
    image: "/hero-street.png",
  },
  {
    n: "Capítulo 2",
    title: "Dois anos de obsessão.",
    body:
      "Estudamos as notas olfativas de casas como Creed, Tom Ford e Maison Margiela. A ciência da fixação, da difusão e da memória olfativa. Testamos e reformulamos dezenas de vezes, até chegar numa fragrância que cria uma atmosfera.",
    tags: ["Fixação", "Difusão", "Memória olfativa"],
  },
  {
    n: "Capítulo 3",
    title: "O interior, enfim, combina com o exterior.",
    body: "Um frasco de vidro que você vai querer exibir. Até 700 borrifadas. Um produto à altura do carro que você escolheu.",
    image: "/bottle.png",
  },
];

const CHAPTER_HEIGHT = "clamp(140px,16vw,240px)";

export default function Historia() {
  const [active, setActive] = useState(0);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function recompute() {
      const vh = window.innerHeight;
      let current = 0;
      articleRefs.current.forEach((el, i) => {
        if (!el) return;
        if (el.getBoundingClientRect().top < vh * 0.5) current = i;
      });
      setActive(current);
    }

    function onScroll() {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        recompute();
      });
    }

    recompute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section id="historia" className="m-[10px] rounded-[var(--radius-lg)] bg-paper-100 px-6 py-[var(--section-y)]">
      <div className="mx-auto flex max-w-[var(--content-max)] flex-wrap items-start gap-12">
        <div className="flex flex-1 basis-[380px] flex-col gap-7 sm:sticky sm:top-[110px]">
          <span className="text-[11px] uppercase text-[var(--text-muted)] tracking-[var(--ls-caps)]">
            A história por trás do melhor cheiro que seu carro já teve
          </span>
          <div className="flex items-end gap-4.5">
            <div className="overflow-hidden" style={{ height: CHAPTER_HEIGHT }}>
              <div
                style={{
                  transform: `translateY(calc(${-active} * ${CHAPTER_HEIGHT}))`,
                  transition: "transform 0.9s cubic-bezier(.16,1,.3,1)",
                }}
              >
                {["01", "02", "03"].map((n) => (
                  <div
                    key={n}
                    className="font-display font-medium leading-none tracking-[-0.07em]"
                    style={{ height: CHAPTER_HEIGHT, fontSize: CHAPTER_HEIGHT, fontVariationSettings: "'wdth' 88" }}
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
            <span className="pb-4.5 font-mono text-[13px] text-[var(--text-muted)]">/ 03</span>
          </div>
          <div className="flex gap-1.5">
            {CHAPTERS.map((_, i) => (
              <span
                key={i}
                className={`h-[3px] flex-1 rounded transition-colors duration-500 ${i <= active ? "bg-ink-950" : "bg-[var(--border-strong)]"}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-1 basis-[480px] flex-col">
          {CHAPTERS.map((chapter, i) => (
            <article
              key={chapter.n}
              ref={(el) => {
                articleRefs.current[i] = el;
              }}
              className="flex min-h-[72vh] flex-col justify-center gap-6 py-10"
            >
              <span className="font-mono text-xs text-[var(--text-muted)]">{chapter.n}</span>
              <h3
                className="m-0 font-display text-[var(--fs-h1)] font-medium leading-[0.95] tracking-[-0.04em]"
                style={{ fontVariationSettings: "'wdth' 88" }}
              >
                {chapter.title}
              </h3>
              <p className="m-0 max-w-[520px] text-[17px] leading-relaxed text-[var(--text-secondary)]">{chapter.body}</p>
              {chapter.image && (
                <div className="relative h-[300px] overflow-hidden rounded-[var(--radius-lg)] bg-paper-100">
                  <Image src={chapter.image} alt="" fill sizes="(min-width: 640px) 480px, 100vw" className="object-cover" />
                </div>
              )}
              {chapter.tags && (
                <div className="flex flex-wrap gap-2">
                  {chapter.tags.map((tag) => (
                    <span key={tag} className="rounded-[var(--radius-pill)] border border-[var(--border-subtle)] px-4 py-2 text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
