import { Link } from "react-router-dom";
import type { User } from "../types";

interface Props {
  user: User;
  onFollow: () => void;
}

export default function UserCard({ user, onFollow }: Props) {
  return (
    <div className="user-card">
      <Link to={`/users/${user.id}`} className="user-info">
        <strong>{user.display_name}</strong>
        <span className="username">@{user.username}</span>
      </Link>
      <button
        className={`follow-btn ${user.is_following ? "following" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          onFollow();
        }}
      >
        {user.is_following ? "フォロー中" : "フォローする"}
      </button>
    </div>
  );
}
