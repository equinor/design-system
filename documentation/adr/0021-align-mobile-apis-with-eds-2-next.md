# Mobile component APIs target the newest EDS web generation, not stable

- **Status:** Accepted (recorded retrospectively 2026-09-23)
- **Date:** 2026-04 (opened as design-system-internal#257 on 2026-04-09, settled through 2026-06-25)
- **Decision makers:** EDS Core Team
- **Scope:** Mobile

## Context

EDS web currently publishes two component generations side by side: the stable library and `next/` (the EDS 2.0 beta, built on the new token foundation). As mobile components are migrated off their inherited `mad-components` shape (see [ADR-0019](./0019-adopt-only-the-component-library-from-mad.md)), each one needs a target API to migrate toward, and the two generations don't always agree — `next/` Button, for example, uses `tone`/`variant` naming that stable's Button doesn't have.

Picking stable's API as the target would mean migrating mobile once now and again later, whenever a component's newer web generation eventually replaces stable's. That second migration is exactly the kind of churn this decision exists to avoid — and it isn't a one-time problem: EDS web itself is expected to keep advancing generations (a further token-foundation revision is already in progress as of this writing), so the principle below has to outlive any one generation, `next/` included.

## Decision Drivers

- Mobile is being built component-by-component right now, so it can absorb a naming decision once, cheaply, rather than shipping stable's API and reworking it after the newer generation graduates.
- EDS 2.0 is the direction the design system is moving in generally; new libraries built during the transition should point at the destination, not the departure point — and should keep pointing at wherever that destination moves to next, not freeze on today's `next/`.
- The newest generation doesn't cover every EDS web component yet, but mobile is building components today regardless — the rule has to specify a fallback for that gap, not just the happy path.
- React Native has no CSS, no DOM, and no `asChild`/`Slot` polymorphism, so some web API surface (styling props, HTML attribute pass-through) cannot be copied verbatim and has to be adapted rather than aligned literally.

## Options Considered

### Option 1: Align every mobile component API with the current stable EDS web API

**Pros:**

- Stable is finished and documented today, so there's no moving target to track while `next/` is still in beta
- Matches what most existing web consumers are used to right now

**Cons:**

- For components `next/` has already redesigned (Button, Input, the selection controls), stable's API is the one being phased out, so mobile would launch already behind the direction EDS is heading
- Guarantees a second migration for every component once its `next/` counterpart ships to stable and mobile has to catch up

### Option 2: Align with the newest EDS web generation where it exists (currently `next/`), fall back to stable where it doesn't (chosen)

**Pros:**

- Mobile only migrates once per component instead of once now and again after the newer generation graduates
- Naming and prop shape stay consistent with the direction EDS web is already moving in, and the rule keeps applying as that direction moves again
- Doesn't block on newest-generation coverage — a component with no `next/` equivalent yet still gets a real API today, from stable

**Cons:**

- `next/` itself is still in beta and can still change before it stabilizes — and a further token-foundation revision is already underway — so "align with the newest generation" is aligning with a moving target by design, not a finished one
- Produces a mobile library whose API doesn't match today's stable web library for the components already redesigned, which can read as inconsistent to a consumer working across both platforms until stable catches up

### Option 3: Design mobile's API independently of both stable and `next/`

**Pros:**

- Free to optimize purely for React Native ergonomics with no web precedent to reconcile against

**Cons:**

- Throws away the API alignment that makes EDS a single design system across platforms in the first place, reintroducing exactly the kind of platform-specific drift ADR-0019 already had to account for
- Doubles the design and documentation work, since neither stable nor `next/` naming can be reused as a starting point

## Decision

**Adopt Option 2.** Where EDS web has published a newer-generation version of a component (currently `next/`), mobile's API follows that generation, not stable. Where the newest generation doesn't yet cover a component, mobile follows stable's API instead. Where neither API translates to React Native (CSS-specific patterns, DOM attribute pass-through, `asChild`/`Slot` polymorphism), the mobile team adapts the pattern rather than forcing a literal port.

This is a standing rule, not a one-time snapshot of `next/`'s current shape: if `next/` itself is superseded by a later generation (the in-progress token-foundation revision, or whatever comes after it), mobile re-targets that later generation under this same decision. No new ADR is needed to keep pointing at the destination — only the table below gets new rows as further migrations happen.

### Applied so far (snapshot — will grow and can go stale)

The following mobile components have already been rebuilt against this principle, each verified against the corresponding `next/` web component's actual props as of this ADR's writing (2026-09):

| Component                                                                             | Change         | Old (stable-shaped) API                                    | New mobile API                                                                                                |
| ------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Button ([mobile PR #109](https://github.com/equinor/design-system-mobile/pull/109))   | Label prop     | `title`                                                    | `label` (RN-specific — `next/` Button takes `children`, not a `label` prop)                                   |
| Button                                                                                | Color theming  | `color="primary \| secondary \| danger"`                   | `tone="accent \| neutral \| danger"`                                                                          |
| Button                                                                                | Variant values | `contained \| outlined \| ghost`                           | `primary \| secondary \| ghost`                                                                               |
| Button                                                                                | Sizes          | Not available                                              | `size="small \| default"`                                                                                     |
| Button                                                                                | Icons          | `iconName` / `iconPosition`                                | `leadingIcon` / `trailingIcon` (RN-specific — `next/` Button composes `<Icon>` children, no equivalent props) |
| Button                                                                                | Removed        | `loading`, `fullWidth`, `Button.Group`, `Button.Toggle`    | —                                                                                                             |
| Switch ([mobile PR #103](https://github.com/equinor/design-system-mobile/pull/103))   | Label          | Not available                                              | `label` prop, optional (`next/` Switch requires it)                                                           |
| Switch                                                                                | Removed        | `color` prop, `Switch.Small`, `switchSize` on `SwitchCell` | —                                                                                                             |
| Radio ([mobile PR #108](https://github.com/equinor/design-system-mobile/pull/108))    | Label          | Not available                                              | `label` prop (optional inline text)                                                                           |
| Radio                                                                                 | Removed        | `color` prop, `size` prop                                  | Uses the `sizing.selectable.lg` token instead                                                                 |
| Checkbox ([mobile PR #110](https://github.com/equinor/design-system-mobile/pull/110)) | Label          | Not available                                              | `label` prop (optional inline text)                                                                           |
| Checkbox                                                                              | Indeterminate  | Not available                                              | `indeterminate` prop                                                                                          |
| Input ([mobile PR #111](https://github.com/equinor/design-system-mobile/pull/111))    | Validation     | `variant?: "danger"`                                       | `invalid?: boolean`                                                                                           |
| Input                                                                                 | Error icon     | Not built in                                               | Built in, with `hideErrorIcon` to suppress it                                                                 |
| Input                                                                                 | Adornments     | `leftAdornments` / `rightAdornments`                       | `startText` / `startAdornment` / `endText` / `endAdornment`                                                   |

All five PRs above are merged. Every new-API prop in this table that is marked as `next/`-aligned (`tone`, `variant`, `size` on Button; `label` on Radio and Checkbox; `indeterminate` on Checkbox; `invalid`, `hideErrorIcon`, `startText`/`startAdornment`/`endText`/`endAdornment` on Input) is confirmed present in both `packages/eds-mobile-components` and the corresponding `packages/eds-core-react/src/components/next/` component as of this ADR, with matching value sets. Button's `size` is `small | default` on both platforms — there is no `large` size on either. Button's `label`/`leadingIcon`/`trailingIcon` are called out above as RN-specific adaptations, not literal ports of `next/`'s `children`-based composition. Switch's `label` diverges by design: `next/` requires it (a switch needs an accessible label), while mobile currently keeps it optional.

### Consequences

- Good: mobile components migrate onto their target API once, at build time, instead of shipping stable's shape and reworking it again after the newer generation graduates.
- Good: a consumer moving from web's newest generation to mobile, or building the same feature on both, finds matching prop names and value sets rather than two different vocabularies for the same design.
- Good: components with no newest-generation equivalent yet aren't blocked — they ship against stable and get revisited only if a newer generation later changes the target.
- Good: the rule survives EDS web advancing past `next/` — mobile re-targets whatever the newest generation is at the time, without needing this ADR rewritten.
- Bad: `next/` is still beta, and a further token-foundation revision is already in progress, so mobile is aligning with an API that can still change more than once before any generation stabilizes. Each such change means mobile absorbs that churn too.
- Bad: for components already redesigned in `next/`, mobile's API no longer matches today's stable web API, which is what most existing web consumers still use. This reads as inconsistent until stable catches up.
- Bad: React Native's lack of CSS, DOM attributes and `asChild`/`Slot` means some prop alignment is unavoidably partial — a mobile component can match a newer-generation component's design-facing props while still diverging on the mechanical, platform-specific ones.

### Confirmation

- New or redesigned mobile components are checked against the corresponding newest-generation component's actual props (not just its documentation) before the mobile API is finalized, the same way Button, Switch, Radio, Checkbox and Input were verified for this ADR.
- Where a mobile component's API is adapted rather than copied (for platform reasons), the PR description states what changed and why, so the deviation is traceable instead of silent.
- When EDS web's newest generation moves again (for example, once the in-progress token-foundation revision produces its own component APIs), mobile re-targets it under this same rule; the "Applied so far" table gets updated or extended, not this Decision.

## Related

- Source discussion: [design-system-internal#257](https://github.com/equinor/design-system-internal/discussions/257)
- Parent discussion: [design-system-internal#255](https://github.com/equinor/design-system-internal/discussions/255)
- [ADR-0019](./0019-adopt-only-the-component-library-from-mad.md) — the migration this API-alignment principle applies to
- [ADR-0020](./0020-mobile-component-scope-exclusions-and-renames.md) — which components are in scope for this migration in the first place
- Tracking issue for this ADR batch: [#5515](https://github.com/equinor/design-system/issues/5515)
