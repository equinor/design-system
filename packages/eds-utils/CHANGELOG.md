# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1](https://github.com/equinor/design-system/compare/eds-utils@1.0.0...eds-utils@v1.0.1) (2025-10-14)


### 🐛 Fixed

* **eds-core-react, eds-utils:** 🐛Table - Fix Firefox table header wrapping issue ([#3957](https://github.com/equinor/design-system/issues/3957)) ([a973b81](https://github.com/equinor/design-system/commit/a973b819fe36fd83870cbacccc4e102274a5a05b))
* icon id for next.js ([#3706](https://github.com/equinor/design-system/issues/3706)) ([7e923a1](https://github.com/equinor/design-system/commit/7e923a11ca27172692ffe50e0471454a322ba3e7))


### 🔧 Chores

* :arrow_up: Upgrade dependencies ([#3795](https://github.com/equinor/design-system/issues/3795)) ([8b5b025](https://github.com/equinor/design-system/commit/8b5b02531eb11949bb85dba719849ed3801ae220))
* ⬆️ Upgrade dependencies ([#3824](https://github.com/equinor/design-system/issues/3824)) ([3519425](https://github.com/equinor/design-system/commit/35194255d59abbc12b66d2d29bd3446792570ab8))
* ⬆️ Upgrade dependencies ([#3881](https://github.com/equinor/design-system/issues/3881)) ([23479f7](https://github.com/equinor/design-system/commit/23479f7c2eabfdc3bf12243b7904545277595431))
* ⬆️ Upgrade dependencies in all packages ([#3933](https://github.com/equinor/design-system/issues/3933)) ([e67ed39](https://github.com/equinor/design-system/commit/e67ed398d3bc40004366eeff44dda8051691b2dd))
* 🔖 Release eds-core-react, eds-data-grid-react, eds-lab-react, eds-tokens, eds-utils ([#3982](https://github.com/equinor/design-system/issues/3982)) ([f250771](https://github.com/equinor/design-system/commit/f2507710d68e926edf0b2a5164ce896984cb2e20))
* 🔥 Remove individual package lockfiles ([#3930](https://github.com/equinor/design-system/issues/3930)) ([f813224](https://github.com/equinor/design-system/commit/f8132240a2c20ad54db54c2c38e53731852f8c7a))
* React 19 upgrade ([#4007](https://github.com/equinor/design-system/issues/4007)) ([645e090](https://github.com/equinor/design-system/commit/645e090d66eb7c1d864c8108497d19003e0cf24e))
* update dependencies ([#3783](https://github.com/equinor/design-system/issues/3783)) ([8fb9f2d](https://github.com/equinor/design-system/commit/8fb9f2d9f7c5ea420e67d34e981d9ed7cf694c50))
* upgrade pnpm to v10 and node to v22 ([#3964](https://github.com/equinor/design-system/issues/3964)) ([d8b9848](https://github.com/equinor/design-system/commit/d8b98482913c76dff41f12ff4a1ee2425dcd9b6c))


### 📦 Build System

* **deps:** bump the npm_and_yarn group across 1 directory with 3 updates ([#3768](https://github.com/equinor/design-system/issues/3768)) ([61e4565](https://github.com/equinor/design-system/commit/61e4565dcf79e6ed5be9f0b0ac7d584bab61a52c))

## [0.9.0] - 2025-09-11

### Added

- ✨ Added a Firefox detection util by @pomfrida in https://github.com/equinor/design-system/pull/3957

### Changed

- 🔥 Remove individual package lockfiles by @pomfrida in https://github.com/equinor/design-system/pull/3930
- ⬆️ Upgrade dependencies in all packages by @pomfrida in https://github.com/equinor/design-system/pull/3933
- ⬆️ Upgrade pnpm to v10 and node to v22 by @torleifhalseth in https://github.com/equinor/design-system/pull/3964

## [0.8.8] - 2025-08-27

### Changed

- ⬆️ Upgrade dependencies by @pomfrida in https://github.com/equinor/design-system/pull/3881

## [0.8.7] - 2025-04-11

### Changed

- `useHideBodyScroll`: Refactored useHideBodyScroll hook for improved reliability in https://github.com/equinor/design-system/pull/3749

## [0.8.6] - 2025-01-17

### Changed

- `useId`: changed from randomly generated number to deterministic counter in order to support server side rendering by @sebastianvitterso in https://github.com/equinor/design-system/pull/3706

## [0.8.5] - 2024-05-14

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
