// Divisor minimalista entre seções de fundo claro que ficam coladas sem
// nenhuma quebra visual — uma linha fina com um ponto central, no mesmo
// espírito das linhas-separadoras já usadas em "Sobre a marca" e nos cards
// da pirâmide.
export default function SectionDivider() {
  return (
    <div aria-hidden className="mx-auto flex max-w-[var(--content-max)] items-center gap-4 px-6 py-8 sm:py-10">
      <span className="h-px flex-1 bg-[var(--border-strong)]" />
      <span className="h-1.5 w-1.5 flex-none rounded-full bg-signal-400" />
      <span className="h-px flex-1 bg-[var(--border-strong)]" />
    </div>
  );
}
