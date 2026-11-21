import Link from "next/link";
import Logo from "@/components/Logo";

export default function SiteFooter({ user }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-ink-line">
      {/* Top gradient fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 sm:flex-row sm:items-center lg:px-10">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Logo />
            <span className="ml-2 text-sm text-slate-muted">— University Web Technology Project</span>
          </div>
          <p className="font-mono text-xs text-slate-muted/60">© {year} MockMate. All rights reserved.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm text-slate-muted">
          <a href="#how-it-works" className="focus-ring group relative rounded transition-colors hover:text-paper">
            How it works
            <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-brand/50 transition-transform duration-200 group-hover:scale-x-100" />
          </a>
          <a href="#features" className="focus-ring group relative rounded transition-colors hover:text-paper">
            Features
            <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-brand/50 transition-transform duration-200 group-hover:scale-x-100" />
          </a>
          <a href="#community" className="focus-ring group relative rounded transition-colors hover:text-paper">
            Community
            <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-brand/50 transition-transform duration-200 group-hover:scale-x-100" />
          </a>
          <Link href={user ? "/dashboard" : "/auth"} className="focus-ring group relative rounded transition-colors hover:text-paper">
            {user ? "Dashboard" : "Log in"}
            <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-brand/50 transition-transform duration-200 group-hover:scale-x-100" />
          </Link>
        </nav>
      </div>
    </footer>
  );
}
