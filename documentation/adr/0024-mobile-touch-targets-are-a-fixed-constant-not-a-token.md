# Touch targets are a fixed platform constant in mobile components, not a density-scaled token

- **Status:** Accepted (recorded retrospectively 2026-09-24)
- **Date:** 2026-09-16 (settled while spiking the Tokens Studio TypeScript export on [#5464](https://github.com/equinor/design-system/issues/5464); confirmed at the 2026-09-17 dev/design alignment meeting)
- **Decision makers:** Chibuzor Nwemambu, EDS Core Team
- **Scope:** Mobile

## Context

`Radio`, `Checkbox`, and `Switch` each size their tappable area from `theme.spacing.sizing.selectable.lg` when rendered without a label (with a label, padding from the squished spacing proportions provides the extra tap area instead, and `touchTargetSize` isn't used). This token comes from `@equinor/eds-tokens@2.3.0-beta.3` — the version `eds-mobile-components` currently pins, built by the legacy Figma-REST sync pipeline, using comfortable/spacious density naming — and is density-scaled: it resolves to 36pt at comfortable density and 44pt at spacious. `Input` sets its `minHeight` from the same token, so `TextField` and `Search`, both built on `Input`, share the same 36pt floor — though padding may push their actual rendered height above it, unlike `Radio`/`Checkbox`/`Switch`, where the unlabelled size is exactly this token's value.

Apple's Human Interface Guidelines say "a button needs a hit region of at least 44×44 pt" ([Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)); the [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) page separately lists 44×44pt as iOS/iPadOS's default control size, with 28×28pt as the labelled minimum. Nothing in the codebase uses `hitSlop` to pad a visually smaller control up to the minimum, so at comfortable density — which EDS advises for screens narrower than 576, the width of a phone — at least `Radio`, `Checkbox`, and `Switch` render a touch target below the accessibility floor. That gap wasn't invisible for lack of a written rule — `apps/design-system-docs/docs/about/getting-started/design/getting_started_design.mdx:53` says to ensure touch targets are at minimum 44px, `apps/design-system-docs/docs/foundation/accessibility.md:45` mentions a 48px clickbound layer, and `packages/eds-mobile-components/CLAUDE.md:265` cites Apple's 44×44pt recommendation. It was invisible because nothing enforces any of those scattered statements: no token, lint rule, or test catches a control that falls below the minimum, so a density change silently violates it. Two mobile component docs go further and describe something the code doesn't do: `Radio.mdx:43` and `Switch.mdx:35` both say the unlabelled control is "sized for a comfortable touch target," when at comfortable density it's actually 36pt.

The question surfaced while spiking the Tokens Studio TypeScript export ([#5464](https://github.com/equinor/design-system/issues/5464)): the new token foundation has no `sizing.selectable` scale at all — it names its densities compact/comfortable/relaxed, not the current package's comfortable/spacious.

In the 🔹 EDS Core Components Figma file, `Radio`, `Checkbox`, and the default `Button` are built from the icon size (`spacing/lg`) plus `spacing/xs` padding on each side instead, giving 28pt at compact, 36pt at comfortable, and 44pt at relaxed — with the same padding whether or not a label is shown, so the extra height labelled controls get today (44pt at comfortable, from the squished `lg` padding) isn't part of the redesign. At compact and comfortable, `Radio`, `Checkbox`, and the default `Button` all sit below 44pt. Even at relaxed, the small `Button`, the small icon buttons (32pt), and `Link` (25pt) still sit below the minimum — they're deliberately smaller controls, not a density artifact.

As of that spike (2026-09-16), the scale's own largest single step was 32pt at comfortable and 36pt at relaxed — it could not express 44pt even if a token-based approach were kept. More spacing steps have been added to that scale since, but that doesn't change this decision: touch target size was never meant to be read off the spacing scale in the first place. Migrating onto the new foundation forces a decision on where touch target sizing belongs, independent of fixing today's 36pt gap (which is deliberately out of scope here — see Consequences).

## Decision Drivers

- 44×44pt is a property of human fingers, not of the design language. It must not vary by theme, density, or brand the way a spacing or sizing token is designed to.
- Spacing and sizing tokens exist specifically to scale with density. Pairing a touch target's size to one of them means a density change can shrink it below the platform minimum with nothing to catch that.
- Cross-platform precedent: Fluent 2 ships one spacing scale across web and mobile, and handles the platform difference through the unit system (pt on iOS, px on web) rather than by scaling the spacing ramp itself. Its touch target minimums are stated separately and platform-specifically, not derived from that spacing scale.

## Options Considered

### Option 1: Keep pairing touch target size to an existing density-scaled sizing token (status quo)

Continue sizing `Radio`, `Checkbox`, and `Switch`'s tap area from `sizing.selectable.lg` or an equivalent scaled token.

**Pros:**

- Reuses the existing scale; no new primitive to introduce or maintain
- Density scaling is automatic — the touch target grows or shrinks with the rest of the density-scaled sizing

**Cons:**

- This is today's actual bug: `sizing.selectable.lg` is 36pt at comfortable density, below Apple's 44pt minimum, with nothing compensating
- A token scale is designed to vary; a touch target minimum is designed not to. Pairing them means the minimum is only accidentally met at whichever density happens to produce 44 or more
- The new token foundation doesn't have this token at all, so there would be nothing to migrate this pairing onto

### Option 2: Introduce a dedicated, always-fixed touch-target token

Add a new token to the token system whose value never changes across theme, density, or brand, so touch target sizing is still expressed as a token, just a pinned one.

**Pros:**

- Every sizing decision in a component stays expressible as "reach for a token," keeping one mental model
- Visible in Tokens Studio alongside every other value, rather than living only in code

**Cons:**

- Tokens exist so a value can vary by theme, density, or brand without touching component code; a value that must never vary gets no benefit from that pipeline. It would also duplicate a number the spacing scale already has: 44 already exists in the new foundation, at `compact`'s `5xl` step and `relaxed`'s `4xl` step. A dedicated touch-target token would just give designers and developers a second name for that same number, with a different meaning attached — confusing rather than useful
- Fluent 2 treats its touch target minimums as separate, platform-specific values, not derived from its shared spacing scale — the same reasoning this option runs against
- Still requires a place in the token pipeline to be defined and exported, which is more moving parts than a constant needs

### Option 3: Fix touch target size as a platform constant in code, outside the token system (chosen)

Define 44pt — the hit region Apple's Human Interface Guidelines call for on buttons, and the default iOS/iPadOS control size — as a fixed constant in `eds-mobile-components`' own code, not derived from or expressed as any token.

**Pros:**

- Never varies by theme, density, or brand, which is exactly the property a finger-size minimum needs
- Matches Fluent 2 precedent: touch target minimums stated separately and platform-specifically, not derived from the shared spacing scale
- Survives the token foundation migration cleanly — it never depended on `sizing.selectable` or any other scale that could change shape or disappear

**Cons:**

- A second source of truth for sizing: a component author has to know to reach for this constant instead of a `sizing.*`/`spacing.*` token like everything else, which isn't obvious without documentation
- Doesn't fix today's 36pt gap by itself — that requires each component to actually add `hitSlop` padding sized from the constant, which is separate follow-on work

## Decision

**Adopt Option 3.** The touch target minimum (44×44pt) is a fixed platform constant defined in `eds-mobile-components`' own code — never derived from a density-scaled sizing or spacing token, and never expressed as a token at all, fixed or otherwise. The constant's home file isn't fixed yet: `src/styling/` is expected to move to the new token foundation (spiked, unmerged, in [#5464](https://github.com/equinor/design-system/issues/5464)), and pinning to a specific file now would tie the decision to code that's about to change. The constant lives in code, never in a token — the file itself gets created once that migration lands.

Meeting the minimum is done with `hitSlop`, not by sizing the control itself to the constant: the visible control keeps its density-scaled size, and its tappable area is padded out to the constant with `hitSlop` wherever the control renders smaller than that. Components don't get fixed sizes under this rule — only their tap area does. Per-component detail on where this applies lives in the Foundation docs page, tracked in [#5486](https://github.com/equinor/design-system/issues/5486).

### Consequences

- Good: 44pt never varies by theme, density, or brand, matching why the number exists in the first place and matching how Fluent 2 keeps touch target minimums separate from its shared spacing scale.
- Good: the decision survives the ongoing token-foundation migration without modification, since it never depended on `sizing.selectable` or any scale that migration changes.
- Bad: introduces a second source of truth for sizing — a component author has to know to reach for a fixed constant instead of a `sizing.*` token like everything else, which needs documentation to be discoverable rather than being obvious from the code.
- Bad: `Radio`, `Checkbox`, and `Switch` still size their touch target from `sizing.selectable.lg` (36pt at comfortable density) with no `hitSlop` compensation, below the platform minimum. `Input` (and `TextField`/`Search`, built on it) share the same 36pt floor via `minHeight`, though their actual rendered height may sit higher once padding is applied. The gap isn't only a density issue either: in the redesign, the small `Button`, small icon buttons, and `Link` sit below 44pt even at the largest density, because they're deliberately smaller controls. Each affected component closes its own gap as it migrates onto the new token foundation, where `packages/eds-mobile-components/CLAUDE.md`'s existing requirement to "scale for mobile touch targets (minimum 44×44pt)" already applies.
- Bad: `Radio` and `Checkbox` can't take `hitSlop` today — their internal `Pressable` takes only fixed, named props with no way to pass one through — and `Switch`'s `Pressable` only forwards `style`. Applying this rule to those three components depends on fixing that prop forwarding first ([#5442](https://github.com/equinor/design-system/issues/5442)).
- Bad: React Native's `hitSlop` doesn't reach past its parent view's bounds, and a sibling view's z-index still wins if the padded areas overlap ([Pressable docs](https://reactnative.dev/docs/pressable)). A control smaller than 44pt inside a row that's the same height as the control gets no extra tap area from `hitSlop` alone — the surrounding layout has to leave room for the padding too.

### Confirmation

- A new interactive mobile component pads its tappable area up to the fixed touch-target constant (once it exists) with `hitSlop` wherever its density-scaled size falls short — never by sizing the control itself to the constant, and never by reaching for a density-scaled `sizing.*`/`spacing.*` token to do it.
- The Foundation docs page under `apps/design-system-docs/docs/foundation/` explains the 44pt minimum and how `hitSlop` meets it — tracked in [#5486](https://github.com/equinor/design-system/issues/5486).
- Each of the nine interactive mobile component docs (`Button`, `Checkbox`, `Input`, `Link`, `Radio`, `Search`, `Switch`, `TextArea`, `TextField`) states how it meets the minimum in its `## Accessibility` section — also tracked in [#5486](https://github.com/equinor/design-system/issues/5486).

## Related

- Tracking issue for the documentation work this decision requires: [#5486](https://github.com/equinor/design-system/issues/5486)
- Blocks applying `hitSlop` to `Radio`, `Checkbox`, and `Switch` until their `Pressable` forwards it: [#5442](https://github.com/equinor/design-system/issues/5442)
- Surfaced while investigating the Tokens Studio TypeScript export: [#5464](https://github.com/equinor/design-system/issues/5464)
- Tracking issue for this ADR batch: [#5515](https://github.com/equinor/design-system/issues/5515)
