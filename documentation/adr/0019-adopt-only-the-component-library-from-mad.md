# Adopt only the component library from the MAD monorepo

- **Status:** Accepted (recorded retrospectively 2026-09-11)
- **Date:** 2025-06 (the imported component tree first appears in `equinor/design-system-mobile` on 2025-06-27)
- **Decision makers:** Chibuzor Nwemambu, EDS Core Team
- **Scope:** Mobile

## Context

EDS had no React Native library of its own. The one that existed at Equinor was maintained by the Mobile App Delivery (MAD) team inside `equinor/mad`, a Yarn 4 and Turborepo monorepo holding twelve packages and two applications. Only one of those packages was a design system.

| Package / app                             | What it is                                   | Taken by EDS |
| ----------------------------------------- | -------------------------------------------- | ------------ |
| `@equinor/mad-components`                 | React Native implementation of EDS           | Yes          |
| `@equinor/mad-core`                       | MAD's own application core                   | No           |
| `@equinor/mad-auth`                       | Wrapper around `react-native-msal`           | No           |
| `@equinor/mad-navigation`                 | Wrapper around React Navigation              | No           |
| `@equinor/mad-insights`                   | Application Insights telemetry               | No           |
| `@equinor/mad-toast`                      | Wrapper around `react-native-toast-message`  | No           |
| `@equinor/mad-dfw`                        | Components for the Digital Field Worker apps | No           |
| `@equinor/react-native-skia-draw`         | Drawing library built on Skia                | No           |
| `@equinor/react-native-mad-tag-ocr`       | Tag scanning                                 | No           |
| `@equinor/mad-maintenance-api-ts-wrapper` | Typed client for the Maintenance API         | No           |
| `@equinor/eslint-config-mad`              | Shared ESLint config                         | No           |
| `@equinor/mad-tsconfig`                   | Shared TypeScript config                     | No           |
| `@equinor/mad-chronicles`                 | A MAD product application                    | No           |
| `@equinor/mad-platform-docs`              | MAD's documentation site                     | No           |

Four facts about `@equinor/mad-components`, then on `0.20.0`, framed the decision:

1. **It had no runtime dependency on any other MAD package.** Its only internal references were `workspace:*` devDependencies on `@equinor/eslint-config-mad` and `@equinor/mad-tsconfig`, both replaceable. Its production dependencies were two third-party packages, `@floating-ui/react-native` and `react-error-boundary`.
2. **The dependency graph ran one way.** Six MAD packages (`auth`, `core`, `dfw`, `toast`, `skia-draw`, `mad-tag-ocr`) and the Chronicles app depended on `mad-components`. Nothing in `mad-components` depended on them.
3. **It did not consume EDS tokens as a package, though it followed EDS values by hand.** It carried its own token layer in `src/styling`, built from `masterToken.ts`, `colors.ts`, `values.ts` and a `createTokenProxy.ts`. `colors.ts` opens with a comment crediting the EDS colour Figma page and hardcodes the same hex values (for example `#007079` for interactive primary), so the palette was aligned with EDS by manual copy rather than left to drift. But none of it was derived from the token pipeline: the values were maintained by hand, could fall out of sync whenever EDS's palette changed, and its source contains no reference to `@equinor/eds-tokens` at all.
4. **It was pinned to an older platform.** Peer requirements were `react@~18.3.1` and `react-native@~0.76.5`, moving on MAD's release cadence through Changesets.

So the question was not whether the code was worth having. It was how much of a neighbouring team's monorepo EDS should take on in order to get the one package that belonged to it.

## Decision Drivers

- EDS should own the design system surface and nothing beyond it. Authentication, telemetry, navigation, drawing and OCR are application platform concerns with no design system mandate behind them.
- The relationship with MAD should end up as publisher and consumer, not shared ownership of the same tree.
- Whatever EDS takes has to be maintainable by the EDS team, in this repository's toolchain (pnpm, release-please, no Turborepo), without inheriting MAD's release cadence.
- The mobile library must be free to move onto `@equinor/eds-tokens` and onto current React and React Native versions on EDS's own schedule.
- Existing MAD applications must keep working. Nothing here is allowed to strand a shipping app.
- Migration cost matters, but rewriting a working 28-component library from nothing costs more than adapting it.

## Options Considered

### Option 1: Adopt the whole MAD monorepo

Move all twelve packages and both applications under EDS ownership.

**Pros:**

- One move, no split ownership, no ambiguity about where mobile code lives
- The consumers of `mad-components` stay in the same tree as the library, so breaking changes surface immediately

**Cons:**

- EDS would own authentication, telemetry, navigation, OCR and a product application, none of which it has a mandate or the capacity to maintain
- Chronicles is a MAD product. Moving it would hand EDS responsibility for a shipping application belonging to another team
- Drags in Yarn 4, Turborepo and Changesets against this repository's pnpm and release-please setup
- The domain packages would compete for EDS time with the design system itself

### Option 2: Adopt only `packages/components`

Take the design system implementation, leave everything else with MAD, and republish under an EDS name.

**Pros:**

- The scope of what EDS owns matches what EDS is for
- The seam already exists. `mad-components` has no internal runtime dependencies, so it lifts out without pulling the graph with it
- MAD becomes a consumer of a published package, which is the relationship EDS has with every other team
- Full freedom over tokens, platform versions, release cadence and toolchain from day one
- Keeps a working component library rather than starting over

**Cons:**

- Creates a fork. `@equinor/mad-components` stays published and can drift, and there is no merge path back in either direction
- Applications built on `mad-core` and its siblings can end up with both libraries in one tree until MAD migrates
- EDS inherits MAD-era internals, including the hand-maintained token layer, and has to migrate them component by component
- Version numbering restarts, so a consumer who knew `mad-components@0.20` meets `eds-mobile-components@0.x` and has to be told it is not a downgrade

### Option 3: Leave the library in MAD and co-maintain it

Keep `mad-components` where it is and have EDS contribute to it.

**Pros:**

- No fork, no duplication, no migration
- MAD's consumers keep working with no change at all

**Cons:**

- EDS would have no control over releases, versioning or platform pins for a library carrying its name
- Design system changes would queue behind MAD's product priorities
- Moving onto `@equinor/eds-tokens` would require agreement from a team with no stake in the token pipeline
- The design system would be published from a repository whose README describes a different team's platform, which is the wrong signal to consumers

### Option 4: Rebuild the React Native library from scratch

Take nothing, and implement mobile components fresh against the current EDS design and token system.

**Pros:**

- No inherited internals and no fork
- Every component would be tokens-driven from its first commit

**Cons:**

- Discards a working library of 28 components, including non-trivial work on positioning, portals, dialogs and offline behaviour
- Leaves MAD applications with no EDS-owned path forward for a long time
- The eventual result would look much like the MAD code anyway, since both implement the same design

## Decision

**Adopt Option 2. EDS takes `packages/components` out of `equinor/mad` and nothing else.**

The library was imported into `equinor/design-system-mobile` on 2025-06-27 and republished as `@equinor/eds-mobile-components`, starting a new version line rather than continuing from `0.20.0`. It later moved into this monorepo at `packages/eds-mobile-components` (see [#5138](https://github.com/equinor/design-system/issues/5138)). MAD's remaining packages stay with MAD, and `@equinor/mad-components` is left in place so that nothing shipping breaks.

The decisive point is scope, not code quality. `mad-components` was the only package in that monorepo whose subject is the design system, and it happened to be the only one that could be lifted cleanly, because nothing inside it depended on the rest. Taking more would have made EDS the owner of another team's application platform. Taking less would have left the design system published from a repository EDS does not control.

### What crossed the boundary

| Kept                                                                                                                                                          | Left behind                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| All 28 components (including `EDSProvider`, `Portal` and `ErrorBoundary`) plus the shared `_internal` folder (`ScrimProvider`, `RootModal`, `PopInContainer`) | Every other MAD package, including the shared ESLint and TypeScript configs |
| `src/styling` (`EDSStyleSheet`, animations, the token layer), `hooks`, `utils`                                                                                | Turborepo, Yarn 4 and Changesets, replaced by pnpm and release-please       |
| Fonts and assets needed by `useEDS`                                                                                                                           | MAD's documentation site and the Chronicles application                     |
| The `tsup` build and the general shape of the public API                                                                                                      | The `@equinor/mad-*` package names and the `0.20.x` version line            |

The inherited token layer is treated as debt to be paid down, not as the target state. Components are being migrated onto `@equinor/eds-tokens` one at a time, and the package now declares that dependency directly.

### Consequences

- Good: the boundary of what EDS owns is now legible. The mobile package implements the design system, and nothing in it speaks to authentication, telemetry or navigation.
- Good: MAD is a consumer like any other team, so EDS can release on its own cadence and MAD can upgrade when it suits them.
- Good: the library moved onto current platform versions quickly once it was no longer pinned by MAD's release train. It now targets `react@^19.2.0` and `react-native@^0.83.6`, and it depends on `@equinor/eds-tokens` directly.
- Good: components MAD never had, including Badge, Divider, Link and TextArea, could be added without negotiating scope with another team.
- Bad: two implementations of the same design are published at once, and both are alive. `@equinor/mad-components` was at `0.20.0` when the split happened and is at `0.25.5` as of 2026-08-25, so it has kept shipping releases since. An application depending on both `mad-core` and `@equinor/eds-mobile-components` will resolve two component libraries into one bundle for as long as MAD's own packages keep depending on `mad-components`. This is not meant to be indefinite: the plan is for `eds-mobile-components` to reach a validated stable release, tested by the consuming teams, at which point MAD's applications switch over and `mad-components` is retired. The release strategy that gets there is covered in its own ADR, tracked in [#5515](https://github.com/equinor/design-system/issues/5515).
- Bad: there is no shared fix path. A bug fixed in one library has to be ported by hand to the other, if it is ported at all, and the two have been diverging for over a year.
- Bad: capabilities that lived in MAD's other packages have no EDS home yet. Toast is the clearest case: `@equinor/mad-toast` provided it, EDS did not take that package, and a Toast component is still planned rather than shipped.
- Bad: EDS inherited internals it did not design, and every component migration carries the cost of untangling the MAD-era token layer before the design work can start.
- Bad: the version reset needs explaining, and gets worse over time. `eds-mobile-components@0.3.x` is the current library as of 2026-09-11, and `mad-components` is on `0.25.5`, so the numbers point a consumer at the wrong one.

### Confirmation

- `packages/eds-mobile-components/package.json` must not declare any `@equinor/mad-*` dependency. Reintroducing one would undo the boundary this ADR draws.
- Reviews reject new dependencies on MAD packages in mobile code. A capability that only exists in a MAD package is a candidate for an EDS component, not a candidate for a dependency.
- Anything outside the design system surface, meaning authentication, telemetry, navigation, device APIs and product-specific components, does not belong in `packages/eds-mobile-components`.

## Related

- Follow-on migration into this monorepo: [equinor/design-system#5138](https://github.com/equinor/design-system/issues/5138)
- Source repository: [equinor/mad](https://github.com/equinor/mad), package `packages/components`
- Intermediate repository: `equinor/design-system-mobile`, archived with a redirect README when [#5394](https://github.com/equinor/design-system/issues/5394) closed on 2026-09-09
- [ADR-0011](./0011-adopt-tokens-studio-platform-pipeline.md) — the token pipeline the mobile library is migrating onto
- Release strategy for the stable cutover: tracked in [#5515](https://github.com/equinor/design-system/issues/5515)
