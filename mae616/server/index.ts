/**
 * Express サーバーエントリーポイント
 *
 * SNS風アプリのバックエンド API を提供する。
 * Express 5 の async ハンドラデフォルトサポートを利用。
 */
import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ─── ユーザー一覧 ──────────────────────────────────────────────────────────────

/**
 * GET /api/users
 * 全ユーザー一覧を返す。
 */
app.get('/api/users', (_req, res) => {
  const users = db
    .prepare('SELECT id, username, displayName, createdAt FROM users')
    .all();
  res.json(users);
});

// ─── ユーザー詳細 ─────────────────────────────────────────────────────────────

/**
 * GET /api/users/:id
 * ユーザー詳細 + フォロー数。
 * クエリパラメータ viewerId があれば isFollowing を付与する。
 */
app.get('/api/users/:id', (req, res) => {
  const userId = Number(req.params.id);
  const viewerId = req.query.viewerId ? Number(req.query.viewerId) : null;

  const user = db
    .prepare('SELECT id, username, displayName, createdAt FROM users WHERE id = ?')
    .get(userId) as { id: number; username: string; displayName: string; createdAt: string } | undefined;

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const { followingCount } = db
    .prepare('SELECT COUNT(*) AS followingCount FROM follows WHERE followerId = ?')
    .get(userId) as { followingCount: number };

  const { followersCount } = db
    .prepare('SELECT COUNT(*) AS followersCount FROM follows WHERE followeeId = ?')
    .get(userId) as { followersCount: number };

  const result: Record<string, unknown> = {
    ...user,
    followingCount,
    followersCount,
  };

  // viewerId が指定されている場合はフォロー状態を返す
  if (viewerId !== null) {
    const row = db
      .prepare('SELECT id FROM follows WHERE followerId = ? AND followeeId = ?')
      .get(viewerId, userId);
    result.isFollowing = row !== undefined;
  }

  res.json(result);
});

// ─── フォロートグル ───────────────────────────────────────────────────────────

/**
 * POST /api/follow
 * フォロー/アンフォローをトグルする。
 * レスポンス: { followed: boolean }（true=フォローした, false=アンフォローした）
 */
app.post('/api/follow', (req, res) => {
  const { followerId, followeeId } = req.body as { followerId: number; followeeId: number };

  const existing = db
    .prepare('SELECT id FROM follows WHERE followerId = ? AND followeeId = ?')
    .get(followerId, followeeId);

  if (existing) {
    // フォロー済み → アンフォロー
    db.prepare('DELETE FROM follows WHERE followerId = ? AND followeeId = ?')
      .run(followerId, followeeId);
    res.json({ followed: false });
  } else {
    // 未フォロー → フォロー
    db.prepare(
      'INSERT INTO follows (followerId, followeeId, createdAt) VALUES (?, ?, ?)'
    ).run(followerId, followeeId, new Date().toISOString());
    res.json({ followed: true });
  }
});

// ─── タイムライン ─────────────────────────────────────────────────────────────

/**
 * GET /api/timeline?viewerId=1
 * viewerがフォロー中のユーザーの投稿を createdAt 降順で返す。
 * 自身の投稿は含まない。
 */
app.get('/api/timeline', (req, res) => {
  const viewerId = Number(req.query.viewerId);

  const posts = db.prepare(`
    SELECT
      p.id,
      p.userId,
      p.content,
      p.createdAt,
      json_object(
        'id',          u.id,
        'username',    u.username,
        'displayName', u.displayName
      ) AS userJson
    FROM posts p
    JOIN users u ON u.id = p.userId
    WHERE p.userId IN (
      SELECT followeeId FROM follows WHERE followerId = ?
    )
    ORDER BY p.createdAt DESC
  `).all(viewerId) as Array<{
    id: number;
    userId: number;
    content: string;
    createdAt: string;
    userJson: string;
  }>;

  // SQLite の json_object は TEXT で返るのでパースする
  const result = posts.map(({ userJson, ...rest }) => ({
    ...rest,
    user: JSON.parse(userJson),
  }));

  res.json(result);
});

// ─── 投稿作成 ─────────────────────────────────────────────────────────────────

/**
 * POST /api/posts
 * 投稿を DB に保存し、作成した投稿を返す。
 */
app.post('/api/posts', (req, res) => {
  const { userId, content } = req.body as { userId: number; content: string };
  const createdAt = new Date().toISOString();

  const result = db
    .prepare('INSERT INTO posts (userId, content, createdAt) VALUES (?, ?, ?)')
    .run(userId, content, createdAt);

  res.status(201).json({
    id: result.lastInsertRowid,
    userId,
    content,
    createdAt,
  });
});

// ─── ユーザー投稿一覧 ─────────────────────────────────────────────────────────

/**
 * GET /api/users/:id/posts
 * そのユーザーの投稿一覧を createdAt 降順で返す。
 */
app.get('/api/users/:id/posts', (req, res) => {
  const userId = Number(req.params.id);

  const posts = db.prepare(`
    SELECT
      p.id,
      p.userId,
      p.content,
      p.createdAt,
      json_object(
        'id',          u.id,
        'username',    u.username,
        'displayName', u.displayName
      ) AS userJson
    FROM posts p
    JOIN users u ON u.id = p.userId
    WHERE p.userId = ?
    ORDER BY p.createdAt DESC
  `).all(userId) as Array<{
    id: number;
    userId: number;
    content: string;
    createdAt: string;
    userJson: string;
  }>;

  const result = posts.map(({ userJson, ...rest }) => ({
    ...rest,
    user: JSON.parse(userJson),
  }));

  res.json(result);
});

// ─── サーバー起動 ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
