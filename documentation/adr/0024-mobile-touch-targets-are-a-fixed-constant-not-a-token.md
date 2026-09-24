# Touch targets are a fixed platform constant in mobile components, not a density-scaled token

- **Status:** Accepted (recorded retrospectively 2026-09-24)
- **Date:** 2026-09-16 (settled while spiking the Tokens Studio TypeScript export on [#5464](https://github.com/equinor/design-system/issues/5464); confirmed at the 2026-09-17 dev/design alignment meeting)
- **Decision makers:** Chibuzor Nwemambu, EDS Core Team
- **Scope:** Mobile

## Context

`Radio`, `Checkbox`, and `Switch` each size their tappable area from `theme.spacing.sizing.selectable.lg` when rendered without a label (with a label, padding from the squished spacing proportions provides the extra tap area instead, and `touchTargetSize` isn't used). `sizing.selectable.lg` is a density-scaled token: it resolves to 36pt at comfortable density and 44pt at spacious. Apple's minimum tappable area is 44×44pt; Android's is 48×48dp. Nothing in the codebase uses `hitSlop` to pad a visually smaller control up to the minimum, so at comfortable density — the platform's own default — these three components render a touch target below the accessibility floor. That gap was invisible because nothing states the rule anywhere: no doc, no token, no lint rule says a touch target must never go below 44/48, so a density change silently violates it.

The question surfaced while spiking the Tokens Studio TypeScript export ([#5464](https://github.com/equinor/design-system/issues/5464)): the new token foundation has no `sizing.selectable` scale at all, and as of that spike (2026-09-16) its largest spacing step was 32 at comfortable and 36 at relaxed — it could not express 44 even if a token-based approach were kept. More spacing steps have been added to that scale since, but that doesn't change this decision: touch target size was never meant to be read off the spacing scale in the first place. Migrating onto the new foundation forces a decision on where touch target sizing belongs, independent of fixing today's 36pt gap (which is deliberately out of scope here — see Consequences).

## Decision Drivers

- 44×44pt / 48×48dp is a property of human fingers, not of the design language. It must not vary by theme, density, or brand the way a spacing or sizing token is designed to.
- Spacing and sizing tokens exist specifically to scale with density. Pairing a touch target's size to one of them means a density change can shrink it below the platform minimum with nothing to catch that.
- Cross-platform precedent: Fluent 2, Carbon, and Atlassian all ship one spacing scale across web and mobile, and handle the platform difference through the unit system (pt on iOS, dp on Android, px on web) rather than by scaling the spacing ramp itself. Touch target minimums are treated as separate and platform-specific in all three, not derived from the spacing scale.
- The new token foundation has no scale that reaches 44 at any density, so a token-based approach has nothing to point at even if one were still wanted.

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

- A value that must never resolve differently across theme, density, or brand isn't really a design token in the sense the rest of the system uses that word — it doesn't decouple output from a single design decision the way every other token does, since resolving differently is exactly what a token is for
- Fluent 2, Carbon, and Atlassian all treat touch target minimums as separate, platform-specific values, not derived from their shared spacing scale — the same reasoning this option runs against
- Still requires a place in the token pipeline to be defined and exported, which is more moving parts than a constant needs

### Option 3: Fix touch target size as a platform constant in code, outside the token system (chosen)

Define 44pt — Apple's minimum tappable area — as a fixed constant in `eds-mobile-components`' own code, not derived from or expressed as any token.

**Pros:**

- Never varies by theme, density, or brand, which is exactly the property a finger-size minimum needs
- Matches Fluent 2, Carbon, and Atlassian precedent: touch target minimums as separate, platform-specific values, not derived from the shared spacing scale
- Survives the token foundation migration cleanly — it never depended on `sizing.selectable` or any other scale that could change shape or disappear

**Cons:**

- A second source of truth for sizing: a component author has to know to reach for this constant instead of a `sizing.*`/`spacing.*` token like everything else, which isn't obvious without documentation
- Doesn't fix today's 36pt gap by itself — that requires each component to actually switch from the token to the constant, which is separate follow-on work

## Decision

**Adopt Option 3.** The touch target minimum (44×44pt) is a fixed platform constant defined in `eds-mobile-components`' own code — never derived from a density-scaled sizing or spacing token, and never expressed as a token at all, fixed or otherwise. Scoped to iOS, which is what `eds-mobile-components` targets today; an Android minimum isn't defined here because there's no shipped Android surface to apply it to. Exactly which file it lives in isn't settled by this ADR — `eds-mobile-components`' own styling layer is itself mid-migration to the new token foundation, so pinning this to a specific existing file would tie the decision to code that's expected to change. What this ADR settles is that the constant lives in code, not in any token; that file doesn't exist yet.

Meeting the minimum is a per-component implementation choice between two techniques: size the control itself to the constant, or keep the visible control at its density-scaled size and pad the tappable area with `hitSlop`. This ADR doesn't pick one over the other — that's documented per-component in the Foundation docs page tracked in [#5486](https://github.com/equinor/design-system/issues/5486), not decided here.

### Consequences

- Good: 44pt never varies by theme, density, or brand, matching why the number exists in the first place and matching how Fluent 2/Carbon/Atlassian keep touch target minimums separate from their shared spacing scale.
- Good: the decision survives the ongoing token-foundation migration without modification, since it never depended on `sizing.selectable` or any scale that migration changes.
- Bad: introduces a second source of truth for sizing — a component author has to know to reach for a fixed constant instead of a `sizing.*` token like everything else, which needs documentation to be discoverable rather than being obvious from the code.
- Bad: this ADR doesn't fix today's real gap. `Radio`, `Checkbox`, and `Switch` still size their touch target from `sizing.selectable.lg` (36pt at comfortable density) with no `hitSlop` compensation, below the platform minimum. That fix is tracked as its own issue, deliberately not this one.

### Confirmation

- A new interactive mobile component sizes its tappable area from the fixed touch-target constant (once it exists) or pads to it with `hitSlop`, never from a density-scaled `sizing.*`/`spacing.*` token.
- The Foundation docs page under `apps/design-system-docs/docs/foundation/` explains the 44pt minimum and the two ways to meet it — tracked in [#5486](https://github.com/equinor/design-system/issues/5486), not this ADR.
- Each of the nine interactive mobile component docs (`Button`, `Checkbox`, `Input`, `Link`, `Radio`, `Search`, `Switch`, `TextArea`, `TextField`) states how it meets the minimum in its `## Accessibility` section — also tracked in [#5486](https://github.com/equinor/design-system/issues/5486).

## Related

- Tracking issue for the documentation work this decision requires: [#5486](https://github.com/equinor/design-system/issues/5486)
- Surfaced while investigating the Tokens Studio TypeScript export: [#5464](https://github.com/equinor/design-system/issues/5464)
- Tracking issue for this ADR batch: [#5515](https://github.com/equinor/design-system/issues/5515)
