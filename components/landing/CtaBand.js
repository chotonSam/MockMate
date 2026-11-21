import Link from "next/link";
import Animate from "@/components/motion/Animate";

export default function CtaBand({ user }) {
  return (
    <section className="relative overflow-hidden border-t border-ink-line">
      {/* Brand gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[200px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-glow/8 blur-[60px]" />
      </div>
      <Animate className="relative mx-auto max-w-7xl px-6 py-28 text-center lg:px-10">
        <h2 className="mx-auto mb-4 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
          {user
            ? "Your next level is waiting."
            : "Your next interview doesn't have to be the first time you've answered these questions."}
        </h2>
        <p className="mx-auto mb-10 max-w-lg text-base text-slate-muted">
          {user
            ? "Pick up where you left off and push to the next difficulty tier."
            : "Practice with real questions, get instant AI feedback, and show up prepared."}
        </p>
        <Link href={user ? "/interview" : "/auth"} className="btn-primary px-8 py-4 text-base">
          {user ? "Continue practicing" : "Start your first mock interview"} <span aria-hidden="true">→</span>
        </Link>
      </Animate>
    </section>
  );
}
