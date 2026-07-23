# Publish Tokens Studio output under temporary `next/*` subpaths during the eds-tokens beta

- **Status:** Accepted
- **Date:** 2026-07-20
- **Decision makers:** Frida Erdal, EDS Core Team

## Context

The whole `@equinor/eds-tokens` package is in beta while the Tokens Studio pipeline replaces the legacy Figma-REST + Style Dictionary build (every release is a pinned `3.0.0-beta.N` on the npm `beta` dist-tag; `latest` stays on 2.x). The new pipeline produces a different output shape — granular, attribute-scoped CSS files (`css/{colors,color-scheme,semantic,primitives,font,density}/*.css`) instead of one bundled `variables.min.css` — and an entirely different variable vocabulary (`--eds-background-container-*`, `--eds-density-spacing-*`, `--eds-family-ui`, …) replacing the legacy names (`--eds-color-*`, `--eds-typography-*`, `--eds-spacing-*`, …).

The new variables are tested together with `eds-core-react-next` (the `/next` beta line), whose component CSS will be rewritten to the new variable names. That migration happens **component by component** so the team can collaborate on it. During the migration window, an app running the betas has some components resolving legacy names and some resolving new names — both variable sets must be importable from a single installed version of the tokens package.

The question this ADR answers: which export specifiers should the new output occupy during the beta — the final ones (`./css/*` etc., replacing the legacy build immediately) or temporary ones alongside it?

## Decision Drivers

- Unmigrated `/next` components reference only legacy variable names — they render unstyled without the legacy bundle
- Component migration is gradual and collaborative; a mixed period is unavoidable
- The beta line should validate the exact 3.0.0 export surface before graduation
- Every variable name changes between 2.x and 3.0 regardless of paths, so keeping import specifiers identical offers no real drop-in compatibility
- Stable 2.x consumers must stay unaffected (they are: `latest` never moves during the beta)

## Options Considered

### Option 1: Ship the new output on the final specifiers immediately

Drop the legacy `build/` output from beta publishes and point `./css/*` (and a bundled `./css/variables` equivalent) at the Tokens Studio output from the first beta.

**Pros:**

- Beta testers exercise the exact 3.0.0 import surface from day one
- No later path migration for testers

**Cons:**

- Breaks every unmigrated `/next` component the moment a tester installs `@beta` — the legacy variables they reference no longer ship
- The path continuity is misleading: the import line survives the upgrade but every `var()` reference behind it breaks, since the variable names change wholesale
- The new pipeline produces no single-bundle equivalent for `./css/variables`; a concat step would have to be built up front

### Option 2: Temporary additive `next/*` subpaths (chosen)

Keep the legacy build on its current specifiers and add the new output under `./next/{css,dtcg,ts}/*`, injected into `files`/`exports` at publish time by `publish_tokens.yaml` (the `exports` map in git stays legacy-only).

**Pros:**

- Both variable sets resolve from one installed version — required during the component-by-component migration
- Legacy specifiers keep working for anything not yet migrated
- The injection is beta-only and additive, so nothing about the stable package definition changes in git

**Cons:**

- Testers adopt `next/*` paths that will not survive to 3.0.0 stable (mitigated: the later change is a mechanical find-and-replace of the path prefix, trivial next to the unavoidable variable-name migration)

### Option 3: Two installed versions via npm alias

Let test apps install the stable package and the beta side by side (`npm install eds-tokens-beta@npm:@equinor/eds-tokens@beta`).

**Pros:**

- No export-map changes at all

**Cons:**

- Every tester manages two installs and two package names in imports
- Version skew between the pair is easy to get wrong and hard to support

## Decision

**Option 2.** The Tokens Studio output ships additively under temporary `./next/{css,dtcg,ts}/*` subpaths for as long as the `/next` component migration is in progress.

**Exit plan:** when the last `/next` component has migrated to the new variable names, a beta release drops the legacy `build/` output and moves the Tokens Studio output onto the final specifiers. That flip happens **inside the beta line**, not at graduation, so at least one beta release exposes the exact 3.0.0 export surface for testing. Graduating to `3.0.0` stable then changes nothing about imports.

### Consequences

- Good, because the tokens beta and eds-core-react-next beta can be tested together at every point of the migration, in any mixed state
- Good, because the 3.0.0 API is still validated in beta before it ships stable — just at the end of the migration instead of the start
- Bad, because beta testers migrate import paths once (`/next/css/…` → `/css/…`) before graduation; announcements and docs for the beta must state up front that the `next/*` paths are temporary
- Bad, because the final specifier layout (granular `./css/*` only, or also a bundled convenience entry) remains an open decision that must be made before the flip

## Related

- [ADR-0008](./0008-generate-ts-tokens-from-studio-exports.md) — how the TS output under `next/ts/*` is generated
- [`documentation/agent-instructions/TOKENS_STUDIO.md`](../agent-instructions/TOKENS_STUDIO.md) — pipeline documentation
- `.github/workflows/publish_tokens.yaml` — the beta-only publish-time injection
- `packages/eds-tokens/src/tokens/README.md` — the generated output this applies to
- Issue [#5108](https://github.com/equinor/design-system/issues/5108); PR [#5180](https://github.com/equinor/design-system/pull/5180)
