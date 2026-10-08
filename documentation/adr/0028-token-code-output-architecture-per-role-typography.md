# Token code / output architecture for the redefined token system, with per-role typography output

- **Status:** Accepted
- **Date:** 2026-10-08
- **Decision makers:** Frida Erdal, EDS Core Team
- **Scope:** Tokens

## Context

This record supersedes [ADR-0014](./0014-token-code-output-architecture.md). [ADR-0027](./0027-token-variable-architecture-typography-roles.md) restructured the typography this layer consumes: `ui` became `label`, body became tokens with explicit line-heights, `bolder` became `medium` and a `bold` (700) weight was added. Two points of ADR-0014 depended on the old typography: point 5 decided that the generator would derive body (this was never built), and point 8 made that derived leading code-owned. Accepted records are not edited, and the template asks for a full replacement, so this record restates ADR-0014 with four kinds of change: points 5 and 8, two consequences that follow from them, the references that now point to ADR-0027 instead of the superseded ADR-0007, and factual corrections where ADR-0014 no longer matched the repository on 2026-10-08. The corrections cover the scope widening extended in [#5568](https://github.com/equinor/design-system/pull/5568), the pipeline diagram, the mobile consumer, issue references and examples. The decisions in the other points, and the reasoning behind them, are carried over.

This ADR defines the **code / output layer** of the redefined token system: how the repository consumes the token structure defined in [ADR-0027](./0027-token-variable-architecture-typography-roles.md) (which superseded ADR-0007), and the shape of what it produces — the build pipeline, the CSS custom-property output, and the TypeScript modules. It replaces the legacy Figma-REST + Style Dictionary build documented in [`documentation/how-to/TOKEN_SYSTEM_GUIDE.md`](../how-to/TOKEN_SYSTEM_GUIDE.md), which had no CI/CD (built locally, then shipped) and accumulated silent drift and zombie tokens (#5108).

ADR-0007 deliberately left this layer undecided until the first CSS/TS export cycle had run. That cycle has now run: the release pipeline (`.github/workflows/tokens_studio_release.yaml`) produces CSS, DTCG, and TypeScript output, committed to `main` under `packages/eds-tokens/src/tokens/` through a release PR. Two neighbouring ADRs own adjacent decisions and this ADR points to them rather than repeating them: [ADR-0011](./0011-adopt-tokens-studio-platform-pipeline.md) (Accepted) decides the pipeline itself — trigger, auth, backup — and [ADR-0008](./0008-generate-ts-tokens-from-studio-exports.md) records the TypeScript-generation mechanics. This ADR is the umbrella for the **output**: what the pipeline produces, its naming, its layering, and its publish boundary.

Everything here is grounded in the actual generated output committed on `main` (`packages/eds-tokens/src/tokens/`), not in planned behaviour — except where a decision is explicitly marked as decided-but-not-yet-implemented (typography output per role, Decision point 5; the bundle layer wrap, Decision point 6). Both were still unimplemented on `main` on 2026-10-08.

## Decision Drivers

- **One evaluation source.** CSS and TypeScript output must descend from the same evaluation of the token source — structure and source values must not be able to drift apart. (Rendered colour values still differ by design between the two formats — see Consequences.)
- **Unattended CI with loud failures.** The pipeline runs on Tokens Studio releases without a human watching; anything unexpected must fail the run, never produce silently wrong output.
- **React Native compatibility.** The mobile library (`packages/eds-mobile-components`, moved into this monorepo from the archived `equinor/design-system-mobile` in [#5138](https://github.com/equinor/design-system/issues/5138)) is to consume the TypeScript modules, so values must be ones React Native can parse: hex colours, not `oklch()`, and unitless numbers, not `px` strings. Today it still imports the legacy Style Dictionary modules from `@equinor/eds-tokens@2.3.0-beta.3`; moving it onto the Tokens Studio TypeScript output is tracked in [#5495](https://github.com/equinor/design-system/issues/5495).
- **Consumer overridability without specificity fights.** Products override token values; the output must make that easy and predictable.
- **Refactor-safe publish boundary.** Code consumes only the mode-free semantic layer (ADR-0027); restructuring the mode-bearing internals must not break consumers.
- **Team ownership.** The team must understand and own every stage (#5108) — no opaque generated tooling.

## Options Considered

### Option 1: Consume the Tokens Studio exports, generate TypeScript locally (chosen)

Pull raw token sets and run the platform's saved CSS + DTCG export configurations via the `studio` CLI in CI; combine the two exports into TypeScript modules with our own zero-dependency script.

**Pros:**

- The platform's formula engine is the single evaluation source — CSS and TS cannot drift structurally or in source values.
- Every stage is a plain script or workflow the team owns and can read.

**Cons:**

- The codegen is pinned to the saved export configurations' shape (layout, prefix, casing).

### Option 2: Keep Style Dictionary on the pulled raw token sets (rejected)

**Pros:**

- Familiar tooling and formats.

**Cons:**

- The raw sets contain unevaluated colour formulas Style Dictionary cannot compute, and it keeps the dependency the new pipeline exists to retire. Rejected in ADR-0008.

### Option 3: Keep syncing from Figma variables via the REST API (rejected)

**Pros:**

- No new platform dependency.

**Cons:**

- Figma is no longer the source of truth — ADR-0027 (as ADR-0007 before it) makes Tokens Studio canonical, with Figma variables synced _from_ it. Building the pipeline on the synced copy reintroduces the drift the redesign removes.

### Option 4: Wrap the published CSS bundle in `@layer eds-tokens` (chosen)

**Pros:**

- Consumer overrides win by design: unlayered author CSS always beats layered styles, so products override tokens with a plain unlayered rule such as `:root { --eds-*: … }`, with no specificity fights. Overrides that should reach colour-scheme and density subtrees need the same selector list as the semantic layer (see Consequences).
- Consistent with EDS 2.0 components, which ship in the `eds-components` layer behind an explicit `@layer eds-elements, eds-components;` order statement.

**Cons:**

- The wrap is a post-processing step we own — the platform's CSS export cannot emit `@layer`.
- Unlayered _legacy_ stylesheets also beat the layer (see Consequences).

### Option 5: Ship the CSS export as-is, bare selectors, no layer (rejected)

**Pros:**

- No post-processing step.

**Cons:**

- Token declarations at `:root` / `[data-*]` specificity compete with consumer CSS unpredictably, and the output would stay outside the layer order the components declare.

### Option 6: Post-process selectors with `:where()` (rejected)

**Pros:**

- Zero specificity, maximally overridable.

**Cons:**

- Zero specificity makes the tokens easy to override, but they stay unlayered. They still beat every layered EDS rule, including any `eds-components` rule that sets the same custom property, and they still tie with consumer rules that have zero specificity (`*`, `:where()`), where source order decides. `@layer` puts the tokens below both the components and all unlayered consumer CSS, whatever the specificity. Inside the bundle, mode files depend on source order with either option (point 6).

## Decision

The pipeline consumes Tokens Studio exports and generates TypeScript locally (Option 1), and the published CSS bundle is wrapped in `@layer eds-tokens` (Option 4). All `src/tokens/…` paths below are relative to the `packages/eds-tokens` package root:

```
Tokens Studio release
  └─ CI trigger (ADR-0011)
       └─ tokens_studio_release.yaml
            ├─ studio tokens pull      → src/tokens/raw/       (raw sets)
            ├─ rm -rf src/tokens/{css,dtcg}                    (clear the previous exports)
            ├─ studio exports run CSS  → src/tokens/css/       (evaluated values)
            ├─ studio exports run DTCG → src/tokens/dtcg/      (structure + $type)
            ├─ generate-ts-tokens.mjs  → src/tokens/ts/        (DTCG ⨯ CSS → TS)
            ├─ generate:css-bundle
            │    ├─ widen-semantic-scope.mjs → rewrites src/tokens/css/semantic/*
            │    │                              (:root → :root, [data-color-scheme], [data-density])
            │    │                              and src/tokens/css/density/comfortable.css
            │    │                              (:root → :root, [data-density="comfortable"])
            │    ├─ generate-css-bundle.mjs  → src/tokens/css/variables.css
            │    │                              (concatenation, colour-scheme files last)
            │    └─ assert-no-duplicate-names.mjs
            ├─ check:css:names         (the duplicate-name check as its own step)
            ├─ release PR (transient branch tokens-studio-release → main, squash-merged as feat:)
            │    └─ release-please PR (eds-tokens 3.0.0-beta.N)
            │         └─ trigger_publish.yml → publish_tokens.yaml
            │              └─ npm beta dist-tag (css, dtcg, ts under ./next/*)
            │                   (@layer eds-tokens wrap pending: point 6, #5423)
            └─ log-errors-to-slack     (on failure)
```

The committed CSS is therefore **not byte-identical to the Studio export**: one post-export step rewrites the selectors of the semantic files and the density base before bundling (point 6), and the bundle step decides file order. Both steps are code-owned (point 8).

1. **Source of truth and sync — decided in ADR-0011.** Tokens Studio is canonical (ADR-0027) and the repository is a pull-based consumer: the release-triggered, OIDC-authenticated pipeline — trigger event, auth model, exports referenced by ID, and the hourly `tokens-studio-backup` recovery branch — is decided in [ADR-0011](./0011-adopt-tokens-studio-platform-pipeline.md) (Accepted) and operationally documented in [`documentation/agent-instructions/TOKENS_STUDIO.md`](../agent-instructions/TOKENS_STUDIO.md). This ADR takes that pipeline as given and decides the shape of what it produces.

2. **Output targets — three artifacts from one source.** The release PR commits three platform outputs, plus the TypeScript generated from two of them and the CLI's `studio.lock`: the **raw token sets** (`src/tokens/raw/`, reference and recovery), the **CSS export** (`src/tokens/css/`, with evaluated values joined across files by `var()` chains; the only export the TypeScript generator reads values from), and the **DTCG export** (`src/tokens/dtcg/`, structural interchange with `$type` metadata, where aliases stay `{…}` references and the colour ladders arrive as evaluated oklch component objects). **TypeScript modules** (`src/tokens/ts/`) are generated by `packages/eds-tokens/scripts/generate-ts-tokens.mjs`, which combines the DTCG tree with the evaluated CSS values — mechanics, options considered, and value conversion (oklch → hex, px → unitless) are recorded in ADR-0008. All four directories are generated output — **never edited by hand**. The format list is deliberately open-ended: further emitters, for example Swift or Jetpack Compose, hang off the same DTCG ⨯ CSS combination and must not require the token shape to change. The platform also exports Swift and Compose itself, and has since gained a TypeScript export ([#5464](https://github.com/equinor/design-system/issues/5464)); moving the pipeline onto the platform TypeScript export is proposed in [#5552](https://github.com/equinor/design-system/issues/5552).

3. **Path → naming transform.** One deterministic mapping from token path to both output names:
   - **CSS:** `eds` prefix + path segments joined with `-` — `background/interactive/accent/emphasis/hover` → `--eds-background-interactive-accent-emphasis-hover`.
   - **TypeScript:** slashes become nested object keys; hyphenated segments become camelCase (`corner-radius` → `cornerRadius`, `rounded-outer` → `roundedOuter`); digit-leading tiers become spelled-out JS-safe keys (`2xl` → `twoXl`, `4xs` → `fourXs`). The DTCG tree drives the nesting, so the flattened CSS names never need to be parsed back into a tree (the ambiguity that rejected CSS-only generation in ADR-0008).
   - The `heading` → `header` spelling unification (ADR-0007) shows the fix path: it was made in the Studio source before the first committed export, which already carried `header` (`--eds-font-family-header`). Only a stale `font-family.heading` Figma variable reference survives, in `raw/$themes.json`. Spelling fixes happen **in the Studio source**, never papered over in the codegen.

4. **One resolved tree per mode.** Files under a dimension folder are resolved in their own variant's context and emitted as complete, self-contained trees: `ts/density/{compact,comfortable,relaxed}.ts` each carry fully resolved values (no cross-file references for consumers to assemble). Mode-less files are resolved once per colour scheme at the base density (`comfortable` — must match the saved export configurations) and split per scheme **only when the resolved values actually differ** (`ts/semantic/{light,dark}.ts` exists because they do; `ts/font/default.ts` does not split because they don't). New colour schemes, and scheme divergence in a mode-less file, surface automatically. Dimensions themselves are configured (`DIMENSION_FOLDERS` in the generator): a new dimension folder fails the run until the generator is taught about it. Mode-less files are not split by density, so the density-dependent values in `ts/semantic/*` (corner radius, spacing, typography) are the `comfortable` values. Mode-as-file is a deliberate divergence from the mode-as-key shape requested for React Native in the [PR #5178 review](https://github.com/equinor/design-system/pull/5178#pullrequestreview-4865110798), where density is a top-level object key and a provider reads `spacing[density].md`: an app that pins one density imports one file and tree-shakes the rest, while a runtime provider can still assemble the keyed object by importing all three files — the reverse derivation (splitting a keyed object back into tree-shakeable modules) is not possible.

5. **Typography output per role (decided, implementation pending).** The generator composes the semantic `font-family/*` and `font-weight/*` tokens into the typography output for each of the three roles in ADR-0027, following its text-style composition rules: `font-family` and `font-weight` are emitted alongside `font-size` and `line-height`.
   - `header` takes `font-family/header` and `font-weight/medium` at every size.
   - `label` takes `font-family/ui` and three weights, `normal`, `medium` and `bold`, matching the `default`, `medium` and `bold` text styles.
   - `body` takes `font-family/ui` and two weights, `normal` and `bold`.

   Body is no longer derived output. Its font size and line-height come from the `typography/body/*` tokens like every other role, so the generator computes no ratio and owns no typography value. Its only typography logic is the role → family/weight composition above: the exports carry no composite typography tokens, so the rules live in the generator and must be kept in step with the Figma text styles. The renamed source tokens (`label`, `typography/body/*`, `medium`, `bold`) reach the generated output with release PR [#5555](https://github.com/equinor/design-system/pull/5555); `main` still carries `ui` and `bolder`. The composed per-role trees do not exist in the generated output yet; this point records the decided mechanism, with implementation tracked as follow-up work. Composed spreadable `textStyle` objects for React Native remain a further follow-up on top of the per-role trees.

6. **CSS specificity — `@layer eds-tokens` (decided, implementation pending).** The raw CSS export files stay unlayered generated artifacts; the **published bundle** wraps them in `@layer eds-tokens`, ordered before the existing component layers. Both the tokens bundle and the components bundle open with the same order statement — `@layer eds-tokens, eds-elements, eds-components;` — because layer order is fixed by the first appearance of each layer name, and a later statement only appends the names it introduces. The components side today declares `eds-elements, eds-components` in `packages/eds-core-react/src/components/next/index.css` and then imports the token bundle, so a wrapped bundle loaded after that two-layer statement would append `eds-tokens` as the last, highest-priority layer. Two post-export steps sit between the Studio export and the published bundle, and this ADR owns both:
   - **Scope widening** (`packages/eds-tokens/scripts/widen-semantic-scope.mjs`, chained before the bundler in the `generate:css-bundle` package script) rewrites the selector of every `src/tokens/css/semantic/*.css` file from `:root` to `:root, [data-color-scheme], [data-density]`, and the density base `src/tokens/css/density/comfortable.css` from `:root` to `:root, [data-density="comfortable"]`. Semantic tokens alias scheme names that only exist under `[data-color-scheme]` scope rules, and custom properties substitute where they are _declared_ — declared only at `:root`, the semantic layer resolves once for the whole page and a colour-scheme switch on a subtree never reaches it ([#5226](https://github.com/equinor/design-system/issues/5226)). Density works the same way: since [#5568](https://github.com/equinor/design-system/pull/5568) the semantic layer is also declared on `[data-density]` elements, so it re-resolves inside a density subtree ([#5247](https://github.com/equinor/design-system/issues/5247)), and the widened density base lets `data-density="comfortable"` inside a Compact subtree get the Comfortable values back. Nothing else is widened: the export's `rootSelector` is global across all non-dimensional layers, and widening the density base to every `[data-color-scheme]` or `[data-density]` element would clobber a `[data-density]` ancestor's values, which is why the base only gets its own attribute value. The bundler asserts both widenings have happened and fails otherwise.
   - **Bundle file order.** Inside the layer, mode files keep winning by **source order**: `[data-density='compact']` and `:root` have equal specificity (0,1,0), so the density base must come before the compact and relaxed files, the same invariant the unlayered export relies on today. That order is currently a side effect of the bundler sorting files alphabetically (`comfortable` before `compact` before `relaxed`), not an enforced rule, so a renamed or added density mode could break it. The bundler is stricter about colour schemes: it concatenates the **colour-scheme files last**, after everything else. On a `[data-color-scheme]` element the widened semantic block and the scheme block apply at equal specificity, so if the two ever declare the same name, source order is the only cascade lever and the scheme value must win — the alternative is the self-referential focus-ring bug in Consequences. Source order only helps where both blocks match: on an element that carries only `data-density`, the semantic block applies and the scheme block does not, so there the duplicate-name check (Confirmation) is the only guard. Nothing depends on this today (the duplicate names are cleared), but a future layer wrap or bundler change that reorders files would bring that bug straight back. The order is an invariant of this ADR, not an implementation detail of the script. The bundle shipped on `main` today (`packages/eds-tokens/scripts/generate-css-bundle.mjs`) has no layer. Its output is a generated-file header plus the source files concatenated with the colour-scheme files last; the bundler also asserts that the widening ran and that the output contains no `light-dark()`, and none of this changes a declaration. This point decides the wrap, which [ADR-0010](./0010-single-bundled-css-entry-for-eds-tokens-3.md) (Accepted) already records as the bundle step's only added behaviour. The wrap keeps the bundle a pure function of the source files.

7. **Publish boundary — the mode-free semantic layer is the contract.** ADR-0027 (point 3) hides primitives, density and font: no consumer targets a mode-bearing variable directly. This ADR makes that boundary explicit for the generated output, because the artifacts necessarily carry more names than the contract. **Published contract:** the mode-free semantic names (CSS) and their TypeScript twins (`ts/semantic/*`), the per-role typography output (`ts/font/*` and the composed trees from point 5), and the per-density spacing/corner-radius trees that React Native mode-switching requires (`ts/density/*`). **Internal:** everything else. The scheme, primitive and font-collection custom properties are physically present in the published CSS bundle — `var()` resolution is late-bound, so every name a semantic alias references must exist at runtime — but they are resolution plumbing, not API: they can be renamed or restructured in any release without notice, and consumer code (human **or agent**) must never reference them. The TypeScript side has seven generated directories today (`color-scheme`, `colors`, `density`, `elevation`, `font`, `primitives`, `semantic`); the four outside the contract are committed reference output, not importable API:
   - `ts/primitives/*` and `ts/color-scheme/*` — the mode-bearing layers ADR-0027 hides.
   - `ts/colors/*` — the raw colour ladders (`dark.blue.1` … `15`): ingredients for the scheme layer, never a finished value.
   - `ts/elevation/*` — the loose parts of a shadow (offset, blur, spread, colour). The finished shadow already lives in the semantic set as `elevation.high` / `elevation.low`, whose Studio description names it the semantic face over the `shadow.*` parts, and `ts/semantic/{light,dark}.ts` emits both a ready CSS `boxShadow` string and a React Native `layers[]` array from it. Nobody downstream needs the parts. This differs from `density/*`, which _is_ published: density has three variants an app switches between at runtime and React Native needs all three; elevation has one. Documentation must present only the contract surface (the colour getting-started page, `apps/design-system-docs/docs/foundation/colour/getting_started.mdx`, still lists the internal `next/ts/` modules), and the 3.0.0 `exports` map must not expose the internal directories (ADR-0010's granular-stays-internal decision). The beta line's `./next/{css,dtcg,ts}/*` wildcards, which `publish_tokens.yaml` adds to the exports map at publish time (ADR-0009), predate this boundary and disappear at the flip.

8. **Ownership boundary.** Design owns the variable structure (primitive + mapping + semantic) and the text-style layer (ADR-0027), including every typography value. Code owns everything downstream: the export configurations, the pipeline workflows, the TypeScript codegen and the bundle layering. No ratio-derived values are planned for code: the body leading that ADR-0014 assigned to the generator, which was never built, has been a token since ADR-0027.

### Consequences

- Good, because token structure and source values cannot drift between CSS and TypeScript — both descend from the platform's single evaluation (ADR-0008). One deliberate exception: **rendered colour differs by format** — CSS ships wide-gamut `oklch()` while TypeScript ships sRGB hex via gamut mapping, so colour steps outside the sRGB gamut (high-chroma reds and oranges at high lightness, and the lightest blues, worst in dark mode) render visibly differently on web and React Native.
- Good, because consumer overrides need no specificity fights: unlayered author CSS beats `@layer eds-tokens` by design.
- Good, because the pipeline is owned end-to-end — plain workflows and a zero-dependency script, satisfying the #5108 "team owns it" driver.
- Good, because per-scheme splitting is data-driven: new colour schemes and scheme divergence surface automatically, and a new dimension fails the run instead of being dropped.
- Good, because the publish boundary (point 7) is stated before beta consumers land on internal names — breaking to change afterwards, cheap to decide now.
- Good, because every typography value in the output traces to a Studio token; the generator's only typography logic is the role → family/weight composition from point 5.
- Bad, because the ADR-0027 renames reach consumers as breaking changes in the first release after them: `--eds-typography-ui-*` becomes `--eds-typography-label-*` and `--eds-font-weight-bolder` becomes `--eds-font-weight-medium`, because generated names follow the Studio source (point 3).
- Bad, because **unlayered legacy stylesheets also beat the layer**: if the legacy bundle (`@equinor/eds-tokens/css/variables`, built as `build/css/variables.min.css`) loads in the same app as the new layered bundle, any shared `--eds-*` custom-property name silently resolves to the legacy value. The repository already carries scars from exactly this pattern (import-order workarounds in `packages/eds-core-react/.storybook/preview.css` and `apps/design-system-docs/src/css/theme-variables.css`). A **name-collision check between the legacy and new outputs is required** before beta consumers mix them.
- Bad, because an override on `:root` alone stops at the first `[data-color-scheme]` or `[data-density]` element: the semantic layer is declared again there (point 6), and a declared value beats an inherited one whatever its layer. Overrides meant to reach those subtrees must use the same selector list, `:root, [data-color-scheme], [data-density]`.
- Bad, because the CSS name transform is **not injective**: both `.` and `-` in token paths flatten to `-`, so distinct tokens can land on the same custom property. This has already bitten _inside_ the new output — semantic `border.focus` flattens to the same name as scheme `border-focus`, and where the one aliases the other the emitted declaration is self-referential (`--eds-border-focus: var(--eds-border-focus)`) and resolves to nothing (the focus-ring breakage found in the Button and Chip token migrations, [#5222](https://github.com/equinor/design-system/pull/5222) and [#5225](https://github.com/equinor/design-system/pull/5225)). `border-disabled` and `text-disabled` had the same duplicate-name shape. The August 2026 semantic restructure (the `*.interactive.*` token layer, released in [#5280](https://github.com/equinor/design-system/pull/5280)) cleared all three from the export — but that fix was token _content_, not structure: the transform is still not injective, so the class of bug can return with any new token name. **The trap: platform-side tooling will not show this** — Tokens Studio resolves by token _name_, where `border.focus` and `border-focus` are distinct, so `studio` previews look healthy while the built CSS is broken. Verification must run on the **built CSS output**.
- Bad, because the codegen and the layer wrap are pinned to the saved export configurations' shape (file layout, `eds` prefix, kebab casing, base density) — changing those in Studio requires a matching change here (ADR-0008 caveat, now extended to bundling).
- Bad, because layer order **inverts for `!important`** (earlier layers win): token sheets must never contain `!important`, or the override story reverses.
- Neutral: browser support is not a new constraint — `@layer` has been baseline since 2022, and the output already requires newer support (`oklch()`).

### Confirmation

- The release workflow runs on every Tokens Studio release; unknown `$type`s, broken `var()` chains, and unsupported value syntax fail the run and alert via the Slack step — deviations are loud, never silent.
- Code review rejects hand edits to the generated directories (`src/tokens/{raw,css,dtcg,ts}`).
- Export configurations are verified to be referenced by ID in the workflows (ADR-0011).
- A **duplicate-name / self-reference check on the built CSS output** gates the release workflow with a non-zero exit ([#5407](https://github.com/equinor/design-system/issues/5407)): `packages/eds-tokens/scripts/assert-no-duplicate-names.mjs` runs in `tokens_studio_release.yaml` after the bundle step and before the PR is created, so a colliding export opens no PR at all. The `generate:css-bundle` package script chains it too, so a local pipeline run is held to the same guard. It catches flattening collisions inside the new output — the `border.focus` vs `border-focus` class, whether as a self-referential `var()`, a redeclaration shadowed inside one block, or a name spread across two layer directories — and shared `--eds-*` names between the legacy and new outputs, against a known list that may only shrink and has to be empty before the `next/*` → `css/*` flip. Platform-side resolution cannot substitute for this check (see Consequences). The same assertions run over the committed artifact in `packages/eds-tokens/src/__tests__/assert-no-duplicate-names.test.ts`, so a hand edit or a merge is caught without a release run.
- The one-way reference rule (primitive → mapping → semantic, ADR-0027) is linted in the pipeline once the expanded colour architecture lands — ADR-0007 and ADR-0027 leave it to code review, which will not hold at that volume.

## Related

- Supersedes [ADR-0014](./0014-token-code-output-architecture.md)
- [ADR-0027](./0027-token-variable-architecture-typography-roles.md) — the token variable architecture this layer consumes (supersedes ADR-0007); ownership boundary
- [#5530](https://github.com/equinor/design-system/issues/5530): the typography restructure behind points 5 and 8
- [ADR-0008](./0008-generate-ts-tokens-from-studio-exports.md) — TypeScript generation mechanics (DTCG ⨯ CSS combination, value conversion)
- [ADR-0010](./0010-single-bundled-css-entry-for-eds-tokens-3.md) (Accepted, added in [#5199](https://github.com/equinor/design-system/pull/5199)) — the single bundled `./css/variables` entry, which already names the layer wrap from point 6 as the bundle's only added behaviour; pointed to by point 7 (granular stays internal)
- [ADR-0011](./0011-adopt-tokens-studio-platform-pipeline.md) (Accepted) — the release-triggered pipeline this output architecture sits on
- [`documentation/agent-instructions/TOKENS_STUDIO.md`](../agent-instructions/TOKENS_STUDIO.md) — pipeline operations playbook (CLI, auth, backup & recovery)
- [`documentation/how-to/TOKEN_SYSTEM_GUIDE.md`](../how-to/TOKEN_SYSTEM_GUIDE.md) — the legacy pipeline this replaces
- Issues: [#5140](https://github.com/equinor/design-system/issues/5140) (ADR-0014's issue), [#4963](https://github.com/equinor/design-system/issues/4963) (parent of #5140), [#5108](https://github.com/equinor/design-system/issues/5108) (pipeline rebuild), [#5423](https://github.com/equinor/design-system/issues/5423) (layer wrap, point 6), [#5495](https://github.com/equinor/design-system/issues/5495) (mobile onto the Tokens Studio TypeScript output)
- PR [#5166](https://github.com/equinor/design-system/pull/5166) — first TS generation cycle. The generated output this ADR is grounded in lives on `main` at `packages/eds-tokens/src/tokens/`; the `tokens-studio-release` branch is created per release PR and deleted on merge, so it is not a stable reference
