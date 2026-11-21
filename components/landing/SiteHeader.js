import Link from "next/link";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/LogoutButton";
import { avatarUrl } from "@/lib/avatar";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#community", label: "Community" },
];

export default function SiteHeader({ user }) {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-line/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm text-slate-muted md:flex" aria-label="Sections">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="focus-ring group relative rounded py-1 transition-colors hover:text-paper"
            >
              {l.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 rounded-full bg-gradient-to-r from-brand to-brand-glow transition-transform duration-200 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/dashboard" className="btn-primary hidden px-4 py-2 text-sm sm:inline-flex">Dashboard</Link>
            <Link
              href="/profile"
              className="focus-ring flex items-center gap-2 rounded-full border border-brand/30 bg-white py-1 pl-1 pr-3 text-sm shadow-xs transition-all hover:border-brand/60"
              aria-label="My profile"
            >
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl(user.image, 64)} alt="" className="h-7 w-7 rounded-full object-cover ring-2 ring-brand/30" />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dim text-xs font-medium text-white ring-2 ring-brand/30">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="hidden max-w-[8rem] truncate sm:inline">{user.name.split(" ")[0]}</span>
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/auth" className="focus-ring rounded px-2 py-2 text-sm text-slate-muted transition-colors hover:text-paper">Log in</Link>
            <Link href="/auth" className="btn-primary px-4 py-2 text-sm">Start free</Link>
          </div>
        )}
      </div>
    </header>
  );
}
