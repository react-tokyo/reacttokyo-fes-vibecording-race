import { Hono } from "hono";
import { db } from "../db/connection";
import { users, follows } from "../db/schema";
import { eq, sql, and } from "drizzle-orm";
import { success, error } from "../lib/apiResponse";
import { idParamSchema, currentUserQuerySchema } from "../validators/common";

const app = new Hono();

// GET /api/users - List all users with optional isFollowing flag
app.get("/", async (c) => {
  const query = currentUserQuerySchema.safeParse({
    currentUserId: c.req.query("currentUserId"),
  });

  const currentUserId = query.success ? query.data.currentUserId : undefined;

  const allUsers = db.select().from(users).all();

  const usersWithFollowStatus = await Promise.all(
    allUsers.map(async (user) => {
      let isFollowing: boolean | undefined;
      if (currentUserId && currentUserId !== user.id) {
        const followRecord = db
          .select()
          .from(follows)
          .where(
            and(
              eq(follows.followerId, currentUserId),
              eq(follows.followingId, user.id)
            )
          )
          .get();
        isFollowing = !!followRecord;
      }

      return {
        ...user,
        isFollowing,
      };
    })
  );

  return success(c, usersWithFollowStatus);
});

// GET /api/users/:id - Get user details with follow counts
app.get("/:id", async (c) => {
  const params = idParamSchema.safeParse({ id: c.req.param("id") });
  if (!params.success) {
    return error(c, "VALIDATION_ERROR", "Invalid user ID", 400);
  }

  const query = currentUserQuerySchema.safeParse({
    currentUserId: c.req.query("currentUserId"),
  });
  const currentUserId = query.success ? query.data.currentUserId : undefined;

  const user = db
    .select()
    .from(users)
    .where(eq(users.id, params.data.id))
    .get();

  if (!user) {
    return error(c, "NOT_FOUND", "User not found", 404);
  }

  const followingCountResult = db
    .select({ count: sql<number>`count(*)` })
    .from(follows)
    .where(eq(follows.followerId, user.id))
    .get();

  const followerCountResult = db
    .select({ count: sql<number>`count(*)` })
    .from(follows)
    .where(eq(follows.followingId, user.id))
    .get();

  let isFollowing: boolean | undefined;
  if (currentUserId && currentUserId !== user.id) {
    const followRecord = db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, currentUserId),
          eq(follows.followingId, user.id)
        )
      )
      .get();
    isFollowing = !!followRecord;
  }

  return success(c, {
    ...user,
    followingCount: followingCountResult?.count ?? 0,
    followerCount: followerCountResult?.count ?? 0,
    isFollowing,
  });
});

export default app;
