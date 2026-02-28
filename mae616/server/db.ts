/**
 * SQLite データベース初期化モジュール
 *
 * better-sqlite3 を使い、起動時にテーブルが未作成なら
 * 作成 + seed データを投入する。
 * DBファイルは server/data.db に保存する。
 */
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** DB ファイルのパス（server/data.db） */
const DB_PATH = join(__dirname, 'data.db');

/**
 * データベースインスタンスを生成する。
 * テスト時はインメモリ DB（:memory:）を渡せるよう引数化している。
 */
export function createDb(path: string = DB_PATH): Database.Database {
  const db = new Database(path);

  // WAL モードで書き込みパフォーマンスを向上
  db.pragma('journal_mode = WAL');

  // テーブル作成（冪等）
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY,
      username    TEXT    UNIQUE NOT NULL,
      displayName TEXT    NOT NULL,
      createdAt   TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS posts (
      id        INTEGER PRIMARY KEY,
      userId    INTEGER NOT NULL,
      content   TEXT    NOT NULL,
      createdAt TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS follows (
      id         INTEGER PRIMARY KEY,
      followerId INTEGER NOT NULL,
      followeeId INTEGER NOT NULL,
      createdAt  TEXT    NOT NULL,
      UNIQUE (followerId, followeeId)
    );
  `);

  // 既にデータがあれば seed をスキップ
  const count = (db.prepare('SELECT COUNT(*) AS c FROM users').get() as { c: number }).c;
  if (count === 0) {
    seed(db);
  }

  return db;
}

/**
 * seed データを投入する。
 * createdAt は新→旧の順になるよう差をつけている。
 */
function seed(db: Database.Database): void {
  const insertUser = db.prepare(
    'INSERT INTO users (id, username, displayName, createdAt) VALUES (?, ?, ?, ?)'
  );
  const insertPost = db.prepare(
    'INSERT INTO posts (userId, content, createdAt) VALUES (?, ?, ?)'
  );
  const insertFollow = db.prepare(
    'INSERT INTO follows (followerId, followeeId, createdAt) VALUES (?, ?, ?)'
  );

  // ユーザー 6 人
  const users: [number, string, string, string][] = [
    [1, 'tanaka',    '田中太郎',   '2026-01-01T00:00:00.000Z'],
    [2, 'sato',      '佐藤花子',   '2026-01-02T00:00:00.000Z'],
    [3, 'suzuki',    '鈴木一郎',   '2026-01-03T00:00:00.000Z'],
    [4, 'yamada',    '山田美咲',   '2026-01-04T00:00:00.000Z'],
    [5, 'takahashi', '高橋健太',   '2026-01-05T00:00:00.000Z'],
    [6, 'ito',       '伊藤さくら', '2026-01-06T00:00:00.000Z'],
  ];
  for (const u of users) insertUser.run(...u);

  // 投稿（新→旧の順で createdAt を設定）
  const posts: [number, string, string][] = [
    [1, '今日は天気がいいので散歩してきました！',
      '2026-02-20T10:00:00.000Z'],

    [2, '今日はReact Tokyo Fesに参加してきました！とても楽しかったです。',
      '2026-02-20T09:30:00.000Z'],
    [2, '週末はゆっくり読書する予定です。おすすめの技術書があれば教えてください！',
      '2026-02-19T08:00:00.000Z'],

    [3, '新しいプロジェクトを始めました。TypeScript + React + Viteの組み合わせが最高です！',
      '2026-02-20T08:00:00.000Z'],

    [4, 'カフェでコーディング中。集中できて最高の環境です。',
      '2026-02-20T11:00:00.000Z'],
    [4, '新しいデザインツールを試してみたけど、なかなか良い感じ。',
      '2026-02-19T14:00:00.000Z'],

    [5, '朝ランニングしてきました。気持ちいい！',
      '2026-02-20T07:00:00.000Z'],

    [6, '猫カフェに行ってきました🐱 癒された〜',
      '2026-02-20T12:00:00.000Z'],
    [6, '最近ハマっている技術の話をブログに書きたい。',
      '2026-02-19T20:00:00.000Z'],
  ];
  for (const p of posts) insertPost.run(...p);

  // フォロー関係
  const follows: [number, number, string][] = [
    [1, 4, '2026-02-01T00:00:00.000Z'], // 田中→山田
    [1, 6, '2026-02-01T01:00:00.000Z'], // 田中→伊藤
    [2, 1, '2026-02-01T02:00:00.000Z'], // 佐藤→田中
    [2, 3, '2026-02-01T03:00:00.000Z'], // 佐藤→鈴木
    [3, 2, '2026-02-01T04:00:00.000Z'], // 鈴木→佐藤
    [3, 5, '2026-02-01T05:00:00.000Z'], // 鈴木→高橋
    [4, 1, '2026-02-01T06:00:00.000Z'], // 山田→田中（相互）
  ];
  for (const f of follows) insertFollow.run(...f);
}

/** デフォルトの DB インスタンス（本番用） */
export const db = createDb();
