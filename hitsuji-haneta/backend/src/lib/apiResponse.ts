import type { Context } from "hono";
import type { ErrorCode } from "shared";

export function success<T>(c: Context, data: T, status: 200 | 201 = 200) {
  return c.json({ success: true as const, data }, status);
}

export function error(
  c: Context,
  code: ErrorCode,
  message: string,
  status: 400 | 404 | 409 | 500 = 400
) {
  return c.json({ success: false as const, error: { code, message } }, status);
}
