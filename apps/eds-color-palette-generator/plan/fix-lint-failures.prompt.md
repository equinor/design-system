# Prompt: Fix the lint failures in the Color Palette Generator app

> Paste this into a fresh Claude Code session (or hand it to an agent) run from the
> repo root. It is scoped entirely to `apps/eds-color-palette-generator`.
> Read `AGENTS.md` and `.claude/CLAUDE.md` first — repo conventions apply.

---

## Role

You are fixing ESLint failures in the Next.js app at `apps/eds-color-palette-generator`.
`pnpm --filter @equinor/eds-color-palette-generator lint` currently reports **6 errors +
1 warning**. Type-check (`types`) and unit tests (`test:run`) are already green, and the
theme-builder-to-root restructure is complete. Your job is to get lint clean **without
changing behaviour** and without regressing types or tests.

## Context (verify before you touch anything)

These failures are **pre-existing** — they were introduced with the theme builder in
commit `a71f92b1` and only surfaced now because that code was promoted to `/`. Two of the
erroring files (`src/app/palette/page.tsx`, `src/components/themebuilder/ComponentPreviewPanel.tsx`)
are unchanged vs `HEAD`, confirming this is not fallout from the restructure.

The rules come from `eslint-config-next/core-web-vitals` (React Compiler / `react-hooks`
recommended-latest under Next 16 + React 19), configured in `eslint.config.mjs`. They are
upstream, not custom — **fix the code, do not disable rules** unless a case is genuinely a
false positive (see the localStorage note below), and then only with a one-line
justification comment.

## The failures (re-run lint to confirm line numbers before editing)

| # | File:line | Rule | Root cause |
| - | --------- | ---- | ---------- |
| 1 | `src/components/themebuilder/ContrastTable.tsx:42` | `react-hooks/rules-of-hooks` | `useMemo` is called **after** the `if (!palette) return null` early-return on line 40 |
| 2 | `src/components/themebuilder/ComponentPreviewPanel.tsx:37` | `react-hooks/rules-of-hooks` | `useState` is called **after** the `if (palettes.length === 0) return null` early-return on line 20 |
| 3 | `src/components/themebuilder/contrast/DataColorChart.tsx:167` | `react-hooks/immutability` | `cumulative += pct` mutates a render-scope variable during `.map()` in JSX |
| 4 | `src/app/page.tsx:72` | react-hooks (setState-in-effect) | effect resets `contrastPaletteIndex` to 0 when the palette list shrinks |
| 5 | `src/app/example/page.tsx:560` | react-hooks (setState-in-effect) | mount effect calls `setCustomPalettes(getSimulationPalettes())` |
| 6 | `src/app/palette/page.tsx:78` | react-hooks (setState-in-effect) | run-once auto-import effect calls `setHasAutoImported(true)` + `setPalettes(...)` |
| 7 | `src/app/palette/page.tsx:3` | `@typescript-eslint/no-unused-vars` (warning) | `useMemo` imported but never used |

## Recommended fixes (confirm each against the actual code; adapt if it drifted)

### 1 & 2 — hooks after an early return (`rules-of-hooks`)

Hooks must run unconditionally, in the same order, on every render. Move every hook call
**above** the early `return null`.

- **`ContrastTable.tsx`** — move the `grid` `useMemo` above the `if (!palette) return null`
  guard and make it null-safe, e.g. `useMemo(() => { if (!palette) return []; return FG_INDICES.map(...) }, [palette])`,
  then keep `if (!palette) return null` after the hook.
- **`ComponentPreviewPanel.tsx`** — the `accentIdx` `useState` initializer depends on
  `neutralIdx` / `accentCandidates`, which are derived after the guard. Preserve the current
  default (first non-gray palette) by using a **lazy initializer** — `useState(() => …)` — that
  computes the default safely even when `palettes` is empty, then move `if (palettes.length === 0) return null`
  to run after the hook. Extract the neutral-finding logic into a module-scope helper (per
  repo convention: helpers at module scope) so the initializer and the render body don't
  duplicate it.

### 3 — mutation during render (`immutability`)

`DataColorChart.tsx`'s `DonutChart` accumulates `cumulative` while mapping. Precompute the
segments **before** the JSX with a single pass (e.g. build an array of `{ pct, offset }` via
`reduce`/`map` at the top of the component), then render from that array — no reassignment
inside the JSX `.map()`.

### 4 — clamp during render instead of in an effect

`src/app/page.tsx` uses an effect to reset `contrastPaletteIndex` when `palettes` shrinks.
This is the classic "adjusting state during render" case — derive a clamped value during
render and drop the effect:

```ts
const safeContrastIndex =
  contrastPaletteIndex >= palettes.length ? 0 : contrastPaletteIndex
```

Use `safeContrastIndex` at every read site. Only keep `setContrastPaletteIndex` for genuine
user-driven changes. Remove the now-dead effect.

### 5 & 6 — setState in a mount effect (client-only hydration)

Both call setState from an effect to hydrate client-only data. **Inspect the data source
first**, because the right fix differs:

- If the source is pure/deterministic and safe during SSR (no `window`/`localStorage`),
  convert to a **lazy `useState` initializer** and delete the effect —
  `useState(() => getSimulationPalettes())`.
- If it reads `localStorage`/`window` (e.g. `palette/page.tsx`'s auto-import via
  `localStorageUtils`, and check whether `getSimulationPalettes` does too), a lazy initializer
  would run during SSR and break hydration. Prefer **`useSyncExternalStore`** (server snapshot
  returns the default, client snapshot returns the stored value) — the idiomatic SSR-safe
  pattern. If that is disproportionate for a one-shot import, keep the effect but add a
  narrowly-scoped `// eslint-disable-next-line …` with a one-line comment explaining it is
  intentional client-only hydration. Do not blanket-disable the rule for the file.

Whichever you pick, the on-screen result must be identical to today.

### 7 — unused import (warning)

Remove `useMemo` from the import on `src/app/palette/page.tsx:3` (only if fix #6 doesn't
reintroduce a use for it).

## Constraints (non-negotiable)

- Follow `AGENTS.md` / `.claude/CLAUDE.md`. Match existing style (2-space, no semicolons,
  single quotes, named exports where applicable, `import type`). The format hook runs
  eslint/prettier `--fix` on save; still eyeball the diff.
- **Behaviour-preserving only.** These are lint fixes, not a refactor. Do not change what any
  tool renders or how it behaves. If a "fix" would alter visible behaviour, stop and flag it.
- **Ask before any git action** — no commits, branches, pushes, or PRs without explicit
  approval. **Never** add AI attribution / "Co-authored-by".
- Keep changes minimal and local to the seven sites above. Don't opportunistically rewrite
  surrounding code.

## Verification (all must pass)

```bash
pnpm --filter @equinor/eds-color-palette-generator lint       # 0 errors, 0 warnings
pnpm --filter @equinor/eds-color-palette-generator types      # clean
pnpm --filter @equinor/eds-color-palette-generator test:run   # green (was 126/126)
```

Then drive the app (`pnpm --filter @equinor/eds-color-palette-generator dev`, or the `/run`
skill) and confirm no behaviour changed and no new console errors / hydration warnings on:

- `/` (theme builder) — tab switching, palette add/remove (exercises fix #4), contrast table
  (#1), component preview role selector (#2), the data-colour donut (#3)
- `/example` (#5) and `/palette` (#6) — data loads on first paint exactly as before

## Report format

Summarise: (a) each error → the fix applied and why, (b) any case where you chose
`useSyncExternalStore` or a justified disable over a lazy initializer and the reasoning,
(c) verification results (each command's pass/fail), (d) anything you deliberately left
untouched.
