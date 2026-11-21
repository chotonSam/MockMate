import Animate from "@/components/motion/Animate";
const steps = [
  { n: "01", title: "Pick a field — or type your own", body: "Frontend, backend, HR… or any field you can name. Everyone starts at Easy." },
  { n: "02", title: "Answer 10 short questions", body: "Predict the output, spot the bug, handle a quick scenario. Short like a real interview, and you can answer as briefly or as fully as you like." },
  { n: "03", title: "Get scored, then level up", body: "An instant AI score and an ideal answer for each question. Finish a level to unlock the next: Easy → Medium → Hard." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-ink-line">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <p className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-signal-green">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-green shadow-[0_0_6px_#34D399]" />
          The process
        </p>
        <h2 className="mb-16 max-w-lg font-display text-4xl leading-tight">Three steps, every time you practice.</h2>

        <Animate variant="stagger" className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              data-reveal-item
              className="group relative overflow-hidden rounded-2xl border border-ink-line bg-white p-8 shadow-sm transition-all duration-300 hover:border-brand/50 hover:shadow-card"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="bg-gradient-to-br from-brand to-brand-dim bg-clip-text font-mono text-5xl font-bold tracking-tight text-transparent opacity-80">
                {s.n}
              </span>
              <h3 className="mb-3 mt-5 font-display text-xl leading-snug text-paper">{s.title}</h3>
              <p className="text-sm leading-relaxed text-slate-muted">{s.body}</p>
            </div>
          ))}
        </Animate>
      </div>
    </section>
  );
}
