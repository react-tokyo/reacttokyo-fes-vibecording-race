import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import usersRouter from './routes/users.js';
import timelineRouter from './routes/timeline.js';
import postsRouter from './routes/posts.js';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'X-User-Id'],
    allowMethods: ['GET', 'POST', 'DELETE'],
  }),
);

app.route('/api/users', usersRouter);
app.route('/api/timeline', timelineRouter);
app.route('/api/posts', postsRouter);

app.get('/health', (c) => c.json({ status: 'ok' }));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: '서버 오류가 발생했습니다' }, 500);
});

const PORT = 3001;
serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`🔥 X Clone Server running on http://localhost:${PORT}`);
});
