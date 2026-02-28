/**
 * タイムライン API テスト
 *
 * インメモリ SQLite を使い、サーバーを起動せずに
 * タイムラインロジックを直接検証する。
 *
 * 検証観点:
 * 1. viewerId=1 のフォロー先（userId=4, 6）の投稿のみ返る
 * 2. createdAt 降順になっている
 * 3. viewer 自身（userId=1）の投稿が含まれない
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { createDb } from '../db.js';
import type Database from 'better-sqlite3';

/** インメモリ DB を seed 済みで取得する */
let db: Database.Database;

beforeAll(() => {
  // ':memory:' を渡すとインメモリ DB になる
  db = createDb(':memory:');
});

// ─── タイムラインクエリ（index.ts と同じ SQL）─────────────────────────────────

function getTimeline(viewerId: number) {
  const rows = db.prepare(`
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

  return rows.map(({ userJson, ...rest }) => ({
    ...rest,
    user: JSON.parse(userJson) as { id: number; username: string; displayName: string },
  }));
}

// ─── テストスイート ────────────────────────────────────────────────────────────

describe('GET /api/timeline (viewerId=1)', () => {
  it('フォロー先（userId=4 と userId=6）の投稿のみ返る', () => {
    const timeline = getTimeline(1);

    expect(timeline.length).toBeGreaterThan(0);

    // すべての投稿が userId=4 または userId=6 である
    for (const post of timeline) {
      expect([4, 6]).toContain(post.userId);
    }
  });

  it('viewer 自身（userId=1）の投稿が含まれない', () => {
    const timeline = getTimeline(1);

    const selfPost = timeline.find((p) => p.userId === 1);
    expect(selfPost).toBeUndefined();
  });

  it('createdAt が降順（新しい順）になっている', () => {
    const timeline = getTimeline(1);

    for (let i = 0; i < timeline.length - 1; i++) {
      const current = timeline[i].createdAt;
      const next = timeline[i + 1].createdAt;
      // ISO 文字列は辞書順比較でも時刻順になる
      expect(current >= next).toBe(true);
    }
  });

  it('各投稿に user オブジェクト（id, username, displayName）が含まれる', () => {
    const timeline = getTimeline(1);

    for (const post of timeline) {
      expect(post.user).toBeDefined();
      expect(typeof post.user.id).toBe('number');
      expect(typeof post.user.username).toBe('string');
      expect(typeof post.user.displayName).toBe('string');
    }
  });

  it('userId=4（山田美咲）の投稿が含まれる', () => {
    const timeline = getTimeline(1);
    const yamadaPosts = timeline.filter((p) => p.userId === 4);
    expect(yamadaPosts.length).toBeGreaterThan(0);
  });

  it('userId=6（伊藤さくら）の投稿が含まれる', () => {
    const timeline = getTimeline(1);
    const itoPosts = timeline.filter((p) => p.userId === 6);
    expect(itoPosts.length).toBeGreaterThan(0);
  });
});
