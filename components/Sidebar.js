"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { avatarUrl } from "@/lib/avatar";

export const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/interview", label: "Mock interview" },
  { href: "/chat", label: "Practice chat" },
  { href: "/history", label: "Interview history" },
  { href: "/community", label: "Community" },
  { href: "/resources", label: "Learning resources" },
  { href: "/notifications", label: "Notifications", badge: true },
  { href: "/profile", label: "Profile" },
];

export default function Sidebar({ user, unread }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col self-start border-r border-ink-line bg-white shadow-sm lg:flex">
      {/* Logo area with subtle bottom gradient border */}
      <div className="relative shrink-0">
        <Logo className="h-16 shrink-0 px-6" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-6 text-sm" aria-label="Main">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`focus-ring group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 ${
                active
                  ? "border-l-2 border-brand bg-brand/10 font-semibold text-brand"
                  : "border-l-2 border-transparent text-slate-muted hover:bg-ink hover:text-paper"
              }`}
            >
              <span className="relative flex-1">{item.label}</span>
              {item.badge && unread > 0 && (
                <span className="rounded-full bg-signal-red px-2 py-0.5 font-mono text-[11px] font-medium leading-none text-white shadow-sm" aria-label={`${unread} unread`}>
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile card */}
      <div className="shrink-0 border-t border-ink-line px-3 py-4">
        <Link href="/" className="focus-ring mb-2 block rounded-lg px-3 py-2 text-sm text-slate-muted transition-colors hover:bg-ink hover:text-paper">
          ← Home page
        </Link>
        <div className="rounded-xl border border-ink-line bg-ink/70 p-3 shadow-sm">
          <Link href="/profile" className="focus-ring flex items-center gap-3 rounded-lg transition-colors hover:bg-white/60">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl(user.image, 64)} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-brand/30" />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dim text-xs font-semibold text-white shadow-sm ring-2 ring-brand/20">
                {user.name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-paper">{user.name}</p>
              <p className="truncate font-mono text-xs text-slate-muted">@{user.username}</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="focus-ring mt-2 w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium text-slate-muted transition-colors hover:bg-white/80 hover:text-rose-600"
          >
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}
