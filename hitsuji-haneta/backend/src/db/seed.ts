import { db } from "./connection";
import { users, posts, follows } from "./schema";
import { sql } from "drizzle-orm";

const seedUsers = [
  {
    username: "taro",
    displayName: "太郎",
    bio: "エンジニアです。TypeScriptが好きです。",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=taro",
  },
  {
    username: "hanako",
    displayName: "花子",
    bio: "デザイナー兼フロントエンドエンジニア",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=hanako",
  },
  {
    username: "yuki",
    displayName: "ゆき",
    bio: "バックエンド開発が得意です",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=yuki",
  },
  {
    username: "ken",
    displayName: "ケン",
    bio: "フルスタックエンジニア。React大好き",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=ken",
  },
  {
    username: "sakura",
    displayName: "さくら",
    bio: "新米エンジニア。毎日学習中！",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=sakura",
  },
  {
    username: "ryo",
    displayName: "りょう",
    bio: "インフラとセキュリティに興味があります",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=ryo",
  },
];

const seedPosts = [
  { authorId: 1, content: "TypeScriptの型システム、奥が深くて面白い！" },
  { authorId: 2, content: "新しいデザインシステムを構築中。Tailwind CSSが便利すぎる" },
  { authorId: 1, content: "Honoフレームワーク使ってみたけど、めっちゃ速い" },
  { authorId: 3, content: "SQLiteとDrizzle ORMの組み合わせ、開発体験が最高" },
  { authorId: 4, content: "React 19の新機能、早く試してみたい" },
  { authorId: 5, content: "今日もコーディング頑張ります！初心者だけどやる気は十分" },
  { authorId: 6, content: "セキュリティの勉強会に参加してきました。学びが多かった" },
  { authorId: 2, content: "アクセシビリティを意識したUIコンポーネント作りました" },
  { authorId: 3, content: "パフォーマンスチューニングの結果、レスポンス時間が半分に！" },
  { authorId: 4, content: "TanStack Queryのキャッシュ戦略について記事書きました" },
];

const seedFollows = [
  { followerId: 1, followingId: 2 },
  { followerId: 1, followingId: 3 },
  { followerId: 2, followingId: 1 },
  { followerId: 2, followingId: 4 },
  { followerId: 3, followingId: 1 },
  { followerId: 3, followingId: 5 },
  { followerId: 4, followingId: 1 },
  { followerId: 4, followingId: 2 },
  { followerId: 5, followingId: 3 },
  { followerId: 6, followingId: 1 },
];

async function seed() {
  console.log("Seeding database...");

  // Create tables using raw SQL
  db.run(sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      bio TEXT NOT NULL DEFAULT '',
      avatar_url TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(sql`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_id INTEGER NOT NULL REFERENCES users(id),
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(sql`
    CREATE TABLE IF NOT EXISTS follows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      follower_id INTEGER NOT NULL REFERENCES users(id),
      following_id INTEGER NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_follow ON follows(follower_id, following_id)
  `);

  // Clear existing data
  db.delete(follows).run();
  db.delete(posts).run();
  db.delete(users).run();

  // Insert seed data
  for (const user of seedUsers) {
    db.insert(users).values(user).run();
  }

  for (const post of seedPosts) {
    db.insert(posts).values(post).run();
  }

  for (const follow of seedFollows) {
    db.insert(follows).values(follow).run();
  }

  console.log("Seeding complete!");
  console.log(`  Users: ${seedUsers.length}`);
  console.log(`  Posts: ${seedPosts.length}`);
  console.log(`  Follows: ${seedFollows.length}`);
}

seed().catch(console.error);
