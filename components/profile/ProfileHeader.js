import { avatarUrl } from "@/lib/avatar";

export default function ProfileHeader({ profile }) {
  const { user, stats } = profile;
  const tiles = [
    { label: "Interviews", value: stats.interviews },
    { label: "Avg score", value: stats.avg ?? "—" },
    { label: "Best score", value: stats.best ?? "—" },
    { label: "Posts", value: stats.posts },
    { label: "Likes received", value: stats.likes },
    { label: "Resources", value: stats.resources },
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-ink-line bg-white shadow-card">
      <div className="h-28 bg-gradient-to-r from-indigo/60 via-brand/20 to-signal-green/20 sm:h-36" />

      <div className="px-5 pb-6 sm:px-8">
        <div className="-mt-12 flex items-end gap-5 sm:-mt-14">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl(user.image, 240)} alt={`${user.name}'s picture`} className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-white shadow-md sm:h-28 sm:w-28" />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dim font-display text-5xl text-white shadow-md ring-4 ring-white sm:h-28 sm:w-28">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>

        <h2 className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
          {user.name}
          {user.verified && (
            <span className="rounded-full border border-signal-green/30 bg-signal-green/15 px-3 py-1 font-body text-xs font-semibold text-signal-green" title="This person confirmed their email address">
              ✓ Verified
            </span>
          )}
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-muted">@{user.username} · Joined {user.joined}</p>
        {user.bio && <p className="mt-4 max-w-2xl leading-relaxed text-paper/90">{user.bio}</p>}

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map((t) => (
            <div key={t.label} className="group rounded-2xl border border-ink-line bg-white px-4 py-3 shadow-sm transition-all hover:border-brand/40 hover:shadow-card">
              <dt className="font-mono text-[11px] uppercase tracking-wider text-slate-muted">{t.label}</dt>
              <dd className="mt-1 font-display text-2xl font-bold text-paper tabular-nums">{t.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
