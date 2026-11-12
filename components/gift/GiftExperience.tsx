import Image from "next/image";
import { Layers, Package, ShieldCheck, Truck } from "lucide-react";
import { GIFT_FEATURES } from "@/lib/content/gifts";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "./SectionHeading";
import DedicationComposer from "./DedicationComposer";
import { EXPERIENCE_ID } from "./ids";

const POINTS = [
  {
    icon: Package,
    title: "Apresentação",
    text: GIFT_FEATURES.giftWrap
      ? "Frasco de vidro 60 ml na caixa original, com embalagem de presente."
      : "Frasco de vidro de 60 ml, protegido na caixa preta original da marca — a mesma de todo pedido.",
  },
  { icon: Truck, title: "Entrega", text: "Envio no mesmo dia da aprovação, com rastreio, para todo o Brasil. Prazo e frete no checkout pelo CEP." },
  { icon: Layers, title: "Facilidade de escolha", text: "Três opções com o mesmo perfume. Você só decide quantos frascos." },
  { icon: ShieldCheck, title: "Troca sem complicação", text: "Até 7 dias após o recebimento para solicitar a devolução." },
];

// 5. Experiência de presentear — o produto real como ele chega + dedicatória.
export default function GiftExperience() {
  return (
    <section
      id={EXPERIENCE_ID}
      aria-labelledby="gift-experience-title"
      className="scroll-mt-20 bg-ink-900/60 py-[var(--section-y)]"
    >
      <div className="mx-auto max-w-[var(--content-max)] px-6 sm:px-10">
        <Reveal>
          <SectionHeading id="gift-experience-title" eyebrow="A experiência de presentear" title="A experiência de presentear.">
            <p className="m-0">
              Fácil de escolher, chega bem protegido e, se você quiser, acompanha uma dedicatória escrita por você.
            </p>
          </SectionHeading>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-[1.2fr_1fr] lg:gap-5">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-ink-800 md:aspect-auto md:min-h-[460px]">
            <Image
              src="/images/cenas/cena-mesa-expedicao.webp"
              alt="Mãos abrindo a caixa de envio com o frasco PURION GT 60 ml ao lado da caixa preta original da marca"
              fill
              loading="lazy"
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={80} className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-ink-800 md:aspect-auto md:min-h-[460px]">
            <Image
              src="/images/cenas/dentro-da-porsche.webp"
              alt="Rapaz sentado num conversível segurando a caixa do PURION GT"
              fill
              loading="lazy"
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <ul className="m-0 flex list-none flex-col divide-y divide-white/10 border-y border-white/10 p-0">
              {POINTS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4 py-6">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/15 text-paper-0">
                    <Icon size={17} aria-hidden />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-[16px] font-medium text-paper-0">{title}</span>
                    <span className="text-[14px] leading-relaxed text-paper-0/60">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <DedicationComposer />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
