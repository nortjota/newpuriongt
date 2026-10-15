export const NOTE_COLORS: Record<string, string> = {
  Maçã: "oklch(0.74 0.17 135)",
  Abacaxi: "oklch(0.86 0.16 95)",
  Tangerina: "oklch(0.73 0.18 55)",
  Rosa: "oklch(0.7 0.15 0)",
  Jasmim: "oklch(0.94 0.04 95)",
  Baunilha: "oklch(0.85 0.08 80)",
  Musk: "oklch(0.84 0.02 300)",
  Couro: "oklch(0.5 0.07 45)",
  Patchouli: "oklch(0.54 0.08 70)",
  Âmbar: "oklch(0.74 0.15 65)",
  "Musgo de carvalho": "oklch(0.54 0.08 135)",
};

export const FRAGRANCE_LAYERS = [
  {
    key: "Saída",
    band: "oklch(0.8 0.15 90 / .22)",
    glow: "oklch(0.8 0.16 95)",
    text: "Abertura fresca e frutada que desperta os sentidos.",
    notes: ["Maçã", "Abacaxi", "Tangerina"],
  },
  {
    key: "Corpo",
    band: "oklch(0.7 0.14 0 / .22)",
    glow: "oklch(0.72 0.15 0)",
    text: "Coração floral, sofisticado e elegante, que revela personalidade.",
    notes: ["Rosa", "Jasmim", "Baunilha"],
  },
  {
    key: "Fundo",
    band: "oklch(0.6 0.1 55 / .28)",
    glow: "oklch(0.66 0.13 60)",
    text: "Base amadeirada, intensa e marcante, que fixa e deixa rastro.",
    notes: ["Musk", "Couro", "Patchouli", "Âmbar", "Musgo de carvalho"],
  },
];

export const ACCORDS = [
  { key: "frutado", pct: 96, color: "oklch(0.66 0.19 35)", dark: true },
  { key: "amadeirado", pct: 90, color: "oklch(0.45 0.08 55)", dark: false },
  { key: "couro", pct: 84, color: "oklch(0.4 0.05 40)", dark: false },
  { key: "doce", pct: 78, color: "oklch(0.58 0.17 20)", dark: false },
  { key: "floral", pct: 72, color: "oklch(0.74 0.12 350)", dark: true },
  { key: "âmbar", pct: 68, color: "oklch(0.72 0.14 70)", dark: true },
  { key: "cítrico", pct: 62, color: "oklch(0.82 0.15 110)", dark: true },
  { key: "almiscarado", pct: 58, color: "oklch(0.72 0.03 300)", dark: true },
  { key: "musgo", pct: 50, color: "oklch(0.45 0.07 135)", dark: false },
];

export const SEASONS = [
  { key: "Inverno", icon: "snowflake", pct: 82, color: "var(--ice-400)" },
  { key: "Primavera", icon: "flower-2", pct: 70, color: "oklch(0.78 0.14 140)" },
  { key: "Verão", icon: "sun", pct: 56, color: "var(--sun-400)" },
  { key: "Outono", icon: "leaf", pct: 90, color: "oklch(0.7 0.13 55)" },
  { key: "Dia", icon: "sun-medium", pct: 68, color: "var(--sun-600)" },
  { key: "Noite", icon: "moon", pct: 94, color: "var(--ice-600)" },
];

export const PERFORMANCE = [
  { key: "Fixação", label: "Alta", segments: 5 },
  { key: "Projeção", label: "Marcante", segments: 4 },
  { key: "Rastro", label: "Presente", segments: 4 },
  { key: "Doçura", label: "Equilibrada", segments: 3 },
];
