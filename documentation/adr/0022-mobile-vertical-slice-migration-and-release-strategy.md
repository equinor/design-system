# Migrate mobile components by loose dependency priority, releasing each individually until one stable cutover

- **Status:** Accepted (recorded retrospectively 2026-09-23)
- **Date:** 2026-03 (ordered vertical slices adopted end of Q1 2026, following an unstructured Q4 2025 attempt; loosened to individual per-component releases through Q2–Q3 2026 once slice-batching itself became the bottleneck — both tracked in design-system-internal#255)
- **Decision makers:** Chibuzor Nwemambu, EDS Core Team
- **Scope:** Mobile

## Context

[ADR-0019](./0019-adopt-only-the-component-library-from-mad.md) brought the whole `mad-components` tree in as a starting point. [ADR-0020](./0020-mobile-component-scope-exclusions-and-renames.md) and [ADR-0021](./0021-align-mobile-apis-with-eds-2-next.md) decide what the target set of components and APIs looks like. Neither says anything about the order to build in, or when a consumer can rely on the result — which is what this ADR covers.

In Q4 2025, the mobile library's OKR was to move onto the new design foundations (colour, spacing, typography) coming from EDS's own token and `next/` work. That attempt was made without a structured plan and progress stalled. Q1 2026 introduced ordered vertical slices as a deliberate response — the same structuring principle EDS Core already uses for its own `next/` migration — plus a PWA proof-of-concept that concluded React Native still had no substitute for these components on mobile. The original decision batched components into four dependency-ordered slices, published each slice as one beta release once every component in it was done, and planned one stable release only once all four slices had shipped and been validated.

That batching ran into a real problem: component designs inside a slice don't all land at the same pace. Treating slice membership as a hard release gate meant a component that was actually ready still waited on its slower slice-mates before a consumer could get it, and work on it stalled rather than moving to a different, ready component in another group. As of this ADR, `packages/eds-mobile-components` shows exactly that unevenness — Slice 2 has shipped `EDSProvider`, `TextField`, `TextArea`, `Link`, `Search` and `Badge`, but `Autocomplete`, `Select` and `Menu` remain unmigrated and `Skeleton` hasn't been started at all; Slice 3 has already shipped `Divider` despite being nominally "not started"; Slice 4 has already shipped `Icon`. The decision below is the response to that: keep the dependency reasoning as a priority signal, drop the hard batching.

## Decision Drivers

- Components have real dependencies on each other — `Card`, `Dialog` and other layout components compose the core controls — so build priority should still lean toward finishing what other components depend on first. This part of the original reasoning holds.
- Design readiness doesn't move at a uniform pace across components that happen to share a dependency group. Treating group membership as a hard sequencing gate stalls a ready component behind a slower design in the same group, for no reason connected to the dependency itself.
- Consuming teams want access to a component the moment it's genuinely ready, not whenever however many other components happen to be batched alongside it.
- A single stable release still has to mean something. Loosening the release cadence must not loosen the bar for what counts as stable.

## Options Considered

### Option 1: Migrate the whole library in one release

Rebuild all in-scope components in a single effort and cut one release when it's done.

**Pros:**

- One migration effort, one version bump, no intermediate "half migrated" state to reason about

**Cons:**

- This was already tried, in effect, in Q4 2025 without a structuring plan, and it stalled
- Consumers see zero visible mobile progress for the entire duration of the effort
- Any problem found late affects all components at once instead of a contained group

### Option 2: Ordered vertical slices, each batch-published as one beta release, one stable release once all slices are complete (originally adopted; superseded below)

Group components into slices ordered by dependency and priority. Publish each slice as a single beta release once every component in it is done. Cut one stable release only once every slice has shipped and been validated.

**Pros:**

- Slices are ordered so that components other components depend on ship and stabilize before the components that compose them
- A slice-level beta release gives consuming teams a clearly labeled milestone to test against
- One deliberate stable cutover means "stable" is a real claim, backed by validation, rather than a label applied to whatever happened to be finished at some cutoff

**Cons:**

- **This is what actually happened**: batching a whole slice behind its slowest component's design readiness stalled components that were themselves ready, with no way to work around it without breaking the batching rule
- Multiple slices still mean multiple opportunities for the API to keep moving before the final stable release, so early adopters tolerate churn across more than one release
- Consumers who only track the `latest` npm tag see nothing from a slice until the eventual stable cut

### Option 3: Ship each component independently the moment it's ready, with no dependency ordering and no beta gate

Release every component to `latest` the moment it's individually done, with no grouping, priority, or pre-stable staging.

**Pros:**

- Fastest possible per-component availability, no batching delay

**Cons:**

- Drops the dependency reasoning entirely, so there's no signal steering effort toward the components others are waiting on
- Shipping straight to `latest` with no beta signal presents still-maturing components as stable, repeating the version-number-versus-maturity mismatch [ADR-0019](./0019-adopt-only-the-component-library-from-mad.md) already flags as a cost of the fork
- No natural point to validate the library as a whole before calling it done

### Option 4: Loose dependency-priority order, individual per-component beta releases, one stable cutover once everything ships (chosen)

Keep the same dependency-ordered priority groups as Option 2, but treat group membership as a planning signal rather than a release gate: each component ships to beta on its own as soon as it's ready, and work moves to a different ready component (in any group) when one is blocked, rather than stalling. The single validated stable cutover from Option 2 is unchanged.

**Pros:**

- Preserves the dependency-ordering rationale — priority still generally favours what other components depend on — without letting one slow design block an unrelated, ready component
- A component's consumers get it the moment it's actually ready, instead of waiting on group-mates, which is exactly the friction Option 2 hit in practice
- The stable-release bar stays exactly as strict as under Option 2 — nothing reaches stable until every planned component is done and validated

**Cons:**

- Without a slice-level release, there's no single clearly labeled checkpoint for consumers to gauge overall progress — progress is now a rolling list of individual beta releases
- Priority becomes a judgment call made per component rather than a fixed schedule, so predicting exactly what ships next is harder for anyone outside the team doing the work
- Loosening the order makes it easier to drift away from the dependency reasoning entirely if priority isn't revisited periodically — deprioritizing a blocked component is meant to be an exception, not the norm

## Decision

**Adopt Option 4.** This supersedes the batching half of Option 2 — the original Q1 2026 decision — while keeping its dependency-ordering intent and its stable-release bar unchanged.

Components are grouped by rough dependency priority into four groups: core controls that other components compose; form and basic UI elements built from those controls; layout and feedback components that arrange or wrap other components; and data and navigation components. Exact group membership isn't enumerated here — it shifts as component scope decisions land (see [ADR-0020](./0020-mobile-component-scope-exclusions-and-renames.md), [ADR-0021](./0021-align-mobile-apis-with-eds-2-next.md)), and pinning specific component names to a group in this ADR would need updating every time scope moves, defeating the point of dropping the hard batching in the first place.

Priority order is a guideline, not a release gate. If a component's design isn't ready, or a blocking issue surfaces, work moves to another ready component — including one in a different group — rather than stalling on the blocked one. Each component is released individually as beta the moment it's ready; there is no batched, group-level beta release. A single stable release is still cut only once every component across all groups is complete and validated by consuming teams.

### Consequences

- Good: a component that's ready, ships to beta immediately instead of waiting on slower group-mates; this is exactly the friction that motivated the change.
- Good: dependency-informed priority is preserved as guidance, so build effort still generally lands on foundational components first, without a hard gate that stalls the whole group on one blocked design.
- Good: the stable-release bar is unchanged; one validated release, once every component is complete, same as originally decided.
- Bad: the beta-publishing mechanics this decision assumes are not wired up yet as of this ADR. `.github/release-please-config.json` has no `prerelease`/`versioning` block for `packages/eds-mobile-components`, and `npm view @equinor/eds-mobile-components dist-tags` shows only `latest` (currently `0.3.2`, no beta tag published). Today's releases are ordinary semver bumps on `latest` — wiring up a dedicated beta line is follow-on work this ADR does not itself complete.
- Bad: without a slice-level release, there's no single visible checkpoint for consumers to gauge overall progress — it's now a rolling list of individual component releases rather than four clearly labeled milestones.
- Bad: a problem discovered in a later component can still require reopening an earlier component's already-public beta shape, since nothing is locked until the final stable cut.

### Confirmation

- A new mobile component is assigned a rough priority group based on dependency (does it compose other not-yet-built components, or is it composed by them) before implementation starts, but starting a different, ready component out of group order when one is blocked is expected, not an exception requiring sign-off.
- When the beta-publishing line for `eds-mobile-components` is wired into release-please, it uses a dedicated dist-tag rather than `latest` — mirroring the approach [ADR-0012](./0012-pinned-prerelease-versioning-for-beta-lines.md) already established for `eds-core-react`'s `/next` line and for `eds-tokens`.
- The stable release does not ship until every planned component, across all priority groups, is complete and validated by consuming teams, and it ships with a migration guide.

## Related

- Source discussion: [design-system-internal#255](https://github.com/equinor/design-system-internal/discussions/255)
- [ADR-0012](./0012-pinned-prerelease-versioning-for-beta-lines.md) — the version-string mechanics for beta lines; distinct from the priority-and-release-cadence policy this ADR decides
- [ADR-0019](./0019-adopt-only-the-component-library-from-mad.md) — the component tree this migration works through
- [ADR-0020](./0020-mobile-component-scope-exclusions-and-renames.md) and [ADR-0021](./0021-align-mobile-apis-with-eds-2-next.md) — what each component migrates toward
- Tracking issue for this ADR batch: [#5515](https://github.com/equinor/design-system/issues/5515)
