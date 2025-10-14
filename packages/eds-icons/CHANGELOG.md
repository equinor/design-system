# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1](https://github.com/equinor/design-system/compare/eds-icons@1.0.0...eds-icons@v1.0.1) (2025-10-14)


### 🔧 Chores

* ⬆️ Upgrade dependencies in all packages ([#3933](https://github.com/equinor/design-system/issues/3933)) ([e67ed39](https://github.com/equinor/design-system/commit/e67ed398d3bc40004366eeff44dda8051691b2dd))
* 🔥 Remove individual package lockfiles ([#3930](https://github.com/equinor/design-system/issues/3930)) ([f813224](https://github.com/equinor/design-system/commit/f8132240a2c20ad54db54c2c38e53731852f8c7a))
* update dependencies ([#3783](https://github.com/equinor/design-system/issues/3783)) ([8fb9f2d](https://github.com/equinor/design-system/commit/8fb9f2d9f7c5ea420e67d34e981d9ed7cf694c50))

## [0.22.0] - 2025-01-08

### Added

- `circle_filled`

### Changed

- `in_progress` stroke thickness adjusted to conform with the rest of the circle icons

## [0.21.0] - 2024-01-26

### Added

- `jacket`
- `monopile`

## [0.20.0] - 2023-12-13

### Changed

- `IconData` type: `svgPathData` changed to `string | Array<string>` to allow multiple paths in the eds-core-react `Icon` component by @oddvernes in https://github.com/equinor/design-system/pull/3177

## [0.19.3] - 2023-07-14

### Changed

- 📦️ Revert changes from 0.19.2 due to testrunners downstream failing to resolve icons

## [0.19.2] - 2023-07-04

### Changed

- 📦️ Use `.mjs` file extension for es-modules in the build output, added `exports` field in package.json by @oddvernes in https://github.com/equinor/design-system/pull/2866

## [0.19.1] - 2023-03-14

### Changed

- ⬆️ Updated SVGO to version 3.0.2 (side effect: "z" in all svg paths changed to uppercase), by @oddvernes in https://github.com/equinor/design-system/pull/2799

## [0.19.0] - 2023-03-03

### Added

- `sheet_rightposition`
- `sheet_topposition`

## [0.18.0] - 2023-01-26

### Added

- `stop_circle`
- `stop_circle_outlined`

### Fixed

- Rendering error `line`
- Rendering error `onshore_drone`

## [0.17.0] - 2022-11-25

### Added

- `wellbore`

## [0.16.0] - 2022-11-07

### Added

- `enlarge`
- `offline_document`
- `open_side_sheet`
- `reduce`
- `sheet_bottom_position`
- `sheet_leftposition`

### Fixed

- Rendering error `approve`
- Rendering error `tag_more`

### Changed

- Resized `in_progress`

## [0.15.0] - 2022-10-12

### Added

- `in_progress`

### Removed

- 🔥 Remove commonjs path for in eds-icons & eds-tokens by @mimarz in https://github.com/equinor/design-system/pull/2571

### Changed

- 🔧 Conform packages build, test & linting by @mimarz in https://github.com/equinor/design-system/pull/2555

## [0.14.0] - 2022-09-19

### Added

- `filter_alt_active`
- `filter_alt_off`
- `collapse_screen`
- `expand_screen`
- `minimize`
- `slack`

### Changed

- Redesigned arrow on `priority_low` & `priority_high`

## [0.13.0] - 2022-08-30

### Added

- `oil`
- `oil_barrel`

## [0.12.0] - 2022-06-30

## Added

- `signature`
- `approve`
- `no_craning`
- `craning`
- `toolbox`
- `toolbox_wheel`
- `toolbox_rope`
- `badge`
- `hand_radio`
- `substation_onshore`
- `substation_offshore`
- `expand`
- `collapse`

## [0.11.0] - 2022-06-09

## Added

- `zip_file`
- `subsea_drone`
- `onshore_drone`
- `anchor`
- `aerial_drone`

## Fixed

- Fixed typo in icons. Make sure to update the following icons to fixed name
  - `communte` -> `commute`
  - `headseat_mic` -> `headset_mic`
  - `desktop_windwos` -> `desktop_windows`
  - `breifcase` -> `briefcase`
  - `format_stikethrough` -> `format_strikethrough`
  - `mood_extreamly_sad` -> `mood_extremely_sad`
  - `mood_extreamly_happy` -> `mood_extremely_happy`

## Removed

- `communte`
- `headseat_mic`
- `desktop_windwos`
- `breifcase`
- `format_stikethrough`
- `mood_extreamly_sad`
- `mood_extreamly_happy`

## [0.10.0] - 2021-12-20

## Added

- `wind_turbine` icon ([#1801](https://github.com/equinor/design-system/issues/1801))

## Fixed

- `calendar` icon should no longer misaligned with other "calendar" icons ([#1809](https://github.com/equinor/design-system/issues/1809))

## [0.9.1] - 2021-12-10

## Fixed

- Missing vector on `fault` icon ([#1793](https://github.com/equinor/design-system/issues/1793))

## [0.9.0] - 2021-12-09

## Added

New icons ([#1743](https://github.com/equinor/design-system/issues/1743)) ([#1581](https://github.com/equinor/design-system/issues/1581)) ([#1734](https://github.com/equinor/design-system/issues/1734))

- `ducting`
- `electrical`
- `fault`
- `formula`
- `go_to`
- `grid_layer`
- `grid_layers`
- `heat_trace`
- `hill_shading`
- `instrument`
- `junction_box`
- `line`
- `log_in`
- `log_out`
- `manual_valve`
- `miniplayer_fullscreen`
- `miniplayer`
- `pipe_support`
- `surface_layer`
- `tag_main_equipment`
- `tag_more`
- `tag_relations`
- `tag_special_equipment`
- `telecom`
- `thumb_pin`
- `well`

## Changed

- `launch` (should no longer be confused with `external_link` icon) ([#1742](https://github.com/equinor/design-system/issues/1742))
- Renamed `inspectrotation` to `inspect_rotation` ([#1781](https://github.com/equinor/design-system/issues/1781))
- Renamed `inspect3d` to `inspect_3d` ([#1781](https://github.com/equinor/design-system/issues/1781))
- Renamed `rotate3d` to `rotate_3d` ([#1781](https://github.com/equinor/design-system/issues/1781))

## [0.8.0] - 2021-11-09

### Deprecated

- Removed `umd` module from the build. This should prompt build tools select the tree-shakeable `esm` module instead. ([#1539](https://github.com/equinor/design-system/issues/1539))

## [0.7.0] - 2021-09-07

### Added

- New icons:
  - `power_bi`
  - `engineering`
  - `boundaries`
  - `inspect3d`
  - `inspectrotation`
  - `invert`

### Changed

- Updated `svgo` from `1.3.2` to `2.3.0` with new parsing, bundling and minimizing plugins.

## [0.6.2] - 2021-01-21

### Fixed 🐛

- Icon name typo for icon `close_cricle_outlined ` -> `close_circle_outlined ` (#993)

## [0.6.1] - 2020-12-11

### Fixed

- Removed postinstall script

## [0.6.0] - 2020-11-30

### Fixed

- Fixed icons with typo `verticle` -> `vertical`
  - more_verticle
  - verticle_split
  - text_rotation_verticle
  - verticle_align_top
  - verticle_align_center
  - verticle_align_bottom
  - border_verticle
  - swap_verticle
  - swap_verticle_circle

### Deprecated

- `@equinor/eds-icons/commonjs` path will be removed as defined as `commonjs` is the `main` type for the package now.

## [0.5.1] - 2020-11-26

### Changed 📓

- Updated README.md

## [0.5.0] - 2020-11-26

### Added

- Types, as part of the [Typescript Milestone](https://github.com/equinor/design-system/milestone/7?closed=1)

### Changed

- Changed module types for better support with `cjs` and `esm`. Using the `<some-eds-npm-package>/commonjs` path on packages should no longer be needed and will be deprecated in the future ([#887](https://github.com/equinor/design-system/issues/887))

## [0.4.0] - 2020-09-11

### Added

- New icon as alternative to `filter` (funnel) called `filter_alt`

### Changed

- Tweaked svg data for `info_circle` & `list`

## [0.3.0] - 2020-06-09

### Added

- New icon for `cable` under **Technical**

### Fixed

- Fixed missing circle on `info_circle` icon ([#349](https://github.com/equinor/design-system/issues/349))

## [0.2.0] - 2020-05-29

### Added

- New group of icons, **Technical**, including _gear, bearing, pressure, platform, circuit, gas_ & _beat_ icons

## [0.1.0] - 2020-02-24

### Changed

- Updated README to me abit more clearer
- Adjustments to to `package.json` to be more in line with our other packages
- New versioning of packages

## [0.0.1-alpha.3] - 2020-01-24

### Added

- Exports of objects containing svg data
- Support for commonjs under seperate path `@equinor/eds-icons/commonjs`

### Removed

- Svg files
- Exports of full svgs as strings

## [0.0.1-alpha.2] - 2019-11-08

### Changed

- Added rollup builds

## [0.0.1-alpha.1] - 2019-11-08

### Changed

- Publish alpha-version of library
