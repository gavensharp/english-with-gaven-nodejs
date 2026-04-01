# Hostinger GitHub Deployment (Single Node Entry)

This repository is configured to deploy as a single Node.js app where the root entry point starts the backend, and backend mounts Next.js for web routes in production.

## Hostinger Build and Start Commands

Use these values in Hostinger's GitHub deployment settings:

- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm run start`

If your Hostinger panel does not provide a Start command field, set startup file to `index.js` in the app root. This project already uses `index.js` as the single Node.js entrypoint.

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

Lean smoke-test optional variable:

- `LEAN_HOSTING_TEST=true` to boot Express without DB checks and without DB-backed API route mounting.

## How It Works

1. Root install command installs one dependency tree for the app.
2. Root `npm run build` builds frontend then backend.
3. Root `npm run start` runs root `index.js` entrypoint.
4. Root entrypoint starts backend server process.
5. Backend serves `/api/*` routes and `/uploads/*` directly.
6. Backend forwards all non-API routes to Next.js request handler.

## Prisma Deployment Step

After first successful deploy with a new database, run:

- `npm run prisma:migrate:deploy`
- `npm run prisma:generate`

## Health Check

After deployment, verify:

- `GET /api/health` returns JSON.

When `LEAN_HOSTING_TEST=true`, also verify:

- `GET /api/smoke` returns JSON.

## Notes

- In development, run frontend and backend separately.
- In production, this is a single-process deployment path.
