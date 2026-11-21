import Link from "next/link";
import Animate from "@/components/motion/Animate";
import { avatarUrl } from "@/lib/avatar";
import { timeAgo } from "@/lib/time";

export default function CommunityPreview({ posts, user }) {
  const community = user ? "/community" : "/auth";

  return (
    <section id="community" className="border-t border-ink-line">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <div className="mb-14 flex items-end justify-between gap-6">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-signal-green">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-green shadow-[0_0_6px_#34D399]" />
              From the community
            </p>
            <h2 className="max-w-lg font-display text-4xl font-bold leading-tight">Other candidates, sharing what worked.</h2>
          </div>
          <Link
            href={community}
            className="focus-ring hidden shrink-0 items-center gap-1 rounded-lg border border-ink-line px-4 py-2 text-sm text-slate-muted transition-all hover:border-brand/50 hover:text-paper sm:inline-flex"
          >
            {posts.length ? "Browse all posts →" : "Open the community →"}
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-line px-6 py-14 text-center">
            <p className="mb-4 text-slate-muted">No posts yet — be the first to share an interview experience.</p>
            <Link href={community} className="btn-primary px-6 py-3 text-sm">{user ? "Write a post" : "Join to post"}</Link>
          </div>
        ) : (
          <Animate variant="stagger" className="grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <article
                key={p.id}
                data-reveal-item
                className="group flex flex-col rounded-2xl border border-ink-line bg-white p-6 shadow-sm transition-all duration-300 hover:border-brand/40 hover:shadow-card"
              >
                <div className="mb-4 flex items-center gap-3">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl(p.image, 64)}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-brand/20"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand/40 to-brand-dim/30 text-xs font-semibold text-white ring-2 ring-brand/20">
                      {p.author.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-paper">{p.author}</p>
                    <p className="font-mono text-xs text-slate-muted">{timeAgo(p.createdAt)} · {p.tag}</p>
                  </div>
                </div>
                <h3 className="mb-2 font-semibold leading-snug text-paper">{p.title}</h3>
                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-muted">{p.body}</p>
                <div className="mt-auto flex items-center gap-4 font-mono text-xs text-slate-muted">
                  <span className="inline-flex items-center gap-1">
                    <svg className="h-3.5 w-3.5 fill-rose-500/80 stroke-rose-500/80" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {p.likes}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <svg className="h-3.5 w-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    {p.comments}
                  </span>
                </div>
              </article>
            ))}
          </Animate>
        )}
      </div>
    </section>
  );
}
