# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
