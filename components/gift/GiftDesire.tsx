import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "./SectionHeading";

const NOTES = [
  { layer: "Saída", notes: "Maçã, abacaxi e tangerina" },
  { layer: "Corpo", notes: "Rosa, jasmim e baunilha" },
  { layer: "Fundo", notes: "Couro, musk e patchouli" },
];

// 7. Desejo — storytelling sensorial (notas reais de lib/content/fragrance.ts).
export default function GiftDesire() {
  return (
    <section aria-labelledby="gift-desire-title" className="relative isolate overflow-hidden">
      <div className="mx-auto grid max-w-[var(--content-max)] items-center gap-12 px-6 pb-[var(--section-y)] sm:px-10 lg:grid-cols-2 lg:gap-20">
        <Reveal className="flex flex-col gap-10">
          <SectionHeading id="gift-desire-title" eyebrow="A experiência" title="O detalhe que transforma cada trajeto.">
            <p className="m-0">
              A porta abre e o carro já recebe quem chega. Uma abertura fresca de frutas, um coração floral elegante e
              um fundo amadeirado de couro que permanece — discreto, presente, inconfundível.
            </p>
            <p className="m-0 mt-4">
              Algumas borrifadas no carpete ou nos bancos de tecido bastam. Sem resíduo no painel, sem cheiro
              artificial. Só o cuidado de quem trata o próprio carro como algo único.
            </p>
          </SectionHeading>
          <dl className="m-0 grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-white/10 sm:grid-cols-3">
            {NOTES.map((n) => (
              <div key={n.layer} className="flex flex-col gap-1.5 bg-ink-950 p-5">
                <dt className="text-[11px] uppercase tracking-[var(--ls-caps)] text-paper-0/45">{n.layer}</dt>
                <dd className="m-0 text-[14px] leading-snug text-paper-0">{n.notes}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={80} className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-ink-900">
          <Image
            src="/images/produto/produto-borrifando.webp"
            alt="Mão borrifando o PURION GT dentro de um carro com volante esportivo"
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
