# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.1](https://github.com/equinor/design-system/compare/eds-tokens@v2.1.0...eds-tokens@v2.1.1) (2025-12-11)


### 🐛 Fixed

* unknown and high security alerts from radix. ([#4313](https://github.com/equinor/design-system/issues/4313)) ([3a9a666](https://github.com/equinor/design-system/commit/3a9a666f9188a1d0bee0f3ebcff1a7de8b03fe18))

## [2.1.0](https://github.com/equinor/design-system/compare/eds-tokens@v2.0.1...eds-tokens@v2.1.0) (2025-11-26)


### ✨ Added

* **eds-color-palette-generator:** add optional second color input to palette generator ([#4247](https://github.com/equinor/design-system/issues/4247)) ([5eaf173](https://github.com/equinor/design-system/commit/5eaf173feecb855ebef34718a1a584d0384912c6))
* **eds-tokens:** generate spacing and typography variables ([#4250](https://github.com/equinor/design-system/issues/4250)) ([6a5ef2c](https://github.com/equinor/design-system/commit/6a5ef2cf7a3821fd67809123f20f5f647ca43935))

## [2.0.1](https://github.com/equinor/design-system/compare/eds-tokens@v2.0.0...eds-tokens@v2.0.1) (2025-11-13)

- **eds-tokens:** update codeSyntax of the spacing and typography tokens ([#4227](https://github.com/equinor/design-system/issues/4227))

### ✨ Added

- **eds-tokens:** update codeSyntax of the spacing and typography tokens ([#4227](https://github.com/equinor/design-system/issues/4227)) ([31a6abc](https://github.com/equinor/design-system/commit/31a6abc2d99aa9e6877358718ff57ad6d19be7b3))

### 🐛 Fixed

- **eds-core-react:** rename text-icon className to eds-typography-text-icon to prevent conflicts and support using typography component as link ([#4233](https://github.com/equinor/design-system/issues/4233)) ([9069372](https://github.com/equinor/design-system/commit/906937262b7cf395a03d1867170791d046fd4734))

### 🔧 Chores

- **eds-core:** remove old unused variable collections ([26214af](https://github.com/equinor/design-system/commit/26214af425b5b63e6e2d668eaee3f32c6e765da8))

## [2.0.0](https://github.com/equinor/design-system/compare/eds-tokens@v1.1.4...eds-tokens@v2.0.0) (2025-11-06)

### ⚠ BREAKING CHANGES

- **eds-core-react, eds-tokens:** add spacing foundation variables, fix names in old variables and remove density specific spacing variables. eds-tokens package is now a peerDependency in eds-core-react to support using the new variables. ([#4200](https://github.com/equinor/design-system/issues/4200))
- **eds-tokens,eds-core-react:** move typography css foundation and remove core style ([#4173](https://github.com/equinor/design-system/issues/4173))

### ✨ Added

- **eds-core-react, eds-tokens:** add spacing foundation variables, fix names in old variables and remove density specific spacing variables. eds-tokens package is now a peerDependency in eds-core-react to support using the new variables. ([#4200](https://github.com/equinor/design-system/issues/4200)) ([7621866](https://github.com/equinor/design-system/commit/7621866194f67d4118167285e9209c5a5194217c))
- **eds-tokens,eds-core-react:** move typography css foundation and remove core style ([#4173](https://github.com/equinor/design-system/issues/4173)) ([0a20351](https://github.com/equinor/design-system/commit/0a20351e68d61334f877bc6ef0a05fcfc1c99c95))

## [1.1.4](https://github.com/equinor/design-system/compare/eds-tokens@v1.1.3...eds-tokens@v1.1.4) (2025-10-29)

### 🐛 Fixed

- Use semver ranges for internal eds dependencies ([#4163](https://github.com/equinor/design-system/issues/4163)) ([7cc8abe](https://github.com/equinor/design-system/commit/7cc8abe64f64f4e5a9081e21e19f71947f354c14))

### 🔧 Chores

- ⬆️ Update dependencies ([#4158](https://github.com/equinor/design-system/issues/4158)) ([344e555](https://github.com/equinor/design-system/commit/344e555ff53ed307026ebb68761281a563c3d3cf))
- **eds-tokens:** update tokens and generate variables ([#4151](https://github.com/equinor/design-system/issues/4151)) ([da830e0](https://github.com/equinor/design-system/commit/da830e0839e807edb9ffef74dc0b9e05f2b90e08)), closes [#4138](https://github.com/equinor/design-system/issues/4138)

## [1.1.3](https://github.com/equinor/design-system/compare/eds-tokens@v1.1.2...eds-tokens@v1.1.3) (2025-10-22)

### 📝 Changed

- **eds-tokens:** add info about importing json files and how to use the dynamic and static approach in your project ([#4120](https://github.com/equinor/design-system/issues/4120)) ([62742b9](https://github.com/equinor/design-system/commit/62742b9028ac721afcafc16323e33274ac08ec6f))

## [1.1.2](https://github.com/equinor/design-system/compare/eds-tokens@v1.1.1...eds-tokens@v1.1.2) (2025-10-16)

### 📝 Changed

- **eds-tokens:** edit docs to trigger publish action ([28b6263](https://github.com/equinor/design-system/commit/28b62633913566eda3e7df313a213fd53e46880a))

## [1.1.1](https://github.com/equinor/design-system/compare/eds-tokens@v1.1.0...eds-tokens@v1.1.1) (2025-10-16)

### 📝 Changed

- **eds-tokens:** update docs to trigger publish of package ([e73d676](https://github.com/equinor/design-system/commit/e73d6765aa471a2ae7f3c633c89c4ad21b7bdfa0))

## [1.1.0](https://github.com/equinor/design-system/compare/eds-tokens@1.0.0...eds-tokens@v1.1.0) (2025-10-16)

### ✨ Added

- **eds-color-palette-generator,eds-tokens,eds-tokens-build:** use oklch in the palette config ([#4081](https://github.com/equinor/design-system/issues/4081)) ([186cc5f](https://github.com/equinor/design-system/commit/186cc5f5866c71f5aa2a0e4ed0dddb2a82a892f2))
- **eds-tokens, eds-demo, eds-tailwind:** use single css variables export ([#4098](https://github.com/equinor/design-system/issues/4098)) ([15689fb](https://github.com/equinor/design-system/commit/15689fbd0b7df201be3be1a4f5774a5f44e6403e))

## [1.0.0] - 2025-10-09

This release aligns with the v1 release of our design system.
No breaking changes or migration required.

**Note:** We're moving from v0 to v1 to signal production stability across all packages in our monorepo.

### Added

- ✨ Create and implement new build scripts by @torleifhalseth in https://github.com/equinor/design-system/pull/4004
- ✨ Update tokens by @torleifhalseth in https://github.com/equinor/design-system/pull/4010

### Changed

- 🔧 Tokens build sync setup by @torleifhalseth in https://github.com/equinor/design-system/pull/3993
- 💄 Update variables by @torleifhalseth in https://github.com/equinor/design-system/pull/4013

## [0.10.0] - 2025-09-11

### Added

- ✨ Exposed `variables-static.css` and `variables-dynamic.css` with CSS custom properties for design tokens by @torleifhalseth in https://github.com/equinor/design-system/pull/3960

### Changed

- 🔥 Remove individual package lockfiles by @pomfrida in https://github.com/equinor/design-system/pull/3930
- ⬆️ Upgrade dependencies in all packages by @pomfrida in https://github.com/equinor/design-system/pull/3933
- ⬆️ Upgrade pnpm to v10 and node to v22 by @torleifhalseth in https://github.com/equinor/design-system/pull/3964

## [0.9.2] - 2023-07-04

### Changed

- 📦️ Use `.mjs` file extension for es-modules in the build output, added `exports` field in package.json by @oddvernes in https://github.com/equinor/design-system/pull/2866
- ⬆️ Updated `rollup` to v3.x by @oddvernes in https://github.com/equinor/design-system/pull/2908

## [0.9.1] - 2023-04-25

### Added

- Added css variables for typography colors by @bjartebore in https://github.com/equinor/design-system/pull/2840

## [0.9.0] - 2022-10-19

### Changed

- ✨ Moved outline to root of ComponentToken type by @mimarz in https://github.com/equinor/design-system/pull/2395

## [0.8.0] - 2022-10-12

### Removed

- 🔥 Remove commonjs path for in eds-icons & eds-tokens by @mimarz in https://github.com/equinor/design-system/pull/2571

### Changed

- 🔧 Conform packages build, test & linting by @mimarz in https://github.com/equinor/design-system/pull/2555
- 💄 `shape.icon_button` token changed from 48px to 40px by @mimarz in https://github.com/equinor/design-system/pull/2351

## [0.7.1] - 2022-06-09

### Changed

- Upgraded dev dependencies([#2183](https://github.com/equinor/design-system/pull/2183))

## [0.7.0] - 2021-09-30

### Added

- Typgraphy tokens for `compact` `Table`

### Changed

- Updates to internal types for tokens

## [0.6.0] - 2021-05-28

### Added

- New `Typography` token [(#1370)](https://github.com/equinor/design-system/issues/1370)
  - `menu_title_hover`

### Changed

- Updated `Typography` tokens [(#1370)](https://github.com/equinor/design-system/issues/1370)
  - Reduced line-height on `h1`, `h2` & `h3`

## [0.5.8] - 2021-05-06

### Changed

- Updates to internal types for tokens

## [0.5.7] - 2021-03-19

### Fixed

- Missing dist folder 🙈

## [0.5.6] - 2021-03-17

### Added ✨

- Support for both `dashed` and `solid` style in the `Outline` type

### Changed 📓

- Preparing the ground for theming ([#1118](https://github.com/equinor/design-system/issues/1118), [#401](https://github.com/equinor/design-system/issues/401), [#882](https://github.com/equinor/design-system/issues/882), [#1136](https://github.com/equinor/design-system/issues/1136), [#1129](https://github.com/equinor/design-system/issues/1129))
  - Added CSS variables for the rgba value in tokens as a first and simple step for theming support

## [0.5.5] - 2021-02-22

### Added

- New background token: `background__semitransparent ` [#1100](https://github.com/equinor/design-system/issues/1100))

## [0.5.4] - 2020-12-11

### Fixed

- Removed postinstall script

## [0.5.3] - 2020-12-09

### Removed

- Removed component tokens in favour of the base tokens approach
  - `Table` ([#830](https://github.com/equinor/design-system/issues/830))
  - `Button` ([#831](https://github.com/equinor/design-system/issues/831))
    - Danger
    - Disabled
    - Primary
    - Secondary

## [0.5.2] - 2020-11-26

### Changed 📓

- Updated README.md

## [0.5.1] - 2020-11-26

### Added

- Types, as part of the ([Typescript Milestone](https://github.com/equinor/design-system/milestone/7?closed=1))

### Changed

- Updated line height for Cell Text (`Table`) tokens and text color for `Snackbar` [#824](https://github.com/equinor/design-system/issues/824)
- Changed module types for better support with `commonjs` and `esm`. Using the `<some-eds-npm-package>/commonjs` path on packages should no longer be needed and will be deprecated in the future ([#887](https://github.com/equinor/design-system/issues/887))

## [0.4.0] - 2020-09-02

### Added

#### Color

- Added missing overlay color `pressed_overlay_light`

### Removed

- Removed unused colors in EDS
  - `field__fill_resting`
  - `field__fill_hover`
  - `field__fill_activated`

### Changed

#### Color

- Changed `link_in_snackbars` for better contrast.

## [0.3.0] - 2020-07-15

### Changed

- Font-weight is increased from 400 (regular) to 500 (medium) in all cases where the font-size is below 16px
- Font-size is increased and line-height decreased for label and helper
- Values such as underline, uppercase etc. are now lowercase

### Removed

- tabs.inactive-text is not in use in EDS Core React and has been removed

## [0.2.1] - 2020-07-08

### Changed

- Updated tokens to include text-align even if the value is “left”

## [0.2.0] - 2020-04-30

### Changed

- Updated tokens with latest values from Figma, see the [EDS Figma changelog](https://eds.equinor.com/updates/release-information/changelog/) for more details

## [0.1.0] - 2020-02-24

### Changed

- Updated README to me abit more clearer
- Adjustments to to `package.json` to be more in line with our other packages
- New versioning of packages

## [0.0.1-alpha.7] - 2020-01-22

### Changed

- Better support for using as commonjs or esm modules in different node versions

## [0.0.1-alpha.6] - 2020-01-20

### Added

- Compiled bundle for esm, cjs and umd modules

## [0.0.1-alpha.5] - 2019-12-13

### Changed

- Base tokens are now exported as esm instead of json

## [0.0.1-alpha.4] - 2019-08-04

### Changed

- Update readme with available tokens
- New model on `base` tokens

### Added

- `table` tokens

## [0.0.1-alpha.3] - 2019-07-23

### Changed

- Update missing fields in package.json

## [0.0.1-alpha.2] - 2019-07-23

### Changed

- Update license
- Add CHANGELOG
