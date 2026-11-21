"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChartIcon, MicIcon, ChatIcon, UsersIcon, MenuIcon } from "@/components/Icons";
import { avatarUrl } from "@/lib/avatar";

const DashboardIcon = (p) => <ChartIcon width={22} height={22} {...p} />;

const TABS = [
  { href: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { href: "/interview", label: "Interview", Icon: MicIcon },
  { href: "/chat", label: "Chat", Icon: ChatIcon },
  { href: "/community", label: "Community", Icon: UsersIcon },
];

const MORE = [
  { href: "/", label: "Home page" },
  { href: "/notifications", label: "Notifications", badge: true },
  { href: "/history", label: "Interview history" },
  { href: "/resources", label: "Learning resources" },
  { href: "/profile", label: "My profile" },
];

export default function MobileNav({ user, unread }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
  const moreActive = MORE.some((m) => isActive(m.href)) || pathname.startsWith("/u/");

  // Close the sheet when you go to another page, or press Escape
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth");
    router.refresh();
  }

  const tabClass = (active) =>
    `focus-ring relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] transition-colors ${active ? "text-brand" : "text-slate-muted"}`;

  return (
    <div className="lg:hidden">
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="More menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-ink-line bg-white px-5 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-3 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-ink-line" />

            {/* User card with gradient background */}
            <Link
              href="/profile"
              className="focus-ring mb-4 flex items-center gap-3 rounded-2xl border border-brand/20 bg-gradient-to-r from-brand/10 via-brand/5 to-transparent p-4 transition-colors hover:border-brand/40"
            >
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl(user.image, 96)} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-brand/30" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dim font-display text-xl text-white ring-2 ring-brand/30">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold text-paper">{user.name}</p>
                <p className="truncate font-mono text-xs text-slate-muted">@{user.username}</p>
              </div>
            </Link>

            <ul className="divide-y divide-ink-line overflow-hidden rounded-2xl border border-ink-line bg-ink/40">
              {MORE.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`focus-ring flex items-center justify-between px-4 py-4 text-sm transition-colors hover:bg-white/80 ${
                      isActive(item.href) ? "text-brand font-semibold" : "text-paper"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && unread > 0 && (
                      <span className="rounded-full bg-signal-red px-2 py-0.5 font-mono text-[11px] font-medium leading-none text-white">{unread > 99 ? "99+" : unread}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={logout}
              className="focus-ring mt-3 w-full rounded-2xl border border-ink-line bg-white px-4 py-3.5 text-left text-sm font-medium text-slate-muted transition-colors hover:bg-ink hover:text-rose-600"
            >
              Log out
            </button>
          </div>
        </div>
      )}

      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-[60] flex border-t border-ink-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur-md">
        {TABS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined} className={tabClass(active)}>
              {/* Brand top-border pill indicator */}
              {active && (
                <span className="absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 rounded-b-full bg-brand" />
              )}
              <Icon />
              <span>{label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="More"
          className={tabClass(open || moreActive)}
        >
          {/* Brand top-border pill for "more" active state */}
          {(open || moreActive) && (
            <span className="absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 rounded-b-full bg-brand" />
          )}
          <span className="relative">
            <MenuIcon />
            {unread > 0 && <span className="absolute -right-1.5 -top-1 h-2.5 w-2.5 rounded-full bg-signal-red ring-2 ring-white" aria-label={`${unread} unread notifications`} />}
          </span>
          <span>More</span>
        </button>
      </nav>
    </div>
  );
}
