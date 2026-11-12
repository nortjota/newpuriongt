import { GIFT_STEPS } from "@/lib/content/gifts";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "./SectionHeading";

// 6. Como funciona — três passos.
export default function GiftHowItWorks() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="gift-how-title"
      className="mx-auto max-w-[var(--content-max)] scroll-mt-20 px-6 py-[var(--section-y)] sm:px-10"
    >
      <Reveal>
        <SectionHeading id="gift-how-title" eyebrow="Como funciona" title="Como funciona." />
      </Reveal>
      <ol className="m-0 mt-12 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {GIFT_STEPS.map((step, i) => (
          <li key={step.title}>
            <Reveal delay={i * 80} className="flex h-full flex-col gap-10 rounded-[var(--radius-md)] border border-white/10 p-7">
              <span className="font-mono text-[13px] text-[var(--gift-accent)]" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex flex-col gap-2.5">
                <span
                  className="font-display text-[26px] font-medium leading-[1.05] tracking-[-0.03em] text-paper-0"
                  style={{ fontVariationSettings: "'wdth' 92" }}
                >
                  <span className="sr-only">Passo {i + 1}: </span>
                  {step.title}
                </span>
                <span className="text-[14px] leading-relaxed text-paper-0/60">{step.text}</span>
              </span>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
