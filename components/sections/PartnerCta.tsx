import { Handshake } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/content/whatsapp";

const PARTNER_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  "Olá! Quero saber mais sobre me tornar parceiro/revendedor do Purion GT."
)}`;

export default function PartnerCta() {
  return (
    <section id="parceiros" className="mx-auto max-w-[var(--content-max)] px-6 pb-[var(--section-y)]">
      <div className="flex flex-col items-center gap-5 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-paper-0 px-6 py-10 text-center sm:flex-row sm:justify-between sm:px-10 sm:text-left">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5">
          <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-paper-100">
            <Handshake size={24} />
          </span>
          <div className="flex flex-col gap-1.5">
            <h3
              className="m-0 font-display text-2xl font-medium tracking-[-0.03em] sm:text-3xl"
              style={{ fontVariationSettings: "'wdth' 88" }}
            >
              Quer revender o Purion GT?
            </h3>
            <p className="m-0 max-w-[460px] text-sm leading-relaxed text-[var(--text-secondary)]">
              Estéticas automotivas, lojas de acessórios e detailers podem vender o Purion GT no próprio espaço.
              Fale com a gente e saiba as condições.
            </p>
          </div>
        </div>
        <a
          href={PARTNER_URL}
          target="_blank"
          rel="noreferrer"
          className="flex-none rounded-[var(--radius-pill)] bg-ink-950 px-6 py-4 text-sm font-medium text-paper-0 transition-transform hover:-translate-y-0.5"
        >
          Quero ser parceiro
        </a>
      </div>
    </section>
  );
}
