"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/lib/time";

export default function ChatList({ sessions }) {
  const router = useRouter();

  async function remove(id) {
    if (!window.confirm("Delete this chat?")) return;
    await fetch(`/api/chat/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (sessions.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 font-display text-lg text-paper">Your recent chats</h2>
      <div className="divide-y divide-ink-line overflow-hidden rounded-2xl border border-ink-line bg-white shadow-card">
        {sessions.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-ink/50">
            <Link href={`/chat/${s.id}`} className="focus-ring min-w-0 flex-1 rounded">
              <p className="truncate font-semibold text-paper hover:text-brand transition-colors">{s.topic} <span className="font-normal text-slate-muted">· {s.level}</span></p>
              <p className="mt-0.5 font-mono text-xs text-slate-muted">{s.count} messages · {timeAgo(s.updatedAt)}</p>
            </Link>
            <button type="button" onClick={() => remove(s.id)} aria-label={`Delete chat about ${s.topic}`}
              className="focus-ring rounded px-2.5 py-1 font-mono text-xs text-slate-muted transition-colors hover:bg-rose-50 hover:text-signal-red">
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
