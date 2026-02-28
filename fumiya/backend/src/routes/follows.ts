import { Router, Request, Response } from "express";
import db from "../database.js";

export const followsRouter = Router();

followsRouter.post("/", (req: Request, res: Response) => {
  const { followerId, followingId } = req.body;

  if (!followerId || !followingId) {
    res.status(400).json({ error: "followerId and followingId are required" });
    return;
  }

  if (followerId === followingId) {
    res.status(400).json({ error: "Cannot follow yourself" });
    return;
  }

  try {
    db.prepare(
      "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)"
    ).run(followerId, followingId);
    res.status(201).json({ success: true });
  } catch (error: unknown) {
    const sqliteError = error as { code?: string };
    if (sqliteError.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
      res.status(409).json({ error: "Already following" });
    } else {
      throw error;
    }
  }
});

followsRouter.delete("/", (req: Request, res: Response) => {
  const followerId = Number(req.query.followerId);
  const followingId = Number(req.query.followingId);

  if (!followerId || !followingId) {
    res.status(400).json({ error: "followerId and followingId are required" });
    return;
  }

  const result = db
    .prepare(
      "DELETE FROM follows WHERE follower_id = ? AND following_id = ?"
    )
    .run(followerId, followingId);

  if (result.changes === 0) {
    res.status(404).json({ error: "Follow relationship not found" });
    return;
  }

  res.json({ success: true });
});
