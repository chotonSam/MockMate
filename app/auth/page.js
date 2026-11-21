import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import Logo from "@/components/Logo";
import AuthTabs from "@/components/auth/AuthTabs";
import AuthSidePanel from "@/components/auth/AuthSidePanel";

export const metadata = {
  title: "Log in or create an account — MockMate",
};

export default async function AuthPage() {
  if (await getSessionUserId()) redirect("/dashboard");

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-brand/5 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand/4 blur-3xl" />
      </div>

      <header className="relative border-b border-ink-line/60 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Logo />
          <Link
            href="/"
            className="focus-ring rounded-lg border border-ink-line bg-white px-4 py-1.5 text-sm text-slate-muted shadow-xs transition-colors hover:border-brand/40 hover:text-paper"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-24">
        {/* Soft glow behind the form */}
        <div className="pointer-events-none absolute left-0 top-1/2 -z-0 h-96 w-96 -translate-y-1/2 rounded-full bg-brand/6 blur-3xl lg:left-24" />
        <div className="relative z-10">
          <AuthTabs />
        </div>
        <AuthSidePanel />
      </main>
    </div>
  );
}
