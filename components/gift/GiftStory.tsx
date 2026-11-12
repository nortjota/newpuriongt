import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "./SectionHeading";

// 2. Seção emocional — o significado de presentear quem ama o próprio carro.
export default function GiftStory() {
  return (
    <section
      id="experiencia"
      aria-labelledby="gift-story-title"
      className="mx-auto grid max-w-[var(--content-max)] scroll-mt-20 items-center gap-12 px-6 py-[var(--section-y)] sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-20"
    >
      <Reveal className="order-2 lg:order-1">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)] bg-ink-900">
          <Image
            src="/images/cenas/foto-somente-carro.webp"
            alt="Carro esportivo prata estacionado numa rua molhada à noite"
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-[var(--scrim-bottom)]" />
        </div>
      </Reveal>

      <Reveal className="order-1 flex flex-col gap-10 lg:order-2">
        <SectionHeading id="gift-story-title" eyebrow="O significado" title="Não é só um carro. É uma conquista.">
          <p className="m-0">
            Para quem ama carros, o carro guarda histórias: a primeira parcela paga, a viagem de férias, o domingo
            dedicado a deixar tudo impecável. É extensão de quem ele é.
          </p>
        </SectionHeading>
        <div className="grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-2">
          <p className="m-0 text-[15px] leading-relaxed text-paper-0/65">
            Presentear essa pessoa é reconhecer o cuidado que ela tem com o que conquistou. Não é sobre mais um objeto
            — é sobre entender o que importa para ela.
          </p>
          <p className="m-0 text-[15px] leading-relaxed text-paper-0/65">
            O PURION GT entra nesse universo como um detalhe que ela vai sentir toda vez que abrir a porta. E, a cada
            trajeto, lembrar de quem deu.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
