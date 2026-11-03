import type { Plan } from "./plans";

export type GalleryItem =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster: string; alt: string };

export const PRODUCT_GALLERY: GalleryItem[] = [
  { type: "image", src: "/product-studio.png", alt: "Frasco PURION GT 60 ml em estúdio" },
  { type: "video", src: "/videos/comercial.mp4", poster: "/images/videos/comercial-poster.webp", alt: "Vídeo comercial PURION GT" },
  { type: "image", src: "/images/produto/produto-frente.webp", alt: "Frasco PURION GT 60 ml de frente" },
  { type: "image", src: "/images/produto/produto-detalhe.webp", alt: "Detalhe da tampa do frasco PURION GT" },
  { type: "image", src: "/images/produto/produto-carros-atras.webp", alt: "Frasco PURION GT com carros ao fundo" },
  { type: "image", src: "/images/produto/produto-borrifando.webp", alt: "Borrifando o PURION GT no carro" },
  { type: "video", src: "/videos/unboxing.mp4", poster: "/images/videos/unboxing-poster.webp", alt: "Vídeo de unboxing PURION GT" },
  { type: "image", src: "/images/produto/produto-ugc-segurando-frasco.webp", alt: "Cliente segurando o frasco PURION GT" },
];

// Kit 2 e Kit 3 trocam a imagem principal da galeria por uma foto própria do
// kit (sem miniaturas de detalhe, já que só existe 1 ângulo de cada kit).
// Unidade e Assinatura usam a mesma galeria (PRODUCT_GALLERY, começando na
// imagem principal em estúdio).
export const PLAN_GALLERY_IMAGE: Partial<Record<Plan["id"], GalleryItem>> = {
  k2: { type: "image", src: "/images/kits/kit-2.webp", alt: "Kit com 2 frascos PURION GT" },
  k3: { type: "image", src: "/images/kits/kit-3.webp", alt: "Kit com 3 frascos PURION GT" },
};
