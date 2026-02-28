import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";
import { join } from "path";
import { mkdirSync } from "fs";

const dataDir = join(import.meta.dir, "../../data");
mkdirSync(dataDir, { recursive: true });

const sqlite = new Database(join(dataDir, "app.db"));
sqlite.exec("PRAGMA journal_mode = WAL;");
sqlite.exec("PRAGMA foreign_keys = ON;");

export const db = drizzle(sqlite, { schema });
