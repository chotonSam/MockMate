import Link from "next/link";
import { connectDB } from "@/lib/db";
import LearningResource from "@/lib/models/LearningResource";
import Thumb from "@/components/resources/Thumb";

// Shows the top community-rated resources (real data, real thumbnails)
export default async function RecommendedResources() {
  await connectDB();
  const items = await LearningResource.find().sort({ ratingCount: -1, ratingSum: -1, createdAt: -1 }).limit(3).lean();

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-medium">Top learning resources</h2>
        <Link href="/resources" className="focus-ring rounded text-sm text-slate-muted transition-colors hover:text-paper">See all resources →</Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-ink-line bg-white px-6 py-10 text-center shadow-card">
          <p className="mb-1 text-sm font-medium text-paper/70">No resources yet</p>
          <p className="text-xs text-slate-muted">Be the first to{" "}<Link href="/resources" className="text-brand hover:text-paper transition-colors">add a video or article</Link>.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-3">
          {items.map((r) => {
            const avg = r.ratingCount ? (r.ratingSum / r.ratingCount).toFixed(1) : null;
            const resource = { type: r.type, youtubeId: r.youtubeId, thumbnail: r.thumbnail ?? "", url: r.url };
            return (
              <Link key={String(r._id)} href="/resources" className="focus-ring group overflow-hidden rounded-2xl border border-ink-line bg-white shadow-sm transition-all duration-200 hover:border-brand/50 hover:shadow-card">
                <div className="relative aspect-video overflow-hidden bg-ink-muted">
                  <Thumb resource={resource} className="h-full w-full transition-transform duration-300 group-hover:scale-105" />
                  {r.type === "video" && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/5">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-base text-white shadow-md transition-transform group-hover:scale-110">▶</span>
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[11px] font-medium text-amber-700">{r.tag}</span>
                  <p className="mt-2 text-sm font-semibold leading-snug text-paper group-hover:text-brand transition-colors line-clamp-2">{r.title}</p>
                  <p className="mt-2.5 font-mono text-xs text-amber-600 font-medium">
                    {avg ? (
                      <>
                        {"★★★★★".slice(0, Math.round(Number(avg)))}{"☆☆☆☆☆".slice(0, 5 - Math.round(Number(avg)))} {avg} · {r.ratingCount} ratings
                      </>
                    ) : (
                      <span className="text-slate-muted">Not rated yet</span>
                    )}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
