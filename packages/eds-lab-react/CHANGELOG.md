# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.9.0](https://github.com/equinor/design-system/compare/eds-lab-react@0.8.0...eds-lab-react@v0.9.0) (2025-10-14)


### ✨ Added

* **datepicker:** Enable custom date-formats ([#3415](https://github.com/equinor/design-system/issues/3415)) ([2f91ed9](https://github.com/equinor/design-system/commit/2f91ed92797bdf42c682e421b86bbaf67247257f))


### 🐛 Fixed

* packages/eds-lab-react/Dockerfile.storybook to reduce vulnerabilities ([#3051](https://github.com/equinor/design-system/issues/3051)) ([6609b34](https://github.com/equinor/design-system/commit/6609b3489abcbcf9d163c7e43ba4d1c31fa5cc4c))
* packages/eds-lab-react/Dockerfile.storybook to reduce vulnerabilities ([#3126](https://github.com/equinor/design-system/issues/3126)) ([b10df8a](https://github.com/equinor/design-system/commit/b10df8aa109cc30053c53e9a30460e43a182bd37))
* packages/eds-lab-react/Dockerfile.storybook to reduce vulnerabilities ([#3276](https://github.com/equinor/design-system/issues/3276)) ([e8dd648](https://github.com/equinor/design-system/commit/e8dd648e5fa41d3ab63c6a416dd93d73a6f4fa00))
* packages/eds-lab-react/Dockerfile.storybook to reduce vulnerabilities ([#3406](https://github.com/equinor/design-system/issues/3406)) ([8001e44](https://github.com/equinor/design-system/commit/8001e44397f373760a995b76e18ed470a919f1d0))
* packages/eds-lab-react/Dockerfile.storybook to reduce vulnerabilities ([#3643](https://github.com/equinor/design-system/issues/3643)) ([f688713](https://github.com/equinor/design-system/commit/f688713f04852253155d86ec932ff695681db275))
* packages/eds-lab-react/Dockerfile.storybook to reduce vulnerabilities ([#3729](https://github.com/equinor/design-system/issues/3729)) ([75c88a9](https://github.com/equinor/design-system/commit/75c88a9faa5e4f00ff2a07503fc89e8b34480dc1))


### 🔧 Chores

* :arrow_up: Upgrade dependencies ([#3795](https://github.com/equinor/design-system/issues/3795)) ([8b5b025](https://github.com/equinor/design-system/commit/8b5b02531eb11949bb85dba719849ed3801ae220))
* ⬆️ Storybook v9 upgrade ([#3976](https://github.com/equinor/design-system/issues/3976)) ([fe76b10](https://github.com/equinor/design-system/commit/fe76b101e344d9dc6889562bb63730768125279f))
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
