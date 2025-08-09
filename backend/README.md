# Arvyax Wellness Backend

## Setup
1. Copy `.env.example` to `.env` and fill MONGO_URI and JWT_SECRET.
2. Install deps: `npm install`
3. Run dev server: `npm run dev`

API endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me
- POST /api/auth/logout
- GET  /api/sessions           (public published sessions)
- GET  /api/sessions/my-sessions      (protected)
- GET  /api/sessions/my-sessions/:id  (protected)
- POST /api/sessions/my-sessions/save-draft  (protected)
- POST /api/sessions/my-sessions/publish     (protected)
