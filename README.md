# Taskify

Full-stack task marketplace where **users** post work and **providers** browse, accept, and complete tasks.

## Features

- **Role-based auth** — register as a User or Provider
- **Task lifecycle** — `pending` → `accepted` → `completed`
- **Marketplace** — providers browse and accept open tasks
- **Dashboard** — stats and quick actions tailored to your role
- **JWT authentication** — secure login with protected routes
- **Production-ready** — Docker + Railway deploy, health checks, rate limiting

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS, Wouter |
| Backend | Node.js, Express 5, JWT, bcrypt |
| Database | MongoDB (Mongoose) |
| Deploy | Docker, Railway |

## Project Structure

```
taskify_project/
├── FRONTEND/          # React + Vite app
├── BACKEND/           # Express API + MongoDB
├── Dockerfile         # Multi-stage production build
├── railway.toml       # Railway deployment config
└── package.json       # Root scripts
```

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/subhadeeplet/project_taskify.git
cd project_taskify
```

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Configure environment

```bash
cp BACKEND/.env.example BACKEND/.env
```

Edit `BACKEND/.env` with your `MONGO_URI` and `JWT_SECRET`.

### 4. Run locally

**Terminal 1 — Backend**
```bash
npm run dev:backend
```

**Terminal 2 — Frontend**
```bash
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173). The frontend proxies API requests to the backend on port 3000.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing tokens (32+ chars in production) |
| `JWT_EXPIRES_IN` | Token lifetime (default: `7d`) |
| `PORT` | Server port (default: `3000`) |
| `FRONTEND_URL` | Allowed CORS origin(s), comma-separated |
| `NODE_ENV` | `development` or `production` |
| `SERVE_FRONTEND` | Serve built React app from backend (`true` in production) |

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Log in |

### Tasks (JWT required)
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/tasks/profile` | Current user profile |
| `POST` | `/api/tasks/create-task` | Create a task |
| `GET` | `/api/tasks/pending-tasks` | Open marketplace tasks |
| `GET` | `/api/tasks/my-created-tasks` | Tasks you created |
| `GET` | `/api/tasks/my-assigned-tasks` | Tasks assigned to you |
| `PUT` | `/api/tasks/:taskId/accept` | Accept a pending task |
| `PUT` | `/api/tasks/complete-task/:id` | Mark task as completed |

### Health
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/health` | Server health check |

## Deploy on Railway

1. Go to [railway.com/new](https://railway.com/new) → **Deploy from GitHub repo**
2. Select **subhadeeplet/project_taskify**
3. Add environment variables:
   - `NODE_ENV` = `production`
   - `SERVE_FRONTEND` = `true`
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = long random string
4. **Settings → Networking → Generate Domain**
5. Set `FRONTEND_URL` to your Railway URL and redeploy
6. In MongoDB Atlas, allow `0.0.0.0/0` in Network Access

Verify: `curl https://<your-domain>/api/health`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install frontend + backend deps |
| `npm run dev:frontend` | Start Vite dev server |
| `npm run dev:backend` | Start API with nodemon |
| `npm run build` | Build frontend for production |
| `npm run start:prod` | Build + start production server |
| `npm run typecheck` | Run TypeScript checks |
| `npm run docker:build` | Build Docker image |

## License

ISC
