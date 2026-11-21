import Link from "next/link";
import Animate from "@/components/motion/Animate";
import Annot from "@/components/Annot";

export default function Hero({ user, stats }) {
  const numbers = stats && [
    { label: "Interviews completed", value: stats.completed.toLocaleString() },
    { label: "Answers scored", value: stats.answers.toLocaleString() },
    { label: "Average score", value: stats.avg !== null ? `${stats.avg}/100` : "—", tone: "text-signal-green" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Mesh-gradient ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-brand/10 blur-[120px]" />
        <div className="absolute -right-16 top-16 h-[400px] w-[400px] rounded-full bg-brand-glow/8 blur-[100px]" />
        {/* Decorative dot-grid */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#8B7FFF" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-16 lg:grid-cols-2 lg:px-10">
        {/* Left */}
        <Animate variant="stagger" scroll={false} stagger={0.12}>
          <p data-reveal-item className="mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-signal-green">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-green shadow-[0_0_6px_#34D399]" />
            AI mock interviews
          </p>
          <h1 data-reveal-item className="mb-6 font-display text-5xl leading-[1.05] sm:text-6xl">
            Walk into the real one
            <br />
            having already had it.
          </h1>
          <p data-reveal-item className="mb-9 max-w-md text-lg leading-relaxed text-slate-muted">
            Quick, real-interview questions — predict the output, spot the bug, handle a scenario — scored by AI in seconds.
            Pass a level to unlock the next one.
          </p>
          <div data-reveal-item className="flex flex-wrap items-center gap-4">
            <Link href={user ? "/interview" : "/auth"} className="btn-primary px-6 py-3.5">
              {user ? "Continue practicing" : "Start a mock interview"} <span aria-hidden="true">→</span>
            </Link>
            <a href="#how-it-works" className="focus-ring rounded px-2 py-3.5 font-medium text-paper/90 hover:text-paper">See how it works</a>
          </div>

          {numbers && (
            <dl data-reveal-item className="mt-14 flex flex-wrap gap-x-10 gap-y-6 font-mono text-sm">
              {numbers.map((s) => (
                <div key={s.label}>
                  <dt className="text-slate-muted">{s.label}</dt>
                  <dd className={`mt-1 text-3xl font-bold tracking-tight ${s.tone ?? "text-paper"}`}>{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Animate>

        {/* Right: annotated transcript (the product, in one picture) */}
        <Animate variant="left" scroll={false} delay={0.35} className="relative">
          {/* Richer ambient glow behind card */}
          <div className="absolute -inset-10 rounded-full bg-brand/15 blur-3xl" />
          <div className="absolute -inset-4 rounded-full bg-indigo/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-brand/30 bg-white shadow-2xl shadow-brand/10 ring-1 ring-brand/10">
            <div className="flex items-center justify-between border-b border-ink-line px-5 py-4">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-muted">
                <span className="h-2 w-2 rounded-full bg-signal-green shadow-[0_0_6px_#34D399]" />
                JavaScript · Easy
              </div>
              <span className="font-mono text-xs text-slate-muted">Question 2 of 10</span>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.15em] font-semibold text-brand">Predict the output</p>
                <p className="font-display text-2xl leading-snug text-paper">What does this print?</p>
                <pre className="mt-3 rounded-xl border border-ink-line bg-ink-muted p-3 font-mono text-sm text-paper">console.log(0.1 + 0.2 === 0.3)</pre>
              </div>

              <div className="border-t border-ink-line pt-5">
                <p className="mb-2 font-mono text-xs text-slate-muted">YOUR ANSWER</p>
                <p className="leading-relaxed text-paper/90">
                  It prints <Annot tone="green">false</Annot> — <Annot tone="green">floating point numbers can&apos;t store 0.1 and 0.2 exactly</Annot>,
                  so the sum is <Annot tone="amber">slightly off</Annot>.
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-start gap-2 text-xs">
                    <span className="mt-0.5 rounded bg-signal-green/15 px-1.5 py-0.5 font-mono text-signal-green">✓ correct</span>
                    <span className="text-slate-muted">Right output and the right reason.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <span className="mt-0.5 rounded bg-signal-amber/15 px-1.5 py-0.5 font-mono text-signal-amber">△ add detail</span>
                    <span className="text-slate-muted">Mention comparing with a small tolerance instead.</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-ink-line pt-4">
                <span className="font-mono text-xs text-slate-muted">AI score</span>
                <span className="font-display text-3xl text-signal-green">92<span className="font-body text-base text-slate-muted">/100</span></span>
              </div>
            </div>
          </div>
        </Animate>
      </div>
    </section>
  );
}
