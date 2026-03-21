# Hostinger GitHub Deployment (Single Node App)

This repository is configured to deploy as a single Node.js app where Express serves API routes and mounts Next.js for frontend pages in production.

## Hostinger Build and Start Commands

Use these values in Hostinger's GitHub deployment settings:

- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm run start`

## Required Environment Variables

Set these in Hostinger environment settings:

- `NODE_ENV=production`
- `PORT` (Hostinger may inject this automatically)
- `HOST=0.0.0.0`
- `DATABASE_URL=...`
- `JWT_SECRET=...`

Optional:

- `JWT_EXPIRES_IN=24h`
- `FRONTEND_URL=https://your-domain.com`
- `NEXT_PUBLIC_BACKEND_URL=https://your-domain.com`
- `MOUNT_NEXT_IN_BACKEND=true` (not required when `NODE_ENV=production`)

## How It Works

1. Root `npm run build` builds frontend then backend.
2. Root `npm run start` starts backend server.
3. Backend serves `/api/*` routes and `/uploads/*` directly.
4. Backend forwards all non-API routes to Next.js request handler.

## Health Check

After deployment, verify:

- `GET /api/health` returns JSON.

## Notes

- In development, run frontend and backend separately.
- In production, this is a single-process deployment path.
