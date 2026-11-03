export type VideoCategoria = "parceiro" | "cliente";

export type VideoItem = {
  arquivo: string;
  titulo: string;
  handle: string;
  categoria: VideoCategoria;
  poster: string;
};

// titulo e handle ficam vazios de propósito — não inventar; preencher
// manualmente quando os dados reais (nome/@handle de cada criador/cliente)
// forem enviados. categoria foi inferida pelo nome de cada arquivo original
// (prefixo "UGC"/"Comercial"/"Instagram" -> parceiro; "Feedback"/"unboxing"
// -> cliente) e deve ser revisada.
export const VIDEOS: VideoItem[] = [
  { arquivo: "/videos/comercial.mp4", titulo: "", handle: "", categoria: "parceiro", poster: "/images/videos/comercial-poster.webp" },
  { arquivo: "/videos/depois-de-lavar-o-carro.mp4", titulo: "", handle: "", categoria: "cliente", poster: "/images/videos/depois-de-lavar-o-carro-poster.webp" },
  { arquivo: "/videos/feedback-cliente.mp4", titulo: "", handle: "", categoria: "cliente", poster: "/images/videos/feedback-cliente-poster.webp" },
  { arquivo: "/videos/feedback.mp4", titulo: "", handle: "", categoria: "cliente", poster: "/images/videos/feedback-poster.webp" },
  { arquivo: "/videos/feedback-2.mp4", titulo: "", handle: "", categoria: "cliente", poster: "/images/videos/feedback-2-poster.webp" },
  { arquivo: "/videos/instagram.mp4", titulo: "", handle: "", categoria: "parceiro", poster: "/images/videos/instagram-poster.webp" },
  { arquivo: "/videos/dia-dos-pais.mp4", titulo: "", handle: "", categoria: "parceiro", poster: "/images/videos/dia-dos-pais-poster.webp" },
  { arquivo: "/videos/ugc-asmr-homem.mp4", titulo: "", handle: "", categoria: "parceiro", poster: "/images/videos/ugc-asmr-homem-poster.webp" },
  { arquivo: "/videos/ugc-asmr-mulher.mp4", titulo: "", handle: "", categoria: "parceiro", poster: "/images/videos/ugc-asmr-mulher-poster.webp" },
  { arquivo: "/videos/ugc-ia.mp4", titulo: "", handle: "", categoria: "parceiro", poster: "/images/videos/ugc-ia-poster.webp" },
  { arquivo: "/videos/ugc-jujubinha.mp4", titulo: "", handle: "", categoria: "parceiro", poster: "/images/videos/ugc-jujubinha-poster.webp" },
  { arquivo: "/videos/unboxing.mp4", titulo: "", handle: "", categoria: "cliente", poster: "/images/videos/unboxing-poster.webp" },
];
