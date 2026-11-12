// Estado de carregamento da rota (exibido durante navegação/streaming).
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[100svh] flex-1 flex-col bg-ink-950 px-6 pt-28 sm:px-10"
    >
      <span className="sr-only">Carregando presentes…</span>
      <div className="mx-auto grid w-full max-w-[var(--content-max)] gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div className="h-3 w-40 animate-pulse rounded-full bg-white/10" />
          <div className="h-12 w-full max-w-[560px] animate-pulse rounded-2xl bg-white/10" />
          <div className="h-12 w-4/5 max-w-[460px] animate-pulse rounded-2xl bg-white/10" />
          <div className="h-5 w-3/5 animate-pulse rounded-full bg-white/[0.07]" />
          <div className="mt-2 h-12 w-56 animate-pulse rounded-full bg-white/10" />
        </div>
        <div className="aspect-[16/10] w-full animate-pulse rounded-[var(--radius-lg)] bg-white/[0.06] lg:aspect-[4/5]" />
      </div>
    </div>
  );
}
