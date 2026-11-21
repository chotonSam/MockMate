import AnimatedBar from "@/components/motion/AnimatedBar";
import { toneBg } from "@/lib/data";

export default function CategoryBreakdown({ items }) {
  return (
    <div className="rounded-2xl border border-ink-line bg-white p-6 shadow-card">
      <div className="mb-6 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand" aria-hidden="true">≡</span>
        <h2 className="font-display text-lg text-paper">By category</h2>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-muted">Your category scores will appear after your first completed interview.</p>
      ) : (
        <ul className="divide-y divide-ink-line">
          {items.map((c, i) => (
            <li key={c.name} className="py-4 first:pt-0 last:pb-0">
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-paper">{c.name}</span>
                <span className="font-mono text-xs rounded-full border border-ink-line bg-ink px-2.5 py-0.5 text-slate-muted font-semibold tabular-nums">{c.score}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-ink-muted">
                <AnimatedBar percent={c.score} delay={0.2 + i * 0.1} className={toneBg[c.tone]} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
