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
  // Nomes atuais (pedido do usuário). As chaves antigas "Âmbar"/"Musgo de
  // carvalho" continuam abaixo só porque lib/content/quiz.ts ainda referencia
  // esses nomes num bloco fora do escopo desta troca — não remover sem
  // atualizar quiz.ts junto.
  Ambergris: "oklch(0.74 0.15 65)",
  "Musgo de Carvalho": "oklch(0.54 0.08 135)",
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
    image: { src: "/images/piramide/piramide-saida.webp", alt: "Maçã, abacaxi e tangerina — notas de saída" },
  },
  {
    key: "Corpo",
    band: "oklch(0.7 0.14 0 / .22)",
    glow: "oklch(0.72 0.15 0)",
    text: "Coração floral, sofisticado e elegante, que revela personalidade.",
    notes: ["Rosa", "Jasmim", "Baunilha"],
    image: { src: "/images/piramide/piramide-corpo.webp", alt: "Rosa, jasmim e baunilha — notas de corpo" },
  },
  {
    key: "Fundo",
    band: "oklch(0.6 0.1 55 / .28)",
    glow: "oklch(0.66 0.13 60)",
    text: "Base amadeirada, intensa e marcante, que fixa e deixa rastro.",
    notes: ["Musk", "Couro", "Patchouli", "Ambergris", "Musgo de Carvalho"],
    image: { src: "/images/piramide/piramide-fundo.webp", alt: "Couro, musgo de carvalho e patchouli — notas de fundo" },
  },
];

export const ACCORDS = [
  { key: "Frutado", pct: 100, color: "oklch(0.66 0.19 35)", dark: true },
  { key: "Amadeirado", pct: 100, color: "oklch(0.45 0.08 55)", dark: false },
  { key: "Couro", pct: 72, color: "oklch(0.4 0.05 40)", dark: false },
  { key: "Cítrico", pct: 64, color: "oklch(0.82 0.15 110)", dark: true },
  { key: "Esfumaçado", pct: 58, color: "oklch(0.4 0.02 260)", dark: false },
  { key: "Fresco", pct: 52, color: "oklch(0.82 0.1 190)", dark: true },
  { key: "Almiscarado", pct: 46, color: "oklch(0.72 0.03 300)", dark: true },
  { key: "Tropical", pct: 40, color: "oklch(0.78 0.16 75)", dark: true },
  { key: "Doce", pct: 34, color: "oklch(0.58 0.17 20)", dark: false },
  { key: "Musgoso", pct: 28, color: "oklch(0.45 0.07 135)", dark: false },
];

// Perfume automotivo: não tem estação certa, é pra usar sempre — por isso
// "quando usar" virou ocasião, não sazonalidade.
export const OCCASIONS = [
  { key: "Dia a dia", icon: "sun-medium" },
  { key: "Trabalho", icon: "briefcase" },
  { key: "Estrada", icon: "map-pin" },
  { key: "Encontros", icon: "heart" },
  { key: "Qualquer clima", icon: "cloud" },
  { key: "A qualquer hora", icon: "clock" },
];

export const PERFORMANCE = [
  { key: "Fixação", label: "Alta", segments: 4 },
  { key: "Projeção", label: "Marcante", segments: 4 },
  { key: "Discrição", label: "Elegante", segments: 4 },
  { key: "Resistência ao calor", label: "Média", segments: 2.5 },
];

export const FRAGRANCE_FAMILY = "Amadeirada Couro";
