import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import RightSidebar from "../components/layout/RightSidebar";
import ProfileHeader from "../components/user/ProfileHeader";
import PostCard from "../components/timeline/PostCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { useUser } from "../hooks/useUser";
import { useUserPosts } from "../hooks/useUserPosts";

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { currentUserId } = useCurrentUser();
  const { data: user, isLoading: userLoading, error: userError } = useUser(userId!, currentUserId);
  const { data: posts, isLoading: postsLoading, error: postsError } = useUserPosts(userId!);

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-x-bg">
        <LoadingSpinner />
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-x-bg">
        <ErrorMessage message="Failed to load user profile." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-x-bg text-x-text">
      {/* Left Sidebar */}
      <aside className="sticky top-0 h-screen w-[260px] border-r border-x-border">
        <Sidebar />
      </aside>

      {/* Center Column */}
      <main className="flex-1 max-w-[600px] border-r border-x-border">
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-x-border bg-x-bg/80 p-4 backdrop-blur">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 transition-colors hover:bg-x-card"
            aria-label="Back"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
              aria-hidden="true"
            >
              <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold">{user?.displayName}</h1>
          </div>
        </header>

        <ProfileHeader user={user} currentUserId={currentUserId} />

        <div className="border-t border-x-border">
          {postsLoading ? (
            <div className="flex justify-center p-8">
              <LoadingSpinner />
            </div>
          ) : postsError ? (
            <ErrorMessage message="Failed to load posts." />
          ) : posts && posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="p-8 text-center text-x-secondary">
              No posts yet.
            </p>
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden w-[350px] lg:block">
        <RightSidebar />
      </aside>
    </div>
  );
}
