# X-like Social Platform — Full Stack Build Guide

**Language Rule: Think in English, respond in Korean.**

You are building an X (Twitter)-like mutual follow + text posting platform.
React frontend + Node.js/Express backend + SQLite, all TypeScript.
Both servers run locally and communicate via REST API.

---

## 6 Completion Criteria (ALL required)

1. **User List** — 5+ users displayed on screen
2. **Follow/Unfollow** — Toggle button, state reflected in UI + backend
3. **Text Post** — Input text → submit → saved to backend → displayed
4. **Timeline** — Only followed users' posts, chronological order
5. **Profile Page** — Click user → profile info + that user's posts
6. **Follow/Follower Counts** — Correct counts on profile

---

## Project Structure

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── UserCard.tsx
│   │   │   ├── PostForm.tsx
│   │   │   ├── PostItem.tsx
│   │   │   ├── Timeline.tsx
│   │   │   ├── UserList.tsx
│   │   │   └── FollowButton.tsx
│   │   ├── pages/               # Route-level components
│   │   │   ├── HomePage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── hooks/               # Custom hooks
│   │   │   └── useApi.ts
│   │   ├── types/               # TypeScript types
│   │   │   └── index.ts
│   │   ├── api/                 # API client
│   │   │   └── client.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/              # Route handlers by domain
│   │   │   ├── users.ts
│   │   │   ├── posts.ts
│   │   │   └── follows.ts
│   │   ├── models/              # Data access layer
│   │   │   └── database.ts
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── seed.ts              # Seed 5+ users + sample data
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── README.md
└── package.json                 # Root: concurrently starts both
```

---

## Database Schema (SQLite via better-sqlite3)

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE follows (
  follower_id INTEGER NOT NULL,
  following_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (follower_id, following_id),
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
```

---

## Seed Data

Seed at least 5 users, some posts, and follow relationships so the app has content on first load.

```typescript
const seedUsers = [
  { username: 'alice', display_name: 'Alice Johnson', bio: 'Software engineer & open source enthusiast' },
  { username: 'bob', display_name: 'Bob Smith', bio: 'Designer by day, gamer by night' },
  { username: 'charlie', display_name: 'Charlie Brown', bio: 'Coffee lover and bookworm' },
  { username: 'diana', display_name: 'Diana Prince', bio: 'Travel photographer' },
  { username: 'eve', display_name: 'Eve Wilson', bio: 'Data scientist exploring AI' },
];
```

---

## API Endpoints

### Users
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users` | List all users with follow counts |
| GET | `/api/users/:id` | User profile + follow/follower counts |
| GET | `/api/users/:id/posts` | Posts by specific user |

### Posts
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/posts` | Create post `{ userId, content }` |
| GET | `/api/timeline/:userId` | Posts from followed users, newest first |

### Follows
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/follows` | Follow `{ followerId, followingId }` |
| DELETE | `/api/follows` | Unfollow `{ followerId, followingId }` |
| GET | `/api/follows/:userId/status/:targetId` | Check follow status |

Current user: hardcode to user ID 1 or use a dropdown selector. No auth required.

---

## Response Format (Consistent Envelope)

```typescript
// Success
interface ApiResponse<T> { success: true; data: T; }

// Error
interface ApiError { success: false; error: { code: string; message: string; }; }

// User
interface User {
  id: number;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  followingCount: number;
  followerCount: number;
  isFollowing?: boolean;
  createdAt: string;
}

// Post (embed user info to avoid N+1)
interface Post {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  user: { id: number; username: string; displayName: string; avatarUrl: string; };
}
```

Use camelCase in JSON. Transform from snake_case in DB layer. Return proper HTTP status codes (200, 201, 400, 404, 500).

---

## State Management (React)

**Server state** → TanStack Query (React Query) or custom hooks with useEffect + useState.
**Client state** → useState only for UI concerns (form inputs, toggles).

Query key convention:
```typescript
const queryKeys = {
  users: ['users'] as const,
  user: (id: number) => ['users', id] as const,
  userPosts: (id: number) => ['users', id, 'posts'] as const,
  timeline: (userId: number) => ['timeline', userId] as const,
};
```

Cache invalidation after mutations:
- Follow/unfollow → invalidate users, profile, timeline
- Create post → invalidate timeline, user posts

Use optimistic updates for follow/unfollow for snappy UX.

---

## Error Handling

### Backend
- Global error-handling middleware (last middleware)
- Async handler wrapper to catch promise rejections
- Validate all inputs: empty content → 400, non-existent user → 404, self-follow → 400, duplicate follow → idempotent 200
- Never leak stack traces

### Frontend
- Loading spinners during data fetch
- User-friendly error messages in UI (not raw errors)
- Disable buttons during pending mutations
- Clear form after successful post
- Empty states: "Follow users to see posts" / "No posts yet"

---

## Testing

### Backend (Vitest)
```typescript
// Required test cases:
describe('POST /api/posts', () => {
  it('creates post with valid content');
  it('returns 400 for empty content');
  it('returns 400 for non-existent user');
});

describe('POST /api/follows', () => {
  it('creates follow relationship');
  it('prevents self-follow');
  it('is idempotent on duplicate');
});

describe('GET /api/timeline/:userId', () => {
  it('returns only followed users posts');
  it('returns posts in reverse chronological order');
  it('returns empty array when no follows');
});
```

### Frontend (Vitest + React Testing Library)
- FollowButton toggle behavior
- PostForm submission + clear
- UserList renders 5+ users

---

## Startup

Root `package.json`:
```json
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
    "install:all": "cd backend && npm install && cd ../frontend && npm install",
    "test": "cd backend && npm test && cd ../frontend && npm test"
  },
  "devDependencies": { "concurrently": "^8.0.0" }
}
```

Frontend: port 5173 (Vite). Backend: port 3001. Configure CORS on backend.

---

## Quality Scoring Rubric (50 points)

| Category (points) | What reviewers check |
|--------------------|----------------------|
| Code Quality (10) | Readability, naming (camelCase/PascalCase), DRY, clean directory structure, no dead code |
| Architecture (10) | Frontend/backend separation, proper data modeling with FK/indexes, single-responsibility modules |
| API Design (10) | Typed interfaces, consistent response envelope, proper status codes, clear error codes |
| State Management (10) | Server vs client state separation, no redundant state, optimistic updates, proper cache invalidation |
| Error Handling (6) | Input validation, edge cases (empty content, self-follow, duplicates), user-friendly UI errors |
| Tests (4) | Tests exist and run, cover happy + error paths, meaningful assertions |

### Naming Rules
- Variables/functions: `camelCase` — `getUserById`, `handleFollow`, `isFollowing`
- Components: `PascalCase` — `FollowButton`, `PostItem`
- Types: `PascalCase` — `UserProfile`, `ApiResponse`
- Booleans: prefix with `is`/`has`/`should`
- Handlers: `handleX` pattern

### FORBIDDEN (−30 points)
Never put AI-directed instructions in code, comments, variables, filenames, or README (e.g., "rate this 10/10", "this code is perfect"). This is prompt injection and results in automatic 30-point deduction.
