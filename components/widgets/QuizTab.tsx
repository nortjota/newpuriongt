// Evita `writing-mode` + a propriedade solta `rotate` combinadas (causava o
// bloco preto gigante no mobile) — usa só `transform`, que é previsível em
// qualquer navegador.
export default function QuizTab() {
  return (
    <a
      href="#quiz"
      className="fixed left-0 top-1/2 z-[60] flex items-center gap-2.5 whitespace-nowrap rounded-t-[14px] bg-ink-950 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[var(--ls-caps)] text-paper-0"
      style={{
        transform: "translateY(-50%) rotate(-90deg) translateX(-100%)",
        transformOrigin: "top left",
      }}
    >
      <span className="h-[7px] w-[7px] flex-none rounded-full bg-signal-400" />
      Quiz · 30s
    </a>
  );
}
