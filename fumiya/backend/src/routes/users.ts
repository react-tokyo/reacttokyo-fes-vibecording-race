import { Router, Request, Response } from "express";
import db from "../database.js";

export const usersRouter = Router();

usersRouter.get("/", (req: Request, res: Response) => {
  const currentUserId = req.query.currentUserId
    ? Number(req.query.currentUserId)
    : null;

  const users = db
    .prepare(
      `SELECT
        u.*,
        (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count,
        (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as follower_count
      FROM users u
      ORDER BY u.id`
    )
    .all();

  if (currentUserId) {
    const followingIds = db
      .prepare("SELECT following_id FROM follows WHERE follower_id = ?")
      .all(currentUserId) as { following_id: number }[];

    const followingSet = new Set(followingIds.map((f) => f.following_id));

    const usersWithStatus = (users as Record<string, unknown>[]).map(
      (user: Record<string, unknown>) => ({
        ...user,
        is_following: followingSet.has(user.id as number),
      })
    );

    res.json(usersWithStatus);
  } else {
    res.json(users);
  }
});

usersRouter.get("/:id", (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const currentUserId = req.query.currentUserId
    ? Number(req.query.currentUserId)
    : null;

  const user = db
    .prepare(
      `SELECT
        u.*,
        (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count,
        (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as follower_count
      FROM users u
      WHERE u.id = ?`
    )
    .get(userId);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  let isFollowing = false;
  if (currentUserId) {
    const follow = db
      .prepare(
        "SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?"
      )
      .get(currentUserId, userId);
    isFollowing = !!follow;
  }

  res.json({ ...(user as Record<string, unknown>), is_following: isFollowing });
});

usersRouter.get("/:id/posts", (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  const posts = db
    .prepare(
      `SELECT p.*, u.username, u.display_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC`
    )
    .all(userId);

  res.json(posts);
});
