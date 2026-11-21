import Link from "next/link";
import { toneBg, toneText } from "@/lib/data";

export default function RecentInterviews({ items }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-ink-line bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-ink-line px-6 py-5">
        <h2 className="font-display text-lg text-paper">Recent interviews</h2>
        <Link href="/history" className="focus-ring rounded-full border border-ink-line bg-white px-3.5 py-1 font-mono text-xs font-medium text-slate-muted shadow-sm transition-all hover:border-brand/40 hover:text-brand">View all →</Link>
      </div>

      {items.length === 0 ? (
        <div className="mx-6 my-8 rounded-xl border border-dashed border-ink-line bg-ink/50 px-6 py-10 text-center">
          <p className="mb-1 text-sm font-medium text-paper">No interviews yet</p>
          <p className="mb-5 text-xs text-slate-muted">Complete your first mock interview to see your history here.</p>
          <Link href="/interview" className="btn-primary px-5 py-2.5 text-sm">Start your first interview</Link>
        </div>
      ) : (
        <div className="divide-y divide-ink-line">
          {items.map((i) => (
            <Link key={i.id} href={`/interview/${i.id}`} className="focus-ring group flex items-center justify-between px-6 py-4 transition-colors hover:bg-ink/60">
              <div className="flex min-w-0 items-center gap-4">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${toneBg[i.tone]}`} />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-paper group-hover:text-brand transition-colors">{i.title}</p>
                  <p className="mt-0.5 font-mono text-xs text-slate-muted">{i.when}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                {i.status === "completed" ? (
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold ${toneText[i.tone]}`}
                    style={{ background: i.tone === "green" ? "rgba(5,150,105,0.12)" : i.tone === "amber" ? "rgba(217,119,6,0.12)" : "rgba(220,38,38,0.12)" }}>
                    {i.score}/100
                  </span>
                ) : (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 font-mono text-xs font-medium text-amber-700">In progress</span>
                )}
                <span className="text-slate-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true">›</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
