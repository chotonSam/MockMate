import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Post from "@/lib/models/Post";
import Notification from "@/lib/models/Notification";
import { getSessionUserId } from "@/lib/session";
import NotificationList from "@/components/notifications/NotificationList";

export const metadata = { title: "Notifications — MockMate" };

export default async function NotificationsPage() {
  const userId = await getSessionUserId();
  await connectDB();
  void User; void Post;

  const items = await Notification.find({ user: userId })
    .sort({ updatedAt: -1 })
    .limit(50)
    .populate("actor", "name username image")
    .populate("post", "title")
    .lean();

  const initial = items
    .filter((n) => n.post && n.actor)
    .map((n) => ({
      id: String(n._id),
      type: n.type,
      text: n.text,
      read: n.read,
      createdAt: n.updatedAt.toISOString(),
      actor: { name: n.actor.name, username: n.actor.username, image: n.actor.image ?? "" },
      postId: String(n.post._id),
      postTitle: n.post.title,
    }));

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-ink-line bg-white/90 backdrop-blur-md">
        <div className="flex h-16 items-center px-6 lg:px-10">
          <div>
            <p className="font-mono text-xs tracking-wide text-slate-muted">
              <span className="mr-1.5" aria-hidden="true">🔔</span>
              Comments, replies and likes
            </p>
            <h1 className="mt-0.5 font-display text-2xl leading-none text-paper">Notifications</h1>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 pt-10 pb-16 lg:px-8">
        <NotificationList initial={initial} />
      </main>
    </>
  );
}
