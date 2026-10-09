# Token variable architecture for typography and spacing, with header, label and body roles

- **Status:** Accepted
- **Date:** 2026-10-08
- **Decision makers:** Edvard Bjørgen (Design Lead), Alex (Designer), EDS Core Team
- **Scope:** Tokens

## Context

[ADR-0007](./0007-token-variable-architecture-spacing-typography.md) defined the variable structure for typography, spacing, corner-radius and density in the redefined token system: primitives, mode-bearing mapping collections, a mode-free semantic layer that is the only thing consumers touch, and Figma text styles on top. That structure is still right. What changed is the typography inside it, and the template asks for a full replacement rather than a partial one, so this record restates everything from ADR-0007 that still applies and adds the new typography decisions. ADR-0007 is superseded by this record.

Four things made the typography in ADR-0007 out of date:

1. **The role names confused designers.** The design-side validation in [#5360](https://github.com/equinor/design-system/issues/5360) (7 testers, August–September 2026) found the typography roles to be the joint-biggest source of confusion: 5 of 7 testers hesitated over which role to use. `ui` read as "text inside a component" rather than "all functional text", and two testers said the emphasis weight (`bolder`, Inter Medium 500) was not bold enough. Alex's summary of the testing in #5530 adds that testers choose text by whether it wraps, not by an abstract role.
2. **Header leading was too tight for Equinor.** One line-height ladder serves both typefaces and was tuned for Inter. At the same step Equinor is set about 2px larger, so headers got tight ratios, and since text-trim was removed a line box shorter than the glyphs cuts off descenders ([#5373](https://github.com/equinor/design-system/issues/5373)). Alex's [review on #5530](https://github.com/equinor/design-system/issues/5530#issuecomment-5829775438) (25 September) also found the header ratios uneven: `xl` at 1.14 sat between `lg` at 1.33 and `2xl` at 1.17.
3. **Body text was not a token.** ADR-0007 point 6 kept body out of the variable set: three text styles (`sm`, `md`, `lg`) reused the `ui` font sizes with a literal 150% line-height. Figma had nothing to bind for the leading, the generator that was to derive it in code ([ADR-0014](./0014-token-code-output-architecture.md) point 5) was never built, and 1.5 × the font size is not always a multiple of 4px (14px gives 21px).
4. **Spacing stopped at 3xl (32px).** Two testers in #5360 hit that ceiling: one needed 48px between fieldsets, the other 48px for a button. Alex's proposal in [#5487](https://github.com/equinor/design-system/issues/5487) added six steps, `4xl` to `9xl` (40 to 128px in comfortable).

The typography decisions were made on 7 and 8 October 2026 in [#5530](https://github.com/equinor/design-system/issues/5530), from Alex's spec for the new line-heights, with Edvard's corrections recorded in the issue's decision comments. The spacing steps come from #5487.

Out of scope, as in ADR-0007: colour ([ADR-0016](./0016-colour-approach-for-eds-2.md)), the code and output layer ([ADR-0028](./0028-token-code-output-architecture-typography-roles.md)) and elevation.

### Decisions carried over from sibling tracks

- **Text-trim is not part of the token set.** Every text style has trim set to None, and line-height is never adjusted to compensate for trimming.
- **CSS utility classes** (for example a `text-xs` utility) are a post-v1 nice-to-have.
- **Release:** tokens ship on the beta line and graduate with the components ([ADR-0012](./0012-pinned-prerelease-versioning-for-beta-lines.md), [ADR-0025](./0025-batch-graduation-with-release-candidate.md)).
- **Consumer migration** for existing UI-kit consumers is still an open risk ([#5121](https://github.com/equinor/design-system/issues/5121)).

## Decision Drivers

- **Role names that match how designers choose text:** by what the text is and whether it wraps.
- **One uniform, mode-free consumption surface** for design and code, so mode logic can change without consumer refactors.
- **Every value a text style uses is a token,** so Figma and code bind the same values, including body leading.
- **Header leading that suits Equinor** at every size and density without clipping descenders.
- **Density set once per surface,** applied uniformly through one step-shift mechanic, so a given font size has the same line-height in every mode.
- **Weight is an orthogonal axis,** composed at the text-style layer rather than multiplied into the size tokens.
- **One spelling per concept,** mapping cleanly to CSS custom properties and nested TypeScript keys.

## Options Considered

### Option 1: Keep `header` / `ui` and explain the roles in documentation

The #5360 roll-up suggested documentation could carry the "when to use what".

**Pros:**

- No breaking rename.

**Cons:**

- The confusion sits in the style picker, where designers choose, and documentation does not reach it.
- Body stays outside the variable set, so its leading still cannot be bound.

### Option 2: Rename the roles to `heading` / `label` / `body`

Alex's first proposal in #5530.

**Pros:**

- `heading` matches the HTML and accessibility vocabulary.

**Cons:**

- Breaks ADR-0007's one-spelling rule, which unified the type domain on `header` in July 2026, and renames every header token although testing did not flag `header`.

### Option 3: `header` / `label` / `body`, with body as tokens (chosen)

Keep `header`, rename `ui` to `label`, and add `body` as tokenised sizes with explicit line-heights.

**Pros:**

- Names the two Inter roles by behaviour: `label` for single-line functional text, `body` for text that wraps.
- Body leading becomes a token that Figma and code both bind, on the 4px grid.
- Keeps the one-spelling rule and the header names.

**Cons:**

- Breaking rename for every `ui` token.
- Twelve more semantic tokens, and twelve more density tokens in each of the three density sets.

### Option 4: Weight as `bold` (700) replacing `bolder` (500)

The first reading of the #5530 spec turned `ui/bolder` into `label/*/bold` at 700.

**Pros:**

- One emphasis weight, clearly bold.

**Cons:**

- Drops the Medium weight that existing `ui/bolder` usages rely on; `bolder` was always meant as medium.

_Rejected in favour of renaming `bolder` to `medium` (500) and adding `bold` (700) beside it (Decision, point 7)._

### Option 5: Weight as a per-step typography variable or a parallel weight group (rejected, as in ADR-0007)

Encode weight into the size tokens, or mirror a role as a separate `label-bold` group.

**Cons:**

- Multiplies the token count (size × weight) and couples an orthogonal axis into the size ramp.

_Rejected: weight is composed at the text-style layer._

## Decision: variable structure

Three layers with one reference direction, and a Figma text-style layer on top. The semantic layer is mode-free and is the only layer consumers, design and code, touch. All mode behaviour lives in the mapping collections beneath it, which are hidden from publishing.

```
  ┌────────────────────────────────────────────────────────────────────┐
  │ Figma text-style layer  header/* · label/*/{default,medium,bold}    │
  │                         · body/*/{default,bold}                     │
  │   binds SEMANTIC font-size · line-height · font-weight · font-family│
  └───────────────┬────────────────────────────────────────────────────┘
                  │ one-way ▼
  ┌───────────────┴────────────────────────────────────────────────────┐
  │ SEMANTIC  (single mode, MODE-FREE, PUBLISHED)                       │
  │   spacing/{none, 4xs … 9xl}                                         │
  │   corner-radius/{none, rounded, rounded-outer, pill}                │
  │   typography/{header,label,body}/{size}/{font-size,line-height}     │
  │   font-family/{header,ui} · font-weight/{normal,medium,bold}        │
  │   (colour and elevation: separate records)                          │
  │   flat 1:1 aliases, no logic                                        │
  └───────────────┬────────────────────────────────────────────────────┘
                  │ one-way ▼
  ┌───────────────┴────────────────────────────────────────────────────┐
  │ MAPPING (mode-bearing, HIDDEN, never consumed directly)             │
  │   Density [Compact · Comfortable · Relaxed]                         │
  │     density/{spacing,corner-radius,typography}/…   step-shift       │
  │   Font [single mode]  family/{header,ui} · weight/{…}               │
  └───────────────┬────────────────────────────────────────────────────┘
                  │ one-way ▼  (each group → primitives only)
  ┌───────────────┴────────────────────────────────────────────────────┐
  │ PRIMITIVE (raw values, no modes)                                    │
  │   spacing · type-scale (inter, equinor) · lineheight-scale          │
  │   weight-scale · font-family (inter, equinor)                       │
  └────────────────────────────────────────────────────────────────────┘
```

1. **Three layers, one-way references.** Primitive → mapping → semantic → text styles and components. No sibling, cross-collection, semantic → semantic or mapping → mapping references, with one exception in corner-radius (point 4).

2. **The semantic layer is a flat 1:1 alias layer with no logic.** Each semantic token aliases exactly one mapping token, or a primitive directly for a value that must not vary. Density step-shifting resolves in the mapping collection, through the mode set on the consuming surface. The semantic token itself carries no mode.

3. **Semantic is the only published, consumable layer,** together with the text styles. Primitives, density and font collections are hidden from publishing. Code consumes every token from this one layer: `--eds-typography-label-md-font-size` and `--eds-font-weight-medium` sit next to `--eds-spacing-md`. In Figma, designers use typography through text styles.

4. **Mapping collections (mode-bearing, hidden):**
   - **Density** [`Compact` · `Comfortable` · `Relaxed`]: `density/spacing/*`, `density/corner-radius/*`, `density/typography/{header,label,body}/{size}/{font-size,line-height}`. Density is set once per surface. Each mode shifts which primitive a token references: `Compact` uses the font-size/line-height pair of the next smaller size on the comfortable scale, `Relaxed` the pair of the next larger size. At the ends of a role's range the pair comes from the primitive steps just beyond it: compact `header/xs` is 10/12 and relaxed `header/4xl` is 36/44. As a result one px font size has the same line-height in every mode for `header` and `body` (in `header`, 16px is 16/20 in every mode; in `body`, 16/28). `label` keeps the former `ui` ramp unchanged, which has one exception: compact `label/sm` is 10/12, while comfortable `label/xs` is 10/16. Spacing and corner-radius shift one step on the spacing primitives. The three domain groups never reference each other, and each aliases only primitives, with two exceptions in corner-radius: `rounded-outer` references `density/corner-radius/rounded` plus `primitives/spacing/6`, the one reference exception in point 1, and `pill` is a raw 9999px instead of an alias.
   - **Font** [single mode]: `family/header` → Equinor, `family/ui` → Inter, `weight/{normal,medium,bold}`.

5. **The primitive layer is the single source of truth:** the spacing scale, the type scale (`inter`, `equinor`), the line-height scale (`lineheight-scale`, steps 100–1200, where 1200 = 44px was added for the largest relaxed sizes), the weight scale (`weight-scale`: normal 400, medium 500, bold 700) and the font families. No modes.

6. **Three typography roles.** Comfortable values below; compact and relaxed follow the step-shift in point 4. Tokens Studio has the values for all three modes.
   - **`header`**, Equinor, `xs`–`4xl`, for titles. Line-heights are looser than the shared ladder's Inter pairing, so Equinor does not clip:

     | size             | xs    | sm    | md    | lg    | xl    | 2xl   | 3xl   | 4xl   |
     | ---------------- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
     | font / line (px) | 12/16 | 14/20 | 16/20 | 18/24 | 21/28 | 24/32 | 28/36 | 32/40 |

     `sm` and `md` share a 20px line-height, the one place two header sizes do (in compact the same 14px and 16px pair falls on `md` and `lg`, in relaxed on `xs` and `sm`). Line-heights sit on the 4px grid, so at these sizes the choices are 16, 20 or 24: 14px needs 20 for enough leading, and 16px at 24 (1.5) would be looser than a heading should be. Moving `md` to 24 and every larger size up one step was tried and rejected, because `md` to `2xl` then sit at 1.50 to 1.56.

   - **`label`**, Inter, `xs`–`5xl`, for single-line functional text: buttons, navigation, table cells, form labels, captions. Sizes and line-heights are the former `ui` ramp, unchanged.
   - **`body`**, Inter, `sm`–`3xl`, for running text that wraps. Line-heights are explicit tokens of at least 1.5 × the font size, on the 4px grid:

     | size             | sm    | md    | lg    | xl    | 2xl   | 3xl   |
     | ---------------- | ----- | ----- | ----- | ----- | ----- | ----- |
     | font / line (px) | 12/20 | 14/24 | 16/28 | 18/28 | 21/32 | 24/36 |

   The 1.5 is a readability choice, not a WCAG requirement. WCAG SC 1.4.12 (AA) asks that components survive a user forcing 1.5 × line-height, which is a component concern; SC 1.4.8's 1.5 leading is Level AAA.

7. **Weight is an orthogonal axis composed at the text-style layer, never a per-step or per-role variable.** The semantic `typography/{role}/{size}` groups carry only `font-size` and `line-height`. Each text style composes `{size ramp} × font-weight × font-family`:
   - `header/*` → `font-weight/medium` (500) at every size. One weight at every size replaces ADR-0007's header weight that varied by step.
   - `label/*` → `default` (`font-weight/normal`, 400), `medium` (`font-weight/medium`, 500, the former `bolder`) and `bold` (`font-weight/bold`, 700).
   - `body/*` → `default` (400) and `bold` (700).
   - No `label-bold` or per-step weight group exists, and adding one is the anti-pattern this rule forbids.

8. **Text styles.** 47 styles: `header/{xs…4xl}` (8), `label/{xs…5xl}/{default,medium,bold}` (27), `body/{sm…3xl}/{default,bold}` (12). Tokens Studio has no typography composites, so the text styles are maintained in the Figma file and bind only semantic variables: font size, line-height, weight and family (`font-family/header` or `font-family/ui`). Variables are synced from Tokens Studio, which stays canonical for every value. The Figma text styles, composed as point 7 describes, are the reference for typography on every platform: the web implements them in its element and component CSS ([ADR-0029](./0029-typography-approach-for-eds-2-web.md)), and React Native in the Typography component in `packages/eds-mobile-components`.

9. **Ownership.** Design owns the variable structure (primitive, mapping, semantic) and the text-style layer, including body leading, which is now a token. This replaces ADR-0007's statement that the body 1.5 leading is code-owned.

### Naming

- **Primitives:** `primitives/<domain>/<step|key>`. Spacing uses the rem-relative hundredths convention, `name = round(px / 16 × 100)` with ties resolving down (spacing `100` = 16px, `25` = 4px). The type scale uses a separate 100-step index, `type-scale/{inter,equinor}/{100…1100}`, rounded to whole px (`type-scale/inter/500` = 16px).
- **Mapping layers are namespaced by where they live** (`density/…`, `font/…`), so a reference shows whether it is density-dependent.
- **Semantic:** `<domain>/<tier>`, lowercase and hyphenated (`4xs … 9xl`, `rounded-outer`).
- `lineheight-scale` has one `default` value per step. Header line-heights deliberately use a higher step than their font-size step in five of eight sizes (comfortable `header/xl` = `type-scale/equinor/600` with `lineheight-scale/700`). Do not "restore" matching step numbers: that brings back the tight ratios from #5373.
- `corner-radius/*` aliases spacing primitives, except `rounded-outer` and `pill` (point 4).
- **Full reference chains for the font axis:**
  - **Weight:** `primitives/weight-scale/medium` (500) → `font/weight/medium` → `font-weight/medium`. Likewise `normal` (400) and `bold` (700). Only the semantic token carries the `font-weight/*` spelling.
  - **Family:** `primitives/font-family/equinor` → `font/family/header` → `font-family/header`, and `primitives/font-family/inter` → `font/family/ui` → `font-family/ui`. `ui` names the Inter family, which both `label` and `body` use; it is no longer a role.
- **One spelling per concept.** The Equinor role is `header` everywhere: `typography/header/*`, `density/typography/header/*`, `font-family/header` and the `header/*` text styles. `heading` is not used.
- **Colour uses US spelling** (`color`) in every variable path and output name.

### Consequences

- Good, because the role names follow how designers choose text, which is what #5360 found missing.
- Good, because body leading is a token on the 4px grid that Figma and code bind identically, and there is no ratio for code to re-derive.
- Good, because Equinor headers get room for descenders at every size and density, and `xl` no longer dips below its neighbours.
- Good, because in `header` and `body` one font size keeps one line-height across all density modes.
- Bad, because the renames break code: `--eds-typography-ui-*` becomes `--eds-typography-label-*` and `--eds-font-weight-bolder` becomes `--eds-font-weight-medium`. Known consumers on `main`: `apps/design-system-docs`, with 27 references in 4 files (`docs-components.css`, `colour/usage.mdx`, `site-chrome.css` and `docs-search-bar.css`). The `next` components and the mobile packages read the 2.x token namespace and are not affected.
- Bad, because header line-heights no longer follow matching step numbers, so the scale is correct by choice rather than by construction, and only the note in Naming guards it.
- Neutral: the Tokens Studio → Figma sync, an open risk in ADR-0007, is now in use. One behaviour to plan for: the sync matches variables by name, so a renamed token arrives in Figma as a new variable and the old one stays, still bound to its text styles. Every rename needs a Figma pass that rebinds and then removes the old variables (observed when this change was synced on 7 October 2026).
- Open: `label/xs` is 9px in compact density. This change does not touch it; it is to be decided with the documentation pass ([#5517](https://github.com/equinor/design-system/issues/5517)).
- **Two accepted records are out of step and get their own successor records, in separate PRs:**
  - [ADR-0014](./0014-token-code-output-architecture.md) point 5 derives body as `ui` font-size × 1.5 in the generator ("decided, implementation pending"), and point 8 makes the body leading code-owned. Body is now a token, so point 5 should not be implemented. [ADR-0028](./0028-token-code-output-architecture-typography-roles.md) supersedes ADR-0014 and drops the per-role composition point 5 describes: the output carries the role tokens, and each platform's components compose the text styles.
  - [ADR-0018](./0018-typography-approach-for-eds-2.md) resolves weight per size and gives `strong` an inherited `--_font-weight-bolder` with a 500 fallback. Under this record weights no longer vary by size and `bolder` no longer exists. ADR-0018 also defines the utility classes `.eds-heading-bold` and `.eds-heading-light` and a `text-box` trim pattern. [ADR-0029](./0029-typography-approach-for-eds-2-web.md) supersedes ADR-0018: it records how `<strong>` and `<b>` resolve on the web, and drops the utility classes and the trim.

### Confirmation

- Code review checks that new references obey the one-way rule and never cross siblings; a pipeline lint should take this over as the colour set grows.
- After each Tokens Studio → Figma sync, the Figma typography variables are compared with Tokens Studio, and every text style is checked to bind only semantic variables and to resolve to the expected values in all three density modes.
- Tests or code review check that the web element CSS (ADR-0029) and the React Native Typography component use the weight point 7 prescribes for each role, so the implementations stay in step with the Figma text styles.
- The duplicate-name check on the built CSS ([ADR-0028](./0028-token-code-output-architecture-typography-roles.md), Confirmation) runs on each release and fails it if a new `label` or `body` name collides with an existing one.

## Related

- Supersedes [ADR-0007](./0007-token-variable-architecture-spacing-typography.md)
- Decision issue: [#5530](https://github.com/equinor/design-system/issues/5530) (decision comments of 7 and 8 October 2026); spacing steps: [#5487](https://github.com/equinor/design-system/issues/5487)
- Evidence: [#5360](https://github.com/equinor/design-system/issues/5360) (design validation), [#5373](https://github.com/equinor/design-system/issues/5373) (header line-heights and clipping)
- [ADR-0014](./0014-token-code-output-architecture.md) and [ADR-0018](./0018-typography-approach-for-eds-2.md): out of step, superseded by [ADR-0028](./0028-token-code-output-architecture-typography-roles.md) and [ADR-0029](./0029-typography-approach-for-eds-2-web.md) in separate PRs
- [ADR-0016](./0016-colour-approach-for-eds-2.md): colour
- Epic [#4740](https://github.com/equinor/design-system/issues/4740); architecture issue [#4963](https://github.com/equinor/design-system/issues/4963); typography documentation [#5517](https://github.com/equinor/design-system/issues/5517)
- Tokens Studio, _Equinor Design System_ project (canonical): `primitives/default`, `density/{compact,comfortable,relaxed}`, `font/default`, `semantic/default`. Figma: _EDS Redefined Foundation_ (`mZ7SefYcGCfiT1XYbaEbi7`).
