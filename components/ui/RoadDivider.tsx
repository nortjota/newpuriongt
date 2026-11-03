// Divisor decorativo "uau" entre seções de fundo claro — uma faixa cheia
// (fundo escuro com textura e glow) com uma estrada sinuosa e um carrinho
// desenhado em cima dela, linhas de velocidade e rodas com aro verde-sinal.
export default function RoadDivider({ mirror = false }: { mirror?: boolean }) {
  const uid = mirror ? "b" : "a";
  return (
    <div
      aria-hidden
      className="pointer-events-none relative m-[10px] overflow-hidden rounded-[var(--radius-lg)] bg-ink-950"
    >
      <svg
        viewBox="0 0 1440 220"
        className="h-[150px] w-full sm:h-[220px]"
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: mirror ? "scaleX(-1)" : undefined }}
      >
        <defs>
          <pattern id={`rd-stripes-${uid}`} width="34" height="34" patternTransform="rotate(35)" patternUnits="userSpaceOnUse">
            <rect width="7" height="34" fill="rgba(255,255,255,.045)" />
          </pattern>
          <radialGradient id={`rd-glow-${uid}`} cx="50%" cy="48%" r="55%">
            <stop offset="0%" stopColor="var(--signal-400)" stopOpacity=".22" />
            <stop offset="100%" stopColor="var(--signal-400)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1440" height="220" fill={`url(#rd-stripes-${uid})`} />
        <ellipse cx="640" cy="110" rx="520" ry="150" fill={`url(#rd-glow-${uid})`} />

        <path
          d="M0 160 C 220 110, 380 200, 620 155 S 1040 100, 1260 150 S 1440 175 1440 160"
          stroke="rgba(255,255,255,.4)"
          strokeWidth="3"
          strokeDasharray="24 18"
          fill="none"
          className="rd-dash"
        />

        <g transform="translate(540,86) scale(1.3)">
          <g className="rd-car-bob">
            <g opacity=".55" stroke="var(--signal-400)" strokeWidth="3.5" strokeLinecap="round">
              <line x1="-42" y1="28" x2="-16" y2="28" />
              <line x1="-54" y1="38" x2="-22" y2="38" />
              <line x1="-38" y1="48" x2="-14" y2="48" />
            </g>
            <ellipse cx="82" cy="58" rx="80" ry="8" fill="black" opacity=".4" />
            <path
              d="M10 42 Q10 32 20 30 L35 28 Q48 10 68 8 L104 8 Q118 8 126 20 L136 28 L148 30 Q160 32 160 42 L160 46 L10 46 Z"
              fill="var(--paper-0)"
            />
            <path d="M158 32 L170 38 L163 47 L158 46 Z" fill="var(--paper-0)" />
            <path d="M58 28 L72 12 L100 12 L113 20 L121 28 Z" fill="var(--ink-950)" />
            <line x1="89" y1="12" x2="89" y2="28" stroke="var(--ink-950)" strokeWidth="2.5" />
            <circle cx="165" cy="38" r="3.6" fill="var(--signal-400)" />
            <circle cx="35" cy="46" r="13" fill="var(--ink-900)" stroke="var(--signal-400)" strokeWidth="2.5" />
            <circle cx="136" cy="46" r="13" fill="var(--ink-900)" stroke="var(--signal-400)" strokeWidth="2.5" />
            <circle cx="35" cy="46" r="4.5" fill="var(--signal-400)" opacity=".65" />
            <circle cx="136" cy="46" r="4.5" fill="var(--signal-400)" opacity=".65" />
          </g>
        </g>
      </svg>
    </div>
  );
}
