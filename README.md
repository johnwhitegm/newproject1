# newproject1

A minimal full-stack TypeScript starter: a **Vite + React** frontend backed by a small **Express** guestbook API. Everything is written in TypeScript and comes with linting, type-checking, unit tests, and a production build wired up.

## Stack

- **Frontend:** React 18 + Vite (TypeScript)
- **Backend:** Express (TypeScript, run with `tsx`)
- **Tooling:** ESLint (flat config), `tsc` type-checking, Vitest + Testing Library + Supertest

## Prerequisites

- Node.js >= 20
- npm

## Getting started

```bash
npm install        # install dependencies
npm run dev        # start API (:4280) and web (:5280) together
```

Then open http://localhost:5280 and sign the guestbook. The Vite dev server proxies `/api/*` requests to the Express API on port 4280.

Both ports can be overridden via the `WEB_PORT` and `API_PORT` environment variables.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run the API and web dev servers concurrently |
| `npm run dev:server` | Run only the Express API (`:4280`) |
| `npm run dev:web` | Run only the Vite dev server (`:5280`) |
| `npm run build` | Type-check and build the frontend for production |
| `npm run typecheck` | Type-check the whole project with `tsc` |
| `npm run lint` | Lint with ESLint |
| `npm test` | Run the Vitest test suite |

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check (`{ "status": "ok" }`) |
| `GET` | `/api/messages` | List guestbook messages |
| `POST` | `/api/messages` | Create a message (`{ "author", "text" }`) |

Messages are stored in memory, so they reset when the API restarts.

## Cloud Agent environment

`.cursor/environment.json` installs dependencies with `npm ci` and starts the `api` and `web` dev servers as terminals, exposing ports 4280 and 5280.
