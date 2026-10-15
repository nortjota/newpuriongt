export type QuizLayer = 1 | 2 | 3;

export const QUIZ_QUESTIONS: {
  q: string;
  options: { label: string; icon: string; layer: QuizLayer }[];
}[] = [
  {
    q: "Onde você mais dirige?",
    options: [
      { label: "Cidade, no dia a dia", icon: "building-2", layer: 1 },
      { label: "Estrada, longas distâncias", icon: "route", layer: 3 },
      { label: "À noite, sem pressa", icon: "moon", layer: 2 },
    ],
  },
  {
    q: "O que te marca num ambiente?",
    options: [
      { label: "Frescor", icon: "wind", layer: 1 },
      { label: "Elegância", icon: "flower-2", layer: 2 },
      { label: "Intensidade", icon: "flame", layer: 3 },
    ],
  },
  {
    q: "Seu carro é…",
    options: [
      { label: "Extensão do escritório", icon: "briefcase", layer: 1 },
      { label: "Um refúgio", icon: "armchair", layer: 2 },
      { label: "Uma declaração", icon: "crown", layer: 3 },
    ],
  },
  {
    q: "Qual horário é o seu?",
    options: [
      { label: "Manhã cedo", icon: "sunrise", layer: 1 },
      { label: "Fim de tarde", icon: "sunset", layer: 2 },
      { label: "Madrugada", icon: "moon-star", layer: 3 },
    ],
  },
  {
    q: "Como quer ser lembrado?",
    options: [
      { label: "Leve e luminoso", icon: "sparkles", layer: 1 },
      { label: "Sofisticado", icon: "gem", layer: 2 },
      { label: "Marcante", icon: "zap", layer: 3 },
    ],
  },
];

export const QUIZ_RESULTS: Record<QuizLayer, { title: string; body: string; notes: string[] }> = {
  1: {
    title: "Abertura luminosa.",
    body: "Seu tempo é a saída: maçã, abacaxi e tangerina recebem você a cada porta aberta.",
    notes: ["Maçã", "Abacaxi", "Tangerina"],
  },
  2: {
    title: "Elegância no habitáculo.",
    body: "Seu tempo é o corpo: rosa, jasmim e baunilha. Sofisticado, sem pedir atenção.",
    notes: ["Rosa", "Jasmim", "Baunilha"],
  },
  3: {
    title: "Presença que fica.",
    body: "Seu tempo é o fundo: couro, âmbar e musgo de carvalho fixam e deixam rastro.",
    notes: ["Musk", "Couro", "Patchouli", "Âmbar", "Musgo de carvalho"],
  },
};
