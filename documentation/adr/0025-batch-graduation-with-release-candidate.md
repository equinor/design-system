# Graduate EDS 2.0 as one batch, through a release candidate, to stable 3.0.0

- **Status:** Accepted
- **Date:** 2026-09-17
- **Decision makers:** EDS Core Team (dev/design sync, 17 September 2026)
- **Scope:** Web, Tokens

## Context

EDS 2.0 components are built under `src/components/next/` and published as `@equinor/eds-core-react@beta` on a pinned `3.0.0-beta.N` series. The redefined tokens ship the same way as `@equinor/eds-tokens@beta`. [ADR-0012](./0012-pinned-prerelease-versioning-for-beta-lines.md) records how that version line works. It does not record how the beta ends.

The graduation model has been in use for a while, but it is written down only in [`BETA_RELEASE_GUIDE.md`](../how-to/BETA_RELEASE_GUIDE.md) and the closed [#5141](https://github.com/equinor/design-system/issues/5141). A how-to explains the mechanics to someone performing a release. It does not say why the model was chosen, which is what anyone questioning it later needs.

The dev/design sync on 17 September 2026 also added a step that is recorded nowhere: a release candidate between beta and stable. That contradicts ADR-0012, which describes graduation as a single flip from beta straight to `3.0.0`.

Two things from history shape the decision:

- **The 2.x line shipped piecemeal.** A major went out with part of the component set and the rest arrived over minors. A consumer who reverted from a later minor to the major lost components they had started using, which is not what a downgrade within one major is supposed to do.
- **EDS 2.0 skipped alpha.** Beta is the only prerelease phase so far, so there is no step that reads as "this is what will ship, test it properly". A beta that is the last step before stable invites more confidence than a beta should carry.

## Decision Drivers

- The new components replace the old ones, so consumers should migrate once rather than once per component
- A version number must mean the same set of components in every release of a major, including after a downgrade
- The code published as stable must have been tested by consumers in the exact shape it ships in, including import paths and the removal of EDS 1 components
- Consumers need a phase they can recognise as "test this with intent", distinct from the beta they have been told to expect breaking changes in
- Components and tokens are designed and released as one system
- Reuse the release-please configuration from ADR-0012 rather than add custom version automation

## Options Considered

### Option 1: Graduate each component on its own

Move a component out of `/next` into the stable export once it is ready, replacing its EDS 1 counterpart.

**Pros:**

- Consumers get each finished component as soon as it is ready
- Visible progress throughout

**Cons:**

- Replacing an EDS 1 component is a breaking change, so every graduation is a major. That is a long run of majors and a lot of noise for consumers
- Consumers migrate repeatedly, and live with a mix of EDS 1 and EDS 2.0 components in between
- Repeats the 2.x problem: which components a version contains depends on which minor you are on

### Option 2: Graduate as one batch, straight from beta to stable

All planned components graduate together in one major. The last beta is followed directly by `3.0.0`. This is what ADR-0012 and `BETA_RELEASE_GUIDE.md` describe today.

**Pros:**

- One migration and one major for consumers
- Simple: one config flip ends the beta

**Cons:**

- The structural change (moving components out of `/next`, deleting EDS 1, rewriting the exports) lands in `3.0.0` itself, so the biggest change in the release is the one nobody tested
- Nothing marks the point where the API stops moving, so consumers cannot tell when testing becomes worthwhile
- The final beta carries the weight of a release candidate without saying so

### Option 3: Graduate as one batch, through a release candidate (chosen)

As option 2, but the beta line is followed by a `3.0.0-rc.N` line before the flip to stable. The RC is code-complete: it already contains the graduated structure.

**Pros:**

- Consumers test exactly what will ship, including the final import paths
- The RC marks the point where the API is frozen and only fixes land, which gives consumers a clear moment to test
- Stable becomes a version flip with no code change

**Cons:**

- Graduation takes longer, and there is less to show along the way
- One more phase to run and communicate

## Decision

**All planned EDS 2.0 components and the redefined tokens graduate together in one major, `3.0.0`, via a release candidate.** The phases are:

1. **Beta** (`3.0.0-beta.N`, today). Components live in `src/components/next/`. Breaking changes are allowed, marked with `!`, and tracked on the breaking changes page in Storybook.
2. **Release candidate** (`3.0.0-rc.N`). Starts when the preconditions below are met. The graduation itself happens here, in one change:
   - components move from `src/components/next/` to `src/components/`
   - the EDS 1 components are removed
   - `src/index.next.ts` is removed and `src/index.ts` exports the EDS 2.0 components

   From this point the API is frozen. Only fixes land on the RC line. A breaking change found during RC means another RC, not a change that slips into stable.

3. **Stable** (`3.0.0`). The last RC is released as stable with no further code change.

This satisfies the drivers as follows. Batching gives one migration and a version number that always means the same set of components. Doing the structural change at RC means consumers test the shape that ships. The RC line gives consumers a phase that reads as "test this with intent", which fills the gap left by skipping alpha and stops the beta being read as the last step.

**Preconditions for starting the RC:**

- Every component in the planned set is built
- Every component is migrated onto the redefined tokens ([#5119](https://github.com/equinor/design-system/issues/5119))

**Tokens go through the same phases.** `@equinor/eds-tokens` moves to `3.0.0-rc.N` at the same time as the components, and to `3.0.0` together with them. An RC of the components resting on beta tokens would not be a candidate for what ships.

**Distribution during RC.** RC versions are published under a new `rc` dist-tag, and the `beta` dist-tag is moved to point at the same version so consumers already on `@beta` are not left on a stale beta. `latest` stays on 2.x until `3.0.0`. The `next` dist-tag is not used, because it is easily confused with the `/next` import path.

**Mechanics.** This builds on the configuration from ADR-0012 and replaces the graduation step described there:

- Entering RC needs a `Release-As: 3.0.0-rc.1` commit footer. Changing `prerelease-type` from `beta` to `rc` is not enough on its own: release-please's `prerelease` strategy increments the last number in the existing prerelease string, so it would produce `beta.N+1`, not `rc.1`. The new type only applies when the current version has no prerelease part (`src/versioning-strategies/prerelease.ts`).
- After that, every commit bumps only the RC counter (`rc.2`, `rc.3`, ...), because the pin from ADR-0012 still holds.
- Stable is `"prerelease": false`, and the publish workflows switch the dist-tag back to `latest`, as ADR-0012 already describes.

### Consequences

- Good, because consumers migrate once, and every release of the 3.x major contains the whole EDS 2.0 set
- Good, because `3.0.0` contains nothing that was not already published and tested as an RC
- Good, because consumers get a clear signal for when to test properly, and the beta no longer has to carry that meaning
- Good, because graduation reuses the release-please setup from ADR-0012, with one footer and one config flip
- Neutral, because 2.x fixes move to a `release/2.x` maintenance branch, cut from `main` just before the RC change. This is true of any graduation model. How long 2.x is supported is decided in [#5505](https://github.com/equinor/design-system/issues/5505)
- Bad, because graduation takes longer, and finished components wait for the rest of the set before they reach stable (accepted)
- Bad, because the RC is one more phase to run and communicate, including a new dist-tag in the publish workflows
- Open, to check when the RC is implemented: `@equinor/eds-core-react` depends on `@equinor/eds-tokens` via `workspace:^`, and ADR-0012 keeps the tokens `package.json` at the last stable 2.x so stable releases resolve to stable tokens. For the RC, the published core-react dependency has to resolve to the tokens RC instead

### Confirmation

- The RC release PR shows `3.0.0-rc.1` for both `eds-core-react-next` and `eds-tokens`, and no `/next` directory remains in `packages/eds-core-react/src/components/`
- The `3.0.0` release has no code diff against the last RC apart from release metadata
- `BETA_RELEASE_GUIDE.md` is updated to describe the RC phase

## Related

- [ADR-0012](./0012-pinned-prerelease-versioning-for-beta-lines.md): the pinned `3.0.0-beta.N` version line. This ADR replaces its graduation step; the pin itself still holds
- [`documentation/how-to/BETA_RELEASE_GUIDE.md`](../how-to/BETA_RELEASE_GUIDE.md): day-to-day beta release mechanics
- [#5504](https://github.com/equinor/design-system/issues/5504): the issue for this ADR
- [#5119](https://github.com/equinor/design-system/issues/5119): component migration onto the redefined tokens, a precondition for the RC
- [#5505](https://github.com/equinor/design-system/issues/5505): the 2.x support window after `3.0.0`, out of scope here
- [#5141](https://github.com/equinor/design-system/issues/5141): pinned prerelease versioning for the beta line
- [#5193](https://github.com/equinor/design-system/issues/5193): deprecating eds-tokens 2.x at graduation
- [#5418](https://github.com/equinor/design-system/pull/5418): adds the RC step to the About EDS 2.0 page in Storybook
