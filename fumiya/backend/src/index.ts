import express from "express";
import cors from "cors";
import { initializeDatabase } from "./database.js";
import { usersRouter } from "./routes/users.js";
import { postsRouter } from "./routes/posts.js";
import { followsRouter } from "./routes/follows.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

initializeDatabase();

app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/follows", followsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
