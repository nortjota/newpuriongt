// Divisor decorativo entre seções de fundo claro que, de outra forma, ficam
// coladas sem nenhuma quebra visual — uma estrada sinuosa (linha tracejada,
// como faixa de pista) com marcas de pneu espalhadas pelo caminho.
export default function RoadDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none mx-auto max-w-[var(--content-max)] px-6">
      <svg
        viewBox="0 0 1440 90"
        fill="none"
        className="h-[56px] w-full sm:h-[84px]"
        preserveAspectRatio="none"
        style={{ transform: flip ? "scaleY(-1)" : undefined }}
      >
        <path
          d="M0 45 C 180 10, 360 80, 540 45 S 900 10, 1080 45 S 1350 10, 1440 45"
          stroke="var(--border-strong)"
          strokeWidth="2"
          strokeDasharray="14 10"
          strokeLinecap="round"
        />
        <g opacity=".3">
          <ellipse cx="258" cy="28" rx="5" ry="10" fill="var(--ink-950)" transform="rotate(-24 258 28)" />
          <ellipse cx="280" cy="44" rx="5" ry="10" fill="var(--ink-950)" transform="rotate(-24 280 44)" />
          <ellipse cx="1036" cy="62" rx="5" ry="10" fill="var(--ink-950)" transform="rotate(18 1036 62)" />
          <ellipse cx="1058" cy="46" rx="5" ry="10" fill="var(--ink-950)" transform="rotate(18 1058 46)" />
        </g>
        <circle cx="720" cy="45" r="4.5" fill="var(--signal-400)" />
      </svg>
    </div>
  );
}
