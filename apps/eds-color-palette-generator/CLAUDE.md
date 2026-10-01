# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@equinor/eds-color-palette-generator` is a Next.js (App Router) internal tool for proposing and checking EDS colour palettes. Each palette has 15 steps generated in **OKLCH**, with chroma shaped by a **gaussian curve** over lightness, and contrast is checked with **APCA** (WCAG 2.1 ratios are shown for reference).

**Tokens Studio is the source of truth for EDS colour** (ADR 0011, ADR 0016 in `documentation/adr/`). The generator reads its defaults from the Tokens Studio pull in `packages/eds-tokens/src/tokens/` and must reproduce what Tokens Studio exports. Generated palettes are proposals, never a token source.

This is a standalone app inside the `design-system` monorepo. The repo-wide component conventions in `../../AGENTS.md` are about EDS 2.0 components and largely do not apply here; this is an application, not a component package.

## Commands

Use `pnpm`.

```bash
pnpm dev                       # Next dev server (Turbopack) on :3000; add --port 3001 if :3000 is taken
pnpm build                     # Next production build
pnpm lint                      # ESLint
pnpm types                     # tsc --noEmit

pnpm test:run                  # Vitest single run
pnpm test:run src/config/tokensStudio.test.ts   # one file
pnpm test:e2e                  # Playwright; start the dev server first (no webServer block)
PLAYWRIGHT_URL=http://localhost:3001/old pnpm test:e2e   # server on another port

pnpm build:cli                 # Build the CLI to dist/ (the CLI tests run dist/, so build first)

pnpm generate:palette-config-in-markdown   # regenerate PALETTE_OVERVIEW.md
pnpm generate:palette-contrast-report      # regenerate PALETTE_CONTRAST_REPORT.md
```

`next.config.ts` sets `agentRules: false` so `next dev` does not write agent files into this folder.

## Architecture

### Tokens Studio inputs (`src/config/tokensStudio.ts`)

Reads the raw Tokens Studio sets from `packages/eds-tokens/src/tokens/raw/` by relative path and exports:

- `TS_HUES`: the seven anchors from `input/palette`, accent and neutral first
- `TS_SCALE`, `TS_GAUSSIAN`: the hand-set lightness per step and scheme, and the gaussian parameters (`input/scale`)
- `TS_TONE_HUE`: tone → hue per scheme (`scheme/*`); neutral is gray in light and north-sea in dark
- `TS_SEMANTIC`, `rolesForStep()`: the semantic layer's alias table (`text.primary` → `neutral.13`, …)
- `TS_DATAVIZ`: the hand-picked data visualisation colours

Do not type colour values into the app. `tokensStudio.test.ts` compares the generator's output for every hue and scheme with the resolved values in `packages/eds-tokens/src/tokens/css/colors/default.css`.

### Steps (`src/config/config.ts`)

`PALETTE_STEPS` builds the 15 steps from Tokens Studio: `id` (`step-N`), lightness per scheme, `roles` (all Tokens Studio roles on that step), and a `label`/`primaryRole` naming the step after its main role (ADR 0016 D5). The primary roles are the only hand-written part; `config.test.ts` fails if Tokens Studio repoints one. Contrast requirements follow ADR 0016 Confirmation 5 (APCA against `background.surface`, on-emphasis against the emphasis fill; borders out of scope). `stepLabel()`, `stepCategoryRuns()` and `stepsWithRole()` are the helpers the UI uses.

`palette-config.ts` holds the default palettes (the Tokens Studio anchors).

### Generation (`src/utils/color.ts`)

`generateColorScale(baseColor, lightnessValues, mean, stdDev, format)` is the single entry point for the UI, the scripts and the CLI. A colour is a single value or a list of anchors at steps; anchors are interpolated in OKLCH. Every step takes its lightness from the scale and its chroma from `gaussian(lightness) × anchor chroma`, as in Tokens Studio's `set_chroma(set_lightness(anchor, L), …)`. Functions fail soft and return a grey rather than throwing.

### Semantic tokens (`src/utils/semanticTokens.ts`)

Resolves any Tokens Studio semantic token against generated ramps: token → tone and step → hue for the scheme → colour. `toneRamps(scheme, palettes, overrides)` uses a palette whose name matches the tone's hue and otherwise the Tokens Studio default. The component previews and contrast views use this, so they show the user's palettes through the design system's own mapping.

### Web app

- `src/app/page.tsx`: the Theme Builder (tabs: Colour system, Examples, Contrast). State lives in the URL (`src/utils/urlState.ts`: palettes, tab, mode). Palette colours are stored and shown in OKLCH; old links with bare hex values still work (`toCssColor`).
- The Config button opens `ExportDialog`: Tokens Studio anchors (changed or new anchors in the `input/palette` shape) or a palettes file, plus import. The file logic is in `src/utils/paletteConfigFile.ts`.
- Other routes: `/dataviz`, `/palette`, `/contrast`, `/example`, `/about`, and the archived generator at `/old`.
- Components: `components/themebuilder/`, `components/contrast/`, `components/example/`, `components/palette/`, `components/docs/`, `components/old/` (archived).
- Shared primitives in `components/shared/`, modelled on EDS 2.0: `AppHeader` (one header and navigation for every route), `Button` (primary, secondary, ghost; icon-only requires `aria-label`), `SegmentedControl` (tab or radio semantics with arrow-key navigation, plus `TabPanel`), `Card`, `Icon` (wraps `@equinor/eds-icons`), `Badge` and `ThemeToggle`. Use these before hand-building controls.
- Colour scheme: `ColorSchemeProvider` plus the pre-paint script in `src/context/colorSchemeScript.ts`. Only an explicit toggle is saved.

### CLI (`src/cli/generate-colors.ts`)

Reads a palette config and writes light and dark token files. It defaults to the frozen 2.x lightness values in `src/config/legacy2x.ts`, because `packages/eds-tokens` generates the 2.x palette with it (`generate:tokens:color-core`) and ADR 0016 freezes that scale. `lightModeValues`/`darkModeValues` in the config override them.

## Conventions

- ESLint enforces `@typescript-eslint/no-explicit-any: error` and `ban-ts-comment: error`.
- New colour maths goes in `src/utils/color.ts` with a colocated test; keep the fail-soft pattern.
- Styling: Tailwind v4 mapped onto the Tokens Studio semantic variables in `src/app/globals.css`. Class names follow token names (`bg-surface`, `text-secondary`, `border-muted`, `bg-accent-emphasis-hover`, …). Tailwind's own colour palette is removed. Add a mapping in `globals.css` rather than using a raw colour.
- User-facing text is British English. The product is "EDS Colour Palette Generator".
- The generated reports (`PALETTE_OVERVIEW.md`, `PALETTE_CONTRAST_REPORT.md`) come from `scripts/`; regenerate, don't hand-edit.
