# SABS Codebase Guide for AI Agents

## Project Overview

SABS (San Andreas Broadcast Service) is a **Next.js 15 real-time streaming dashboard** with PIN-based authentication. It monitors RTMP connections and system status via the MediaMTX streaming API.

**Key Stack:**

- Next.js 15 (App Router, Turbopack)
- React 19 + TypeScript (strict mode)
- JWT-based session authentication
- SWR for real-time data polling
- Tailwind CSS + GSAP animations
- Biome 2.3.5 for linting/formatting

## Architecture Patterns

### Authentication Flow (Critical)

The auth system is **stateless JWT-based**:

1. **Client submits PIN** → `POST /api/v1/auth/pin`
2. **Server validates** against `DASHBOARD_PIN` env var
3. **JWT token created** (`/src/lib/auth.ts`: `createSessionToken()`)
4. **Token stored** in `httpOnly` cookie `dashboard-session`
5. **Session verified** on client via `GET /api/v1/auth/pin` (check `useAuthSimple.ts`)

**Key files:** `src/contexts/AuthProvider.tsx` (React context) → `src/hooks/useAuthSimple.ts` (polling login state) → `src/app/api/v1/auth/pin/route.ts` (backend)

**Pattern:** Protected pages wrap content with `<ProtectedRoute>` component, which internally uses `useAuth()` hook. Never directly check JWT in client code—the context handles it.

### Real-Time Data (SWR Pattern)

Dashboard fetches RTMP data with **2-second refresh interval**:

```tsx
// src/components/dasboard/RTMPStatus.tsx
const { data, error } = useSWR("/api/v1/sabs/rtmp/status", fetcher, {
  refreshInterval: 2000,
});
```

This calls `src/app/api/v1/sabs/rtmp/status/route.ts`, which internally uses `MediaMTX` class (`src/mediamtx.ts`) to query streaming connections.

**Convention:** Always use SWR for polling; avoid `setInterval` in components.

### Component Organization

- **`src/components/auth/`** → Login/ProtectedRoute guards
- **`src/components/dasboard/`** → Dashboard modules (note: typo "dasboard" is intentional, keep it)
- **`src/contexts/`** → React Context providers (AuthProvider, AuthContext)
- **`src/hooks/`** → Custom hooks (auth, scroll, logout)
- **`src/lib/`** → Utilities (JWT verification, auth helpers)

**Naming:** Components use PascalCase, files use camelCase. Typo "dasboard" is in original codebase.

## Development Workflows

### Setup & Build

```bash
npm install
npm run dev          # Start with Turbopack (port 3000)
npm run build        # Optimized build
npm run start        # Production server
```

### Code Quality (Use Biome, Not ESLint)

```bash
npm run check        # Lint + format check (runs biome check --write)
npm run lint:fix     # Fix linting issues
npm run format       # Format code
```

**Important:** Biome is the only linter—no ESLint. Configuration is in `biome.json` (tabs, double quotes, Tailwind directives enabled).

### Environment Variables

Required in `.env.local`:

```
DASHBOARD_PIN=2025                    # PIN for dashboard access
JWT_SECRET=sabs-dashboard-secret-key  # JWT signing key
MEDIAMTX_URL=https://...             # MediaMTX API endpoint
MEDIAMTX_USERNAME=admin              # MediaMTX credentials
MEDIAMTX_PASSWORD=secret
```

## Type Safety & Imports

**Path Aliases** (tsconfig.json):

- `@/*` → `./src/*`
- `@public/*` → `./public/*`

**Conventions:**

- Always use TypeScript interfaces; no `any` types
- API response types defined in route files (e.g., `RTMPConnectionItem` in `mediamtx.ts`)
- React components are "use client" when using hooks or state

## API Conventions

All APIs follow `/api/v1/` namespace:

- **Auth:** `POST /api/v1/auth/pin` (login), `GET /api/v1/auth/pin` (verify), `POST /api/v1/auth/logout` (logout)
- **RTMP Status:** `GET /api/v1/sabs/rtmp/status` (active connections)
- **Contact:** `POST /api/v1/sabs/contact` (contact form)

Responses use `NextResponse.json()` with appropriate status codes. Always validate input and return `{ error: "message" }` on failures.

## Common Patterns

### Adding a Protected Dashboard Card

1. Create component in `src/components/dasboard/MyCard.tsx` with "use client"
2. Use `useSWR` to fetch data if needed
3. Wrap in `<GlassSurface>` for styling
4. Import and add to `src/components/dasboard/DashboardGrid.tsx`
5. Grid auto-layouts with Tailwind (responsive design already handled)

### Adding an API Endpoint

1. Create file: `src/app/api/v1/[feature]/[action]/route.ts`
2. Export `async function POST/GET(request: NextRequest)`
3. Use `NextResponse.json()` to return data
4. Add token validation if protected: `verifySessionToken(token)` from `src/lib/auth.ts`

### Adding Authentication to a Route

Wrap page in `<AuthProvider>` + `<ProtectedRoute>`. Example: `src/app/dashboard/page.tsx`.

## Performance Notes

- **Turbopack** is default for `npm run dev` (much faster than Webpack)
- **GSAP animations** used for hero/transitions but lazy-imported to avoid bundle bloat
- **SWR caching** prevents unnecessary API calls; adjust `refreshInterval` if real-time updates not needed
- **Tailwind JIT** compiles only used classes (CSS modules disabled in Biome config)

## Security Reminders

- Never commit `.env.local`; use `.env.example` template
- JWT tokens are 24-hour expiry
- `httpOnly` cookies prevent XSS access to session tokens
- PIN is compared in constant-time (use timing-safe comparison if scaling)
- Sensitive data (e.g., `remoteAddr`) commented out in MediaMTX responses

## References

- **README:** Comprehensive setup & auth docs with examples
- **Next.js Docs:** Official Next.js 15 App Router patterns
- **Biome:** Linting via `biome.json` (no manual ESLint config needed)
