import { Hono } from 'hono';
import * as store from '../store.js';

const router = new Hono();

// GET /api/users/me - 현재 로그인 유저 정보
router.get('/me', async (c) => {
  const currentUserId = c.req.header('X-User-Id') ?? 'user1';
  const user = await store.getUserById(currentUserId);
  if (!user) return c.json({ error: '유저를 찾을 수 없습니다' }, 404);
  return c.json({ data: user });
});

// GET /api/users - 유저 목록 (팔로우 상태 포함)
router.get('/', async (c) => {
  const currentUserId = c.req.header('X-User-Id') ?? 'user1';

  const [users, allFollows] = await Promise.all([
    store.getUsers(),
    store.getAllFollows(),
  ]);

  const data = users.map((u) => ({
    ...u,
    followingCount: allFollows.filter((f) => f.follower_id === u.id).length,
    followerCount: allFollows.filter((f) => f.following_id === u.id).length,
    isFollowing: allFollows.some(
      (f) => f.follower_id === currentUserId && f.following_id === u.id,
    ),
    isCurrentUser: u.id === currentUserId,
  }));

  return c.json({ data });
});

// GET /api/users/:id - 유저 프로필 + 포스트 목록
router.get('/:id', async (c) => {
  const currentUserId = c.req.header('X-User-Id') ?? 'user1';
  const userId = c.req.param('id');

  const [user, posts, followingIds, followerIds, following] = await Promise.all([
    store.getUserById(userId),
    store.getPostsByAuthor(userId),
    store.getFollowingIds(userId),
    store.getFollowerIds(userId),
    store.isFollowing(currentUserId, userId),
  ]);

  if (!user) return c.json({ error: '유저를 찾을 수 없습니다' }, 404);

  return c.json({
    data: {
      ...user,
      followingCount: followingIds.length,
      followerCount: followerIds.length,
      isFollowing: following,
      isCurrentUser: userId === currentUserId,
      posts: posts.map((p) => ({ ...p, author: user })),
    },
  });
});

// POST /api/users/:id/follow - 팔로우
router.post('/:id/follow', async (c) => {
  const currentUserId = c.req.header('X-User-Id') ?? 'user1';
  const targetId = c.req.param('id');

  if (currentUserId === targetId) {
    return c.json({ error: '자기 자신을 팔로우할 수 없습니다' }, 400);
  }
  if (!(await store.getUserById(targetId))) {
    return c.json({ error: '유저를 찾을 수 없습니다' }, 404);
  }

  await store.follow(currentUserId, targetId);
  return c.json({ data: { following: true } });
});

// DELETE /api/users/:id/follow - 언팔로우
router.delete('/:id/follow', async (c) => {
  const currentUserId = c.req.header('X-User-Id') ?? 'user1';
  const targetId = c.req.param('id');

  await store.unfollow(currentUserId, targetId);
  return c.json({ data: { following: false } });
});

export default router;
