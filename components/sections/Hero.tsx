"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

const SLIDE_INTERVAL_MS = 6000;

type Slide =
  | { type: "image"; desktop: string; mobile: string; alt: string }
  | { type: "video"; src: string; poster: string; alt: string };

// Os 2 banners de imagem já têm o texto embutido na própria imagem — por
// isso não há headline/CTA sobreposto aqui, só o badge de avaliação (chrome
// de UI, não copy de marketing) e os indicadores de slide.
const SLIDES: Slide[] = [
  {
    type: "video",
    src: "/videos/comercial.mp4",
    poster: "/images/videos/comercial-poster.webp",
    alt: "Vídeo comercial Purion GT",
  },
  {
    type: "image",
    desktop: "/images/slideshow/slideshow-1.webp",
    mobile: "/images/slideshow/slideshow-1-mobile.webp",
    alt: 'Homem segura o frasco Purion GT cercado de frutas e flores, carro branco ao fundo — "Seu carro também tem assinatura."',
  },
  {
    type: "image",
    desktop: "/images/slideshow/slideshow-2.webp",
    mobile: "/images/slideshow/slideshow-2-mobile.webp",
    alt: 'Frasco Purion GT sobre o console de um carro premium — "O perfume automotivo premium do Brasil."',
  },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Os banners mobile são quadrados (1:1) — numa seção alta tipo "min-h-80svh"
  // o object-cover cortava boa parte da imagem (e do texto embutido nela).
  // Em telas <768px a seção vira aspect-square (mostra a imagem inteira) e o
  // parallax de scroll fica desligado, já que não sobra margem de corte.
  //
  // Inicializador "preguiçoso" (função, não valor) — roda de novo durante a
  // primeira renderização no cliente (hidratação), então `isMobile` já sai
  // correto nesse primeiro render, sem esperar um efeito rodar depois pra
  // corrigir. Antes, `useState(false)` sempre começava assumindo desktop por
  // um ciclo de render inteiro: o efeito de play do vídeo (abaixo) rodava
  // uma primeira vez com isMobile ainda falso (não chamava play()), e só
  // tentava de verdade no SEGUNDO ciclo — exatamente a janela em que a
  // reprodução falhava silenciosamente na primeira visita.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const y = useTransform(scrollY, [0, 1200], [0, reduceMotion || isMobile ? 0 : 240]);

  const [slide, setSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Dá play só no vídeo do slide ativo (e pausa os demais) assim que o
  // carrossel chega nele — sem precisar de clique, igual à galeria do produto.
  // No desktop o slide de vídeo mostra só o poster estático (ver JSX), então
  // não tem vídeo rodando ali pra dar play.
  //
  // play() pode rejeitar por um motivo transitório (o elemento ainda não
  // tinha dados suficientes no instante exato da chamada) sem que seja
  // bloqueio real de política de autoplay — como é muted, a política em si
  // não deveria barrar. Sem nenhum retry, essa rejeição ficava sem
  // tratamento nenhum (catch vazio) e o vídeo só voltava a tentar tocar
  // quando `slide`/`isMobile` mudassem de novo (ex: o usuário trocar de
  // slide e voltar) — daí o sintoma relatado. Uma única retentativa,
  // amarrada ao evento `canplay` do próprio elemento (não timer/polling),
  // cobre esse caso. `NotAllowedError` é bloqueio real do navegador — nesse
  // caso não insiste.
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    SLIDES.forEach((s, i) => {
      if (s.type !== "video") return;
      const el = videoRefs.current[i];
      if (!el) return;

      if (i !== slide || !isMobile) {
        el.pause();
        return;
      }

      if (!el.paused) return; // já tocando — evita play() redundante

      el.play().catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "NotAllowedError") return;
        const retry = () => {
          el.play().catch(() => {});
        };
        el.addEventListener("canplay", retry, { once: true });
        cleanups.push(() => el.removeEventListener("canplay", retry));
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [slide, isMobile]);

  function next() {
    setSlide((s) => (s + 1) % SLIDES.length);
  }

  // O slide 0 (vídeo) não existe no desktop (ver JSX) — sempre que o
  // carrossel cai nele por lá (no mount ou ao dar a volta), pula direto pro
  // próximo. Checa a media query na hora, sem depender do estado `isMobile`
  // (que só é setado um instante depois do mount), pra não ter o risco de
  // pular um mobile de verdade antes da detecção real acontecer.
  useEffect(() => {
    if (slide !== 0) return;
    if (!window.matchMedia("(max-width: 767px)").matches) setSlide(1);
  }, [slide]);

  // Slides de imagem avançam no timer de sempre. No mobile, o slide de vídeo
  // não usa timer — ele avança sozinho quando o vídeo termina (onEnded), pra
  // deixar o comercial rodar até o fim antes de trocar. No desktop esse
  // mesmo slide mostra só o poster estático, então avança no timer normal.
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (SLIDES[slide].type === "video" && isMobile) return;
    timerRef.current = setInterval(next, SLIDE_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slide, isMobile]);

  function goTo(i: number) {
    setSlide(i);
  }

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-ink-900 aspect-square md:aspect-auto md:min-h-[90svh]"
    >
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        {SLIDES.map((s, i) => (
          <motion.div
            key={s.type === "video" ? s.src : s.desktop}
            className="absolute inset-0"
            initial={false}
            animate={{ x: `${(i - slide) * 100}%` }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={reduceMotion || i !== 0 ? false : { scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {s.type === "video" ? (
                <>
                  {/* O vídeo fonte é vertical (9:16); num banner largo de
                      desktop ele precisava ser ampliado muito além da
                      resolução original e ficava borrado/esticado. Por
                      pedido, esse slide inteiro some no desktop — nem vídeo
                      nem imagem/poster (o useEffect acima pula ele direto
                      pro próximo slide por lá). O mobile (aspect-square)
                      continua com o vídeo tocando, igual sempre foi. */}
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    src={s.src}
                    poster={s.poster}
                    aria-label={s.alt}
                    muted
                    playsInline
                    preload={i === 0 && isMobile ? "auto" : "none"}
                    onEnded={next}
                    className="absolute inset-0 h-full w-full object-cover md:hidden"
                  />
                </>
              ) : (
                <picture>
                  <source media="(max-width: 767px)" srcSet={s.mobile} />
                  <img
                    src={s.desktop}
                    alt={s.alt}
                    loading={i === 1 ? "eager" : "lazy"}
                    fetchPriority={i === 1 ? "high" : "auto"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </picture>
              )}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      <div className="absolute inset-0" style={{ background: "var(--scrim-top)" }} />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
        className="hidden sm:flex absolute right-6 bottom-6 items-center gap-2 rounded-full px-4 py-2 text-[13px] text-paper-0 backdrop-blur-md border border-[var(--border-glass)] bg-[var(--surface-glass-dark)]"
      >
        <span className="font-mono">4.9</span>
        <span className="opacity-80">· 450+ avaliações verificadas</span>
      </motion.div>

      {SLIDES.length > 1 && (
        <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              aria-label={`Banner ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${s.type === "video" ? "md:hidden" : ""}`}
              style={{ width: i === slide ? 24 : 8, background: i === slide ? "var(--signal-400)" : "rgba(255,255,255,.4)" }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
