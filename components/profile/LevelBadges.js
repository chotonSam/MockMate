import { LEVELS } from "@/lib/topics";

// Fields this person has cleared levels in (a small "achievements" strip)
export default function LevelBadges({ levels, name }) {
  if (levels.length === 0) return null;
  return (
    <section>
      <h2 className="mb-4 font-medium">Levels cleared</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {levels.map((f) => {
          const hasCompleted = f.completed.length > 0;
          return (
            <div
              key={f.key}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition-all hover:border-brand/40 ${
                hasCompleted
                  ? "border-l-4 border-l-signal-green border-ink-line"
                  : "border-ink-line"
              }`}
            >
              <p className="mb-3 truncate font-semibold text-paper" title={`${name} — ${f.label}`}>{f.label}</p>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((l) =>
                  f.completed.includes(l) ? (
                    <span
                      key={l}
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-700 shadow-xs"
                    >
                      ✓ {l}
                    </span>
                  ) : (
                    <span
                      key={l}
                      className="rounded-full border border-ink-line bg-ink px-2 py-0.5 font-mono text-[11px] text-slate-muted"
                    >
                      {l}
                    </span>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
