import { Hono } from "hono";
import { db } from "../db/connection";
import { posts, users } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { success, error } from "../lib/apiResponse";
import { createPostSchema } from "../validators/post";
import { idParamSchema } from "../validators/common";

const app = new Hono();

// POST /api/posts - Create a new post
app.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = createPostSchema.safeParse(body);

  if (!parsed.success) {
    return error(
      c,
      "VALIDATION_ERROR",
      parsed.error.errors.map((e) => e.message).join(", "),
      400
    );
  }

  const author = db
    .select()
    .from(users)
    .where(eq(users.id, parsed.data.authorId))
    .get();

  if (!author) {
    return error(c, "NOT_FOUND", "Author not found", 404);
  }

  const result = db.insert(posts).values(parsed.data).returning().get();

  return success(c, { ...result, author }, 201);
});

// GET /api/users/:id/posts - Get user's posts
app.get("/users/:id/posts", async (c) => {
  const params = idParamSchema.safeParse({ id: c.req.param("id") });
  if (!params.success) {
    return error(c, "VALIDATION_ERROR", "Invalid user ID", 400);
  }

  const user = db
    .select()
    .from(users)
    .where(eq(users.id, params.data.id))
    .get();

  if (!user) {
    return error(c, "NOT_FOUND", "User not found", 404);
  }

  const userPosts = db
    .select()
    .from(posts)
    .where(eq(posts.authorId, params.data.id))
    .orderBy(desc(posts.createdAt))
    .all();

  const postsWithAuthor = userPosts.map((post) => ({
    ...post,
    author: user,
  }));

  return success(c, postsWithAuthor);
});

export default app;
