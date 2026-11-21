"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/lib/time";
import { avatarUrl } from "@/lib/avatar";

async function markRead(body) {
  try {
    await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), keepalive: true });
  } finally {
    window.dispatchEvent(new Event("iq:notifications")); // refresh the badge
  }
}

export default function NotificationList({ initial }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const unread = items.filter((n) => !n.read).length;

  async function open(n) {
    if (!n.read) {
      setItems((all) => all.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      markRead({ id: n.id });
    }
    router.push(`/community/${n.postId}`);
  }

  async function markAll() {
    setItems((all) => all.map((x) => ({ ...x, read: true })));
    await markRead({ all: true });
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-line px-6 py-14 text-center">
        <p className="mb-1 font-medium">No notifications yet</p>
        <p className="text-sm text-slate-muted">When someone comments on or likes your post, or replies to your comment, you will see it here.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-xs text-slate-muted">
          {unread > 0 ? (
            <>
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-indigo align-middle" />
              {unread} unread
            </>
          ) : (
            "All caught up"
          )}
        </p>
        {unread > 0 && (
          <button
            type="button"
            onClick={markAll}
            className="focus-ring rounded-lg border border-ink-line px-3 py-1.5 text-xs text-slate-muted transition-colors hover:border-indigo/40 hover:text-paper"
          >
            Mark all as read
          </button>
        )}
      </div>

      <ul className="divide-y divide-ink-line overflow-hidden rounded-2xl border border-ink-line bg-white shadow-card">
        {items.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => open(n)}
              className={`focus-ring group flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-ink/60 ${
                n.read ? "" : "bg-brand/5"
              }`}
            >
              {/* Avatar with brand ring for unread */}
              <span className={`shrink-0 rounded-full p-0.5 transition-colors ${!n.read ? "ring-2 ring-brand/50 ring-offset-1 ring-offset-white" : ""}`}>
                {n.actor.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl(n.actor.image, 80)} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dim text-sm font-semibold text-white shadow-sm">
                    {n.actor.name.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm leading-relaxed text-paper">
                  <span className="font-semibold">{n.actor.name}</span>{" "}
                  {n.type === "reply" ? "replied to your comment on" : n.type === "comment" ? "commented on your post" : "liked your post"}{" "}
                  <span className="text-slate-muted font-medium">&ldquo;{n.postTitle}&rdquo;</span>
                </span>
                {(n.type === "comment" || n.type === "reply") && n.text && (
                  <span className="mt-1.5 block rounded-lg border border-ink-line bg-ink px-3 py-2 text-sm text-slate-muted group-hover:bg-white">{n.text}</span>
                )}
                <span className="mt-1.5 block font-mono text-xs text-slate-muted">{timeAgo(n.createdAt)}</span>
              </span>

              {/* Unread dot */}
              {!n.read && (
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-brand shadow-[0_0_6px_rgba(99,102,241,0.5)]" aria-label="Unread" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
