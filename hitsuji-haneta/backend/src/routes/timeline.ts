import { Hono } from "hono";
import { db } from "../db/connection";
import { posts, users, follows } from "../db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { success, error } from "../lib/apiResponse";
import { idParamSchema } from "../validators/common";

const app = new Hono();

// GET /api/timeline/:userId - Get timeline for a user (posts from followed users)
app.get("/:userId", async (c) => {
  const params = idParamSchema.safeParse({ id: c.req.param("userId") });
  if (!params.success) {
    return error(c, "VALIDATION_ERROR", "Invalid user ID", 400);
  }

  const userId = params.data.id;

  const user = db.select().from(users).where(eq(users.id, userId)).get();
  if (!user) {
    return error(c, "NOT_FOUND", "User not found", 404);
  }

  // Get IDs of users being followed
  const followedUsers = db
    .select({ followingId: follows.followingId })
    .from(follows)
    .where(eq(follows.followerId, userId))
    .all();

  const followingIds = followedUsers.map((f) => f.followingId);

  if (followingIds.length === 0) {
    return success(c, []);
  }

  // Get posts from followed users
  const timelinePosts = db
    .select()
    .from(posts)
    .where(inArray(posts.authorId, followingIds))
    .orderBy(desc(posts.createdAt))
    .all();

  // Attach author info to each post
  const allUsers = db.select().from(users).all();
  const userMap = new Map(allUsers.map((u) => [u.id, u]));

  const postsWithAuthors = timelinePosts.map((post) => ({
    ...post,
    author: userMap.get(post.authorId)!,
  }));

  return success(c, postsWithAuthors);
});

export default app;
