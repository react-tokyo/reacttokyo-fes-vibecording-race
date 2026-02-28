import { Hono } from "hono";
import { cors } from "hono/cors";
import { errorHandler } from "./middleware/errorHandler";
import usersRoute from "./routes/users";
import postsRoute from "./routes/posts";
import followsRoute from "./routes/follows";
import timelineRoute from "./routes/timeline";

const app = new Hono();

app.use("*", cors());
app.use("*", errorHandler);

app.route("/api/users", usersRoute);
app.route("/api/posts", postsRoute);
app.route("/api", postsRoute);
app.route("/api/follows", followsRoute);
app.route("/api/timeline", timelineRoute);

app.get("/api/health", (c) => c.json({ status: "ok" }));

export default {
  port: 3000,
  fetch: app.fetch,
};

console.log("Server running on http://localhost:3000");
