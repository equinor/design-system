# Pin beta release lines to a fixed 3.0.0-beta.N series with release-please prerelease versioning

- **Status:** Proposed
- **Date:** 2026-07-20
- **Decision makers:** Frida Erdal, EDS Core Team

## Context

Two packages are in a beta phase ahead of a `3.0.0` major: `eds-core-react-next` (the `/next` EDS 2.0 components) and `@equinor/eds-tokens` (the Tokens Studio rework, [ADR-0011](./0011-adopt-tokens-studio-platform-pipeline.md)).

The `/next` beta channel originally rolled its version base on every `feat(next)`: `2.6.0-beta.0 → 2.7.0-beta.1 → 2.8.0-beta.1`. That presented the betas as previews of stable 2.x minors, when EDS 2.0 actually graduates as `3.0.0` ([#5141](https://github.com/equinor/design-system/issues/5141)). The betas needed to be a fixed `3.0.0-beta.N` series where only the counter climbs, regardless of commit type.

The same question arose for `eds-tokens`: during the Tokens Studio transition there is no stable release channel — consumers on `latest` stay on the last stable `2.3.1` — and every pipeline or code change should cut the next `3.0.0-beta.N`.

An extra constraint applies to `eds-tokens`: four packages (`eds-core-react`, `eds-utils`, `eds-lab-react`, `eds-data-grid-react`) depend on it via `workspace:^`, and `pnpm publish` rewrites that to the version in eds-tokens' `package.json`. If `package.json` carried the beta version, stable releases of those packages would depend on beta tokens.

## Decision Drivers

- The version base must never move during beta — every commit type (`fix`, `feat`, `feat!`) bumps only the beta counter
- Breaking changes must still surface as a "⚠ BREAKING CHANGES" changelog section for beta consumers
- Stable releases of dependent packages must keep depending on stable tokens (`workspace:^` rewrite)
- Graduation to `3.0.0` must be a config flip, not re-plumbing
- Prefer configuration release-please owns over custom version automation in workflows

## Options Considered

### Option 1: Custom version automation in the publish workflows

What [#5141](https://github.com/equinor/design-system/issues/5141) originally prescribed, on the premise that release-please cannot pin a prerelease base: compute `3.0.0-beta.N` in `publish_core_react.yaml` at publish time.

**Pros:**

- Full control of the version string

**Cons:**

- The premise is outdated — verified against release-please v17 source (`src/versioning-strategies/prerelease.ts`, bundled as 17.6.0 in `release-please-action@v5`), the `prerelease` strategy pins the base natively
- Version would live in workflow logic, drifting from the manifest/`version.txt` release-please owns
- Changelogs and GitHub releases would not match what is published

### Option 2: Separate beta component/package per line

A dedicated release-please component (or package) per beta line with independent versioning, discarded at graduation.

**Pros:**

- Beta and stable lines cannot interfere by construction

**Cons:**

- Breaks tag and changelog continuity — history splits across components
- More moving parts to dismantle at graduation

### Option 3: release-please `versioning: "prerelease"` + `prerelease: true` (chosen)

Configure the existing components with release-please's prerelease versioning strategy, base seeded at `3.0.0-beta.N`.

**Pros:**

- release-please owns the version end to end (manifest, `version.txt`, changelog, tags)
- Verified by running release-please's actual versioning code: `fix`, `feat` and `feat!` all produce `beta.N+1` while minor and patch are 0
- Graduation is flipping `"prerelease": false` (or a `Release-As: 3.0.0` footer)

**Cons:**

- Subtle: `prerelease-type: beta` **alone** does not pin — without `prerelease: true` the default strategy bumps the base and carries the suffix (the exact #5141 drift), and a `fix` on `3.0.0-beta.0` would release **stable `3.0.0`**
- The pin only holds while minor and patch are both 0

## Decision

**Use release-please's `versioning: "prerelease"` + `prerelease: true` + `prerelease-type: "beta"` on both beta lines**, with the base seeded at `3.0.0-beta.N` in the manifest. Every commit type bumps only the beta counter; `feat!`/`fix!` additionally emit a "⚠ BREAKING CHANGES" changelog section. The former "no `!` in beta commits" rule is inverted: `!` is now safe (the base cannot roll) and preferred, because it surfaces breaking changes to beta consumers.

For **`eds-tokens`**, the entry additionally uses `release-type: simple`, which tracks the version in `version.txt` instead of `package.json`. `package.json` stays at the last stable (`2.3.1`) so `pnpm publish`'s `workspace:^` rewrite keeps stable releases of dependent packages on stable tokens; the publish workflow applies the `version.txt` beta version at publish time. The existing component, tags, and CHANGELOG continue seamlessly — no separate `-next` component.

At graduation, flip `"prerelease": false` and switch the npm dist-tag from `beta` back to `latest`; the same configuration then emits stable `3.0.0`.

### Consequences

- Good, because betas present honestly as `3.0.0-beta.N` — previews of the actual next major, not of fictional 2.x minors
- Good, because breaking changes in beta are encouraged to carry `!` and get a changelog section, instead of being banned
- Good, because both beta lines share one validated configuration pattern, and graduation is a config flip
- Good, because stable releases of `workspace:^` dependents keep resolving to stable tokens throughout the transition
- Bad, because an urgent stable 2.x tokens patch during the transition is a manual publish from the `eds-tokens@v2.3.1` tag (accepted — no stable tokens work is planned; exercised once for the docs-only `2.3.2`)
- Bad, because the eds-tokens version lives in two places with different meanings (`version.txt` = beta line, `package.json` = stable line) — a known sharp edge for anyone touching the publish flow
- Bad, because the pin silently stops working if minor/patch ever leave 0 (e.g. a stray `Release-As` footer) — the base would start rolling again

### Confirmation

Validated in production: the 2026-07-20 release moved `eds-tokens` `3.0.0-beta.0 → 3.0.0-beta.1` from a `feat` without rolling the base. The next `/next` merge to main must produce a release PR with `eds-core-react-next: 3.0.0-beta.2`. `documentation/how-to/BETA_RELEASE_GUIDE.md` and `.github/release-please-config.md` document the day-to-day rules.

## Related

- [ADR-0011](./0011-adopt-tokens-studio-platform-pipeline.md) — the Tokens Studio pipeline whose releases feed the eds-tokens beta line
- [`documentation/how-to/BETA_RELEASE_GUIDE.md`](../how-to/BETA_RELEASE_GUIDE.md) — beta commit conventions and channel overview
- [`.github/release-please-config.md`](../../.github/release-please-config.md) — config field documentation
- Issues [#5141](https://github.com/equinor/design-system/issues/5141), [#5120](https://github.com/equinor/design-system/issues/5120)
- PRs [#5180](https://github.com/equinor/design-system/pull/5180) (eds-tokens), [#5190](https://github.com/equinor/design-system/pull/5190) (eds-core-react-next)
