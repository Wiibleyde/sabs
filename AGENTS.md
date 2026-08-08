# SABS Codebase Guide for AI Agents

## Project Overview

SABS (San Andreas Broadcast Service) is a **Next.js 16 marketing site + OBS overlay set** with a PIN-protected dashboard. The dashboard itself is still a "coming soon" placeholder — the live RTMP/SRT supervision cards are not implemented yet.

**Key Stack:**

- Next.js 16.2.12 (App Router, Turbopack)
- React 19.2 + TypeScript (strict mode)
- JWT session auth (`jsonwebtoken`)
- Tailwind CSS v4 (via `@tailwindcss/postcss`) + GSAP animations
- Three.js / `@react-three/fiber` + `ogl` for WebGL effects
- Biome 2.5.6 for linting/formatting
- **Bun** as package manager (`bun.lock` is the committed lockfile — there is no `package-lock.json`)

## Architecture Patterns

### Authentication Flow (Critical)

The auth system is **stateless JWT-based**:

1. **Client submits PIN** → `POST /api/v1/auth/pin`
2. **Server validates** against `DASHBOARD_PIN` env var (falls back to `"2025"`)
3. **JWT token created** (`src/lib/session.ts`: `createSessionToken()`)
4. **Token stored** in `httpOnly` cookie `dashboard-session` (`setSessionCookie()`)
5. **Session verified** on client via `GET /api/v1/auth/pin` (see `useAuthSimple.ts`)

**Key files:** `src/lib/session.ts` (token + cookie helpers) → `src/hooks/useAuthSimple.ts` (auth state machine) → `src/contexts/AuthProvider.tsx` (context + `useAuth()`) → `src/app/api/v1/auth/pin/route.ts` (backend)

**Pattern:** Protected pages wrap content with `<ProtectedRoute>`, which internally uses `useAuth()`. Never check the JWT directly in client code — the context handles it. `<ProtectedRoute>` must be inside an `<AuthProvider>` or `useAuth()` throws.

### Data Fetching

There is **no SWR, React Query, or MediaMTX client in this codebase** (older versions of this guide claimed otherwise). Everything is either static, server-rendered, or a plain `fetch` in a hook (`useAuthSimple`). If you add polling, add the dependency explicitly and prefer a data-fetching library over raw `setInterval`.

### OBS Overlay Scenes

`src/app/obs/{starting-soon,brb,ended,loading}/page.tsx` are browser-source overlays, all built from `src/components/obs/createObsPage.tsx`. Copy and styling are driven **entirely by URL query params** so streamers can edit text without a redeploy.

`src/components/obs/params.ts` is the single source of truth: `resolveObsConfig(variant, searchParams)` merges params over per-variant defaults into a typed `ObsSceneConfig`. Add new options there, not in the page components.

### Component Organization

- **`src/components/auth/`** → `AuthGuard`, `ProtectedRoute`
- **`src/components/dasboard/`** → Dashboard modules (note: typo "dasboard" is intentional, keep it)
- **`src/components/obs/`** → OBS scenes, countdown, param parsing
- **`src/components/reactbits/`** → Visual effects (Aurora, GlitchText, LetterGlitch, ScrollReveal)
- **`src/components/three/`** → WebGL (`ParticleField`)
- **`src/contexts/`** → `AuthProvider` (also exports `useAuth`)
- **`src/hooks/`** → `useAuthSimple`, `useGsapContext`, `useLogout`
- **`src/data/`** → Static content (`projects.ts`)
- **`src/lib/`** → `session.ts` (JWT), `fonts.ts`, `projectMedia.ts`

**Naming:** Components use PascalCase, files use camelCase. Typo "dasboard" is in original codebase.

## Development Workflows

### Setup & Build

```bash
bun install
bun run dev          # Start with Turbopack (port 3000)
bun run build        # Optimized build (standalone output)
bun run start        # Production server
```

### Code Quality (Use Biome, Not ESLint)

```bash
bun run check        # Lint + format, writes fixes (biome check --write)
bun run lint:fix     # Fix linting issues
bun run format       # Format code
```

**Important:** Biome is the only linter—no ESLint. Configuration is in `biome.json` (tabs, double quotes, Tailwind directives enabled, `public/` and `.claude/` ignored). There is no `type-check` script; use `bunx tsc --noEmit` if you need one.

### Environment Variables

Copy `.env.example` → `.env.local`:

```
DASHBOARD_PIN=2025                    # PIN for dashboard access
JWT_SECRET=change-me                  # JWT signing key
SABS_DISCORD_WEBHOOK_URL=https://...  # Contact-form webhook target
```

`DASHBOARD_PIN` and `JWT_SECRET` have insecure in-code fallbacks for local dev — always set them in production. All env vars are read at **runtime** (no `NEXT_PUBLIC_*` in the codebase), so the Docker image needs no build args.

## Docker & CI

### Image layout

`Dockerfile` is a 3-stage build:

1. **`deps`** — `oven/bun:1.3-alpine`, `bun install --frozen-lockfile`
2. **`builder`** — same base, `bun run build`
3. **`runner`** — `node:22-alpine`, copies `.next/standalone` + `.next/static` + `public`, runs `node server.js` as the non-root `node` user

Both stages are musl-based on purpose: `sharp` (a `next` optional dependency, used by `next/image` optimization) resolves to `@img/sharp-linuxmusl-x64` at install time and gets traced into the standalone bundle. **Do not mix a glibc builder with an alpine runner** — image optimization breaks at runtime.

`next.config.ts` sets `output: "standalone"`; the Dockerfile depends on it. Removing it breaks the image.

```bash
docker build -t sabs:local .
docker run -p 3000:3000 -e JWT_SECRET=dev-secret sabs:local
```

Runtime env defaults in the image: `NODE_ENV=production`, `PORT=3000`, `HOSTNAME=0.0.0.0`, `NEXT_TELEMETRY_DISABLED=1`.

### GHCR publishing

`.github/workflows/docker-publish.yml` builds and pushes to `ghcr.io/wiibleyde/sabs` on push to `main` and on `workflow_dispatch`. Auth uses the built-in `GITHUB_TOKEN` with `packages: write` — no secrets to configure. Layer cache via `type=gha`.

Tags produced (`docker/metadata-action`):

- `latest`
- `{{date 'YYYYMMDD-HHmmss'}}` — immutable timestamped build

No git-tag trigger and no semver tags: the workflow is intentionally branch-driven only. Build is `linux/amd64` only; adding arm64 requires `platforms:` on the build step and roughly doubles CI time via QEMU.

## Type Safety & Imports

**Path Aliases** (tsconfig.json):

- `@/*` → `./src/*`
- `@public/*` → `./public/*`

**Conventions:**

- Always use TypeScript interfaces; no `any` types
- React components are `"use client"` when using hooks or state
- OBS/config shapes live next to their parser (`src/components/obs/params.ts`)

## API Conventions

All APIs follow the `/api/v1/` namespace. Current routes:

- **Auth:** `POST /api/v1/auth/pin` (login), `GET /api/v1/auth/pin` (verify), `POST /api/v1/auth/logout` (logout)
- **Contact:** `POST /api/v1/sabs/contact` (relays to the Discord webhook)

Responses use `NextResponse.json()` with appropriate status codes. Always validate input and return `{ error: "message" }` on failures.

## Common Patterns

### Adding a Dashboard Card

`src/components/dasboard/DashboardGrid.tsx` currently renders an "En construction" panel plus a `COMING_SOON_CARDS` array of placeholder tiles. To add a real card:

1. Create component in `src/components/dasboard/MyCard.tsx` with `"use client"`
2. Fetch data with a real data-fetching hook if needed (add the dependency)
3. Import and render it from `DashboardGrid.tsx`, replacing the matching placeholder entry
4. Grid auto-layouts with Tailwind (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`)

### Adding an API Endpoint

1. Create file: `src/app/api/v1/[feature]/[action]/route.ts`
2. Export `async function POST/GET(request: NextRequest)`
3. Use `NextResponse.json()` to return data
4. Add token validation if protected: read the `SESSION_COOKIE` and call `verifySessionToken(token)` from `src/lib/session.ts`

### Adding Authentication to a Route

Wrap the page in `<AuthProvider>` + `<ProtectedRoute>`. Example: `src/app/dashboard/page.tsx`.

### Adding an OBS Overlay Option

1. Add the field to `ObsSceneConfig` and parse it in `resolveObsConfig()` (`src/components/obs/params.ts`)
2. Document it in that file's header comment
3. Consume it in `ObsScene.tsx` / the relevant sub-component

## Performance Notes

- **Turbopack** is default for `bun run dev`
- **GSAP animations** used for hero/transitions; scoped via `useGsapContext`
- **WebGL effects** (Aurora, ParticleField) are the heaviest client bundles — keep them out of shared layouts
- **Tailwind v4** compiles only used classes (CSS modules disabled in Biome config)
- `public/` is ~32 MB of imagery and ships into the Docker image as-is

## Security Reminders

- Never commit `.env.local`; `.gitignore` covers `.env*` and `.dockerignore` excludes them from the image (`.env.example` is the one exception)
- JWT tokens expire after 24 h; cookies are `httpOnly`, `sameSite: strict`, `secure` in production
- PIN comparison is a plain string compare (use a timing-safe comparison if this ever guards something sensitive)
- Docker image runs as non-root `node`

## References

- **README.md:** Setup, Docker/GHCR usage, OBS overlay params
- **Next.js Docs:** Official Next.js App Router + self-hosting/Docker patterns
- **Biome:** Linting via `biome.json` (no manual ESLint config needed)
