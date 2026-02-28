import { Router, Request, Response } from "express";
import db from "../database.js";

export const postsRouter = Router();

postsRouter.post("/", (req: Request, res: Response) => {
  const { userId, content } = req.body;

  if (!userId || !content?.trim()) {
    res.status(400).json({ error: "userId and content are required" });
    return;
  }

  if (content.trim().length > 280) {
    res.status(400).json({ error: "Content must be 280 characters or less" });
    return;
  }

  const result = db
    .prepare("INSERT INTO posts (user_id, content) VALUES (?, ?)")
    .run(userId, content.trim());

  const post = db
    .prepare(
      `SELECT p.*, u.username, u.display_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?`
    )
    .get(result.lastInsertRowid);

  res.status(201).json(post);
});

postsRouter.get("/timeline/:userId", (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  const posts = db
    .prepare(
      `SELECT p.*, u.username, u.display_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
        OR p.user_id IN (SELECT following_id FROM follows WHERE follower_id = ?)
      ORDER BY p.created_at DESC`
    )
    .all(userId, userId);

  res.json(posts);
});
