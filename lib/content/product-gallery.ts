import type { Plan } from "./plans";

export const PRODUCT_GALLERY = [
  { src: "/product-studio.png", alt: "Frasco PURION GT 60 ml em estúdio" },
  { src: "/images/produto/produto-frente.webp", alt: "Frasco PURION GT 60 ml de frente" },
  { src: "/images/produto/produto-detalhe.webp", alt: "Detalhe da tampa do frasco PURION GT" },
  { src: "/images/produto/produto-carros-atras.webp", alt: "Frasco PURION GT com carros ao fundo" },
  { src: "/images/produto/produto-borrifando.webp", alt: "Borrifando o PURION GT no carro" },
  { src: "/images/produto/produto-ugc-segurando-frasco.webp", alt: "Cliente segurando o frasco PURION GT" },
];

// Kit 2 e Kit 3 trocam a imagem principal da galeria por uma foto própria do
// kit (sem miniaturas de detalhe, já que só existe 1 ângulo de cada kit).
// Unidade e Assinatura usam a mesma galeria (PRODUCT_GALLERY, começando na
// imagem de frente).
export const PLAN_GALLERY_IMAGE: Partial<Record<Plan["id"], { src: string; alt: string }>> = {
  k2: { src: "/images/kits/kit-2.webp", alt: "Kit com 2 frascos PURION GT" },
  k3: { src: "/images/kits/kit-3.webp", alt: "Kit com 3 frascos PURION GT" },
};
