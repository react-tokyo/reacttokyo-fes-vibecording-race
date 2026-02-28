import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "..", "data.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      bio TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS follows (
      follower_id INTEGER NOT NULL,
      following_id INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (follower_id, following_id),
      FOREIGN KEY (follower_id) REFERENCES users(id),
      FOREIGN KEY (following_id) REFERENCES users(id)
    );
  `);

  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as {
    count: number;
  };

  if (userCount.count === 0) {
    const insertUser = db.prepare(
      "INSERT INTO users (username, display_name, bio) VALUES (?, ?, ?)"
    );
    const users = [
      ["fumiya", "Fumiya", "フルスタックエンジニア。React大好き。"],
      ["tanaka", "Tanaka Taro", "バックエンド担当。Go言語推し。"],
      ["suzuki", "Suzuki Hanako", "デザイナー兼フロントエンド。UI/UXが専門。"],
      ["yamada", "Yamada Ichiro", "インフラエンジニア。AWS好き。"],
      ["sato", "Sato Yuki", "モバイルアプリ開発者。Swift/Kotlin。"],
      ["watanabe", "Watanabe Ken", "データサイエンティスト。Python推し。"],
    ];
    for (const [username, displayName, bio] of users) {
      insertUser.run(username, displayName, bio);
    }

    const insertPost = db.prepare(
      "INSERT INTO posts (user_id, content, created_at) VALUES (?, ?, ?)"
    );
    const posts: [number, string, string][] = [
      [2, "Go 1.22がリリースされました！新機能が楽しみ。", "2024-01-15 10:00:00"],
      [3, "新しいデザインシステムを構築中。Figmaが最高。", "2024-01-15 11:00:00"],
      [4, "Terraformでインフラをコード化するの楽しい。", "2024-01-15 12:00:00"],
      [5, "SwiftUIの新しいAPIが使いやすい！", "2024-01-15 13:00:00"],
      [6, "PandasからPolarsに移行中。速い！", "2024-01-15 14:00:00"],
      [2, "マイクロサービスアーキテクチャについて勉強中。", "2024-01-16 10:00:00"],
      [3, "アクセシビリティを考慮したUIコンポーネントを作成。", "2024-01-16 11:00:00"],
    ];
    for (const [userId, content, createdAt] of posts) {
      insertPost.run(userId, content, createdAt);
    }

    const insertFollow = db.prepare(
      "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)"
    );
    insertFollow.run(1, 2);
    insertFollow.run(1, 3);
    insertFollow.run(2, 1);
    insertFollow.run(3, 1);
    insertFollow.run(4, 1);
  }
}

export default db;
