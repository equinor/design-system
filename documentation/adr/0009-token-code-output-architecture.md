# Token code / output architecture for the redefined token system

- **Status:** Proposed
- **Date:** 2026-07-15
- **Decision makers:** Frida Erdal, EDS Core Team

## Context

This ADR defines the **code / output layer** of the redefined token system: how the repository consumes the token structure defined in [ADR-0007](./0007-token-variable-architecture-spacing-typography.md), and the shape of what it produces — the build pipeline, the CSS custom-property output, and the TypeScript modules. It replaces the legacy Figma-REST + Style Dictionary build documented in [`documentation/how-to/TOKEN_SYSTEM_GUIDE.md`](../how-to/TOKEN_SYSTEM_GUIDE.md), which had no CI/CD (built locally, then shipped) and accumulated silent drift and zombie tokens (#5108).

ADR-0007 deliberately left this layer undecided until the first CSS/TS export cycle had run. That cycle has now run: the release pipeline (`.github/workflows/tokens_studio_release.yaml`) produces CSS, DTCG, and TypeScript output on the `tokens-studio-release` branch, and [ADR-0008](./0008-generate-ts-tokens-from-studio-exports.md) records the TypeScript-generation mechanics. This ADR is the umbrella: it records the overall output architecture and points to ADR-0008 rather than repeating it.

Everything here is grounded in the actual generated output on the `tokens-studio-release` branch, not in planned behaviour — except where a decision is explicitly marked as decided-but-not-yet-implemented (font composition and body typography, Decision point 5).

## Decision Drivers

- **One evaluation source.** CSS and TypeScript consumers must get identical values; the outputs must not be able to drift apart.
- **Unattended CI with loud failures.** The pipeline runs on Tokens Studio releases without a human watching; anything unexpected must fail the run, never produce silently wrong output.
- **React Native compatibility.** `equinor/design-system-mobile` consumes the TypeScript modules — values must be hex colours and unitless numbers, not `oklch()` or `px` strings.
- **Consumer overridability without specificity fights.** Products override token values; the output must make that easy and predictable.
- **Refactor-safe publish boundary.** Code consumes only the mode-free semantic layer (ADR-0007); restructuring the mode-bearing internals must not break consumers.
- **Team ownership.** The team must understand and own every stage (#5108) — no opaque generated tooling.

## Options Considered

### Option 1: Consume the Tokens Studio exports, generate TypeScript locally (chosen)

Pull raw token sets and run the platform's saved CSS + DTCG export configurations via the `studio` CLI in CI; combine the two exports into TypeScript modules with our own zero-dependency script.

**Pros:**

- The platform's formula engine is the single evaluation source — CSS and TS cannot drift.
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

- Figma is no longer the source of truth — ADR-0007 makes Tokens Studio canonical, with Figma synced _from_ it. Building the pipeline on the synced copy reintroduces the drift the redesign removes.

### Option 4: Wrap the published CSS bundle in `@layer eds-tokens` (chosen)

**Pros:**

- Consumer overrides win by design: unlayered author CSS always beats layered styles, so products override tokens with a plain `:root { --eds-*: … }` — no specificity fights.
- Consistent with EDS 2.0 components, which already ship in `eds-elements` / `eds-components` layers with an explicit order declaration.

**Cons:**

- The wrap is a post-processing step we own — the platform's CSS export cannot emit `@layer`.
- Unlayered _legacy_ stylesheets also beat the layer (see Consequences).

### Option 5: Ship the CSS export as-is, bare selectors, no layer (rejected)

**Pros:**

- No post-processing step.

**Cons:**

- Token declarations at `:root` / `[data-*]` specificity compete with consumer CSS unpredictably, and the output would be the only unlayered part of EDS 2.0.

### Option 6: Post-process selectors with `:where()` (rejected)

**Pros:**

- Zero specificity, maximally overridable.

**Cons:**

- Mode files (`dark`, `compact`) would then rely _purely_ on source order to beat the `:root` defaults — fragile once a bundler or consumer reorders imports. `@layer` achieves the overridability without flattening the internal cascade.

## Decision

The pipeline consumes Tokens Studio exports and generates TypeScript locally (Option 1), and the published CSS bundle is wrapped in `@layer eds-tokens` (Option 4):

```
Tokens Studio release
  └─ CI trigger (repository_dispatch: tokens-release)
       └─ tokens_studio_release.yaml            (OIDC auth, exports run by ID)
            ├─ studio tokens pull      → src/tokens/<alias>/   (raw sets)
            ├─ studio exports run CSS  → src/tokens/css/       (evaluated values)
            ├─ studio exports run DTCG → src/tokens/dtcg/      (structure + $type)
            └─ generate-ts-tokens.mjs  → src/tokens/ts/        (DTCG ⨯ CSS → TS)
                 └─ release PR (branch tokens-studio-release)
                      └─ package bundle: @layer eds-tokens wrap → npm (beta line)
```

1. **Source of truth and sync.** Tokens Studio is canonical (ADR-0007); the repository is a pull-based consumer via the `studio` CLI. Platform releases fire a `repository_dispatch` (type `tokens-release`) that runs `tokens_studio_release.yaml`, which authenticates back via GitHub OIDC and opens/updates the release PR. Saved export configurations are referenced **by ID, never by name** — a rename in the Studio UI must not break the run. An hourly backup workflow (`tokens_studio_backup.yaml`) pulls all sources to the orphan branch `tokens-studio-backup` as the recovery net between releases. Local validation uses the same CLI: `studio exports preview` and `studio tokens pull --dry-run`. Operational detail lives in [`documentation/agent-instructions/TOKENS_STUDIO.md`](../agent-instructions/TOKENS_STUDIO.md).

2. **Output targets — three artifacts from one source.** The release PR commits three generated directories: the **raw token sets** (`src/tokens/<alias>/`, reference and recovery), the **CSS export** (`src/tokens/css/` — the only platform format that evaluates the colour formulas into concrete values), and the **DTCG export** (`src/tokens/dtcg/` — structural interchange with `$type` metadata, references unresolved). **TypeScript modules** (`src/tokens/ts/`) are generated by `packages/eds-tokens/scripts/generate-ts-tokens.mjs`, which combines the DTCG tree with the evaluated CSS values — mechanics, options considered, and value conversion (oklch → hex, px → unitless) are recorded in ADR-0008. All four directories are generated output — **never edited by hand**.

3. **Path → naming transform.** One deterministic mapping from token path to both output names:
   - **CSS:** `eds` prefix + path segments joined with `-` — `background/surface/accent/default/hover` → `--eds-background-surface-accent-default-hover`.
   - **TypeScript:** slashes become nested object keys; hyphenated segments become camelCase (`corner-radius` → `cornerRadius`, `rounded-outer` → `roundedOuter`); digit-leading tiers become spelled-out JS-safe keys (`2xl` → `twoXl`, `4xs` → `fourXs`). The DTCG tree drives the nesting, so the flattened CSS names never need to be parsed back into a tree (the ambiguity that rejected CSS-only generation in ADR-0008).
   - The current export still carries `font/family/heading` where ADR-0007 unified the spelling to `header`; this is fixed **in the Studio source**, not papered over in the codegen.

4. **One resolved tree per mode.** Files under a dimension folder are resolved in their own variant's context and emitted as complete, self-contained trees: `ts/density/{compact,comfortable,relaxed}.ts` each carry fully resolved values (no cross-file references for consumers to assemble). Mode-less files are resolved once per colour scheme at the base density (`comfortable` — must match the saved export configurations) and split per scheme **only when the resolved values actually differ** (`ts/semantic/{light,dark}.ts` exists because they do; `ts/font/default.ts` does not split because they don't). New divergent dimensions surface automatically rather than by configuration.

5. **Font composition and body typography — decided, implementation pending.** The generator composes the `Font` collection into the typography output per role: `font-family` and `font-weight` are emitted alongside `font-size` and `line-height` in the per-role typography trees, following the text-style composition rules from ADR-0007 (weight per header step lives in the composition, not in tokens). `body/*` is emitted as **derived output** in both CSS and TypeScript: ui font-size × **1.5** line-height for the `sm` · `md` · `lg` reading range. The 1.5 ratio is deliberately not a token — it is code-owned (ADR-0007 ownership boundary) and lives in the generator. Neither composition exists in the current output yet; this point records the decided mechanism, with implementation tracked as follow-up work.

6. **CSS specificity — `@layer eds-tokens`.** The raw CSS export files stay unlayered generated artifacts; the **published bundle** wraps them in `@layer eds-tokens`, ordered before the existing component layers. Both the tokens bundle and the components bundle open with the same order statement — `@layer eds-tokens, eds-elements, eds-components;` — because the first order declaration the browser sees wins and repeated declarations are harmless (the components side today declares `eds-elements, eds-components` in `packages/eds-core-react/src/components/next/index.css`). Inside the layer, mode files keep winning by **source order**: `[data-color-scheme='dark']` and `:root` have equal specificity (0,1,0), so the bundle step must preserve the defaults-before-modes file order — the same invariant the unlayered export relies on today.

7. **Ownership boundary.** Design owns the variable structure (primitive + mapping + semantic) and the text-style layer in Tokens Studio (ADR-0007). Code owns everything downstream: the export configurations, the pipeline workflows, the TypeScript codegen, the bundle layering, and the ratio-derived values that are deliberately not variables (the body 1.5 leading).

### Consequences

- Good, because token values cannot drift between CSS and TypeScript — both descend from the platform's single evaluation (ADR-0008).
- Good, because consumer overrides need no specificity fights: unlayered author CSS beats `@layer eds-tokens` by design.
- Good, because the pipeline is owned end-to-end — plain workflows and a zero-dependency script, satisfying the #5108 "team owns it" driver.
- Good, because per-scheme/per-density splitting is data-driven — new divergent dimensions surface automatically.
- Bad, because **unlayered legacy stylesheets also beat the layer**: if the legacy bundles (`tokens.css`, `variables.css`) load in the same app as the new layered bundle, any shared `--eds-*` custom-property name silently resolves to the legacy value. The repository already carries scars from exactly this pattern (workaround comments in `packages/eds-core-react/src/components/next/index.css`). A **name-collision check between the legacy and new outputs is required** before beta consumers mix them.
- Bad, because the codegen and the layer wrap are pinned to the saved export configurations' shape (file layout, `eds` prefix, kebab casing, base density) — changing those in Studio requires a matching change here (ADR-0008 caveat, now extended to bundling).
- Bad, because layer order **inverts for `!important`** (earlier layers win): token sheets must never contain `!important`, or the override story reverses.
- Neutral: browser support is not a new constraint — `@layer` has been baseline since 2022, and the output already requires newer support (`oklch()`).

### Confirmation

- The release workflow runs on every Tokens Studio release; unknown `$type`s, broken `var()` chains, and unsupported value syntax fail the run and alert via the Slack step — deviations are loud, never silent.
- Code review rejects hand edits to the generated directories (`src/tokens/{<alias>,css,dtcg,ts}`).
- Export configurations are verified to be referenced by ID in the workflows.
- Before the layered bundle ships alongside the legacy package output, a collision check compares the two sets of `--eds-*` names.

## Related

- [ADR-0007](./0007-token-variable-architecture-spacing-typography.md) — the token variable architecture this layer consumes; ownership boundary
- [ADR-0008](./0008-generate-ts-tokens-from-studio-exports.md) — TypeScript generation mechanics (DTCG ⨯ CSS combination, value conversion)
- [`documentation/agent-instructions/TOKENS_STUDIO.md`](../agent-instructions/TOKENS_STUDIO.md) — pipeline operations playbook (CLI, auth, backup & recovery)
- [`documentation/how-to/TOKEN_SYSTEM_GUIDE.md`](../how-to/TOKEN_SYSTEM_GUIDE.md) — the legacy pipeline this replaces
- Issues: [#5140](https://github.com/equinor/design-system/issues/5140) (this ADR), [#4963](https://github.com/equinor/design-system/issues/4963) (parent), [#5108](https://github.com/equinor/design-system/issues/5108) (pipeline rebuild)
- PR [#5166](https://github.com/equinor/design-system/pull/5166) — first TS generation cycle; the `tokens-studio-release` branch holds the generated output this ADR is grounded in
