# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.5] - 2024-02-09

### Changed

- ⬆️ Updated prod dependencies by @oddvernes in https://github.com/equinor/design-system/pull/3425

## [0.8.4] - 2024-02-09

### Changed

- 🔧 Updated `babel` browserlist from "defaults" to "last 2 versions of chrome/edge/firefox/safari". This reduces build size significantly and removes all the babel runtime helpers. by @oddvernes in https://github.com/equinor/design-system/pull/3219

## [0.8.3] - 2023-10-20

### Fixed

- ⬆️ Update `@babel/runtime` to fix a vulnerability in its dependency `@babel/traverse` (https://nvd.nist.gov/vuln/detail/CVE-2023-45133) by @oddvernes in https://github.com/equinor/design-system/pull/3115

## [0.8.2] - 2023-09-26

### Added

- ⬆️ Support `Styled-components` v6 by @oddvernes in https://github.com/equinor/design-system/pull/3050

## [0.8.1] - 2023-07-14

### Added

- ✨ `useIsInDialog`: new hook to detect if an element is inside a `dialog` @oddvernes in https://github.com/equinor/design-system/pull/2970

## [0.8.0] - 2023-07-10

### Changed

- 💄`useHideBodyScroll`: added scrollbar detection and handling to prevent layout shift by @oddvernes in https://github.com/equinor/design-system/pull/2950
- ⬆️Updated dependencies @oddvernes in https://github.com/equinor/design-system/pull/2925
- ⬆️Updated Rollup to v3.x @oddvernes in https://github.com/equinor/design-system/pull/2908

### Removed

- 🔥Removed deprecated usePopper hook @oddvernes in https://github.com/equinor/design-system/pull/2955

## [0.7.0] - 2022-11-04

### Added

- ✨`useIsomorphicLayoutEffect`: new hook for better ssr support by @oddvernes in https://github.com/equinor/design-system/pull/2631

## [0.6.0] - 2022-10-19

### Added

- ✨ `typographyMixin` by @mimarz in https://github.com/equinor/design-system/pull/2395

## [0.5.0] - 2022-10-12

### Changed

- 🔧 Conform packages build, test & linting by @mimarz in https://github.com/equinor/design-system/pull/2555

## [0.4.0] - 2022-10-05

### Changed

- ⬆️ Upgrade to React 18 by @mimarz in https://github.com/equinor/design-system/pull/2510

## [0.3.0] - 2022-09-08

### Added

- ✨ Added `mergeRefs` utility function, this replaces `useCombinedRefs` and works the same way, except it doesn't internally memoize the ref, by @oddvernes in https://github.com/equinor/design-system/pull/2381
- ✨ Added OverridableComponent type by @oddvernes in https://github.com/equinor/design-system/pull/2410

### Removed

- 🗑️ `useCombinedRefs` was removed/renamed to `mergeRefs` by @oddvernes in https://github.com/equinor/design-system/pull/2381

### Deprecated

- 🗑️ Marked `usePopper` as Deprecated by @oddvernes in https://github.com/equinor/design-system/pull/2463

## [0.2.3] - 2022-06-24

### Changed

- ⬆️ Upgrade popperjs dependencies by @mimarz in https://github.com/equinor/design-system/pull/2347

## [0.2.2] - 2022-06-08

### Changed

- Upgraded dev dependencies & fixed missing types([#2183](https://github.com/equinor/design-system/pull/2183))

## [0.2.1] - 2022-04-06

### Changed

- Support for passed `null` element type on `useOutsideClick` hook ([#2068](https://github.com/equinor/design-system/issues/2068))

## [0.2.0] - 2022-03-18

### Changed

- Changed `usePopper` params to object instead

### Fixed

- Nullable anchorEl param for `useOutsideClick`

## [0.1.0] - 2022-01-05

### Changed

- First release of eds-utils
