# nick-konstantinov-REACT2026Q2

Rolling Scopes School: React 2026Q2 — **Task 8: Next.js SSR/SSG**.

A server-rendered Pokemon search app built on the **Next.js App Router** (React 19): the
list, search, pagination and details are rendered on the server; selection state lives in
Redux on the client; CSV export runs through a Server Action.

## Contacts

- GitHub: [@nick-konstantinov](https://github.com/nick-konstantinov)
- Email: nick.konstantinov.job@gmail.com

## Tech stack

- **Next.js 15** (App Router) + **React 19**
- **next-intl** — i18n (`en` / `ru`), localized routing via `createNavigation`
- **Redux Toolkit** — client selection state (per-request store)
- **SCSS modules**
- **next/image** for all images
- **Vitest** + Testing Library for the client islands and server utilities

## Features

- Server-side data layer (`src/lib/pokemon.ts`) on native `fetch` with ISR revalidation
- SSR list + server pagination + server-rendered details (URL-driven, streamed via `Suspense`)
- Search through a **Server Action** + `redirect` (uncontrolled input)
- CSV export through a **Server Action** + `useActionState` (no client-side DOM)
- Internationalization with a client language switcher (preserves path + query)
- Cookie-based theme (no flash, no direct DOM manipulation)
- Localized 404 and error boundaries (`not-found`, `error`, `global-error`)

## Setup

```bash
npm install
cp .env.example .env   # then edit if needed
npm run dev            # http://localhost:3000
```

### Environment variables

See `.env.example`:

| Variable          | Description                                     | Default                     |
| ----------------- | ----------------------------------------------- | --------------------------- |
| `POKEMON_API_URL` | Base URL of the PokeAPI (server-side fetch)     | `https://pokeapi.co/api/v2` |
| `REVALIDATE`      | ISR revalidate TTL for PokeAPI fetches, seconds | `60`                        |

`.env` is git-ignored — edit it locally.

## Scripts

| Script               | Description                |
| -------------------- | -------------------------- |
| `npm run dev`        | Dev server (Turbopack)     |
| `npm run build`      | Production build           |
| `npm run start`      | Serve the production build |
| `npm run lint`       | ESLint                     |
| `npm run typecheck`  | `tsc --noEmit`             |
| `npm test`           | Vitest (run once)          |
| `npm run test:watch` | Vitest (watch)             |
| `npm run format:fix` | Prettier write             |

## Deployment (Render)

SSR and Server Actions need a Node runtime, so the app runs as a **Render Web Service**
(GitHub Pages serves static files only and cannot run the server parts). `next start`
honors the `PORT` env variable that Render provides, so no extra config is needed.

The repo ships a `render.yaml` Blueprint:

- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- **Env vars:** `POKEMON_API_URL`, `REVALIDATE`

Deploy by creating a Blueprint (New → Blueprint, pick the repo) or a Web Service pointing
at the same build/start commands and env vars.
