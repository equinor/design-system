# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@equinor/eds-color-palette-generator` — a Next.js (App Router) tool that generates accessible color scales for the Equinor Design System. Each scale has 15 semantic steps (backgrounds, fills, borders, text). Colors are generated in **OKLCH space** with chroma shaped by a **Gaussian curve** across lightness, and validated against **APCA** and **WCAG 2.1** contrast targets.

This is a standalone app inside the `design-system` monorepo. The repo-wide component conventions in `../../AGENTS.md` are about EDS 2.0 components and largely **do not** apply here — this is an application, not a component package. It consumes the published workspace packages `@equinor/eds-tokens`, `@equinor/eds-tailwind`, and `@equinor/eds-utils`.

## Commands

Use `pnpm` (monorepo uses pnpm workspaces).

```bash
pnpm dev                       # Next dev server (Turbopack) on :3000
pnpm build                     # Next production build
pnpm lint                      # ESLint
pnpm types                     # tsc --noEmit type check

pnpm test                      # Vitest watch (unit tests)
pnpm test:run                  # Vitest single run
pnpm test:run src/utils/color.test.ts   # run one unit test file
pnpm test:e2e                  # Playwright e2e (start `pnpm dev` first — no webServer configured)
pnpm test:e2e:ui               # Playwright UI mode

pnpm build:cli                 # Build the CLI to dist/ via Vite (rolldown)

pnpm generate:palette-config-in-markdown   # regenerate PALETTE_OVERVIEW.md
pnpm generate:palette-contrast-report      # regenerate PALETTE_CONTRAST_REPORT.md
```

**Two test runners, separate scopes:** Vitest covers `src/**/*.{test,spec}.ts` in a Node environment (color math, utils, CLI). Playwright covers `tests/e2e/**` against the running dev server. `vitest.config.ts` excludes `tests/**`, so the two never overlap. Playwright has no `webServer` block — start the dev server manually before `pnpm test:e2e`.

## Architecture

### Generation pipeline (the core)

`src/utils/color.ts` is the heart. `generateColorScale(baseColor, lightnessValues, mean, stdDev, format)` is the single entry point used by both the web UI and the CLI:

- A color is either a **single value** (`{ name, value }`) or **multiple anchors** (`{ name, anchors: [{ value, step }] }`). `generateColorScale` branches on `Array.isArray(baseColor)`; the anchor path calls `generateColorScaleWithInterpolation`, which interpolates between anchors in OKLCH space (shorter-hue) per step.
- For every step, hue + base chroma are extracted, then `createColorWithGaussianChroma` sets the step's target lightness and multiplies chroma by `gaussian(lightness, mean, stdDev)`. So **lightness is fixed per step; chroma follows the bell curve**.
- All functions fail soft: on any error they fall back to a gray (`getFallbackColor`) rather than throwing, so the UI never crashes on bad input.

### Step definitions (`src/config/`)

The 15 semantic steps live in `config.ts` as individual exported `StepDefinition` constants (`BG_CANVAS`, `TEXT_STRONG`, …) collected into `PALETTE_STEPS`. Each carries a `lightValue`, `darkValue`, and a `contrastWith` list of contrast requirements (target step + APCA `lc` + WCAG level). This config is the source of truth for both lightness arrays (`getLightnessValues` in `helpers.ts`) and the contrast report. `palette.ts` holds the default color set (`paletteConfig`).

To change which steps exist, their lightness, or their contrast targets, edit `config.ts` — not the components.

### Web app (`src/app`, `src/components`)

- `src/app/page.tsx` is a `'use client'` component holding all state: Gaussian params (separate mean/stdDev for light vs dark), lightness value arrays, the colors array, and display toggles. Every piece of state is mirrored to `localStorage` via `src/utils/localStorage.ts` (keys prefixed `colorPalette_`).
- Scales are computed in `useMemo` keyed on a `valueKey` (color values only) so renaming a color doesn't recompute the (expensive) scales.
- Light/dark scheme comes from `ColorSchemeContext`; the page generates both light and dark scales and picks one. Mounting is gated on `useIsMounted()` to avoid hydration mismatches from localStorage.
- `~13` presentational components in `src/components` (`ColorScale`, `DisplayOptionsPanel`, `GaussianParametersPanel`, `QuickActionsPopover`, etc.). Import/export of full configs (`ConfigFile`) flows through `QuickActionsPopover` → `handleConfigUpload`.

### CLI (`src/cli/generate-colors.ts`)

Standalone Node script (shebang banner added at build time). Reads a palette config JSON, reuses `generateColorScale` + `PALETTE_STEPS`, and writes two W3C-design-token files (light + dark). Same single-value/anchor formats as the UI. Built separately via `vite.config.ts` (lib build, externals: node builtins + `colorjs.io`), output to `dist/`, exposed as the `generate-colors` bin. See `src/cli/README.md` for config format.

### Types

`src/types.ts` holds app-level types (`ColorDefinition`, `ColorAnchor`, `ConfigFile`, `ColorFormat`, `ContrastMethod`). `src/config/types.ts` holds the step/contrast config types. The `@/*` path alias maps to `src/*` (set in both `tsconfig.json` and `vitest.config.ts`).

## Conventions

- ESLint enforces `@typescript-eslint/no-explicit-any: error` and `ban-ts-comment: error` — no `any`, no unexplained ts-comments.
- New color math goes in `src/utils/color.ts` with a colocated `*.test.ts`; keep the fail-soft (return fallback, don't throw) pattern.
- Styling is Tailwind v4 (PostCSS) using EDS token classes (`bg-canvas`, `text-default`, `bg-surface`, `border-neutral-medium`, …) from `@equinor/eds-tailwind` — prefer these over raw color utilities.
- The generated reports (`PALETTE_OVERVIEW.md`, `PALETTE_CONTRAST_REPORT.md`) are build artifacts from `scripts/` — regenerate them, don't hand-edit.
