// Depoimentos reais — NÃO inventar novos nomes/cidades/textos aqui.
// Adicionar os próximos depoimentos enviados pelo usuário diretamente nesta lista.
export type TestimonialOrigin = "cliente" | "parceiro";

export type Testimonial = {
  name: string;
  city: string;
  text: string;
  origin: TestimonialOrigin;
  photo?: string;
  link?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Gilson",
    city: "Itajaí/SC",
    text: "Tô usando há um tempinho e gostei bastante do cheiro. É bem diferente desses de loja, mais suave mesmo. Todo mundo que entra no carro pergunta o que é.",
    origin: "cliente",
  },
  {
    name: "Marcos",
    city: "Belo Horizonte/MG",
    text: "Comprei meio na dúvida mas valeu a pena. O cheiro dura bem mais que os outros que eu já usei e o frasco é bonito, fica até bem no porta-luvas.",
    origin: "cliente",
  },
  {
    name: "Carlos",
    city: "Brasília/DF",
    text: "Gostei demais, sinceramente. Comprei mais por curiosidade e acabou sendo um dos melhores que já usei no carro. Recomendo.",
    origin: "cliente",
  },
  {
    name: "Felipe",
    city: "Itajaí/SC",
    text: "Chegou certinho, embalagem bonita. O cheiro é suave e dura bastante, gostei bem mais do que eu esperava.",
    origin: "cliente",
  },
  {
    name: "Rodrigo",
    city: "São Paulo/SP",
    text: "Muito bom, superou minha expectativa. O carro fica com um cheiro discreto e agradável, nada enjoativo.",
    origin: "cliente",
  },
];
