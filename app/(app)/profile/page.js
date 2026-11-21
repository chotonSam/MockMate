import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { getSessionUserId } from "@/lib/session";
import { getProfileData } from "@/lib/profile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import LevelBadges from "@/components/profile/LevelBadges";
import ProfileActivity from "@/components/profile/ProfileActivity";

export const metadata = { title: "My profile — MockMate" };

export default async function MyProfilePage() {
  const userId = await getSessionUserId();
  const profile = await getProfileData(userId);
  if (!profile) notFound();

  await connectDB();
  const priv = await User.findById(userId).select("email phone emailVerified").lean(); // private details, only for the owner

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-ink-line bg-white/90 backdrop-blur-md">
        <div className="flex h-16 items-center px-6 lg:px-10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-brand font-semibold">Your account</p>
            <h1 className="mt-0.5 font-display text-2xl leading-none text-paper">My profile</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-10">
        <ProfileHeader profile={profile} />

        {/* Edit profile accordion */}
        <details className="group rounded-2xl border border-ink-line bg-white shadow-card open:pb-6">
          <summary className="focus-ring flex cursor-pointer list-none items-center justify-between rounded-2xl px-6 py-4 font-medium transition-colors hover:bg-ink/50">
            <span className="font-semibold text-paper">Edit profile</span>
            <span className="flex items-center gap-2 font-mono text-xs text-slate-muted">
              <span className="group-open:hidden">Picture, name, bio, phone</span>
              <span className="hidden group-open:inline">Close</span>
              {/* Chevron icon */}
              <svg
                className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </span>
          </summary>
          <div className="px-4 pt-2 sm:px-6">
            <ProfileForm
              user={{ name: profile.user.name, username: profile.user.username, email: priv?.email ?? "", phone: priv?.phone ?? "", image: profile.user.image, bio: profile.user.bio, emailVerified: Boolean(priv?.emailVerified) }}
            />
          </div>
        </details>

        {/* Change password accordion */}
        <details className="group rounded-2xl border border-ink-line bg-white shadow-card open:pb-6">
          <summary className="focus-ring flex cursor-pointer list-none items-center justify-between rounded-2xl px-6 py-4 font-medium transition-colors hover:bg-ink/50">
            <span className="font-semibold text-paper">Change password</span>
            <span className="flex items-center gap-2 font-mono text-xs text-slate-muted">
              <span className="group-open:hidden">Update your password</span>
              <span className="hidden group-open:inline">Close</span>
              {/* Chevron icon */}
              <svg
                className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </span>
          </summary>
          <div className="px-4 pt-2 sm:px-6">
            <ChangePasswordForm />
          </div>
        </details>

        <LevelBadges levels={profile.levels} name={profile.user.name} />
        <ProfileActivity posts={profile.posts} resources={profile.resources} isOwner name={profile.user.name} />
      </main>
    </>
  );
}
