# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2022-10-06

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
