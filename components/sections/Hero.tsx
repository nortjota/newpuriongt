export default function Hero() {
  return (
    <section
      className="relative m-[10px] overflow-hidden rounded-[var(--radius-lg)] bg-ink-900"
      style={{ aspectRatio: "1672/941", minHeight: 420 }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/hero-banner.png)" }}
      />
      <div className="absolute inset-0" style={{ background: "var(--scrim-top)" }} />

      <a
        href="#comprar"
        aria-label="Conheça o Purion GT"
        className="absolute rounded-full"
        style={{ left: "5.2%", top: "56.6%", width: "16.8%", height: "7%" }}
      />

      <div className="hidden sm:flex absolute right-6 bottom-6 items-center gap-2 rounded-full px-4 py-2 text-[13px] text-paper-0 backdrop-blur-md border border-[var(--border-glass)] bg-[var(--surface-glass-dark)]">
        <span className="font-mono">4.9</span>
        <span className="opacity-80">· 100+ avaliações verificadas</span>
      </div>
    </section>
  );
}
