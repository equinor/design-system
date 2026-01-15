# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.11.0](https://github.com/equinor/design-system/compare/eds-lab-react@v0.10.0...eds-lab-react@v0.11.0) (2026-01-15)


### ✨ Added

* **eds-icons:** add new icons from Figma sync ([cc7cec8](https://github.com/equinor/design-system/commit/cc7cec8ae3ef2f615dbb4d7b132fdef8936ddec0))


### 🔧 Chores

* release main ([#4366](https://github.com/equinor/design-system/issues/4366)) ([d31389c](https://github.com/equinor/design-system/commit/d31389cbd96f497b7f96e59821e8dd221945ab62))

## [0.10.0](https://github.com/equinor/design-system/compare/eds-lab-react@v0.9.0...eds-lab-react@v0.10.0) (2025-12-11)

### ✨ Added

- **eds-color-palette-generator:** fix memory leak from uncleaned debounce timeouts on unmount ([#4260](https://github.com/equinor/design-system/issues/4260)) ([b226edb](https://github.com/equinor/design-system/commit/b226edbc087b1f10ef0a2108d927939819fedc0e))

### 🔧 Chores

- release main ([#4254](https://github.com/equinor/design-system/issues/4254)) ([1313fa1](https://github.com/equinor/design-system/commit/1313fa1f2e2e908a8200f6b8f00e158ef88e917b))

## [0.9.0](https://github.com/equinor/design-system/compare/eds-lab-react@v0.8.1...eds-lab-react@v0.9.0) (2025-10-29)

### ✨ Added

- **eds-core-react, eds-utils:** Create base typography component and opinionated heading and paragraph ([b2130c6](https://github.com/equinor/design-system/commit/b2130c6f2be82e63549caacf876f263253292f87)), closes [#4125](https://github.com/equinor/design-system/issues/4125)

### 🐛 Fixed

- Use semver ranges for internal eds dependencies ([#4163](https://github.com/equinor/design-system/issues/4163)) ([7cc8abe](https://github.com/equinor/design-system/commit/7cc8abe64f64f4e5a9081e21e19f71947f354c14))

### 🔧 Chores

- ⬆️ Update dependencies ([#4158](https://github.com/equinor/design-system/issues/4158)) ([344e555](https://github.com/equinor/design-system/commit/344e555ff53ed307026ebb68761281a563c3d3cf))

## [0.8.1](https://github.com/equinor/design-system/compare/eds-lab-react@0.8.0...eds-lab-react@v0.8.1) (2025-10-16)

### 🔧 Chores

- 🔧 Align peer deps across packages ([#4066](https://github.com/equinor/design-system/issues/4066)) ([869afad](https://github.com/equinor/design-system/commit/869afadb4a5a34b2c0f105cd1b834e4c824213aa))

## [0.8.0] - 2025-10-09

**Note:** Due to technical debt and limited active components, we're keeping the lab package at v0.x while evaluating whether to deprecate it entirely. The styled-components implementation has React 19 compatibility issues requiring workarounds we're not comfortable promoting to v1.0.0.

### Changed

- chore: ⬆️ React 19 upgrade by @pomfrida in https://github.com/equinor/design-system/pull/4007

## [0.7.9] - 2025-09-11

### Changed

- 🔥 Remove individual package lockfiles by @pomfrida in https://github.com/equinor/design-system/pull/3930
- ⬆️ Upgrade dependencies in all packages by @pomfrida in https://github.com/equinor/design-system/pull/3933
- ⬆️ Upgrade pnpm to v10 and node to v22 by @torleifhalseth in https://github.com/equinor/design-system/pull/3964
- ⬆️ Storybook v9 upgrade by @pomfrida in https://github.com/equinor/design-system/pull/3976

## [0.7.8] - 2025-08-27

### Changed

- ⬆️ Upgrade dependencies by @pomfrida in https://github.com/equinor/design-system/pull/3881

## [0.7.7] - 2024-05-14

### Changed

- 🗑️ `DatePicker`: We removed import of CSS. You need to require the CSS file from `react-datepicker`. In any event, this component should be considered deprecated in favour of `DatePicker` in `@equinor/eds-core-react`. by @torleifhalseth in https://github.com/equinor/design-system/pull/3346
- ⬆️ Updated prod dependencies by @oddvernes in https://github.com/equinor/design-system/pull/3425

## [0.7.6] - 2024-03-01

### Changed

- ⬆️ Update prod dependencies by @oddvernes in https://github.com/equinor/design-system/pull/3298

### Fixed

- ⬆️ `Datepicker`: Update downshift@8.3.3 to fix focus grabbing on load bug by @oddvernes in https://github.com/equinor/design-system/pull/3336

## [0.7.5] - 2024-02-09

### Changed

- 🔧 Updated `babel` browserlist from "defaults" to "last 2 versions of chrome/edge/firefox/safari". This reduces build size significantly and removes all the babel runtime helpers. by @oddvernes in https://github.com/equinor/design-system/pull/3219

## [0.7.4] - 2023-12-13

### Changed

- ⬆️ Updated `eds-core-react`/`eds-icons` dependencies

## [0.7.3] - 2023-10-20

### Fixed

- ⬆️ Update `@babel/runtime` to fix a vulnerability in its dependency `@babel/traverse` (https://nvd.nist.gov/vuln/detail/CVE-2023-45133) by @oddvernes in https://github.com/equinor/design-system/pull/3115

## [0.7.2] - 2023-09-26

### Added

- ⬆️ Support `Styled-components` v6 by @oddvernes in https://github.com/equinor/design-system/pull/3050

## [0.7.1] - 2023-07-13

### Changed

- ⬆️ Upgrade rollup to v3 by @oddvernes in https://github.com/equinor/design-system/pull/2908
- ⬆️ Storybook updated to v7 by @oddvernes in https://github.com/equinor/design-system/pull/2866
- ⬆️ updated dependencies by @oddvernes in https://github.com/equinor/design-system/pull/2925
- 📌 Restricted `styled-components` to below version 6 in `peerDependencies`. this package does not support v6 yet

## [0.7.0] - 2023-03-30

### Added

- `DatePicker`: Forwarded `renderCustomHeader` prop and made an example called `DatePickerSelectHeader` by @bovan in https://github.com/equinor/design-system/pull/2826
- `DatePicker`: Added `disabled` prop and styles by @bovan in https://github.com/equinor/design-system/pull/2826
- `DatePicker`: Forwarded `minDate`, `maxDate` & `disableAfterDate` props by @bovan in https://github.com/equinor/design-system/pull/2826

### Changed

- `DatePicker`: Reworked `filterDate` to be able to use both `disableBeforeDate` and `disableAfterDate` at the same time by @bovan in https://github.com/equinor/design-system/pull/2826
- `DatePicker`: Uses eds `Label` instead of custom label by @bovan in https://github.com/equinor/design-system/pull/2826
- `DatePicker`: Updated `react-datepicker` to `v4.10.0` (this is supposed to improve react 18 support) by @oddvernes in https://github.com/equinor/design-system/pull/2835

### Fixed

- `DatePicker`: fixed input dimensions that were wrong in some cases by @oddvernes in https://github.com/equinor/design-system/pull/2835

## [0.6.0] - 2022-11-04

### Removed

- 🚚 Moved `SideBar` component to eds-core-react by @oddvernes in https://github.com/equinor/design-system/pull/2614

## [0.5.2] - 2022-10-19

### Fixed

- 🐛Datepicker: fix calendar icon position by @oddvernes in https://github.com/equinor/design-system/pull/2573

## [0.5.1] - 2022-10-12

### Changed

- ⬆️ Upgrade to React 18 by @mimarz in https://github.com/equinor/design-system/pull/2510
- 🐛Sidebar link active warning by @oddvernes in https://github.com/equinor/design-system/pull/2531
- 💄 Sidebar spacing by @oddvernes in https://github.com/equinor/design-system/pull/2543

## [0.4.2] - 2022-06-20

### Added

- Expose `CSSButton` for downstream testing

## [0.4.1] - 2022-06-16

### Fixed

- Fix three issues with the lab DatePicker component by @sebastianvitterso in [#2301](https://github.com/equinor/design-system/pull/2301)

## [0.4.0] - 2022-05-xx

## [0.3.2] - 2022-03-18

### Changed

- Auto overflow on `Autocomplete` dropdown

## [0.3.1] - 2022-03-18

### Changed

- Updated dependency `@equinor/eds-utils` to version `0.2.0`

## [0.3.0] - 2022-03-16

### Added

- Initial release of features of `Autocomplete` for feedback

### Changed

- Renamed `Combobox` to `Autocomplete`

## [0.2.0] - 2022-02-02

### Changed

- Use `@equinor/eds-utils` for all utilities (removing copies)

## [0.1.0] - 2022-01-31

### Changed

- First release of eds-lab-react
