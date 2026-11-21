import Link from "next/link";
import { connectDB } from "@/lib/db";
import Category from "@/lib/models/Category";
import Interview from "@/lib/models/Interview";
import Question from "@/lib/models/Question";
import Feedback from "@/lib/models/Feedback";
import { getSessionUserId } from "@/lib/session";
import { getProgressSummary } from "@/lib/progress";
import { toneFor, formatWhen } from "@/lib/dashboard";
import { toneBg, toneText } from "@/lib/data";
import { LEVELS, unlockedLevels } from "@/lib/topics";

export const metadata = { title: "Interview History — MockMate" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

function LevelPill({ level, completed, unlocked }) {
  if (completed)
    return (
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-700 shadow-sm">
        ✓ {level}
      </span>
    );
  if (unlocked)
    return (
      <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 font-mono text-xs font-semibold text-brand shadow-sm">
        {level}
      </span>
    );
  return (
    <span className="rounded-full border border-ink-line bg-ink px-2 py-0.5 font-mono text-[11px] text-slate-muted">
      🔒 {level}
    </span>
  );
}

export default async function HistoryPage({ searchParams }) {
  const userId = await getSessionUserId();
  await connectDB();
  void Category;

  const requested = Math.max(1, parseInt(searchParams?.page ?? "1", 10) || 1);
  const [progress, total] = await Promise.all([getProgressSummary(userId), Interview.countDocuments({ user: userId })]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requested, totalPages);

  const list = await Interview.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .populate("category", "name")
    .lean();

  const ids = list.map((i) => i._id);
  const [qCounts, fCounts] = await Promise.all([
    Question.aggregate([{ $match: { interview: { $in: ids } } }, { $group: { _id: "$interview", n: { $sum: 1 } } }]),
    Feedback.aggregate([{ $match: { interview: { $in: ids } } }, { $group: { _id: "$interview", n: { $sum: 1 } } }]),
  ]);
  const questionsOf = Object.fromEntries(qCounts.map((c) => [String(c._id), c.n]));
  const answeredOf = Object.fromEntries(fCounts.map((c) => [String(c._id), c.n]));

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-ink-line bg-white/90 backdrop-blur-md">
        <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <div>
            <p className="font-mono text-xs text-slate-muted">{total} {total === 1 ? "interview" : "interviews"} so far</p>
            <h1 className="mt-1 font-display text-2xl leading-none text-paper after:mt-1 after:block after:h-0.5 after:w-10 after:rounded-full after:bg-brand">
              Interview history
            </h1>
          </div>
          <Link href="/interview" className="btn-primary px-5 py-2.5 text-sm">New interview <span aria-hidden="true">→</span></Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-6 sm:space-y-10 sm:px-6 sm:py-10 lg:px-10">
        {total === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-line bg-white px-6 py-12 text-center shadow-card">
            <p className="mb-4 text-sm text-slate-muted">No interviews yet. Your history and level progress will show up here.</p>
            <Link href="/interview" className="btn-primary px-5 py-2.5 text-sm">Start your first interview</Link>
          </div>
        ) : (
          <>
            <section>
              <h2 className="mb-4 font-display text-lg text-paper">Your level progress</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {progress.map((p) => {
                  const unlocked = unlockedLevels(p.completed);
                  const completedCount = p.completed.length;
                  const totalLevels = LEVELS.length;
                  return (
                    <div key={p.key} className="rounded-2xl border border-ink-line bg-white p-5 shadow-card">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="font-semibold text-paper">{p.label}</p>
                        <span className="font-mono text-xs rounded-full border border-ink-line bg-ink px-2 py-0.5 text-slate-muted font-medium">
                          {completedCount}/{totalLevels}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {LEVELS.map((l) => <LevelPill key={l} level={l} completed={p.completed.includes(l)} unlocked={unlocked[l]} />)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-ink-line bg-white shadow-card">
              <div className="border-b border-ink-line px-6 py-5"><h2 className="font-display text-lg text-paper">All interviews</h2></div>
              <div className="divide-y divide-ink-line">
                {list.map((i) => {
                  const id = String(i._id);
                  const done = i.status === "completed" && typeof i.score === "number";
                  const tone = done ? toneFor(i.score) : "indigo";
                  return (
                    <Link key={id} href={`/interview/${id}`} className="focus-ring flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-ink/60">
                      <div className="flex min-w-0 items-center gap-4">
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${toneBg[tone]}`} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-paper">{i.topic || i.category?.name || "Interview"} · {i.difficulty}</p>
                          <p className="mt-0.5 font-mono text-xs text-slate-muted">{formatWhen(i.createdAt)}{i.timed ? " · ⏱ Timed" : ""}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-5">
                        {done ? (
                          <span className={`rounded-full px-2.5 py-1 font-mono text-xs font-semibold ${toneText[tone]}`}
                            style={{ backgroundColor: "color-mix(in srgb, currentColor 12%, transparent)" }}>
                            {i.score}/100
                          </span>
                        ) : (
                          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-mono text-xs font-medium text-amber-700">
                            In progress · {answeredOf[id] ?? 0}/{questionsOf[id] ?? "?"}
                          </span>
                        )}
                        <span className="text-slate-muted" aria-hidden="true">→</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {totalPages > 1 && (
              <nav aria-label="Pagination" className="flex items-center justify-between font-mono text-sm">
                {page > 1 ? (
                  <Link href={`/history?page=${page - 1}`} className="focus-ring rounded-lg border border-ink-line px-4 py-2 text-slate-muted transition-colors hover:border-indigo/40 hover:text-paper">
                    ← Newer
                  </Link>
                ) : (
                  <span className="rounded-lg border border-ink-line/40 px-4 py-2 opacity-30">← Newer</span>
                )}
                <span className="rounded-lg border border-indigo/40 bg-indigo/10 px-4 py-2 font-semibold text-paper">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages ? (
                  <Link href={`/history?page=${page + 1}`} className="focus-ring rounded-lg border border-ink-line px-4 py-2 text-slate-muted transition-colors hover:border-indigo/40 hover:text-paper">
                    Older →
                  </Link>
                ) : (
                  <span className="rounded-lg border border-ink-line/40 px-4 py-2 opacity-30">Older →</span>
                )}
              </nav>
            )}
          </>
        )}
      </main>
    </>
  );
}
