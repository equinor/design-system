# Changelog - EDS 2.0 Beta Components

All notable changes to EDS 2.0 beta components (`@equinor/eds-core-react/next`) will be documented in this file.

These are experimental components available under the `/next` entry point. They follow semantic versioning with a `beta` prerelease tag.

## [3.0.0-beta.1](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.8.0-beta.1...eds-core-react-next@v3.0.0-beta.1) (2026-06-30)


### ⚠ BREAKING CHANGES

* consumers targeting these class names directly in their own CSS must update to the new flat names.

### 🐛 Fixed

* convert Banner BEM classes to flat class names ([#5114](https://github.com/equinor/design-system/issues/5114)) ([778515c](https://github.com/equinor/design-system/commit/778515ca9e2eb6144fcf96f57b483d6afdaae25d))

## [2.8.0-beta.1](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.7.0-beta.1...eds-core-react-next@v2.8.0-beta.1) (2026-06-23)


### ✨ Added

* Badge EDS 2.0 ([#4999](https://github.com/equinor/design-system/issues/4999)) ([2235377](https://github.com/equinor/design-system/commit/2235377b318cb4c75712d6b2380d16caa3aef721))
* Dialog EDS 2.0 ([#4956](https://github.com/equinor/design-system/issues/4956)) ([e2f6df2](https://github.com/equinor/design-system/commit/e2f6df2f62991d3f5a0205b416ffcf5d880a3d17))
* Select EDS 2.0 ([#4918](https://github.com/equinor/design-system/issues/4918)) ([0be44ad](https://github.com/equinor/design-system/commit/0be44adfbf0a45ad27b6b6b5f3a0cfb7337c4ec9))


### 🐛 Fixed

* correct TextArea helper message spacing in both density modes ([#4986](https://github.com/equinor/design-system/issues/4986)) ([f1a3b4d](https://github.com/equinor/design-system/commit/f1a3b4dcab016f4236e0d10ffcf63af4e25d6486))
* remove box-shadow from Switch handle ([#4980](https://github.com/equinor/design-system/issues/4980)) ([2f0dd96](https://github.com/equinor/design-system/commit/2f0dd96d685107e5d770bbfb00b8dde8cf80869a)), closes [#4838](https://github.com/equinor/design-system/issues/4838)
* replace styled-components Progress with spinning icon in Autocomplete ([#4982](https://github.com/equinor/design-system/issues/4982)) ([9581f89](https://github.com/equinor/design-system/commit/9581f892ef28d8d4fa1195ef05818c5fadf34f4c))
* rely on parent flex gap for Field helper-message spacing ([#5080](https://github.com/equinor/design-system/issues/5080)) ([8a18fb6](https://github.com/equinor/design-system/commit/8a18fb697aaeab3bdab6f14bd3a47160377b58a7))
* replace styled-components Tooltip with next/Tooltip in TextField and TextArea ([#4981](https://github.com/equinor/design-system/issues/4981)) ([e3ea724](https://github.com/equinor/design-system/commit/e3ea724eb99e9a3511686c07a2d7b9232f38cb10))


### ♻️ Refactoring

* migrate Banner.Message and Chip label off TypographyNext ([#4984](https://github.com/equinor/design-system/issues/4984)) ([ea19590](https://github.com/equinor/design-system/commit/ea195904f5321e89930f3d0247025ac4deeb9283)), closes [#4835](https://github.com/equinor/design-system/issues/4835) [#4836](https://github.com/equinor/design-system/issues/4836)

## [2.7.0-beta.1](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.6.0-beta.1...eds-core-react-next@v2.7.0-beta.1) (2026-05-27)


### ✨ Added

* Add Accordion component ([#4912](https://github.com/equinor/design-system/issues/4912)) ([fbe6874](https://github.com/equinor/design-system/commit/fbe6874a31249ada38656cd1444f770cf4004554))
* Add Autocomplete component ([#4808](https://github.com/equinor/design-system/issues/4808)) ([10e0217](https://github.com/equinor/design-system/commit/10e0217f266a97ef09f6972f6e4824d83ff29049))

## [2.6.0-beta.1](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.6.0-beta.0...eds-core-react-next@v2.6.0-beta.1) (2026-05-20)


### 🐛 Fixed

* publish with correct workspace dependencies — 2.6.0-beta.0 had unresolved `workspace:^` references that prevented installation via npm (CI workflow issue, no code changes in /next)

## [2.6.0-beta.0](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.5.0-beta.0...eds-core-react-next@v2.6.0-beta.0) (2026-05-20)


### ✨ Added

* add Divider component to next/ ([#4844](https://github.com/equinor/design-system/issues/4844)) ([b5706db](https://github.com/equinor/design-system/commit/b5706dbb3dbb8e3617660e99bfa98a384feb3ed1))


### 🐛 Fixed

* correct Chip height to match Figma design spec ([#4871](https://github.com/equinor/design-system/issues/4871)) ([3364526](https://github.com/equinor/design-system/commit/3364526b79b697bdd33019eab6d7c8d25d53294e))


### ♻️ Refactoring

* migrate Field off TypographyNext ([#4843](https://github.com/equinor/design-system/issues/4843)) ([6cbc34d](https://github.com/equinor/design-system/commit/6cbc34d791eb4c7219a523826c26cf08e8d3dce2))

## [2.5.0-beta.0](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.4.1-beta.0...eds-core-react-next@v2.5.0-beta.0) (2026-04-23)


### ✨ Added

* add asChild prop to Button (next) ([#4810](https://github.com/equinor/design-system/issues/4810)) ([06d961a](https://github.com/equinor/design-system/commit/06d961a49ad79a48e383a23265321d7c1babea16))
* add Chip component to next/ ([#4802](https://github.com/equinor/design-system/issues/4802)) ([81c6111](https://github.com/equinor/design-system/commit/81c61117fff150bcdd15f141afc223488b545f69))
* CSS-first typography system and Foundation element styles ([#4660](https://github.com/equinor/design-system/issues/4660)) ([284fbf6](https://github.com/equinor/design-system/commit/284fbf667d497ae24410ffbb9f7acff1e5e91c36)), closes [#4659](https://github.com/equinor/design-system/issues/4659)

## [2.4.1-beta.0](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.4.0-beta.0...eds-core-react-next@v2.4.1-beta.0) (2026-04-14)


### 🔨 Refactored

* add Slot utility and asChild prop to Link ([#4778](https://github.com/equinor/design-system/issues/4778)) ([fae4e42](https://github.com/equinor/design-system/commit/fae4e4248e6fb9a2f7466f9a6dbc2d4763fe30f0))

## [2.4.0-beta.0](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.3.6-beta.0...eds-core-react-next@v2.4.0-beta.0) (2026-04-08)


### ✨ Added

* add Banner component ([#4626](https://github.com/equinor/design-system/issues/4626)) ([44893b5](https://github.com/equinor/design-system/commit/44893b552bff463ae26dfc20c2a57a46d3108995))
* add Link component ([#4601](https://github.com/equinor/design-system/issues/4601)) ([05019e2](https://github.com/equinor/design-system/commit/05019e2a4686a7df7818c295048c3dd116b84326))
* add Search component ([#4637](https://github.com/equinor/design-system/issues/4637)) ([83a8446](https://github.com/equinor/design-system/commit/83a8446fe10aab3fadfca2685a5c98b211a72e97))
* add TextArea component ([#4652](https://github.com/equinor/design-system/issues/4652)) ([cfd254c](https://github.com/equinor/design-system/commit/cfd254cc829322e62c8417e69b0cdc3ce035cf40))
* add Tooltip component ([#4751](https://github.com/equinor/design-system/issues/4751)) ([dc96a24](https://github.com/equinor/design-system/commit/dc96a24122908404d6a4c26b1bec0cdc51813f98))

## [2.3.6-beta.0](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.3.5-beta.0...eds-core-react-next@v2.3.6-beta.0) (2026-03-20)


### 🐛 Fixed

* add missing BEM classes to next components ([#4638](https://github.com/equinor/design-system/issues/4638)) ([0cf8194](https://github.com/equinor/design-system/commit/0cf8194431b70bb56cb7da5af14e53c8be0dd7ac))

## [2.3.5-beta.0](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.3.4-beta.0...eds-core-react-next@v2.3.5-beta.0) (2026-03-03)


### 🐛 Fixed

* update Icon to follow next/ conventions ([#4612](https://github.com/equinor/design-system/issues/4612)) ([559d022](https://github.com/equinor/design-system/commit/559d0222718765aa41702b4151e38e81114924ed))

## [2.3.4-beta.0](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.3.3-beta.0...eds-core-react-next@v2.3.4-beta.0) (2026-02-25)


### 🐛 Fixed

* use EDS Button for TextField info icon and fix helper message gap ([#4569](https://github.com/equinor/design-system/issues/4569)) ([28b0035](https://github.com/equinor/design-system/commit/28b0035fb8a699098f5fc9ae6356ff1f3b3781a6))

## [2.3.3-beta.0](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.3.2-beta.0...eds-core-react-next@v2.3.3-beta.0) (2026-02-20)


### 🐛 Fixed

* improve Input component alignment and sizing ([#4531](https://github.com/equinor/design-system/issues/4531)) ([7564780](https://github.com/equinor/design-system/commit/756478081e2a549d9bd837bbc0f33dda825c80bf))

## [2.3.2-beta.0](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.3.1-beta.0...eds-core-react-next@v2.3.2-beta.0) (2026-02-19)


### ♻️ Refactoring

* simplify Button CSS by removing TypographyNext and using explicit heights ([#4514](https://github.com/equinor/design-system/issues/4514)) ([79fa2d6](https://github.com/equinor/design-system/commit/79fa2d6e57997aca9f9d3bce9b8566f21eaa74df))
* use semantic disabled tokens in next components ([#4529](https://github.com/equinor/design-system/issues/4529)) ([6d4bbd9](https://github.com/equinor/design-system/commit/6d4bbd9a292e85b8b5f8bf8fd018b78ae2501fad))

## [2.3.1-beta.0](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.3.0-beta.0...eds-core-react-next@v2.3.1-beta.0) (2026-01-29)


### ✨ Added

* Button component ([#4389](https://github.com/equinor/design-system/issues/4389)) ([94c9fbc](https://github.com/equinor/design-system/commit/94c9fbc148833e611f4c3b6ed9df6baf7a3b3d09))
* Radio component ([#4388](https://github.com/equinor/design-system/issues/4388)) ([b9cd9c3](https://github.com/equinor/design-system/commit/b9cd9c3931bbe666d2739b94335419107559a23b))
* Checkbox component ([#4208](https://github.com/equinor/design-system/issues/4208)) ([6171f95](https://github.com/equinor/design-system/commit/6171f95b4581d2e36d5bd14ea1204ba7357bb113))
* Field and HelperMessage components ([#4332](https://github.com/equinor/design-system/issues/4332)) ([6bbbad5](https://github.com/equinor/design-system/commit/6bbbad5feb18963054ef502cc83a6751c7d8592a))
* Input and TextField components ([8dd4dca](https://github.com/equinor/design-system/commit/8dd4dca74a6699a5cd1dfbf8977117c9e48fc445))
* Switch component ([#4387](https://github.com/equinor/design-system/issues/4387)) ([0a5226d](https://github.com/equinor/design-system/commit/0a5226d45bb5664c758240d03e3c0331369c875b))


### 🐛 Fixed

* align Checkbox CSS with Radio token usage ([#4393](https://github.com/equinor/design-system/issues/4393)) ([b5f886d](https://github.com/equinor/design-system/commit/b5f886d8eb7ca0ac39786ae9a016ab47ea20a3b2))
* align Switch with selection controls 2.0 ([#4394](https://github.com/equinor/design-system/issues/4394)) ([ba2d2fa](https://github.com/equinor/design-system/commit/ba2d2fab0b8e09ddcae13a4151c573a018051b68))
* update Field stories to use Input component ([#4397](https://github.com/equinor/design-system/issues/4397)) ([91a8626](https://github.com/equinor/design-system/commit/91a86264b65e3d888c4688e73af431a6e2d65802))


### 📝 Changed

* organize EDS 2.0 component navigation ([#4398](https://github.com/equinor/design-system/issues/4398)) ([44751b1](https://github.com/equinor/design-system/commit/44751b1c798d740da2d24ea7a13930e81a6f832c))


## [2.3.0-beta.0](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.2.1-beta.0...eds-core-react-next@v2.3.0-beta.0) (2026-01-16)

**Version correction release.** This release contains the same code as `2.2.0-beta.0`, republished with correct version number.

The previous release `2.2.0-beta.0` was incorrectly versioned since `2.2.1-beta.0` already existed. This caused semver ordering issues where users on `2.2.1-beta.0` would not receive the update.

### ✨ Added

- Icon Component 2.0 ([#4331](https://github.com/equinor/design-system/issues/4331)) ([95c589a](https://github.com/equinor/design-system/commit/95c589aaeb9883793e3ee59d7e4079614027bbfa))

### 📝 Changed

- **eds-core-react:** add Figma Code Connect setup and documentation ([#4363](https://github.com/equinor/design-system/issues/4363)) ([e468ec2](https://github.com/equinor/design-system/commit/e468ec2fcab569c3cb742e4692abd6ccf8b3d25b))

## [2.2.0-beta.0](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.2.1-beta.0...eds-core-react-next@v2.2.0-beta.0) (2026-01-15)

**Deprecated:** This version was incorrectly published. Use `2.3.0-beta.0` instead.

## [2.1.2-beta.0](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.1.1-beta.0...eds-core-react-next@v2.1.2-beta.0) (2025-12-15)

### 🔧 Chores

- setup beta release workflow for eds-core-react 2.2.1-beta.0 ([f11fb44](https://github.com/equinor/design-system/commit/f11fb44ab949e1e2997334915b1f641b1d413bcf))

## [2.2.1-beta.0](https://github.com/equinor/design-system/compare/eds-core-react-next@v2.1.0-beta.0...eds-core-react-next@v2.1.1-beta.0) (2025-12-11)

### 🔧 Chores

- add /next subpath + (beta) release please for next components ([#4251](https://github.com/equinor/design-system/issues/4251)) ([0184d22](https://github.com/equinor/design-system/commit/0184d223620328a51a8e7f0162a548dfe40feb1b))
- sync beta version and include component name in tag ([#4320](https://github.com/equinor/design-system/issues/4320)) ([ee861e2](https://github.com/equinor/design-system/commit/ee861e2c773d8055e18247f1d91c44edcf434452))
