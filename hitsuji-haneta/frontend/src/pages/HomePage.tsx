import Sidebar from "../components/layout/Sidebar";
import RightSidebar from "../components/layout/RightSidebar";
import Timeline from "../components/timeline/Timeline";
import PostComposer from "../components/timeline/PostComposer";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { useTimeline } from "../hooks/useTimeline";

export default function HomePage() {
  const { currentUserId } = useCurrentUser();
  const { data: posts, isLoading, error } = useTimeline(currentUserId);

  return (
    <div className="flex min-h-screen bg-x-bg text-x-text">
      {/* Left Sidebar */}
      <aside className="sticky top-0 h-screen w-[260px] border-r border-x-border">
        <Sidebar />
      </aside>

      {/* Center Column */}
      <main className="flex-1 max-w-[600px] border-r border-x-border">
        <header className="sticky top-0 z-10 border-b border-x-border bg-x-bg/80 p-4 backdrop-blur">
          <h1 className="text-xl font-bold">Home</h1>
        </header>

        <div className="border-b border-x-border">
          <PostComposer authorId={currentUserId} />
        </div>

        <Timeline posts={posts} isLoading={isLoading} error={error} />
      </main>

      {/* Right Sidebar */}
      <aside className="hidden w-[350px] lg:block">
        <RightSidebar />
      </aside>
    </div>
  );
}
