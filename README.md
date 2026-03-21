# English with Gaven (JavaScript App)

Full-stack English tutoring platform built with Next.js and Express.

## Overview

- Frontend: Next.js (App Router, React, Tailwind)
- Backend: Express + TypeScript
- Database: Prisma ORM (MySQL)
- Realtime/Video: Agora SDK integrations

In production, this project runs as a single Node.js app process: Express serves API routes and mounts Next.js for web routes.

## Monorepo Structure

- `frontend/` - Next.js app
- `backend/` - Express API + Prisma
- `docs/` - Product and integration notes

## Requirements

- Node.js 20+
- npm 10+
- MySQL-compatible database

## Local Development

Install dependencies from repo root:

```bash
npm install
```

Run backend and frontend separately in dev:

```bash
npm run dev:backend
npm run dev:frontend
```

Default local URLs:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001/api`

## Production Build and Run

From repo root:

```bash
npm run build
npm run start
```

## Environment Variables

Required:

- `NODE_ENV` (set to `production` in production)
- `PORT`
- `HOST` (recommended: `0.0.0.0`)
- `DATABASE_URL`
- `JWT_SECRET`

Optional:

- `JWT_EXPIRES_IN`
- `FRONTEND_URL`
- `NEXT_PUBLIC_BACKEND_URL`
- `MOUNT_NEXT_IN_BACKEND` (typically not needed in production)

## Deployment

For Hostinger GitHub deployment settings and health check details, see:

- `DEPLOYMENT_HOSTINGER.md`

## Health Check

- `GET /api/health`
