# Dependency Update Report — 2026-05-19

## Updated

| Package | From | To | Notes |
|---|---|---|---|
| `axios` | ^1.13.2 | ^1.16.1 | Patch/minor, no breaking changes |
| `gsap` | ^3.14.2 | ^3.15.0 | Bug fixes + `easeReverse` feature, no breaking changes |
| `markdown-to-jsx` | ^9.6.0 | ^9.8.0 | Minor, no breaking changes |
| `next` | 16.1.4 | 16.2.6 | No breaking changes: ~400% faster dev startup, 500 error page redesign, Server Function Logging, 200+ bug fixes |
| `react` | 19.2.3 | 19.2.6 | Patch, no breaking changes |
| `react-dom` | 19.2.3 | 19.2.6 | Patch, no breaking changes |
| `swr` | ^2.3.8 | ^2.4.1 | Minor, no breaking changes |
| `@biomejs/biome` | 2.3.11 | 2.4.15 | HTML formatter overhauled (experimental only — not used in project) |
| `@types/react` | 19.2.8 | 19.2.15 | Types patch, also updated in `overrides` |
| `@types/three` | ^0.184.0 | ^0.184.1 | Patch |
| `tailwindcss` | ^4 (4.1.11) | ^4 (4.3.0) | New utilities (scrollbar, logical props, colors), no breaking changes |
| `@tailwindcss/postcss` | ^4 (4.1.11) | ^4 (4.3.0) | Follows tailwindcss |
| `@types/node` | ^25 (25.0.9) | ^25 (25.9.1) | Types minor bump |
| `@eslint/eslintrc` | ^3 (3.3.1) | ^3 (3.3.5) | Patch |

---

## Skipped

### `typescript` — 5.8.3 → 6.0.3 (kept at `^5`, resolved to 5.9.3)

TypeScript 6.0 is a **major version** with several breaking changes incompatible with the current config:

**Breaking changes:**
- **`types` defaults to `[]`** — TypeScript no longer auto-includes all `@types/*` packages. Projects relying on ambient globals (e.g., `process.env` from `@types/node`) must explicitly add `"types": ["node"]` to `tsconfig.json`. The current `tsconfig.json` has no `types` array.
- **`moduleResolution: "classic"` and `"node"` removed** — current config uses `"bundler"` (safe), but worth noting.
- **`module: "amd"/"umd"/"system"` now an error** — current config uses `"esnext"` (safe).
- **ES5 target deprecated** — current `target: "ES2017"` is fine.
- **All non-ESM output gets `"use strict"` unconditionally** — behavioral change.

**Why skipped:** The `types: []` default change is the most likely to cause silent type regressions in this Next.js project. Requires running `npx @andrewbranch/ts5to6` migration tool and verifying the full type check output before upgrading.

**How to upgrade when ready:**
```bash
npx @andrewbranch/ts5to6
npx tsc --noEmit   # review new errors before fixing
```
Then add to `tsconfig.json` if needed:
```json
"types": ["node"]
```

---

## Known Audit Issue (Not Fixed)

`postcss < 8.5.10` is flagged inside `next`'s internal dependencies. The npm-suggested fix (`npm audit fix --force`) would downgrade Next.js to 9.3.3 — completely wrong. This is a known false-positive in npm audit for Next.js 16.x. Track upstream: [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93).

---

## Lint Issues Surfaced by Biome 2.4.x

Two pre-existing issues now reported with stricter biome rules:

- `src/app/overlay/mcbanner/page.tsx:65` — `useExhaustiveDependencies`: missing `slides.length` in `useEffect` dep array
- `src/components/Projects.tsx:422` — `noArrayIndexKey`: array index used as part of React key

These are not build-blocking. Fix with `npm run check` or `npm run lint:fix`.
