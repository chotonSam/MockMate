import Animate from "@/components/motion/Animate";
import { toneText } from "@/lib/data";
import { toneFor } from "@/lib/dashboard";

export default function StatCards({ stats }) {
  const topAccent = [
    "border-t-brand",
    "border-t-signal-green",
    "border-t-signal-amber",
    "border-t-signal-green",
  ];

  const cards = [
    { label: "Total interviews", value: String(stats.total) },
    {
      label: "Average score",
      value: stats.avg ?? "—",
      suffix: stats.avg !== null ? "/100" : "",
      tone: stats.avg !== null ? toneFor(stats.avg) : null,
    },
    { label: "Practice streak", value: String(stats.streak), suffix: stats.streak === 1 ? " day" : " days" },
    { label: "Strongest category", value: stats.strongest ?? "—", small: true },
  ];

  return (
    <Animate as="section" variant="stagger" scroll={false} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((s, idx) => (
        <div key={s.label} data-reveal-item className={`relative overflow-hidden rounded-2xl border-t-2 border border-ink-line bg-white p-6 shadow-card transition-all duration-200 hover:shadow-card-hover ${topAccent[idx]}`}>
          {s.tone && (
            <div className="pointer-events-none absolute -top-6 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full opacity-10 blur-2xl"
              style={{ background: s.tone === "green" ? "#059669" : s.tone === "amber" ? "#D97706" : "#DC2626" }} />
          )}
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-muted">{s.label}</p>
          <p className={`font-display font-bold ${s.small ? "mt-2.5 text-2xl" : "text-5xl"} ${s.tone ? toneText[s.tone] : "text-paper"}`}>
            {s.value}
            {s.suffix && <span className="font-body text-lg text-slate-muted font-normal">{s.suffix}</span>}
          </p>
        </div>
      ))}
    </Animate>
  );
}
