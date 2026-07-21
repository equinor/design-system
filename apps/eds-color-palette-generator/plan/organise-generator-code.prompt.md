# Prompt: Tidy up the code organisation of the Color Palette Generator app

> Paste this into a fresh Claude Code session (or hand it to an agent) run from the
> repo root. It is scoped entirely to `apps/eds-color-palette-generator`.
> Read `AGENTS.md` and `.claude/CLAUDE.md` first — repo conventions apply.

---

## Role

You are improving the **internal code organisation** of the Next.js app at
`apps/eds-color-palette-generator` — a safe, behaviour-preserving tidy-up. The app works
today; your job is to make its structure easier to navigate and maintain **without
changing what any tool does or looks like**. This is not a redesign and not a rewrite.

## Scope

**In scope (safe / mechanical):**

- Consolidate split type definitions into a single source of truth.
- Fix cross-folder name collisions and clarify the `config/` vs `utils/` boundary.
- Break up over-large route/component files by extracting components and helpers, keeping
  the route files thin.
- Add barrel (`index.ts`) files where they genuinely reduce deep-import churn.

**Out of scope (do NOT do — flag only):**

- **Do not** merge the two parallel palette/contrast systems (`config/config.ts` /
  `PALETTE_STEPS` vs `utils/palette.ts` / `PALETTES`). This is a deeper structural change;
  only **document** it in your report as a recommended follow-up.
- **Do not** touch the archived `/old` generator: `src/app/old/**` and
  `src/components/old/**` stay exactly as they are.
- No behaviour, styling, copy, or dependency changes.

## Current state (verify before you touch anything — do not trust this map blindly)

Next.js 16 App Router. `@/*` → `./src/*`. Confirm every item below against the real code
before acting; the line counts and paths are a starting point, not gospel.

| Smell | Where | What to do |
| ----- | ----- | ---------- |
| Split types, no single source of truth | `src/types.ts` **and** `src/config/types.ts` | Pick one home per type; consolidate; re-point imports |
| Name collisions across folders | two `palette.ts` (`config/`+`utils/`), two `dataviz.ts` (`config/`+`utils/`) | Rename for clarity so the folder no longer disambiguates |
| `config/` holds pure functions | `config/helpers.ts`, lightness fns in `config/config.ts` | Keep `config/` for data; move pure logic to `utils/` |
| Over-large page files inline logic + JSX | `app/example/page.tsx` (~1012), `app/about/page.tsx` (~866), `app/contrast/page.tsx` (~795), `app/palette/page.tsx` (~485) | Extract feature components/helpers; leave the route as a thin shell |
| No barrel files → deep imports | e.g. `@/components/themebuilder/contrast/StepSelect` | Add `index.ts` re-exports where they cut churn (avoid cycles) |

## Execution plan

### Phase 0 — Map & baseline

- Re-derive the map above from the actual code: list `src/`, and for each type / colliding
  filename / oversized file, find its real importers with a reference search.
- Establish a green baseline and record it, so you can prove nothing regressed:
  - `pnpm --filter @equinor/eds-color-palette-generator types`
  - `pnpm --filter @equinor/eds-color-palette-generator test:run`
  - `pnpm --filter @equinor/eds-color-palette-generator lint`
- **Propose your ordered cleanup (which files, what moves where, new names) and confirm it
  with the user before making structural moves.**

### Phase 1 — Consolidate types

- Decide a single home for each shared domain type (app-wide → `src/types.ts`;
  config-only → keep in `config/`). Merge duplicates, delete the emptied file if any,
  update all `import type` sites. Prefer `git mv` where a file is relocated wholesale.
- Verify: `types` + `test:run` still green.

### Phase 2 — Fix naming & the config/utils boundary

- Rename the colliding `palette.ts` / `dataviz.ts` pairs so each name is self-describing
  (e.g. `config/palette-config.ts` vs `utils/palette.ts`); update imports.
- Move pure helper functions out of `config/` into `utils/`; keep `config/` for static
  data only. Behaviour-preserving `git mv` + import fixes — do not rewrite the functions.
- Verify: `types` + `test:run` green.

### Phase 3 — Break up over-large files

- One file at a time, start with the largest. Extract self-contained pieces (sub-panels,
  render helpers, pure calculators) into the matching feature folder
  (`components/themebuilder/**`, `components/docs/**`, `utils/**`). The route file should
  end up a thin composition of imported components.
- **Extraction is a judgment call — move code verbatim, don't refactor its internals in
  the same step.** Confirm the split for each big file with the user if it isn't obvious.
- Verify after each file: `types` + `test:run` green; the page renders identically.

### Phase 4 — Barrel files (only where they help)

- Add `index.ts` re-exports for feature folders that are imported deeply from many places.
- Skip any barrel that would create a circular import or that saves nothing. This step is
  optional — do not add barrels for their own sake.

### Phase 5 — Verify end-to-end (all must pass)

```bash
pnpm --filter @equinor/eds-color-palette-generator types      # clean
pnpm --filter @equinor/eds-color-palette-generator lint       # 0 errors, 0 warnings
pnpm --filter @equinor/eds-color-palette-generator test:run   # green (unchanged count)
pnpm --filter @equinor/eds-color-palette-generator test:e2e   # green
pnpm --filter @equinor/eds-color-palette-generator build      # succeeds
```

Then drive the app (`pnpm --filter @equinor/eds-color-palette-generator dev`, or the
`/run` skill) and confirm every route renders identically with no new console errors:
`/` (theme builder), `/about`, `/contrast`, `/example`, `/palette`, and `/old` (untouched).

## Constraints (non-negotiable)

- Follow `AGENTS.md` / `.claude/CLAUDE.md`. Match existing style (2-space, no semicolons,
  single quotes, named exports, `import type`). The format hook runs eslint/prettier
  `--fix` on save; still eyeball the diff.
- **Behaviour-preserving only.** This is organisation, not a refactor. If a "tidy" would
  change what any tool renders or how it behaves, stop and flag it.
- **Do not merge the two palette systems** and **do not touch `/old`** — report the
  palette-system overlap as a follow-up instead.
- Prefer `git mv` for moves so history is preserved; update imports to the new paths.
- **Ask before any git action** — no commits, branches, pushes, or PRs without explicit
  approval. **Never** add AI attribution / "Co-authored-by".
- Work in small, verifiable steps; run `types` + `test:run` between phases.

## Report format

Summarise: (a) types consolidated (from → to), (b) files renamed/moved and imports
updated, (c) large files split (before/after line counts + what was extracted),
(d) barrels added and why, (e) verification results (each command's pass/fail),
(f) the palette-system overlap and any other deeper issues flagged for follow-up,
(g) anything deliberately left untouched.
