"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

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
    // bottle.png é uma foto de produto vertical — "cover" cortava o gargalo e a
    // base do frasco. "contain" mostra o frasco inteiro.
    fit: "contain" as const,
  },
];

// Minimo bem menor que antes (era 140px fixo, ocupava quase 1/4 da tela no
// mobile e nunca encolhia) - agora escala suavemente de telas pequenas a grandes.
const CHAPTER_HEIGHT = "clamp(64px,18vw,240px)";

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
    <section
      id="historia"
      className="relative m-[10px] overflow-hidden rounded-[var(--radius-lg)] bg-ink-950 px-6 py-[var(--section-y)] text-paper-0"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[10%] top-0 select-none font-display text-[clamp(200px,32vw,480px)] font-medium leading-none tracking-[-0.07em] text-paper-0/[0.03]"
        style={{ fontVariationSettings: "'wdth' 88" }}
      >
        01
      </div>

      {/* Mobile/tablet: barra de progresso SEM sticky (position:sticky empilhado
          com os capítulos abaixo se comportou de forma instável — ficava
          "grudado" no lugar errado). Rola normalmente junto com a página,
          mas o número e a barra continuam animando conforme o `active` muda. */}
      <div className="relative mb-10 flex items-center gap-4 lg:hidden">
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-signal-400 font-mono text-sm font-medium text-ink-950">
          {["01", "02", "03"][active]}
        </span>
        <div className="flex flex-1 gap-1.5">
          {CHAPTERS.map((_, i) => (
            <span
              key={i}
              className={`h-[3px] flex-1 rounded transition-colors duration-500 ${i <= active ? "bg-signal-400" : "bg-[var(--border-inverse)]"}`}
            />
          ))}
        </div>
        <span className="font-mono text-xs text-[var(--text-inverse-muted)]">/ 03</span>
      </div>

      <div className="relative mx-auto flex max-w-[var(--content-max)] flex-col items-start gap-12 lg:flex-row lg:flex-wrap">
        <div className="hidden flex-1 basis-[380px] flex-col gap-7 lg:sticky lg:top-[110px] lg:flex">
          <span className="text-[11px] uppercase text-[var(--text-inverse-muted)] tracking-[var(--ls-caps)]">
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
                    className="font-display font-medium leading-none tracking-[-0.07em] text-signal-400"
                    style={{ height: CHAPTER_HEIGHT, fontSize: CHAPTER_HEIGHT, fontVariationSettings: "'wdth' 88" }}
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
            <span className="pb-4.5 font-mono text-[13px] text-[var(--text-inverse-muted)]">/ 03</span>
          </div>
          <div className="flex gap-1.5">
            {CHAPTERS.map((_, i) => (
              <span
                key={i}
                className={`h-[3px] flex-1 rounded transition-colors duration-500 ${i <= active ? "bg-signal-400" : "bg-[var(--border-inverse)]"}`}
              />
            ))}
          </div>
        </div>

        <div className="relative flex flex-1 basis-[480px] flex-col">
          <div
            aria-hidden
            className="absolute bottom-10 left-5 top-10 hidden w-px bg-[var(--border-inverse)] sm:block"
          />
          {CHAPTERS.map((chapter, i) => (
            <article
              key={chapter.n}
              ref={(el) => {
                articleRefs.current[i] = el;
              }}
              className="relative flex min-h-0 flex-col justify-center py-8 sm:pl-14 lg:min-h-[72vh] lg:py-10"
            >
              <Reveal className="flex flex-col gap-6">
                <div className="flex items-center gap-4 sm:absolute sm:-left-14 sm:top-10">
                  <span
                    className={`flex h-10 w-10 flex-none items-center justify-center rounded-full font-mono text-sm transition-colors duration-500 ${
                      i <= active ? "bg-signal-400 text-ink-950" : "bg-ink-800 text-[var(--text-inverse-muted)]"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <span className="font-mono text-xs text-[var(--text-inverse-muted)] sm:hidden">{chapter.n}</span>
                </div>
                <h3
                  className="m-0 font-display text-[var(--fs-h1)] font-medium leading-[0.95] tracking-[-0.04em]"
                  style={{ fontVariationSettings: "'wdth' 88" }}
                >
                  {chapter.title}
                </h3>
                <p className="m-0 max-w-[520px] text-[17px] leading-relaxed text-[var(--text-inverse-muted)]">{chapter.body}</p>
                {chapter.image && (
                  <div className="relative h-[220px] overflow-hidden rounded-[var(--radius-lg)] bg-ink-900 sm:h-[300px]">
                    {"fit" in chapter && chapter.fit === "contain" && (
                      <div
                        aria-hidden
                        className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-400/20 blur-[50px]"
                      />
                    )}
                    <Image
                      src={chapter.image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 480px, 100vw"
                      className={"fit" in chapter && chapter.fit === "contain" ? "relative object-contain p-8" : "object-cover opacity-90"}
                    />
                  </div>
                )}
                {chapter.tags && (
                  <div className="flex flex-wrap gap-2">
                    {chapter.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-[var(--radius-pill)] border border-[var(--border-inverse)] px-4 py-2 text-sm text-[var(--text-inverse-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
