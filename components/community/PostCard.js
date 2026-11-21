"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { timeAgo } from "@/lib/time";
import { avatarUrl } from "@/lib/avatar";

const COMMENT_POLL_MS = 5000; // how often an open comment section checks for new comments

export async function api(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
  return data;
}
export const postJSON = (url, body) =>
  api(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export function Avatar({ name, image, size = "h-8 w-8" }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={avatarUrl(image, 64)} alt="" className={`${size} shrink-0 rounded-full object-cover ring-2 ring-brand/20`} />;
  }
  return (
    <div className={`${size} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand/20 to-brand/10 font-medium text-brand ring-2 ring-brand/20 text-xs`}>
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

function CommentItem({ c, onReply, small = false }) {
  return (
    <div className="flex gap-3">
      <Link href={`/u/${c.username}`} aria-label={`${c.author}'s profile`} className="focus-ring h-fit shrink-0 rounded-full">
        <Avatar name={c.author} image={c.authorImage} size={small ? "h-6 w-6" : "h-7 w-7"} />
      </Link>
      <div className="min-w-0">
        <p className="text-xs">
          <Link href={`/u/${c.username}`} className="focus-ring rounded font-semibold text-paper hover:text-brand">{c.author}</Link>
          <span className="ml-2 font-mono text-slate-muted">{timeAgo(c.createdAt)}</span>
        </p>
        <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-slate-muted">{c.text}</p>
        <button type="button" onClick={() => onReply(c)} className="focus-ring mt-1 rounded font-mono text-xs font-medium text-slate-muted transition-colors hover:text-brand">
          Reply
        </button>
      </div>
    </div>
  );
}

function Comments({ postId, onCount }) {
  const [comments, setComments] = useState(null); // null = loading
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null); // the comment being answered, or null for a new top-level comment
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);

  // Load now, then poll so comments from other users appear without a refresh
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await api(`/api/posts/${postId}/comments`);
        if (!active) return;
        setComments(data.comments);
        onCount(data.comments.length);
      } catch {
        if (active) setComments((c) => c ?? []);
      }
    }
    load();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, COMMENT_POLL_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [postId, onCount]);

  function startReply(c) {
    setReplyTo({ id: c.id, name: c.author });
    // answering a reply: start with @name so it's clear who you mean
    setText(c.parentId ? `@${c.author} ` : "");
    setError("");
    inputRef.current?.focus();
  }

  function cancelReply() {
    setReplyTo(null);
    setText("");
  }

  async function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setError("");
    setSending(true);
    try {
      const { comment } = await postJSON(`/api/posts/${postId}/comments`, { text, parentId: replyTo?.id });
      setComments((list) => {
        const next = list ?? [];
        const merged = next.some((c) => c.id === comment.id) ? next : [...next, comment];
        onCount(merged.length);
        return merged;
      });
      setText("");
      setReplyTo(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  // top-level comments, each followed by its replies (a reply whose parent is missing is shown as top-level)
  const ids = new Set((comments ?? []).map((c) => c.id));
  const tops = (comments ?? []).filter((c) => !c.parentId || !ids.has(c.parentId));
  const repliesOf = (id) => (comments ?? []).filter((c) => c.parentId === id);

  return (
    <div className="mt-5 space-y-4 border-t border-ink-line pt-5">
      {comments === null && <p className="text-sm text-slate-muted">Loading comments…</p>}
      {comments?.length === 0 && <p className="text-sm text-slate-muted">No comments yet. Be the first.</p>}

      {tops.map((c) => (
        <div key={c.id} className="space-y-3">
          <CommentItem c={c} onReply={startReply} />
          {repliesOf(c.id).length > 0 && (
            <div className="ml-3 space-y-3 border-l border-ink-line pl-4 sm:ml-5">
              {repliesOf(c.id).map((r) => <CommentItem key={r.id} c={r} onReply={startReply} small />)}
            </div>
          )}
        </div>
      ))}

      {error && <p role="alert" className="text-sm text-signal-red">{error}</p>}

      <form onSubmit={submit} className="space-y-2 pt-1">
        {replyTo && (
          <p className="flex items-center justify-between gap-3 rounded-lg bg-brand/10 px-3 py-1.5 font-mono text-xs text-slate-muted">
            <span className="truncate">Replying to <span className="font-semibold text-paper">{replyTo.name}</span></span>
            <button type="button" onClick={cancelReply} className="focus-ring shrink-0 rounded font-medium text-brand hover:text-brand-dim">Cancel</button>
          </p>
        )}
        <div className="flex gap-3">
          <label htmlFor={`c-${postId}`} className="sr-only">{replyTo ? "Write a reply" : "Write a comment"}</label>
          <input
            id={`c-${postId}`}
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            placeholder={replyTo ? `Reply to ${replyTo.name}…` : "Write a comment…"}
            className="field focus-ring"
          />
          <button type="submit" disabled={!text.trim() || sending} className="btn-primary px-5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">
            {sending ? "…" : replyTo ? "Reply" : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function PostCard({ post, onLike, onCount, onDelete, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const setCount = useCallback((n) => onCount(post.id, n), [onCount, post.id]);

  return (
    <article className="rounded-2xl border border-ink-line bg-white p-6 shadow-sm transition-all hover:border-brand/40 hover:shadow-card">
      <div className="mb-4 flex items-center justify-between gap-4">
        <Link href={`/u/${post.username}`} className="focus-ring flex min-w-0 items-center gap-3 rounded-lg" aria-label={`${post.author}'s profile`}>
          <Avatar name={post.author} image={post.authorImage} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-paper transition-colors hover:text-brand">{post.author}</p>
            <p className="font-mono text-xs text-slate-muted">{timeAgo(post.createdAt)}</p>
          </div>
        </Link>
        <span className="rounded-full border border-brand/20 bg-brand/5 px-3 py-1 font-mono text-xs font-medium text-brand">{post.tag}</span>
      </div>

      <h2 className="mb-2 font-display text-xl text-paper"><Link href={`/community/${post.id}`} className="focus-ring rounded transition-colors hover:text-brand">{post.title}</Link></h2>
      <p className="mb-5 whitespace-pre-line text-sm leading-relaxed text-slate-muted">{post.body}</p>

      <div className="flex items-center gap-3 text-xs">
        <button
          type="button"
          onClick={() => onLike(post.id)}
          aria-pressed={post.liked}
          className={`focus-ring inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95 ${
            post.liked
              ? "border border-rose-300 bg-rose-50 text-rose-600 font-semibold shadow-sm hover:bg-rose-100/90 hover:border-rose-400"
              : "border border-ink-line bg-white text-slate-muted shadow-sm hover:border-rose-200 hover:bg-rose-50/50 hover:text-rose-600"
          }`}
        >
          <svg
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
              post.liked ? "scale-105 fill-rose-500 stroke-rose-500" : "fill-none stroke-current"
            }`}
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="font-mono tabular-nums">{post.likes}</span>
        </button>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={`focus-ring inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95 ${
            open
              ? "border border-brand/30 bg-brand/10 font-semibold text-brand shadow-sm"
              : "border border-ink-line bg-white text-slate-muted shadow-sm hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
          }`}
        >
          <svg
            className="h-3.5 w-3.5 shrink-0 fill-none stroke-current"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span className="font-mono tabular-nums">{post.comments}</span>
          <span className="hidden sm:inline">{post.comments === 1 ? "comment" : "comments"}</span>
        </button>

        {post.mine && (
          <button
            type="button"
            onClick={() => onDelete(post.id)}
            className="focus-ring ml-auto rounded-lg px-2.5 py-1 text-xs text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-700"
          >
            Delete
          </button>
        )}
      </div>

      {open && <Comments postId={post.id} onCount={setCount} />}
    </article>
  );
}

