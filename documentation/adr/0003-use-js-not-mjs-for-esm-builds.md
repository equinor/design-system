# Use .js (not .mjs) for ESM builds in packages using styled-components

- **Status:** Accepted
- **Date:** 2026-02-11
- **Decision makers:** EDS Core Team

## Context

In version 2.3.3, we changed our ESM build output from `.js` to `.mjs` file extensions (#4463). The intent was to allow the built ESM output to be loaded directly in Node.js without a bundler, since Node.js doesn't recognize `.js` files as ES modules unless the package has `"type": "module"` in its `package.json`.

However, this change broke tests for consumers using Vitest and Jest, and also broke SSR with React Router (#4333). The root cause is that both `.mjs` and `"type": "module"` force Node's native ESM loader, which doesn't handle `styled-components`' default export correctly — `import styled from 'styled-components'` returns a namespace object where `styled.span` is `undefined`, causing `Cannot read properties of undefined (reading 'withConfig')`.

Bundlers (Vite, webpack, esbuild) have built-in CJS/ESM interop that handles this correctly, but Node's native ESM loader does not.

## Decision Drivers

- Must not break consumers' test environments (Vitest, Jest)
- Must not break SSR frameworks (React Router, Next.js)
- Should work with standard bundler toolchains without extra configuration
- Would be nice to run ESM output directly in Node.js, but not at the cost of breaking consumers

## Options Considered

### Option 1: Use .mjs file extensions

Output ESM files with `.mjs` extension, which Node.js always treats as ES modules.

**Pros:**

- Node.js recognizes files as ESM without additional configuration
- Explicit about module format

**Cons:**

- Breaks Vitest and Jest for consumers (styled-components default export is undefined)
- Breaks SSR contexts (React Router, Next.js) for the same reason
- Doesn't actually solve the problem — styled-components still fails in native ESM

### Option 2: Add "type": "module" to dist/esm/

Keep `.js` extensions but add a `package.json` with `{ "type": "module" }` in the `dist/esm/` directory.

**Pros:**

- Node.js recognizes `.js` files as ESM
- No file extension changes

**Cons:**

- Same breakage as `.mjs` — forces Node's native ESM loader, which breaks styled-components
- Slightly less explicit than `.mjs`

### Option 3: Use .js without "type": "module"

Keep `.js` extensions and don't set `"type": "module"`. Rely on bundlers to resolve ESM via the `"module"` and `"exports"` fields in `package.json`.

**Pros:**

- Bundlers (Vite, webpack) resolve ESM correctly via `package.json` fields
- No breakage in Vitest, Jest, or SSR contexts
- Matches the pre-2.3.3 behavior that worked for consumers

**Cons:**

- ESM build cannot be loaded directly in Node.js without a bundler
- Less "correct" from a pure Node.js module resolution perspective

## Decision

We will use **Option 3: `.js` without `"type": "module"`**.

The ESM build cannot be run directly in Node.js without a bundler, but that's a `styled-components` limitation — not something we can fix on our side. Since EDS is a React component library, consumers always use a bundler, making this a non-issue in practice.

This limitation goes away naturally as EDS 2.0 (`/next`) components migrate from `styled-components` to vanilla CSS (see [ADR-0002](0002-use-vanilla-css-with-design-tokens-for-eds-2.md)).

### Consequences

- Good, because consumer test environments (Vitest, Jest) work without extra configuration
- Good, because SSR frameworks (React Router, Next.js) work correctly
- Good, because it matches the behavior consumers relied on before 2.3.3
- Bad, because the ESM build cannot be loaded directly in Node.js without a bundler
- Bad, because this is a workaround for a `styled-components` limitation, not a principled choice

### Scope

This decision applies to packages that depend on `styled-components`:

- **eds-core-react** — uses `.js` (has styled-components)
- **eds-icons** — uses `.js` (imported by eds-core-react components that use styled-components)
- **eds-data-grid-react** — uses `.js` (depends on eds-core-react)
- **eds-lab-react** — uses `.js` (depends on eds-core-react)

Packages that don't use `styled-components` can safely use `.mjs`:

- **eds-tokens** — uses `.mjs`
- **eds-utils** — uses `.mjs`

### Confirmation

- Rollup configs for eds-core-react, eds-icons, eds-data-grid-react, and eds-lab-react must NOT use `entryFileNames: '[name].mjs'`
- `package.json` `"module"` and `"exports.import"` fields must point to `.js` files for the above packages
- No `{ "type": "module" }` in `dist/esm/` for the above packages

## Related

- [PR #4463 — Original .mjs change (reverted)](https://github.com/equinor/design-system/pull/4463)
- [Issue #4333 — SSR breakage with styled-components](https://github.com/equinor/design-system/issues/4333)
- [ADR-0002 — Use vanilla CSS for EDS 2.0](0002-use-vanilla-css-with-design-tokens-for-eds-2.md)
