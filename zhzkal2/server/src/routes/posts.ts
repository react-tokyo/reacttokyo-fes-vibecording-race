import { Hono } from 'hono';
import * as store from '../store.js';

const router = new Hono();

// POST /api/posts - 포스트 작성
router.post('/', async (c) => {
  const currentUserId = c.req.header('X-User-Id') ?? 'user1';

  const body = await c.req.json<{ content?: string }>();
  const content = body.content?.trim();

  if (!content) return c.json({ error: '내용을 입력해주세요' }, 400);
  if (content.length > 280) return c.json({ error: '280자를 초과할 수 없습니다' }, 400);

  const author = await store.getUserById(currentUserId);
  if (!author) return c.json({ error: '유저를 찾을 수 없습니다' }, 401);

  const post = await store.createPost(currentUserId, content);
  return c.json({ data: { ...post, author } }, 201);
});

export default router;
