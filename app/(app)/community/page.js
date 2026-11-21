import CommunityFeed from "@/components/community/CommunityFeed";

export const metadata = { title: "Community — MockMate" };

export default function CommunityPage() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-ink-line bg-white/90 backdrop-blur-md">
        <div className="flex h-16 items-center px-6 lg:px-10">
          <div>
            <p className="font-mono text-xs text-slate-muted">Posts, questions and experiences</p>
            <h1 className="mt-1 font-display text-2xl leading-none text-paper">Community</h1>
          </div>
        </div>
      </header>
      <CommunityFeed />
    </>
  );
}
