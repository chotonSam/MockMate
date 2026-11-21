"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LEVELS, TIME_LIMITS, formatDuration, sanitizeTopic, isValidTopic, customKey, unlockedLevels, recommendedLevel } from "@/lib/topics";

const HINTS = { Easy: "Fundamentals", Medium: "Real-world cases", Hard: "Tricky edge cases" };
const CUSTOM = "__custom__";

export default function InterviewSetup({ categories, progress }) {
  const router = useRouter();
  const [choice, setChoice] = useState(categories[0]?.id ?? CUSTOM); // a category id, or CUSTOM
  const [customText, setCustomText] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [timed, setTimed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const doneByKey = useMemo(() => Object.fromEntries(progress.map((p) => [p.key, p.completed])), [progress]);

  const isCustom = choice === CUSTOM;
  const topic = sanitizeTopic(customText);
  const topicKey = isCustom ? (isValidTopic(topic) ? customKey(topic) : "") : choice;
  const completed = doneByKey[topicKey] ?? [];
  const unlocked = unlockedLevels(completed);
  const recommended = recommendedLevel(completed);

  // Whenever the topic changes, jump to the level this person should do next
  useEffect(() => {
    setDifficulty(recommended);
  }, [topicKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const canStart = !loading && (isCustom ? isValidTopic(topic) : Boolean(choice)) && unlocked[difficulty];

  async function start(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isCustom ? { customTopic: topic, difficulty, timed } : { categoryId: choice, difficulty, timed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not start the interview.");
      router.push(`/interview/${data.id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const cardBase =
    "cursor-pointer rounded-2xl border p-5 transition-all duration-200 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo";

  return (
    <form onSubmit={start} className="mx-auto max-w-3xl space-y-10 px-6 py-10 lg:px-10">
      {/* ── Section 1: Choose a field ── */}
      <fieldset>
        <legend className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-brand font-semibold">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-brand">1</span>
          Choose a field
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((c) => (
            <label
              key={c.id}
              className={`${cardBase} ${
                choice === c.id
                  ? "border-2 border-brand bg-brand/5 shadow-sm ring-1 ring-brand/20"
                  : "border border-ink-line bg-white shadow-sm hover:border-brand/40 hover:shadow-card"
              }`}
            >
              <input type="radio" name="field" checked={choice === c.id} onChange={() => setChoice(c.id)} className="sr-only" />
              <p className={`font-semibold ${choice === c.id ? "text-brand" : "text-paper"}`}>{c.name}</p>
              <p className="mt-1 text-sm text-slate-muted">{c.description}</p>
            </label>
          ))}

          {/* Any other field */}
          <label
            className={`${cardBase} sm:col-span-2 ${
              isCustom
                ? "border-2 border-brand bg-brand/5 shadow-sm ring-1 ring-brand/20"
                : "border-dashed border-ink-line bg-white shadow-sm hover:border-brand/40 hover:shadow-card"
            }`}
          >
            <input type="radio" name="field" checked={isCustom} onChange={() => setChoice(CUSTOM)} className="sr-only" />
            <p className="font-semibold text-paper">Other field</p>
            <p className="mt-1 text-sm text-slate-muted">Type any field — e.g. Digital Marketing, Nursing, Python, Accounting.</p>
            {isCustom && (
              <div className="mt-4">
                <label htmlFor="custom-topic" className="sr-only">Your field</label>
                <input
                  id="custom-topic"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  maxLength={60}
                  placeholder="Your field…"
                  autoFocus
                  className="field focus-ring"
                />
              </div>
            )}
          </label>
        </div>
      </fieldset>

      {/* ── Section 2: Choose a level ── */}
      <fieldset>
        <legend className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-brand font-semibold">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-brand">2</span>
          Choose a level
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {LEVELS.map((level) => {
            const isLocked = !unlocked[level];
            const isDone = completed.includes(level);
            return (
              <label
                key={level}
                className={`${cardBase} relative text-center ${
                  isLocked
                    ? "cursor-not-allowed border border-ink-line bg-ink/60 opacity-50"
                    : difficulty === level
                    ? "border-2 border-brand bg-brand/5 shadow-sm ring-1 ring-brand/20"
                    : "border border-ink-line bg-white shadow-sm hover:border-brand/40 hover:shadow-card"
                }`}
              >
                <input type="radio" name="level" value={level} checked={difficulty === level} disabled={isLocked} onChange={() => setDifficulty(level)} className="sr-only" />
                <p className="font-semibold text-paper">{level}</p>
                <p className="mt-1 text-sm text-slate-muted">{HINTS[level]}</p>
                <p className="mt-3 font-mono text-xs">
                  {isLocked ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-ink-line bg-ink-muted/80 px-2 py-0.5 text-slate-muted">
                      <span>🔒</span> Complete {LEVELS[LEVELS.indexOf(level) - 1]} first
                    </span>
                  ) : isDone ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700">
                      ✓ Completed
                    </span>
                  ) : level === recommended ? (
                    <span className="font-semibold text-brand">Start here</span>
                  ) : (
                    <span className="text-slate-muted">Unlocked</span>
                  )}
                </p>
              </label>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-slate-muted">Finish Easy to unlock Medium, then finish Medium to unlock Hard. Each field has its own progress.</p>
      </fieldset>

      {/* ── Timed mode toggle ── */}
      <label
        className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all duration-200 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand ${
          timed ? "border-amber-300 bg-amber-50/70 shadow-sm" : "border-ink-line bg-white shadow-sm hover:border-brand/40 hover:shadow-card"
        }`}
      >
        <input type="checkbox" role="switch" checked={timed} onChange={(e) => setTimed(e.target.checked)} className="peer sr-only" />
        {/* Toggle pill */}
        <span
          aria-hidden="true"
          className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${timed ? "bg-signal-amber" : "bg-ink-line"}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full shadow-sm transition-all duration-300 ${
              timed ? "left-[1.375rem] bg-white" : "left-0.5 bg-slate-muted/70"
            }`}
          />
        </span>
        <span className="min-w-0">
          <span className="block font-medium">
            Timed mode{" "}
            <span className={`font-normal ${timed ? "text-signal-amber" : "text-slate-muted"}`}>(optional)</span>
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-slate-muted">
            A countdown for every question —{" "}
            <span className="text-paper">{formatDuration(TIME_LIMITS[difficulty])} per question</span> on {difficulty} (Easy{" "}
            {formatDuration(TIME_LIMITS.Easy)} · Medium {formatDuration(TIME_LIMITS.Medium)} · Hard {formatDuration(TIME_LIMITS.Hard)}).
            When it hits zero, what you have typed is submitted automatically. The clock pauses if you leave the page.
          </span>
        </span>
      </label>

      {error && <p role="alert" className="rounded-lg border border-signal-red/40 bg-signal-red/10 px-4 py-3 text-sm text-signal-red">{error}</p>}

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-slate-muted">10 short questions · AI generated</p>
        <button type="submit" disabled={!canStart} className="btn-primary px-7 py-3.5 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Preparing your questions…" : "Start interview"}
          {!loading && <span aria-hidden="true">→</span>}
        </button>
      </div>
    </form>
  );
}
