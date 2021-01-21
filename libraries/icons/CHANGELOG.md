# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
