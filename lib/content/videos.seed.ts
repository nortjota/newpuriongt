// Fontes de vídeo vazias de propósito — ver lib/content/PLACEHOLDERS.md. Thumbnails reusam assets já existentes.
export const VIDEO_TABS = ["Todos", "Parceiros", "Clientes"] as const;

export const VIDEOS_SEED: {
  tab: (typeof VIDEO_TABS)[number];
  handle: string;
  title: string;
  img: string;
  pos: string;
}[] = [
  { tab: "Parceiros", handle: "@creator", title: "Primeira impressão no carro", img: "/hero-banner.png", pos: "72% center" },
  { tab: "Clientes", handle: "@cliente", title: "Unboxing Purion GT", img: "/product-studio.png", pos: "center" },
  { tab: "Clientes", handle: "Gilson · Itajaí/SC", title: "“Todo mundo pergunta o que é”", img: "/hero-street.png", pos: "left center" },
  { tab: "Parceiros", handle: "@creator", title: "Teste de fixação", img: "/hero-street.png", pos: "right center" },
  { tab: "Clientes", handle: "@cliente", title: "POV: entrando no carro", img: "/hero-banner.png", pos: "58% center" },
  { tab: "Clientes", handle: "Marcos · BH/MG", title: "“O frasco fica bonito no porta-luvas”", img: "/product-studio.png", pos: "center" },
  { tab: "Parceiros", handle: "@creator", title: "Review completo", img: "/hero-banner.png", pos: "85% center" },
  { tab: "Clientes", handle: "@cliente", title: "Antes e depois do habitáculo", img: "/hero-street.png", pos: "center" },
];
