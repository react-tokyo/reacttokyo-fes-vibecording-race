import type { Context, Next } from "hono";

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    console.error("Unhandled error:", err);
    return c.json(
      {
        success: false as const,
        error: {
          code: "INTERNAL_ERROR" as const,
          message: "An unexpected error occurred",
        },
      },
      500
    );
  }
}
