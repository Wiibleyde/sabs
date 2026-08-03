# SABS Codebase Guide for AI Agents

## Project Overview

SABS (San Andreas Broadcast Service) is a **Next.js 16 marketing site** for a GTA-RP audiovisual/broadcast crew. It ships three things:

1. **Public landing page** (`/`) — hero, presentation, project portfolio, team, contact form.
2. **OBS overlay scenes** (`/obs/*`) — browser-source screens configured entirely from URL query params.
3. **PIN-gated dashboard** (`/dashboard`) — currently a placeholder ("En construction") behind JWT auth.

There is **no live stream monitoring**: no MediaMTX client, no RTMP status endpoint, no SWR polling. Do not assume any of those exist.

**Key Stack:**

- Next.js 16 (App Router, Turbopack) — `next` 16.2.12
- React 19 + TypeScript 6 (`strict: true`)
- Bun as runtime and package manager (`bun.lock` is the only lockfile)
- JWT session auth via `jsonwebtoken`
- Tailwind CSS v4 (CSS-first config in `src/app/globals.css`, no `tailwind.config`)
- GSAP + ScrollTrigger for animation
- `three` / `@react-three/fiber` (particles) and `ogl` (aurora shader)
- Biome 2.5.6 for linting/formatting

## Architecture Patterns

### Authentication Flow (Critical)

The auth system is **stateless JWT-based**:

1. **Client submits PIN** → `POST /api/v1/auth/pin`
2. **Server validates** against `DASHBOARD_PIN` env var (default `"2025"`)
3. **JWT token created** (`src/lib/session.ts`: `createSessionToken()`)
4. **Token stored** in `httpOnly` cookie `dashboard-session` (`setSessionCookie()`)
5. **Session verified** on client via `GET /api/v1/auth/pin`

**Key files:** `src/contexts/AuthProvider.tsx` (context + `useAuth()`) → `src/hooks/useAuthSimple.ts` (fetch-based auth state) → `src/app/api/v1/auth/pin/route.ts` (backend) → `src/lib/session.ts` (token/cookie helpers).

`src/lib/session.ts` exports: `SESSION_COOKIE`, `createSessionToken()`, `verifySessionToken()`, `setSessionCookie()`, `clearSessionCookie()`.

**Note:** `useAuthSimple` checks the session **once on mount** — it does not poll. `AuthProvider.tsx` holds both the context and the `useAuth()` hook; there is no separate `AuthContext` file.

**Pattern:** Protected pages wrap content with `<ProtectedRoute>`, which uses `useAuth()` and renders `<AuthGuard>` (the PIN form) when unauthenticated. Never directly check JWT in client code—the context handles it.

### Static Content (`src/data/`)

Page content lives in `src/data/`, not inline in components. Components import it and stay presentational.

| File | Exports |
|---|---|
| `projects.ts` | `Project`, `ProjectMedia`, `Competency`, `COMPETENCIES`, `projects` |
| `team.ts` | `TeamMember`, `TEAM` |
| `services.ts` | `Service`, `SERVICES` (footer list) |
| `features.ts` | `Feature`, `FeatureId`, `FEATURES` (presentation cards) |
| `eventTypes.ts` | `EVENT_TYPES` (contact form select) |
| `dashboardCards.ts` | `DashboardCard`, `COMING_SOON_CARDS` |

**Rules:**

- `src/data/` is **`.ts` only — no `.tsx`**. Data files carry no JSX. When an entry needs an icon, give it a string id and keep the SVG in a `Record<Id, ReactNode>` map inside the component (see `FeatureId` → `FEATURE_ICONS` in `Presentation.tsx`).
- Keep render-only constants (Tailwind class strings, gradients, accent maps) in the component, not in `src/data/`.

### OBS Overlay Scenes

`/obs/{starting-soon,brb,ended,loading}` are one-liners: `export default createObsPage("brb")`. All copy, accent color, background, logo/glitch toggles and the project marquee come from URL search params, resolved by `resolveObsConfig()` in `src/components/obs/params.ts` — the doc comment there is the source of truth for supported params.

### Component Organization

- **`src/components/*.tsx`** → landing sections (Hero, Presentation, Projects, Team, Contact, Footer, Multiview)
- **`src/components/auth/`** → `AuthGuard` (PIN form), `ProtectedRoute` (guard)
- **`src/components/dasboard/`** → `DashboardGrid`, `DashboardHeader`, `DashboardLayout` (note: typo "dasboard" is intentional, keep it)
- **`src/components/obs/`** → `createObsPage`, `ObsScene`, `Countdown`, `ProjectsMarquee`, `params.ts`
- **`src/components/reactbits/`** → vendored effects: `Aurora`, `GlitchText`, `LetterGlitch`, `ScrollReveal`
- **`src/components/three/`** → `ParticleField` (react-three-fiber)
- **`src/contexts/`** → `AuthProvider.tsx`
- **`src/data/`** → static content (see above)
- **`src/hooks/`** → `useAuthSimple`, `useGsapContext`, `useLogout`
- **`src/lib/`** → `session.ts` (JWT/cookies), `projectMedia.ts` (thumbnails, date formatting), `fonts.ts`

**Naming:** React component files are PascalCase (`Team.tsx`); everything else is camelCase (`useAuthSimple.ts`, `projectMedia.ts`, `dashboardCards.ts`). Typo "dasboard" is in original codebase.

## Development Workflows

### Setup & Build

```bash
bun install
bun run dev          # Start with Turbopack (port 3000)
bun run build        # Optimized build
bun run start        # Production server
```

`package-lock.json` was removed — do not reintroduce npm lockfiles.

### Code Quality (Use Biome, Not ESLint)

```bash
bun run check        # Lint + format, writes fixes (biome check --write .)
bun run lint         # Lint only
bun run lint:fix     # Fix linting issues
bun run format       # Format code
bunx tsc --noEmit    # Typecheck (no test suite in this repo)
```

**Important:** Biome is the only linter—no ESLint. Configuration is in `biome.json` (tabs, double quotes, `recommended` preset, organize-imports assist on, Tailwind directives enabled). `biome.json` ignores `public/` and `.claude/` only, so editor config dirs like `.zed/` are formatted too.

### Environment Variables

Set in `.env.local`:

```
DASHBOARD_PIN=2025                         # PIN for dashboard access (default "2025")
JWT_SECRET=sabs-dashboard-secret-key-2025  # JWT signing key (has an insecure default)
SABS_DISCORD_WEBHOOK_URL=https://...       # Contact form target; no default, 500s without it
```

`DASHBOARD_PIN` and `JWT_SECRET` fall back to hardcoded defaults, so the app boots without them. `SABS_DISCORD_WEBHOOK_URL` does not and is currently missing from `.env.example`.

## Type Safety & Imports

**Path Aliases** (tsconfig.json):

- `@/*` → `./src/*`
- `@public/*` → `./public/*`

**Conventions:**

- Always use TypeScript interfaces; no `any` types (codebase currently has zero)
- Request/response body types defined in route files (e.g., `ContactBody` in `sabs/contact/route.ts`)
- React components are "use client" when using hooks or state

## API Conventions

All APIs follow `/api/v1/` namespace:

- **Auth:** `POST /api/v1/auth/pin` (login), `GET /api/v1/auth/pin` (verify), `POST /api/v1/auth/logout` (logout)
- **Contact:** `POST /api/v1/sabs/contact` (validates all 7 fields, forwards a Discord embed to `SABS_DISCORD_WEBHOOK_URL`)

Responses use `NextResponse.json()` with appropriate status codes. Auth routes return `{ error: "message" }` on failure; the contact route returns `{ message: "..." }` — match the neighbouring route's shape rather than inventing a third.

## Common Patterns

### Adding a Dashboard Card

1. Add the card's content to `src/data/dashboardCards.ts` if it is static
2. For a live card, create `src/components/dasboard/MyCard.tsx` with "use client"
3. Import and add to `src/components/dasboard/DashboardGrid.tsx`
4. Grid auto-layouts with Tailwind (responsive design already handled)

There is no shared card wrapper component — cards style themselves with `bg-sabs-bg-2 border border-sabs-border` plus a `border-t-2` accent class.

### Adding an API Endpoint

1. Create file: `src/app/api/v1/[feature]/[action]/route.ts`
2. Export `async function POST/GET(request: NextRequest)`
3. Use `NextResponse.json()` to return data
4. Add token validation if protected: read `SESSION_COOKIE` from `request.cookies`, then `verifySessionToken(token)` — both from `@/lib/session`

### Adding Authentication to a Route

Wrap page in `<AuthProvider>` + `<ProtectedRoute>`. Example: `src/app/dashboard/page.tsx`.

### Adding a Landing Section

1. Create `src/components/MySection.tsx` with "use client"
2. Put copy/list content in a new `src/data/*.ts` module
3. Animate with `useGsapContext(ref, ...)` + `ScrollTrigger` — the hook handles cleanup
4. Mount it in `src/app/page.tsx`

## Performance Notes

- **Turbopack** is default for `bun run dev` (much faster than Webpack); `bun run build` uses the standard builder
- **Heavy visuals are `next/dynamic` with `ssr: false`** — `ParticleField` (Hero), `LetterGlitch` (Presentation) — keep new WebGL/canvas work behind the same pattern
- **Tailwind v4 JIT** compiles only used classes, so dynamic class strings must appear as full literals (see `RAINBOW_TEXT_CLASS` in `Projects.tsx`)
- **`useGsapContext`** scopes GSAP animations to a ref and reverts them on unmount; avoid raw `gsap.to` in effects

## Security Reminders

- Never commit `.env.local`; use `.env.example` template (`.gitignore` covers `.env*`)
- JWT tokens expire in 24h; the session cookie `maxAge` matches (86400s)
- Cookie is `httpOnly`, `sameSite: "strict"`, `path: "/"`, and `secure` only in production
- **PIN comparison is a plain `!==` in `auth/pin/route.ts` — not timing-safe.** Use `crypto.timingSafeEqual` if this becomes a real secret
- `JWT_SECRET` and `DASHBOARD_PIN` have committed fallback defaults — production must override both
- The contact route forwards user input straight into a Discord embed with no length cap or sanitisation

## References

- **`src/components/obs/params.ts`:** authoritative doc comment for OBS scene URL params
- **Next.js Docs:** Official Next.js 16 App Router patterns
- **Biome:** Linting via `biome.json` (no manual ESLint config needed)
- **README.md:** setup notes, but its RTMP/MediaMTX framing is stale — prefer this file
