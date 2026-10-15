export default function QuizTab() {
  return (
    <a
      href="#quiz"
      className="fixed left-0 top-1/2 z-[60] flex -translate-y-1/2 items-center gap-2.5 rounded-r-[14px] bg-ink-950 px-2.5 py-4.5 text-[11px] font-medium uppercase tracking-[var(--ls-caps)] text-paper-0 transition-[padding] hover:pl-4"
      style={{ writingMode: "vertical-rl", rotate: "180deg" }}
    >
      <span className="h-[7px] w-[7px] rounded-full bg-signal-400" />
      Quiz · 30s
    </a>
  );
}
