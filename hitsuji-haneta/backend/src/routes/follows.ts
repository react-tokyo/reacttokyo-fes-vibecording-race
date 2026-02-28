import { Hono } from "hono";
import { db } from "../db/connection";
import { follows, users } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { success, error } from "../lib/apiResponse";
import { followSchema } from "../validators/follow";

const app = new Hono();

// POST /api/follows - Follow a user
app.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = followSchema.safeParse(body);

  if (!parsed.success) {
    return error(
      c,
      "VALIDATION_ERROR",
      parsed.error.errors.map((e) => e.message).join(", "),
      400
    );
  }

  const { followerId, followingId } = parsed.data;

  // Check both users exist
  const follower = db.select().from(users).where(eq(users.id, followerId)).get();
  const following = db.select().from(users).where(eq(users.id, followingId)).get();

  if (!follower || !following) {
    return error(c, "NOT_FOUND", "User not found", 404);
  }

  // Check if already following
  const existing = db
    .select()
    .from(follows)
    .where(
      and(eq(follows.followerId, followerId), eq(follows.followingId, followingId))
    )
    .get();

  if (existing) {
    return error(c, "CONFLICT", "Already following this user", 409);
  }

  const result = db
    .insert(follows)
    .values({ followerId, followingId })
    .returning()
    .get();

  return success(c, result, 201);
});

// DELETE /api/follows - Unfollow a user
app.delete("/", async (c) => {
  const body = await c.req.json();
  const parsed = followSchema.safeParse(body);

  if (!parsed.success) {
    return error(
      c,
      "VALIDATION_ERROR",
      parsed.error.errors.map((e) => e.message).join(", "),
      400
    );
  }

  const { followerId, followingId } = parsed.data;

  const existing = db
    .select()
    .from(follows)
    .where(
      and(eq(follows.followerId, followerId), eq(follows.followingId, followingId))
    )
    .get();

  if (!existing) {
    return error(c, "NOT_FOUND", "Follow relationship not found", 404);
  }

  db.delete(follows)
    .where(
      and(eq(follows.followerId, followerId), eq(follows.followingId, followingId))
    )
    .run();

  return success(c, { message: "Unfollowed successfully" });
});

export default app;
