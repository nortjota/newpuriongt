import { MessageCircle } from "lucide-react";
import { GIFT_FAQ } from "@/lib/content/gifts";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "./SectionHeading";
import Accordion from "./Accordion";
import { GiftLink } from "./GiftButton";

const WHATSAPP_GIFT_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  "Olá! Quero tirar uma dúvida sobre presentear com o PURION GT."
)}`;

// 8. FAQ de presente.
export default function GiftFaq() {
  return (
    <section
      id="faq"
      aria-labelledby="gift-faq-title"
      className="mx-auto grid max-w-[var(--content-max)] scroll-mt-20 gap-12 px-6 py-[var(--section-y)] sm:px-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20"
    >
      <Reveal className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
        <SectionHeading id="gift-faq-title" eyebrow="Dúvidas" title="Antes de presentear.">
          <p className="m-0">Ficou alguma pergunta? A gente responde rápido no WhatsApp.</p>
        </SectionHeading>
        <GiftLink href={WHATSAPP_GIFT_URL} target="_blank" rel="noreferrer" variant="ghost" className="self-start">
          <MessageCircle size={16} aria-hidden />
          Falar no WhatsApp
        </GiftLink>
      </Reveal>
      <Reveal delay={80}>
        <Accordion items={GIFT_FAQ} />
      </Reveal>
    </section>
  );
}
