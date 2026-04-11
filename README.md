# StayHub — Hotel Booking Platform

A full-stack hotel booking platform inspired by Agoda, with an Apple-inspired minimal UI.  
Two user roles: **Guest** (search & book hotels) and **Hotel Partner** (manage listings & bookings).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 (Apple design tokens) |
| Backend | Express.js + TypeScript |
| Database | PostgreSQL + Prisma 7 ORM |
| Auth | JWT (access 15min + refresh 7d) |
| Charts | Recharts |
| Maps | Leaflet / react-leaflet |

---

## Project Structure

```
hotel-booking/
├── backend/          # Express.js API server
│   ├── prisma/       # Schema, migrations, seed
│   └── src/          # Controllers, services, routes, middleware
└── frontend/         # React + Vite app
    └── src/
        ├── api/      # Axios API calls
        ├── components/
        ├── pages/
        └── contexts/ # Auth state
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### 1. Database Setup

```bash
createdb hotel_booking
```

### 2. Backend

```bash
cd backend
cp .env.example .env      # Edit DATABASE_URL, JWT secrets
npm install
npx prisma migrate dev --config prisma/prisma.config.ts --name init
npx tsx prisma/seed.ts    # Seed sample hotels & accounts
npx tsx src/index.ts      # Start on port 3001
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev               # Start on port 5173
```

Open [http://localhost:5173](http://localhost:5173)

---

## Test Accounts

| Role | Email | Password |
|---|---|---|
| Guest | guest@stayhub.com | password123 |
| Partner | partner@stayhub.com | password123 |

---

## Environment Variables

### `backend/.env`

```env
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hotel_booking"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
FRONTEND_URL="http://localhost:5173"
```

---

## Key Features

### Guest
- Search hotels by city, dates, guests, price, star rating, amenities
- View hotel details: photos, room types, map, reviews
- Book rooms with date selection and mock payment
- View and cancel bookings

### Partner
- Dashboard: revenue chart, occupancy, booking stats
- Manage hotel listings (create, edit, publish/unpublish, delete)
- Upload hotel photos
- Manage room types and availability
- Confirm/cancel guest bookings

---

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/hotels              # Search with filters
GET    /api/hotels/featured
GET    /api/hotels/:id
POST   /api/hotels              # [Partner] Create
PUT    /api/hotels/:id          # [Partner] Update
DELETE /api/hotels/:id          # [Partner] Delete
PATCH  /api/hotels/:id/publish  # [Partner] Toggle publish
GET    /api/hotels/my           # [Partner] Own hotels

GET    /api/hotels/:hotelId/rooms
POST   /api/hotels/:hotelId/rooms   # [Partner]
PUT    /api/rooms/:id               # [Partner]
DELETE /api/rooms/:id               # [Partner]

POST   /api/bookings            # [Guest] Create booking
GET    /api/bookings            # [Guest] My bookings
GET    /api/bookings/:id
PATCH  /api/bookings/:id/cancel
PATCH  /api/bookings/:id/confirm  # [Partner]

GET    /api/hotels/:hotelId/reviews
POST   /api/hotels/:hotelId/reviews  # [Guest]

POST   /api/upload              # Image upload (multipart)

GET    /api/partner/stats
GET    /api/partner/revenue-chart
```

---

## Testing on Mobile

When running in development, both servers expose on your local network:

1. Start backend: `cd backend && npx tsx src/index.ts`
2. Start frontend: `cd frontend && npm run dev` (uses `--host` flag automatically)
3. Vite will print your local IP — e.g., `http://192.168.0.41:5173`
4. Open that URL on your phone (must be on the same Wi-Fi network)

---

## Deployment

### Frontend → Vercel

1. Push code to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL` (your backend URL)
5. Deploy — Vercel auto-detects Vite

### Backend + Database → Railway (recommended)

[Railway](https://railway.app) hosts both Express and PostgreSQL in one place with free tier:

1. Create new project → **Deploy from GitHub**
2. Select the `backend/` directory (or use a monorepo root with start command)
3. Add a **PostgreSQL** plugin — Railway injects `DATABASE_URL` automatically
4. Set environment variables: `JWT_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`
5. Set start command: `npx tsx src/index.ts`
6. After deploy, run migrations:
   ```bash
   railway run npx prisma migrate deploy --config prisma/prisma.config.ts
   railway run npx tsx prisma/seed.ts
   ```

**Alternative backends**: [Render](https://render.com) (free tier, spins down after inactivity) or [Fly.io](https://fly.io) (more control, Docker-based).

### Update frontend after backend deployment

In `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend.railway.app
```

Update `frontend/src/api/client.ts` to use `import.meta.env.VITE_API_URL` as the base URL.
