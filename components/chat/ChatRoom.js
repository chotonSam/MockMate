"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import RichText from "@/components/RichText";

const CHIPS = [
  { label: "💡 Hint", text: "Give me a hint" },
  { label: "🔍 Explain", text: "Explain this more simply" },
  { label: "⏭ Skip", text: "I don't know, show me the answer" },
  { label: "⬆ Harder", text: "Make the questions harder" },
  { label: "⬇ Easier", text: "Make the questions easier" },
];

const VERDICT = {
  correct: { label: "Correct ✓", cls: "bg-signal-green/15 text-signal-green" },
  partial: { label: "Partly right", cls: "bg-signal-amber/15 text-signal-amber" },
  incorrect: { label: "Not quite", cls: "bg-signal-red/15 text-signal-red" },
};

function Bubble({ m }) {
  if (m.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-br-md bg-gradient-to-r from-brand to-brand-dim px-4 py-3 text-sm leading-relaxed text-white shadow-md shadow-brand/10">{m.text}</p>
      </div>
    );
  }

  if (m.kind === "question") {
    return (
      <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-brand/30 bg-white p-5 shadow-card">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] font-semibold text-brand">Question</p>
        <p className="font-display text-xl leading-snug text-paper">{m.text}</p>
        {m.code && <pre className="mt-4 overflow-x-auto rounded-xl border border-ink-line bg-ink-muted p-4 font-mono text-sm leading-relaxed text-paper">{m.code}</pre>}
      </div>
    );
  }

  if (m.kind === "feedback") {
    const v = VERDICT[m.verdict] ?? VERDICT.partial;
    return (
      <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-ink-line bg-white p-5 shadow-card">
        <span className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold ${v.cls}`}>{v.label}</span>
        <RichText text={m.text} className="mt-3 text-sm text-paper" />
        {m.ideal && (
          <div className="mt-3 border-t border-ink-line pt-3 text-sm text-slate-muted">
            <p className="mb-1 font-mono text-xs font-semibold uppercase text-brand">IDEAL ANSWER</p>
            <RichText text={m.ideal} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-ink-line bg-white px-5 py-4 text-sm text-paper shadow-sm">
      <RichText text={m.text} />
    </div>
  );
}

export default function ChatRoom({ session }) {
  const [messages, setMessages] = useState(session.messages);
  const [level, setLevel] = useState(session.level);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  async function send(raw) {
    const text = raw.trim();
    if (!text || sending) return;
    setError("");
    setSending(true);

    const tempId = `tmp-${Date.now()}`;
    setMessages((m) => [...m, { id: tempId, role: "user", kind: "text", text }]); // show it instantly
    setInput("");

    try {
      const res = await fetch(`/api/chat/${session.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "The coach could not reply.");
      setMessages((m) => [...m.filter((x) => x.id !== tempId), ...data.messages]);
      setLevel(data.level);
    } catch (err) {
      setMessages((m) => m.filter((x) => x.id !== tempId)); // undo, and give the text back
      setInput(text);
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className="flex h-[calc(100dvh_-_4rem_-_env(safe-area-inset-bottom))] flex-col lg:h-screen">
      <header className="shrink-0 border-b border-ink-line bg-white/90 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <div className="min-w-0">
            <p className="font-mono text-xs text-slate-muted">Practice chat · {level}</p>
            <h1 className="mt-1 truncate font-display text-2xl leading-none text-paper">{session.topic}</h1>
          </div>
          <Link href="/chat" className="focus-ring shrink-0 rounded text-sm font-medium text-slate-muted transition-colors hover:text-brand">All chats</Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((m) => <Bubble key={m.id} m={m} />)}
          {sending && (
            <p className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-ink-line bg-white px-4 py-3 font-mono text-xs text-slate-muted shadow-sm" role="status">
              <span className="rec-dot h-1.5 w-1.5 rounded-full bg-brand" /> Coach is thinking…
            </p>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <footer className="shrink-0 border-t border-ink-line bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-4 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <button key={c.label} type="button" disabled={sending} onClick={() => send(c.text)}
                className="focus-ring rounded-full border border-ink-line bg-white px-3 py-1 font-mono text-xs text-slate-muted shadow-sm transition-colors hover:border-brand/50 hover:text-brand disabled:opacity-50">
                {c.label}
              </button>
            ))}
          </div>

          {error && <p role="alert" className="mb-3 text-sm text-signal-red font-medium">{error}</p>}

          <div className="flex items-end gap-3">
            <label htmlFor="chat-input" className="sr-only">Your message</label>
            <textarea id="chat-input" rows={Math.min(8, Math.max(2, input.split("\n").length))} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown}
              maxLength={2000} placeholder="Answer the question, or ask anything — write as much as you need…" className="field focus-ring resize-none" />
            <button type="button" onClick={() => send(input)} disabled={sending || !input.trim()}
              className="btn-primary h-12 shrink-0 px-6 text-sm disabled:cursor-not-allowed disabled:opacity-50">
              Send
            </button>
          </div>
          <p className="mt-2 hidden font-mono text-xs text-slate-muted sm:block">Enter to send · Shift+Enter for a new line</p>
        </div>
      </footer>
    </div>
  );
}
