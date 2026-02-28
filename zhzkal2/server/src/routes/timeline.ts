import { Hono } from 'hono';
import * as store from '../store.js';

const router = new Hono();

// GET /api/timeline - 팔로우 중인 유저 + 자신의 포스트를 시간순으로
router.get('/', async (c) => {
  const currentUserId = c.req.header('X-User-Id') ?? 'user1';

  const followingIds = await store.getFollowingIds(currentUserId);
  const targetIds = [...new Set([...followingIds, currentUserId])];

  const [posts, users] = await Promise.all([
    store.getPostsByAuthorIds(targetIds),
    store.getUsers(),
  ]);

  const userMap = new Map(users.map((u) => [u.id, u]));
  const data = posts.map((p) => ({ ...p, author: userMap.get(p.authorId)! }));

  return c.json({ data });
});

export default router;
