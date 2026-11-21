import Animate from "@/components/motion/Animate";
import { CheckCircleIcon, ChartIcon, ChatIcon, LockIcon, UsersIcon, GlobeIcon } from "@/components/Icons";

const features = [
  { Icon: CheckCircleIcon, title: "Scored on every answer", body: "A score, what you did well, what to fix, and the ideal answer — for each question." },
  { Icon: LockIcon, title: "Levels that unlock", body: "Easy → Medium → Hard, tracked per field. Finish one level to open the next." },
  { Icon: ChatIcon, title: "Practice chat", body: "Talk to an AI coach: ask for a hint, a full explanation, or harder questions. No scores, no pressure." },
  { Icon: GlobeIcon, title: "Any field", body: "Not just software. Type any field — marketing, nursing, accounting — and get questions for it." },
  { Icon: ChartIcon, title: "Progress dashboard", body: "Your score trend, strongest fields, practice streak, and what to do next." },
  { Icon: UsersIcon, title: "Community & resources", body: "Share experiences, comment, and learn from rated videos and articles." },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-ink-line">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <p className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-signal-green">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-green shadow-[0_0_6px_#34D399]" />
          What&apos;s inside
        </p>
        <h2 className="mb-16 max-w-lg font-display text-4xl font-bold leading-tight text-paper">Everything around the interview, too.</h2>

        <Animate variant="stagger" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ Icon, title, body }) => (
            <div
              key={title}
              data-reveal-item
              className="group relative overflow-hidden rounded-2xl border border-ink-line bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-card"
            >
              {/* Hover glow overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand/30 to-brand-dim/20 text-brand-glow shadow-inner ring-1 ring-brand/20">
                <Icon />
              </div>
              <h3 className="mb-2 text-base font-semibold text-paper">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-muted">{body}</p>
            </div>
          ))}
        </Animate>
      </div>
    </section>
  );
}
