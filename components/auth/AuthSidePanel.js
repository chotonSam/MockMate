const reasons = [
  "Every mock interview and score is kept in your history.",
  "Post and comment in the community under your own profile.",
  "Get resource recommendations based on your weak spots.",
];

export default function AuthSidePanel() {
  return (
    <div className="relative hidden lg:block">
      {/* Ambient glow */}
      <div className="absolute -inset-8 rounded-full bg-indigo/10 blur-3xl" />
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-brand/5 to-transparent blur-xl" />

      <div className="relative overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/10 via-white to-white p-8 shadow-xl">
        {/* Decorative corner glow */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand/10 blur-2xl" />

        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-brand font-semibold">Why create an account</p>
        <h2 className="mb-8 font-display text-3xl leading-tight text-paper">
          Your practice, saved and scored over time.
        </h2>

        <ul className="space-y-6">
          {reasons.map((r, i) => (
            <li key={r} className="flex gap-4">
              {/* Styled numbered chip */}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand/10 font-mono text-sm font-semibold text-brand shadow-sm">
                {i + 1}
              </span>
              <p className="pt-1.5 text-sm leading-relaxed text-slate-muted">{r}</p>
            </li>
          ))}
        </ul>

        {/* Achievement stat bar */}
        <div className="mt-8 rounded-xl border border-ink-line bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-muted">Score improvement, avg.</span>
            <span className="font-mono text-sm font-semibold text-signal-green">+22%</span>
          </div>
          {/* Visual progress bar */}
          <div className="h-1.5 overflow-hidden rounded-full bg-ink-muted">
            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-signal-green/70 to-signal-green" />
          </div>
        </div>
      </div>
    </div>
  );
}
