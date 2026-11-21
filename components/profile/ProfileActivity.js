"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/lib/time";
import Thumb from "@/components/resources/Thumb";

export default function ProfileActivity({ posts, resources, isOwner = false, name = "This person" }) {
  const router = useRouter();
  const [tab, setTab] = useState("posts");
  const [error, setError] = useState("");

  async function remove(url, what) {
    if (!window.confirm(`Delete this ${what}? This can't be undone.`)) return;
    setError("");
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return setError(data.error ?? "Could not delete.");
    }
    router.refresh();
  }

  const tabs = [["posts", `Posts (${posts.length})`], ["resources", `Resources (${resources.length})`]];
  const first = name.split(" ")[0];

  return (
    <section>
      <div role="tablist" className="mb-6 flex items-center gap-8 border-b border-ink-line">
        {tabs.map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className={`focus-ring relative pb-4 font-medium transition-colors ${tab === id ? "text-paper" : "text-slate-muted hover:text-paper"}`}>
            {label}
            <span className={`absolute -bottom-px left-0 right-0 h-0.5 bg-indigo transition-opacity ${tab === id ? "opacity-100" : "opacity-0"}`} />
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mb-4 text-sm text-signal-red">{error}</p>}

      {tab === "posts" && (
        posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-line px-6 py-10 text-center text-sm text-slate-muted">
            {isOwner ? (<>You haven&apos;t posted anything yet. <Link href="/community" className="text-indigo hover:text-paper">Share an interview experience</Link>.</>) : `${first} hasn't posted anything yet.`}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((p) => (
              <article key={p.id} className="rounded-2xl border border-ink-line bg-white p-5 shadow-sm transition-all hover:border-brand/40 hover:shadow-card">
                <div className="mb-2 flex items-center justify-between gap-3 font-mono text-xs text-slate-muted">
                  <span className="rounded-full border border-brand/20 bg-brand/5 px-2.5 py-0.5 text-brand font-medium">{p.tag}</span>
                  <div className="flex items-center gap-3">
                    <span>{timeAgo(p.createdAt)}</span>
                    {isOwner && (
                      <button type="button" onClick={() => remove(`/api/posts/${p.id}`, "post")} className="focus-ring rounded font-medium text-rose-500 transition-colors hover:text-rose-700">Delete</button>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-paper"><Link href={`/community/${p.id}`} className="focus-ring rounded hover:text-brand">{p.title}</Link></h3>
                <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-muted">{p.body}</p>
                <div className="mt-3 flex items-center gap-4 font-mono text-xs text-slate-muted">
                  <span className="inline-flex items-center gap-1">
                    <svg className="h-3.5 w-3.5 fill-rose-500 stroke-rose-500" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {p.likes}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <svg className="h-3.5 w-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    {p.comments} {p.comments === 1 ? "comment" : "comments"}
                  </span>
                  <Link href={`/community/${p.id}`} className="ml-auto font-medium text-brand hover:text-brand-dim">Open post →</Link>
                </div>
              </article>
            ))}
          </div>
        )
      )}

      {tab === "resources" && (
        resources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-line px-6 py-10 text-center text-sm text-slate-muted">
            {isOwner ? (<>You haven&apos;t added any resources. <Link href="/resources" className="text-brand hover:text-paper">Add a video or article</Link>.</>) : `${first} hasn't shared any resources yet.`}
          </div>
        ) : (
          <div className="space-y-4">
            {resources.map((r) => (
              <article key={r.id} className="flex flex-col gap-4 rounded-2xl border border-ink-line bg-white p-4 shadow-sm transition-all hover:border-brand/40 hover:shadow-card sm:flex-row">
                <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-ink-muted sm:h-20 sm:w-36">
                  <Thumb resource={r} className="h-full w-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3 font-mono text-xs text-slate-muted">
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-medium text-amber-700">{r.tag} · {r.type === "video" ? "Video" : "Article"}</span>
                    {isOwner && (
                      <button type="button" onClick={() => remove(`/api/resources/${r.id}`, "resource")} className="focus-ring rounded font-medium text-rose-500 transition-colors hover:text-rose-700">Delete</button>
                    )}
                  </div>
                  <h3 className="mt-1.5 font-semibold text-paper sm:truncate">{r.title}</h3>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-slate-muted">
                    <span className="text-amber-600 font-semibold">{r.avg !== null ? `★ ${r.avg.toFixed(1)} · ${r.ratingCount} ratings` : "Not rated yet"}</span>
                    <span>{timeAgo(r.createdAt)}</span>
                    <a href={r.url} target="_blank" rel="noopener noreferrer nofollow" className="ml-auto font-medium text-brand hover:text-brand-dim">Open ↗</a>
                  </p>
                </div>
              </article>
            ))}
          </div>
        )
      )}
    </section>
  );
}
