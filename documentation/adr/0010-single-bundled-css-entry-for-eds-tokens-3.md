# Mirror the 2.x CSS export surface in eds-tokens 3.0.0: one bundled `./css/variables` entry

- **Status:** Proposed (accept after the bundle has been exercised on the
  beta line — see validation plan below)
- **Date:** 2026-07-20
- **Decision makers:** Frida Erdal, EDS Core Team

## Context

[ADR-0009](./0009-temporary-next-subpaths-for-eds-tokens-beta.md) left one
consequence open: what CSS export surface should eds-tokens 3.0.0 offer at
the flip — the beta release that drops the legacy `build/` output and moves
the Tokens Studio output onto the final specifiers?

The Tokens Studio pipeline generates granular, attribute-scoped CSS files
(`src/tokens/css/{colors,color-scheme,semantic,primitives,font,density}/*`,
nine files, ≈ 44 kB unminified), currently published under the temporary
`./next/css/*` wildcard. Legacy 2.x publishes exactly one CSS entry:
`./css/variables` → `variables.min.css`, a bundle of everything. 2.x has
no granular CSS exports at all — granular paths exist only for the data
formats (`./json/*`, `./js/*`, `./ts/*`). No consumer has ever assembled
EDS token CSS from parts.

Facts verified against the repo (2026-07-20):

- **Publishing granular files is an API commitment.** Export paths cannot
  be removed or renamed without a breaking change. Publishing the nine
  files freezes the internal file layout into public API while the token
  architecture is still being reworked in Figma. Keeping them internal
  preserves freedom to reorganize.
- **Payload is not a differentiator.** Full nine-file bundle: 4.6 kB
  minified + gzipped. The minimal subset (light-only, one density):
  3.7 kB. Subset loading saves under 1 kB.
- **Component consumers never see the specifiers.** `eds-core-react`'s
  rollup build inlines the token CSS (postcss-import) into its shipped
  `dist/**/index.css`. Only teams importing the tokens package directly
  are affected.
- **CSS variables fail silently.** A consumer who omits one required file
  from a granular set (e.g. `color-scheme/light.css`) gets no error —
  semantic tokens resolve to nothing and the UI renders unstyled. Several
  import lines are several chances to get this wrong without a signal.
- **The new output is attribute-mandatory, unlike 2.x.** The scheme
  aliases exist only under `[data-color-scheme="light"|"dark"]`; without
  the attribute nothing resolves — not even light mode. The 2.x bundle
  works with no attribute (light values at `:root`, dark via explicit
  attribute, plus a `prefers-color-scheme` media fallback appended by
  `build-dark-scope` — added in #4864 to preserve the system-dark
  behaviour that `light-dark()` had provided implicitly).

## Decision Drivers

- The one-import habit (`@import '@equinor/eds-tokens/css/variables'`) is
  the only import pattern EDS consumers have ever had
- Smallest possible public API surface: keep the generated file layout an
  internal pipeline detail while the token architecture is in motion
- No demand for granular CSS exists, and the measured payload gain of
  subsetting is negligible
- A semver major legitimizes changing the content behind a kept
  specifier; consumers upgrading across a major expect breaking changes
  and read the migration guide

## Options Considered

### Option A: Granular files only

**Pros:** no bundle step; consumers load only the modes they use.

**Cons:** every direct consumer needs six-plus `@import` lines and must
learn which files are required versus opt-in, with silent failure as the
error mode; breaks the only established import habit; freezes the internal
file layout into public API; measured payload gain under 1 kB.

### Option B: Granular files plus a bundled convenience entry

**Pros:** one-import DX preserved; payload-sensitive consumers keep
subsetting.

**Cons:** still publishes the granular layout as permanent API (the real
cost of A) for a benefit measured at under 1 kB; two documented ways to do
the same thing.

### Option C: One bundled entry, granular files stay internal (chosen)

Mirror 2.x: publish a single generated bundle as `./css/variables`; the
granular files remain committed pipeline artifacts that are not exported.

**Pros:** identical consumer surface to 2.x (the variable *names* change,
the *shape* of the package does not); internal file layout stays free to
change; no subset footgun; shortest possible setup docs.

**Cons:** consumers cannot skip unused modes (costs < 1 kB); a blind 2.x →
3.0 upgrade keeps resolving the import and fails visually instead of at
build time (mitigated: with every variable renamed, the unstyled result is
unmissable, and the major-version migration guide is the intended path).

## Decision

**Option C.** eds-tokens 3.0.0 publishes one bundled CSS entry on the
reused `./css/variables` specifier, mirroring the 2.x export surface. The
granular files stay internal.

- **Name reuse is deliberate.** ADR-0009's "path continuity is
  misleading" argument applied to flipping specifiers mid-migration, where
  unmigrated components would break silently on install. At a major
  version boundary the same continuity is a feature: one import line, one
  habit, content change signalled by the major bump and the migration
  guide.
- **Where the bundle is built:** a bundle step in
  `tokens_studio_release.yaml`, committed as generated output alongside
  the nine source files (inspectable in the release workflow's automated
  PRs like everything else in `src/tokens/`). Concatenation is
  conflict-free by construction — every mode file is attribute-scoped.
  The step is a plain concatenation, deliberately not minified: the
  committed bundle stays a pure function of the source files (no
  minifier-version churn in release-PR diffs, no extra toolchain
  dependency in the pipeline) and diffs stay reviewable. Gzip closes
  the size gap (4.8 vs 4.6 kB); consumers that bundle minify with
  their own tooling. The bundle adds no behaviour of its own on top of
  the generated files (see the colour-scheme note below).
- **Beta validation costs nothing extra:** the existing `./next/css/*`
  wildcard maps to `src/tokens/css/*`, so the committed bundle is
  importable as `@equinor/eds-tokens/next/css/variables.css` in the next
  beta with no publish-workflow change. The temporary `next/*` paths
  (including the granular files) disappear at the flip as ADR-0009 already
  prescribes.

### Colour-scheme behaviour: governed by ADR-0004, not by 2.x

The bundle keeps the generated output's attribute-scoped behaviour as-is:
consumers set `data-color-scheme` once at root level, per the theming
convention decided in
[ADR-0004](./0004-component-conventions-for-eds-2.md). There is no
`prefers-color-scheme` media fallback in 3.0. 2.x behaves differently
(light at `:root`, automatic system-dark via a media fallback), but that
behaviour is inherited from `light-dark()` in the original 2024 build
setup (#3447) and a bug-fix rewrite that preserved its semantics (#4864),
not from a design decision — it does not carry over. Apps that want to
follow the OS make that choice themselves by setting the attribute (e.g.
from a `matchMedia` listener); the design system provides the switch, the
app decides the policy.

### Open question (must be settled before Accepted)

- **Whether anything beyond colour needs mode files bundled** as the
  token architecture rework lands (density set may change shape).

### Validation plan

1. Add the concat step; the bundle ships in the next beta as
   `next/css/variables.css`
2. Use it in the `/next` component migration and let beta testers exercise
   it
3. Settle the open questions; at the flip, map `./css/variables` to the
   bundle per ADR-0009's exit plan
4. Mark this ADR Accepted when at least one beta has exposed the exact
   3.0.0 surface

### Consequences

- Good, because 2.x consumers keep their single import line through the
  major upgrade; only variable names migrate
- Good, because the granular file layout stays changeable while designers
  rework the token architecture
- Good, because the bundle is validated on the beta line before the flip,
  matching ADR-0009's exit plan
- Bad, because the pipeline gains a small generated artifact whose build
  step must follow future changes to the export set (mitigated: the step
  should glob `src/tokens/css/`, not hard-code file names)
- Bad, because 2.x's automatic system-dark does not carry over: apps that
  relied on it must set `data-color-scheme` themselves — the migration
  guide must call this out explicitly

## Related

- [ADR-0009](./0009-temporary-next-subpaths-for-eds-tokens-beta.md) — the
  open consequence this ADR settles
- [ADR-0004](./0004-component-conventions-for-eds-2.md) — the theming
  convention (`data-color-scheme` set once at root by the consumer) that
  governs the bundle's colour-scheme behaviour
- [ADR-0013](./0013-attribute-scoped-custom-properties-not-light-dark.md)
  — why the token CSS uses attribute-scoped rules and never
  `light-dark()`
- PR [#4864](https://github.com/equinor/design-system/pull/4864) — why the
  2.x bundle has explicit dark scopes + the `prefers-color-scheme`
  fallback (`build-dark-scope`)
- `.github/workflows/tokens_studio_release.yaml` — where the concat step
  will live
- Epic [#4740](https://github.com/equinor/design-system/issues/4740);
  issue [#5108](https://github.com/equinor/design-system/issues/5108)
