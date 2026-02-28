# Payment Engine

Node.js service skeleton using **Inversify**, **inversify-express-utils**, and Express.

## Setup

```bash
npm install
```

## Scripts

- `npm run dev` — run with ts-node-dev (watch mode)
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled app

## Structure

- `src/container.ts` — Inversify container; bind services here
- `src/controllers/` — Express controllers (use `@controller`, `@httpGet`, etc.)
- `src/server.ts` — App entry; builds InversifyExpressServer and starts HTTP server

## Examples

- **GET** `/health` — returns `{ status: "ok", timestamp: "..." }`
- **GET** `/payments/:id/status` — example with injected `PaymentService` (e.g. `/payments/txn-123/status`)

## Adding controllers

1. Create a class with `@controller("/path")` and bind it in `container.ts` and `server.ts` (or a single bootstrap that imports all controllers).
2. Use `@httpGet`, `@httpPost`, etc. for routes and inject services via constructor `@inject()`.
