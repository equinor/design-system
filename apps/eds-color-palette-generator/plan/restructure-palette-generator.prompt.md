# Prompt: Restructure the Color Palette Generator / Theme Builder app

> Paste this into a fresh Claude Code session (or hand it to an agent) run from the
> repo root. It is scoped entirely to `apps/eds-color-palette-generator`.
> Read `AGENTS.md` and `.claude/CLAUDE.md` first — repo conventions apply.

---

## Role

You are restructuring the Next.js app at `apps/eds-color-palette-generator`. There are
two distinct tools living in one App-Router project, and they need to swap places,
after which the whole codebase should be analysed and cleaned up.

## Current state (verify before you touch anything — do not trust this map blindly)

Next.js 16 App Router. Routes under `src/app/`:

| Route           | File                              | What it is                                                                 |
| --------------- | --------------------------------- | -------------------------------------------------------------------------- |
| `/`             | `src/app/page.tsx` (`App`)        | **OLD** tool — Gaussian color-scale generator (the one to move to `/old`)  |
| `/themebuilder` | `src/app/themebuilder/page.tsx`   | **NEW** theme builder (the one to promote to root `/`)                     |
| `/palette`      | `src/app/palette/page.tsx`        | Supporting route                                                           |
| `/contrast`     | `src/app/contrast/page.tsx`       | Supporting route                                                           |
| `/example`      | `src/app/example/page.tsx`        | Supporting route                                                           |
| `/about`        | `src/app/about/page.tsx`          | Docs page                                                                  |

Component ownership:

- **Old generator** uses top-level `src/components/*`: `HeaderPanel`, `ColorScale`,
  `ColorScalesHeader`, `GaussianParametersPanel`, `DisplayOptionsPanel`,
  `LightnessValueInputs`, `QuickActionsPopover`, `AnchorColorInput`,
  `BellCurveVisualization`, `ChromaDistributionDemo`, `ContrastRequirementsTable`,
  `NameAndControls`, `ThemeToggle`, `Badge`, etc.
- **Theme builder** uses `src/components/themebuilder/**` (`ThemeBuilderHeader`,
  `PaletteInputPanel`, `TokenMatrix`, `ContrastTable`, `ComponentPreviewPanel`,
  `SimpleColorPicker`, and the `themebuilder/contrast/**` set).
- **Shared** (used by both / by supporting routes): `src/utils/**`, `src/config/**`,
  `src/context/ColorSchemeContext.tsx`, `src/styles/**`, `src/types.ts`, `src/cli/**`.
  Confirm actual usage with a reference search before assuming anything is shared.

Known cross-references that WILL break on the swap (find the full set yourself — this
is a starting list, not exhaustive):

- `src/components/HeaderPanel.tsx` — links to `/themebuilder`, `/contrast`, `/example`,
  `/palette`, `/about`. The `/themebuilder` link must point at `/` after the move, and
  a link to the old tool at `/old` needs to exist.
- `src/app/about/page.tsx` — `href="/"` (back-to-app link) currently points at the old
  tool; it should point at `/old`.
- `src/app/{contrast,example,palette}/page.tsx` — cross-links between supporting routes;
  re-verify each still resolves.
- `tests/e2e/*.spec.ts` — every spec does `page.goto('.../')` and exercises the **old**
  generator (anchor color, change color, step dropdown, general features). After the
  swap `/` is the theme builder, so these must be retargeted to `/old` (or rewritten if
  the flows no longer exist). `playwright.config.ts` and `PLAYWRIGHT_URL` env usage too.
- `scripts/**` and `src/cli/**` — check whether any import assumes the root page module.
- `layout.tsx` `metadata`, `README.md`, `ABOUT_PAGE.md`, `PALETTE_OVERVIEW.md` — update
  copy/titles that describe `/` as the old generator.

## Goal

1. **Move the OLD generator to `/old`.** The Gaussian color-scale generator currently at
   `/` (`src/app/page.tsx`) becomes the `/old` route (`src/app/old/page.tsx`). It must
   still work identically at its new URL.
2. **Promote the theme builder to root `/`.** `src/app/themebuilder/page.tsx` becomes
   `src/app/page.tsx` and serves at `/`. Remove the now-empty `/themebuilder` route
   (optionally leave a redirect `/themebuilder` → `/` — see Decision points).
3. **Analyse every code path and clean up + restructure** the app into a more logical
   layout, now that the theme builder is the primary tool.

## Constraints (non-negotiable)

- Follow `AGENTS.md` / `.claude/CLAUDE.md`. Match existing code style (2-space, no semis,
  single quotes, named exports, `import type`).
- **Ask before any git action** — no commits, branches, pushes, or PRs without explicit
  approval. **Never** add AI attribution / "Co-authored-by" to commits.
- After editing `.ts`/`.tsx` files, ensure lint/format is clean (`pnpm run lint <file>`
  or rely on the format hook). Don't leave a noisy diff.
- **Behaviour-preserving moves first, cleanup second.** Do not change what the tools do
  while relocating them. Do the swap, prove it works, *then* refactor.
- Prefer `git mv` for moves so history is preserved. Update imports to match the moved
  paths (the `@/` alias points at `src/`).
- Don't delete the old generator — it is being archived to `/old`, not removed.
- Work in small, verifiable steps. Run the app and the test suites between phases.

## Execution plan

### Phase 0 — Map & baseline
- Re-derive the current-state map above from the actual code. List every file in
  `src/`, and build a reference graph: which route pulls which components/utils/config.
- Establish a green baseline: `pnpm --filter @equinor/eds-color-palette-generator dev`
  boots, `pnpm --filter @equinor/eds-color-palette-generator test:run` passes,
  `pnpm --filter @equinor/eds-color-palette-generator types` is clean. Note anything
  already broken so you don't get blamed for it.

### Phase 1 — Move the OLD generator to `/old`
- `git mv src/app/page.tsx src/app/old/page.tsx`; fix relative/`@/` imports.
- Update every inbound reference (nav links, about page `href="/"`, docs) to `/old`.
- Retarget the e2e specs that exercise the old generator to `/old`.
- Verify: `/old` renders and behaves exactly as `/` did before; e2e specs pass against it.

### Phase 2 — Promote the theme builder to root `/`
- `git mv src/app/themebuilder/page.tsx src/app/page.tsx`; fix imports.
- Remove the empty `src/app/themebuilder/` dir (or convert to a redirect — Decision points).
- Point `HeaderPanel`'s former `/themebuilder` link at `/`, add an `/old` entry.
- Update `layout.tsx` metadata/title if it described the old tool.
- Verify: `/` now serves the theme builder; all nav links across all routes resolve
  (no 404s); `next build` succeeds.

### Phase 3 — Analyse all code paths & restructure
Only after Phases 1–2 are verified green.
- **Dead code:** find components/utils/config/exports no longer referenced by any route
  (e.g. old-generator-only helpers that nothing imports post-swap). Report before deleting;
  delete only what is provably unused.
- **Duplication:** the old generator and theme builder likely duplicate colour-scale,
  contrast, and palette-config logic. Identify overlaps in `src/utils/**` and
  `src/config/**`; consolidate shared logic into clearly-named shared modules, keep
  genuinely tool-specific logic separate.
- **Component layout:** now that the theme builder is primary, `src/components/**` is
  upside-down (primary tool nested under `themebuilder/`, archived tool at top level).
  Propose and apply a clearer structure — e.g. group each tool's route-specific
  components (`src/components/old/**`, and lift the theme-builder set up a level or into
  a `theme-builder/**` group), keep cross-tool components in a shared location. Keep the
  move mechanical (`git mv` + import fixes); don't rewrite component internals in the same
  step as moving them.
- **Naming & co-location:** align file/dir names with the new hierarchy; co-locate tests
  with the code they cover where the repo already does so.
- **Docs:** update `README.md`, `ABOUT_PAGE.md`, `PALETTE_OVERVIEW.md`, and the `plan/`
  notes to reflect the new routing and structure.

### Phase 4 — Verify end-to-end
- `pnpm --filter @equinor/eds-color-palette-generator types` — clean.
- `pnpm --filter @equinor/eds-color-palette-generator lint` — clean.
- `pnpm --filter @equinor/eds-color-palette-generator test:run` — green.
- `pnpm --filter @equinor/eds-color-palette-generator test:e2e` — green (retargeted).
- `pnpm --filter @equinor/eds-color-palette-generator build` — succeeds.
- Manually drive the app (or use the `/run` skill): `/` = theme builder, `/old` = old
  generator, and every nav link + cross-link resolves with no console errors or 404s.
- Produce a short written summary of what moved, what was merged/deleted, and why.

## Decision points — confirm with the user before deciding

1. **Keep `/themebuilder` as a redirect to `/`,** or remove it entirely (breaks existing
   bookmarks/links)? Default recommendation: add a permanent redirect in `next.config.ts`.
2. **Should the OLD generator stay linked in the header nav** (discoverable at `/old`), or
   exist unlinked as an archive? Default: keep a low-emphasis "Old generator" link.
3. **How aggressive is the restructure** — mechanical moves + dead-code removal only, or a
   deeper consolidation of duplicated colour/contrast logic? Default: do the moves and
   safe dead-code removal now; propose the deeper consolidation as a follow-up before
   executing it.

## Report format

When done, summarise: (a) files moved (old→new paths), (b) references updated,
(c) code deleted/merged with justification, (d) proposed structure diagram,
(e) verification results (each command's pass/fail), (f) any follow-ups deferred.
