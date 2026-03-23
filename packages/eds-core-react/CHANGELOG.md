# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0](https://github.com/equinor/design-system/compare/eds-core-react@v2.4.0...eds-core-react@v2.5.0) (2026-03-23)


### ✨ Added

* support React 18 and 19 ([#4648](https://github.com/equinor/design-system/issues/4648)) ([38ff591](https://github.com/equinor/design-system/commit/38ff5918f95a799e1d1ab44178b4647b6dd00887))


### 🐛 Fixed

* DatePicker displays correct day for configured timezone ([#4622](https://github.com/equinor/design-system/issues/4622)) ([de33a5e](https://github.com/equinor/design-system/commit/de33a5e2f685bd32341e3cd28fda282b44d53d66))
* **eds-core-react:** stabilise DatePicker popover size when navigating months ([#4620](https://github.com/equinor/design-system/issues/4620)) ([04ae29a](https://github.com/equinor/design-system/commit/04ae29aa1961d78e2a1d0c8140138f09b5376c48)), closes [#4376](https://github.com/equinor/design-system/issues/4376)
* localise DatePicker validation messages based on configured locale ([#4576](https://github.com/equinor/design-system/issues/4576)) ([410bbc2](https://github.com/equinor/design-system/commit/410bbc24054efe61d971d4ac4f797954279fc183))
* normalize link font-size and font-weight in Table cells ([#4578](https://github.com/equinor/design-system/issues/4578)) ([1739bd6](https://github.com/equinor/design-system/commit/1739bd66f585b8b4aac730307456c0d692d83e51))
* prevent Datepicker day field from eagerly auto-advancing on "3" ([#4553](https://github.com/equinor/design-system/issues/4553)) ([b5c98d3](https://github.com/equinor/design-system/commit/b5c98d373443b7c2ba5ff9e78dbd88fc30b25df2))
* resolve runtime errors in Autocomplete and DatePicker ([#4646](https://github.com/equinor/design-system/issues/4646)) ([ad48343](https://github.com/equinor/design-system/commit/ad4834334923a02bb414038083489f3961583080))

## [2.4.0](https://github.com/equinor/design-system/compare/eds-core-react@v2.3.7...eds-core-react@v2.4.0) (2026-03-20)


### ✨ Added

* support React 18 and 19 ([#4648](https://github.com/equinor/design-system/issues/4648)) ([38ff591](https://github.com/equinor/design-system/commit/38ff5918f95a799e1d1ab44178b4647b6dd00887))


### 🐛 Fixed

* DatePicker displays correct day for configured timezone ([#4622](https://github.com/equinor/design-system/issues/4622)) ([de33a5e](https://github.com/equinor/design-system/commit/de33a5e2f685bd32341e3cd28fda282b44d53d66))
* **eds-core-react:** stabilise DatePicker popover size when navigating months ([#4620](https://github.com/equinor/design-system/issues/4620)) ([04ae29a](https://github.com/equinor/design-system/commit/04ae29aa1961d78e2a1d0c8140138f09b5376c48)), closes [#4376](https://github.com/equinor/design-system/issues/4376)
* resolve runtime errors in Autocomplete and DatePicker ([#4646](https://github.com/equinor/design-system/issues/4646)) ([ad48343](https://github.com/equinor/design-system/commit/ad4834334923a02bb414038083489f3961583080))

## [2.3.7](https://github.com/equinor/design-system/compare/eds-core-react@v2.3.6...eds-core-react@v2.3.7) (2026-02-25)


### 🐛 Fixed

* localise DatePicker validation messages based on configured locale ([#4576](https://github.com/equinor/design-system/issues/4576)) ([410bbc2](https://github.com/equinor/design-system/commit/410bbc24054efe61d971d4ac4f797954279fc183))
* normalize link font-size and font-weight in Table cells ([#4578](https://github.com/equinor/design-system/issues/4578)) ([1739bd6](https://github.com/equinor/design-system/commit/1739bd66f585b8b4aac730307456c0d692d83e51))

## [2.3.6](https://github.com/equinor/design-system/compare/eds-core-react@v2.3.5...eds-core-react@v2.3.6) (2026-02-20)


### 🐛 Fixed

* prevent Datepicker day field from eagerly auto-advancing on "3" ([#4553](https://github.com/equinor/design-system/issues/4553)) ([b5c98d3](https://github.com/equinor/design-system/commit/b5c98d373443b7c2ba5ff9e78dbd88fc30b25df2))

## [2.3.5](https://github.com/equinor/design-system/compare/eds-core-react@v2.3.4...eds-core-react@v2.3.5) (2026-02-11)


### 🐛 Fixed

* **config:** revert .mjs extension for ESM builds ([#4482](https://github.com/equinor/design-system/issues/4482)) ([4fb957f](https://github.com/equinor/design-system/commit/4fb957f0a9885e0004e4951e9b5a846b8f0c443d))

## [2.3.4](https://github.com/equinor/design-system/compare/eds-core-react@v2.3.3...eds-core-react@v2.3.4) (2026-02-05)


### 🐛 Fixed

* 🐛 Fix multiple height in compact density mode ([#4468](https://github.com/equinor/design-system/issues/4468)) ([b01311b](https://github.com/equinor/design-system/commit/b01311bbea2a283330a1bc34ddeb8763ae71b486))
* export TypographyVariants from public API ([#4470](https://github.com/equinor/design-system/issues/4470)) ([13fb583](https://github.com/equinor/design-system/commit/13fb583f7e5ab456eabb9a3d1b40af46a42e0ded))


### 🔧 Chores

* **config:** Add new-component slash command for automating new components ([#4461](https://github.com/equinor/design-system/issues/4461)) ([6f878f2](https://github.com/equinor/design-system/commit/6f878f2f89f35dcb2638cadf6d55ca96ef64724f))

## [2.3.3](https://github.com/equinor/design-system/compare/eds-core-react@v2.3.2...eds-core-react@v2.3.3) (2026-02-03)


### 🐛 Fixed

* **config:** use .mjs extension for ESM builds ([#4463](https://github.com/equinor/design-system/issues/4463)) ([476a40e](https://github.com/equinor/design-system/commit/476a40ebfd73080e469898ae45d78fcb6cd612d9))

## [2.3.2](https://github.com/equinor/design-system/compare/eds-core-react@v2.3.1...eds-core-react@v2.3.2) (2026-01-29)


### 🐛 Fixed

* 🚑️ output next bundle to separate directory to prevent export overwrite ([#4405](https://github.com/equinor/design-system/issues/4405)) ([a53e64e](https://github.com/equinor/design-system/commit/a53e64e1efe10a45b23a7df7e2be119a5358a658))

## [2.3.1](https://github.com/equinor/design-system/compare/eds-core-react@v2.3.0...eds-core-react@v2.3.1) (2026-01-29)


### 🐛 Fixed

* 🐛 Autocomplete - restore onBlur and onKeyDown event handler support ([#4396](https://github.com/equinor/design-system/issues/4396)) ([39e8e97](https://github.com/equinor/design-system/commit/39e8e97a8e1eb46c42cd7330dc3d2e7c7059a849))
* restrict /next exports to beta releases only ([#4395](https://github.com/equinor/design-system/issues/4395)) ([cff5521](https://github.com/equinor/design-system/commit/cff55216bd7672d40653693e3d0d0ce6d8423715))


### 📝 Changed

* organize EDS 2.0 component navigation ([#4398](https://github.com/equinor/design-system/issues/4398)) ([44751b1](https://github.com/equinor/design-system/commit/44751b1c798d740da2d24ea7a13930e81a6f832c))


## [2.3.0](https://github.com/equinor/design-system/compare/eds-core-react@v2.2.0...eds-core-react@v2.3.0) (2026-01-15)


### ✨ Added

* adds chips in autocomplete multiple ([#4345](https://github.com/equinor/design-system/issues/4345)) ([faaa8ad](https://github.com/equinor/design-system/commit/faaa8ad967eea30d8cb3dd2d2087b689c09474e5))


### 🐛 Fixed

* DatePicker Esc Key Closing Entire Dialog ([#4346](https://github.com/equinor/design-system/issues/4346)) ([4375f39](https://github.com/equinor/design-system/commit/4375f3995c0f167b2077aedc2cbe315ea7c66eb9))


### 📝 Changed

* **eds-core-react:** add Figma Code Connect setup and documentation ([#4363](https://github.com/equinor/design-system/issues/4363)) ([e468ec2](https://github.com/equinor/design-system/commit/e468ec2fcab569c3cb742e4692abd6ccf8b3d25b))


### 🔧 Chores

* **figma-broker:** sync icons from Figma ([#4361](https://github.com/equinor/design-system/issues/4361)) ([ca944ca](https://github.com/equinor/design-system/commit/ca944ca8525897d1281bf53004a7266ff519a037))

## [2.2.0](https://github.com/equinor/design-system/compare/eds-core-react@v2.1.0...eds-core-react@v2.2.0) (2025-12-11)


### ✨ Added

* new icons Horizontal unfold more + Horizontal unfold less  ([#4231](https://github.com/equinor/design-system/issues/4231)) ([df50b34](https://github.com/equinor/design-system/commit/df50b34446faba98880df1e8f847fab74f2ecb37))


### 🐛 Fixed

* unknown and high security alerts from radix. ([#4313](https://github.com/equinor/design-system/issues/4313)) ([3a9a666](https://github.com/equinor/design-system/commit/3a9a666f9188a1d0bee0f3ebcff1a7de8b03fe18))
* update autocomplete types to require optionLabel when using objects and optional for strings/numbers ([#4279](https://github.com/equinor/design-system/issues/4279)) ([848c16f](https://github.com/equinor/design-system/commit/848c16f035da2480c99f24d635d54feaabc9a03a))


### 🔧 Chores

* add /next subpath + (beta) release please for next components ([#4251](https://github.com/equinor/design-system/issues/4251)) ([0184d22](https://github.com/equinor/design-system/commit/0184d223620328a51a8e7f0162a548dfe40feb1b))

## [2.1.0](https://github.com/equinor/design-system/compare/eds-core-react@v2.0.1...eds-core-react@v2.1.0) (2025-11-26)

### ✨ Added

- **eds-tokens:** generate spacing and typography variables ([#4250](https://github.com/equinor/design-system/issues/4250)) ([6a5ef2c](https://github.com/equinor/design-system/commit/6a5ef2cf7a3821fd67809123f20f5f647ca43935))

## [2.0.1](https://github.com/equinor/design-system/compare/eds-core-react@v2.0.0...eds-core-react@v2.0.1) (2025-11-13)

- **eds-tokens:** update codeSyntax of the spacing and typography tokens ([#4227](https://github.com/equinor/design-system/issues/4227))

### ✨ Added

- **eds-tokens:** update codeSyntax of the spacing and typography tokens ([#4227](https://github.com/equinor/design-system/issues/4227)) ([31a6abc](https://github.com/equinor/design-system/commit/31a6abc2d99aa9e6877358718ff57ad6d19be7b3))

### 🐛 Fixed

- **eds-core-react:** rename text-icon className to eds-typography-text-icon to prevent conflicts and support using typography component as link ([#4233](https://github.com/equinor/design-system/issues/4233)) ([9069372](https://github.com/equinor/design-system/commit/906937262b7cf395a03d1867170791d046fd4734))

## [2.0.0](https://github.com/equinor/design-system/compare/eds-core-react@v1.1.0...eds-core-react@v2.0.0) (2025-11-06)

### ⚠ BREAKING CHANGES

- **eds-core-react, eds-tokens:** add spacing foundation variables, fix names in old variables and remove density specific spacing variables. eds-tokens package is now a peerDependency in eds-core-react to support using the new variables. ([#4200](https://github.com/equinor/design-system/issues/4200))
- **eds-tokens,eds-core-react:** move typography css foundation and remove core style ([#4173](https://github.com/equinor/design-system/issues/4173))
- **eds-core-react, eds-utils:** Improve onChange handler typing for TextField component and remove multiline support ([#4134](https://github.com/equinor/design-system/issues/4134))

### ✨ Added

- **eds-core-react, eds-tokens:** add spacing foundation variables, fix names in old variables and remove density specific spacing variables. eds-tokens package is now a peerDependency in eds-core-react to support using the new variables. ([#4200](https://github.com/equinor/design-system/issues/4200)) ([7621866](https://github.com/equinor/design-system/commit/7621866194f67d4118167285e9209c5a5194217c))
- **eds-tokens,eds-core-react:** move typography css foundation and remove core style ([#4173](https://github.com/equinor/design-system/issues/4173)) ([0a20351](https://github.com/equinor/design-system/commit/0a20351e68d61334f877bc6ef0a05fcfc1c99c95))

### 🐛 Fixed

- Corrected tsconfig.build.json to ensure proper type declaration structure ([#4172](https://github.com/equinor/design-system/issues/4172)) ([f1d07e2](https://github.com/equinor/design-system/commit/f1d07e24298a939d22a7832c8d1107f8d8d0a7de))
- **eds-core-react, eds-utils:** Improve onChange handler typing for TextField component and remove multiline support ([#4134](https://github.com/equinor/design-system/issues/4134)) ([72c5f78](https://github.com/equinor/design-system/commit/72c5f78c1eba95beeb1e4363b3808168f3683745))
- **eds-core-react:** 🐛 Autocomplete - should start at selected index and preserve scroll position ([#3996](https://github.com/equinor/design-system/issues/3996)) ([d5d51a7](https://github.com/equinor/design-system/commit/d5d51a790d5f2fe98c747e7ff9b37041997d44c6))
- update stories to use callback refs instead ([#4195](https://github.com/equinor/design-system/issues/4195)) ([3492802](https://github.com/equinor/design-system/commit/34928027b8b486e2d22fc41cae6bdd8a50693da6))

### 🔧 Chores

- ensure index.json is properly overwritten during Storybook deployment ([#4179](https://github.com/equinor/design-system/issues/4179)) ([3950502](https://github.com/equinor/design-system/commit/395050206c908dd144e906b581242d6499388748))

## [1.1.0](https://github.com/equinor/design-system/compare/eds-core-react@v1.0.2...eds-core-react@v1.1.0) (2025-10-29)

### ✨ Added

- **eds-core-react, eds-utils:** Create base typography component and opinionated heading and paragraph ([b2130c6](https://github.com/equinor/design-system/commit/b2130c6f2be82e63549caacf876f263253292f87)), closes [#4125](https://github.com/equinor/design-system/issues/4125)
- use npm badges to update package versions in documentation ([#4141](https://github.com/equinor/design-system/issues/4141)) ([ffd20ba](https://github.com/equinor/design-system/commit/ffd20bab35011a169f4fdb3f72f500b5755bae9d))

### 🐛 Fixed

- **eds-core-react:** update storybook version ([22a21fd](https://github.com/equinor/design-system/commit/22a21fdcdf7c76e514e523752466fd6b9b3d763f))
- Update Card.docs.mdx ([7fc1205](https://github.com/equinor/design-system/commit/7fc1205b3c7bb2358f666524346027ccb7a52a92))
- Use semver ranges for internal eds dependencies ([#4163](https://github.com/equinor/design-system/issues/4163)) ([7cc8abe](https://github.com/equinor/design-system/commit/7cc8abe64f64f4e5a9081e21e19f71947f354c14))

### 🔧 Chores

- ⬆️ Update dependencies ([#4158](https://github.com/equinor/design-system/issues/4158)) ([344e555](https://github.com/equinor/design-system/commit/344e555ff53ed307026ebb68761281a563c3d3cf))
- **eds-tokens:** update tokens and generate variables ([#4151](https://github.com/equinor/design-system/issues/4151)) ([da830e0](https://github.com/equinor/design-system/commit/da830e0839e807edb9ffef74dc0b9e05f2b90e08)), closes [#4138](https://github.com/equinor/design-system/issues/4138)

## [1.0.2](https://github.com/equinor/design-system/compare/eds-core-react@v1.0.1...eds-core-react@v1.0.2) (2025-10-22)

### 🐛 Fixed

- **eds-core-react:** 🐛 Update Tooltip component to use mergeRefs ([#4130](https://github.com/equinor/design-system/issues/4130)) ([a7f42ce](https://github.com/equinor/design-system/commit/a7f42cee4e1287bcfba90007ca7544dfef18bf12))

### 🔧 Chores

- Rename follow-up ([#4129](https://github.com/equinor/design-system/issues/4129)) ([cae9fc0](https://github.com/equinor/design-system/commit/cae9fc0b3d32394da8d89ddb09c747142dd66f38))

## [1.0.1](https://github.com/equinor/design-system/compare/eds-core-react@1.0.0...eds-core-react@v1.0.1) (2025-10-16)

### 🐛 Fixed

- **eds-core-react:** sidebar links not showing tooltip when sidebar is collapsed ([#4068](https://github.com/equinor/design-system/issues/4068)) ([aa2622a](https://github.com/equinor/design-system/commit/aa2622aa6cd278560c0fa1b89203c336775f0f65))

### 🔧 Chores

- 🔧 Align peer deps across packages ([#4066](https://github.com/equinor/design-system/issues/4066)) ([869afad](https://github.com/equinor/design-system/commit/869afadb4a5a34b2c0f105cd1b834e4c824213aa))

## [1.0.0] - 2025-10-09

This release marks a significant milestone: **EDS is now production-ready**. We're moving from v0 to v1 to signal stability and our commitment to semantic versioning going forward.

### BREAKING CHANGES ⚠️

- **React 19 Required**: This version requires React >= 19.0.0 and React DOM >= 19.0.0. Previous versions of EDS are not compatible with React 19, and this version is not compatible with React 18.

### Changed

- chore: React 19 upgrade by @pomfrida in https://github.com/equinor/design-system/pull/4007

## [0.49.0] - 2025-09-11

### Added

- ✨ Always show "add new option" in Autocomplete when onAddNewOption is provided by @FredrikMWold in https://github.com/equinor/design-system/pull/3924

### Fixed

- 🐛 Autocomplete - Don't call onOptionsChange when clicking "Add new" by @FredrikMWold in https://github.com/equinor/design-system/pull/3932
- 🐛 Table - Fix Firefox table header wrapping issue by @pomfrida in https://github.com/equinor/design-system/pull/3957
- 🐛 Tabs documentation type mismatch - update onChange parameter from number to number | string by @Copilot @torleifhalseth in https://github.com/equinor/design-system/pull/3972

### Changed

- 📝 Banner - clarify complex content usage patterns and improve examples by @pomfrida in https://github.com/equinor/design-system/pull/3961
- 🔥 Remove individual package lockfiles by @pomfrida in https://github.com/equinor/design-system/pull/3930
- ⬆️ Upgrade dependencies in all packages by @pomfrida in https://github.com/equinor/design-system/pull/3933
- ⬆️ Upgrade pnpm to v10 and node to v22 by @torleifhalseth in https://github.com/equinor/design-system/pull/3964
- ⬆️ Storybook v9 upgrade by @pomfrida in https://github.com/equinor/design-system/pull/3976

## [0.48.0] - 2025-08-27

### Added

- ✨ `Tabs` call onChange with provided value if present by @FredrikMWold in https://github.com/equinor/design-system/pull/3893
- ✨ add disabled prop to `Tooltip` by @FredrikMWold in https://github.com/equinor/design-system/pull/3908
- ✨`Autocomplete` allow option-label prop to be used without type of object by @magnh in https://github.com/equinor/design-system/pull/3915

### Fixed

- 🐛 `DatePicker` Disable back button in year range based on year, not month by @FredrikMWold in https://github.com/equinor/design-system/pull/3853
- 🐛 `Tabs` now allow 'null' value as child element 'Tabs.List' and 'Tabs.Panel' by @AndreasPresthammer in https://github.com/equinor/design-system/pull/3878
- 🐛 `Autocomplete` prevent `onAddNewOption` from being called twice in Strict Mode by @FredrikMWold in https://github.com/equinor/design-system/pull/3894
- 🐛`Table` export table row with pascal case by @magnh in https://github.com/equinor/design-system/pull/3889

### Changed

- 📝 Added security policy info (#3856) by @torleifhalseth in https://github.com/equinor/design-system/pull/3857
- 📝 Add comprehensive guidelines for project standards and component creation by @torleifhalseth in https://github.com/equinor/design-system/pull/3845
- ⬆️ Upgrade dependencies by @pomfrida in https://github.com/equinor/design-system/pull/3858
- 🐛 Fixed typo in README.md by @Richard-Persson in https://github.com/equinor/design-system/pull/3860
- ⬆️ Upgrade dependencies by @pomfrida in https://github.com/equinor/design-system/pull/3881
- ⬆️ Security upgrade nginx from 1.26.3-alpine to 1.29.1-alpine by @Hjaf in https://github.com/equinor/design-system/pull/3899
- 📝 Update radixconfig.yaml by @emirgens in https://github.com/equinor/design-system/pull/3909
- 🐛 fix: pnpm lock by @torleifhalseth in https://github.com/equinor/design-system/pull/3921

## [0.47.0] - 2025-06-13

### Fixed

- 🐛 `Autocomplete`: Improvements to placeholder text by @FredrikMWold in https://github.com/equinor/design-system/pull/3813
- 🐛 `Menu`: Ensure onClose is called when a MenuItem without onClick is clicked by @FredrikMWold in https://github.com/equinor/design-system/pull/3828

### Added

- ✨`Autocomplete`: Add support for adding new options in Autocomplete by @FredrikMWold in https://github.com/equinor/design-system/pull/3833
- 📝 `Autocomplete`: story example with the new totalOptions prop by @pomfrida in https://github.com/equinor/design-system/pull/3817
- 📝 ♿ ✅ `Autocomplete`: enhance Autocomplete onAddNewOption - stories, tests, and accessibility by @pomfrida in https://github.com/equinor/design-system/pull/3841

### BREAKING CHANGES ⚠️

- ⬆️ `Autocomplete`: Upgraded TanStack Virtual dependency by @pomfrida in https://github.com/equinor/design-system/pull/3824
  Virtual items may not render immediately in test environments
  Tests expecting DOM elements to be present synchronously may fail:

```
// ❌ Old - may fail
const options = screen.getAllByRole('option')

// ✅ New - wait for virtual items
const options = await screen.findAllByRole('option')
// or
await waitFor(() => {
  expect(screen.getAllByRole('option')).toHaveLength(expectedCount)
})
```

## [0.46.0] - 2025-05-19

### Fixed

- 🐛 `Slider`: Fix slider track disappearing on hover by @pomfrida in https://github.com/equinor/design-system/pull/3803

### Added

- ✨ `Autocomplete`: Export Autocomplete Option Label by @pomfrida in https://github.com/equinor/design-system/pull/3799
- ✨ `Banner.Message`: Allow ReactNode as children by @pomfrida in https://github.com/equinor/design-system/pull/3805

## [0.45.1] - 2025-05-06

### Fixed

- :bug: `Autocomplete`, `TextField`: fix scroll to field error with react hook form by @FredrikMWold in https://github.com/equinor/design-system/pull/3777
- :bug: `Button`: allow button to become disabled when the as prop is used by @FredrikMWold in https://github.com/equinor/design-system/pull/3785
- :bug: `Slider`: fix active line disappearing when user hovers by @pomfrida in https://github.com/equinor/design-system/pull/3783
- :bug: `Autocomplete`: clean up console log by @FredrikMWold in https://github.com/equinor/design-system/pull/3788

## [0.45.0] - 2025-04-11

### Fixed

- 🐛 `DatePicker` & `DateRangePicker`: Ensure consistent styling on state changes by @pomfrida in https://github.com/equinor/design-system/pull/3754
- 🐛 `Autocomplete` Expose itemToKey, add deprecation notice to itemCompare by @mhwaage in https://github.com/equinor/design-system/pull/3763

## [0.44.0] - 2025-02-27

### Fixed

- 🐛 `Sidesheet`: fix shrinking close button by @oddvernes in https://github.com/equinor/design-system/pull/3728

### Changed

- ✨ `TextField`: make id optional by @mhwaage in https://github.com/equinor/design-system/pull/3730

### Added

- 🏷️ `Tooltip`: Allow ReactNode as title by @magnh in https://github.com/equinor/design-system/pull/3460
- 🧱 Export subcomponents individually for ssr support by @oddvernes in https://github.com/equinor/design-system/pull/3725

## [0.43.0] - 2025-01-17

### Fixed

- 🐛`Tooltip`: fixed an issue that caused the Tooltip to flicker in some cases by @oddvernes in https://github.com/equinor/design-system/pull/3695
- 🐛`Icon`: icon now uses deterministically generated id internally to work better with server side rendering by @sebastianvitterso in https://github.com/equinor/design-system/pull/3706

### Added

- ✨`Tooltip`: Allow defining custom root element for tooltips portal by setting the new `rootElement` prop on the `EdsProvider` by @yusijs in https://github.com/equinor/design-system/pull/3696
- 🧑‍💻`Tooltip`: added `eds-tooltip` class for easier access to override styling by @oddvernes in https://github.com/equinor/design-system/pull/3700

### Changed

- 🧑‍💻components are `'use client'` by default for better ssr support (this only applies to non-composite components) by @oddvernes in https://github.com/equinor/design-system/pull/3703
- ⬆️ updated dev dependencies by @oddvernes in https://github.com/equinor/design-system/pull/3713
- ⬆️ updated prod dependencies by @oddvernes in https://github.com/equinor/design-system/pull/3715

## [0.42.5] - 2024-11-21

### Fixed

- 🐛 `Autocomplete`: undefined param in `optionDisabled` by @oddvernes in https://github.com/equinor/design-system/pull/3689
- 🐛 `DatePicker`: use locale prop for text and formats when it is defined by @torleifhalseth in https://github.com/equinor/design-system/pull/3690

## [0.42.4] - 2024-11-15

### added

- 🎨 `Autocomplete`: added `onClear` callback (triggered when clicking the 'clear' button) by @arkadiy93 in https://github.com/equinor/design-system/pull/3679

## [0.42.3] - 2024-11-08

### Fixed

- 🐛 `Datepicker`: "today" button stopped working and didn't focus on today's cell by @arkadiy93 in https://github.com/equinor/design-system/pull/3669
- 🐛 `SideBar`: fixes issue where sidebar default state always starts as closed by @FredrikMWold in https://github.com/equinor/design-system/pull/3672

## [0.42.2] - 2024-10-24

### Fixed

- `Menu`: when using menu within a form, the form was submitted due to missing `type="button"` attribute by @FredrikMWold in https://github.com/equinor/design-system/pull/3660
- 🐛`Tooltip`: use `react.createPortal` to render element in body to prevent possible invalid syntax (such as wrapping tooltip around a path within svg) by @oddvernes in https://github.com/equinor/design-system/pull/3657

## [0.42.1] - 2024-10-04

### Fixed

- 🐛 Popover: Fixed an issue where popover would "flicker" in a prod enviroment by @oddvernes in https://github.com/equinor/design-system/pull/3639

### changed

- ⬆️ Updated @tanstack/react-virtual by @oddvernes in https://github.com/equinor/design-system/pull/3629
- ⬆️ Updated rollup and related plugins by @oddvernes in https://github.com/equinor/design-system/pull/3633

## [0.42.0] - 2024-09-17

### Added

- ✨ `Table`: new table footer sub-component `<Table.Foot>` by @zulu-eq-bouvet in https://github.com/equinor/design-system/pull/3624
- ✨ `DatePicker`: Enable setting locale from prop (`<DatePicker locale="en-US" />`), and fetch default locale from system settings instead of browser language. by @yusijs in https://github.com/equinor/design-system/pull/3626

### Fixed

🐛 `Popover`: added check to make it more robust againt an edge case where popover element is not connected to DOM by @oddvernes in https://github.com/equinor/design-system/pull/3610
🐛 `DatePicker`: removing a deprecated popover prop causing console warnings by @oddvernes

## [0.41.5] - 2024-09-10

### Fixed

- 🐛`Scrim`: fixed a bug where body scroll was not restored after opening a `Dialog` within `Scrim` by @oddvernes in https://github.com/equinor/design-system/pull/3619

## [0.41.4] - 2024-09-05

### Changed

- 🐛 `NativeSelect`: Remove dropdown svg icon when `multiple` is set by @mhwaage in https://github.com/equinor/design-system/pull/3611
- ⬆️ Updated `@tanstack/react-virtual` by @oddvernes in https://github.com/equinor/design-system/pull/3606
- ⬆️ Updated `downshift` by @oddvernes in https://github.com/equinor/design-system/pull/3608

### Fixed

- 🐛 `Autocomplete`: in controlled singleselect, if updating `selectedOptions` programmatically by something other that the `Autocomplete` itself, the internal "selected item" state was not updated by @oddvernes in https://github.com/equinor/design-system/pull/3614

## [0.41.3] - 2024-08-28

### Changed

- ✨`Popover`: implement native `popover`. This also deprecates the `withinPortal` prop. by @oddvernes in https://github.com/equinor/design-system/pull/3601
- 🔥 `Autocomplete`: remove deprecated `disablePortal` prop by @oddvernes in https://github.com/equinor/design-system/pull/3603

### Fixed

- 🐛 `Autocomplete`: deselect multiple does not work with complex items by @mhwaage in https://github.com/equinor/design-system/pull/3600

## [0.41.2] - 2024-08-26

### Changed

- ✨ `DatePicker`: year picker is now multipage by @arkadiy93 in https://github.com/equinor/design-system/pull/3571

## [0.41.1] - 2024-08-20

### Changed

- 🧑‍💻`Button.Toggle`: allow "wrapped" Button as child by @oddvernes in https://github.com/equinor/design-system/pull/3590

### Fixed

- 🐛`Snackbar`: fixed "auto hide" timer restarting every render by @oddvernes in https://github.com/equinor/design-system/pull/3591

## [0.41.0] - 2024-08-14

### Fixed

- 🐛 `DateRangePicker`: Added missing `{...props}` spread that prevented attaching eventlisteners etc to this component by @oddvernes in https://github.com/equinor/design-system/pull/3584
- 🐛 `Autocomplete`: fixed an edge case where it would crash when all items in filter are disabled by @mhwaage in https://github.com/equinor/design-system/pull/3565
- 🐛 `Autocomplete`: fixed a bug where it was unclickable inside `Menu` by @oddvernes in https://github.com/equinor/design-system/pull/3583
- 🩹 `Tabs`: Fix firefox error message caused by invalid value for scrollbar-width by @Benjamin-Lyon in https://github.com/equinor/design-system/pull/3578
- ♿️ `Menu`: added missing `role="group"` to `Menu.Section` by @oddvernes in https://github.com/equinor/design-system/pull/3583

### Changed

- 💄 `Tooltip`: implement native `popover` by @oddvernes in https://github.com/equinor/design-system/pull/3575
- 💄 `Snackbar`: implement native `popover` by @oddvernes in https://github.com/equinor/design-system/pull/3577
- 💄`Menu`: implement native `popover` by @oddvernes in https://github.com/equinor/design-system/pull/3583
- ⬆️ Updated dependencies by @oddvernes in https://github.com/equinor/design-system/pull/3579

## [0.40.1] - 2024-07-10

### Fixed

- 🐛 `Autocomplete`: Do not attach document.body if server side rendering by @magnh in https://github.com/equinor/design-system/pull/3542

### Changed

- 🧑‍💻 `Icon`: improve icon type definition by making it a descriminated union on `name` and `data` by @FredrikMWold in https://github.com/equinor/design-system/pull/3547
- ⬆️ Updated prod dependencies by @oddvernes in https://github.com/equinor/design-system/pull/3554

## [0.40.0] - 2024-06-21

### Fixed

- 💄 `DatePicker`: use correct token for text color by @oddvernes in https://github.com/equinor/design-system/pull/3520
- 🐛 `DatePicker`: export `DatePickerProps` type by @oddvernes in https://github.com/equinor/design-system/pull/3538
- 🐛 `Autocomplete`: reverted changes from https://github.com/equinor/design-system/pull/3408 (conditional `optionLabel` type) due to typescript issues when wrapping the component. Also made `options` type `readonly` by @oddvernes in https://github.com/equinor/design-system/pull/3515
- 🚸 `Autocomplete`: return focus to input after pressing 'clear' button by @oddvernes in https://github.com/equinor/design-system/pull/3531
- 🐛 `Autocomplete`: crash triggered by opening dropdown using keyboard if all items are disabled by @oddvernes in https://github.com/equinor/design-system/pull/3534

### Added

- 🧑‍💻 `Datepicker` type: allow passing standard html attributes by @oddvernes in https://github.com/equinor/design-system/pull/3509
- ✨ `Datepicker`/`DateRangepicker`: added `hideClearButton` prop, and also hide clear button if no date is set by @oddvernes in https://github.com/equinor/design-system/pull/3537

## [0.39.0] - 2024-05-27

### Fixed

- 🐛 `DatePicker`: Datetime-input was formatted with `/` instead of `:` by @yusijs in https://github.com/equinor/design-system/pull/3450
- 🐛 `Autocomplete`: added explicit transparent background-color to [popover]::backdrop by @oddvernes in https://github.com/equinor/design-system/commit/af36ebd06c7c5bd5770e37f26abc9302e2b7aa26

### Added

- ✨ `Autocomplete`: Solution for object-checking by value instead of reference with new `itemCompare` prop by @yusijs in https://github.com/equinor/design-system/pull/3455

### Changed

- 📌 Changed required `styled-components` version to 5.1 in peer dependencies by @oddvernes in https://github.com/equinor/design-system/pull/3459

## [0.38.0] - 2024-05-14

### Added

- ✨ `DatePicker`: Enable custom date-formats in the input segments when they are not focused. Also added support for custom locale by @yusijs in https://github.com/equinor/design-system/pull/3415

### Changed

- `🧑‍💻 Autocomplete`: improved type safety for autocomplete when `optionLabel` is required by @FredrikMWold in https://github.com/equinor/design-system/pull/3408
- 🚸 `Autocomplete`: implement native `popover` for better compatability with `Dialog` by @oddvernes in https://github.com/equinor/design-system/pull/3416
- ⬆️ Updated prod dependencies by @oddvernes in https://github.com/equinor/design-system/pull/3425

### Fixed

- 🐛 `Autocomplete` "Select all" toggle causing crashes under certain circumstances with controlled `Autocomplete` by @mhwaage in https://github.com/equinor/design-system/pull/3428
- 🐛 `Autocomplete` when toggling "Select all" or clicking the "clear" button, disabled items are now left unchanged. The "x/y selected" text in the input has changed "y" from "total non-disabled items length" to "all items length" by @oddvernes in https://github.com/equinor/design-system/pull/3429
- 🐛 `Autocomplete`: dragging scrollbar and then switching to using up/down arrow navigation should now work as expected by @oddvernes in https://github.com/equinor/design-system/pull/3441

### Notes

Due to the introduction of the native `popover` attribute, downstream unit tests involving eds `Autocomplete` may fail due to Jest/jsDom not having added support for the popover api yet. The easy solution to this is to add the following lines to your `jest.setup.ts` or alternatively within the test itself:
`HTMLElement.prototype.showPopover = jest.fn()`
`HTMLElement.prototype.hidePopover = jest.fn()`

## [0.37.0] - 2024-04-24

### Added

- ✨ New components: `Datepicker` and `DateRangePicker` by @yusijs in https://github.com/equinor/design-system/pull/3387
- ➕ New dependencies
  - `react-aria`
  - `@react-aria/utils`
  - `@react-stately/calendar`
  - `@react-stately/datepicker`
  - `@react-types/shared`
  - `@internationalized/date`

### Changed

- 🏷️ `Label`: change "meta" field type to `ReactNode` by @oddvernes in https://github.com/equinor/design-system/pull/3341
- 🚸 `Autocomplete`: show "no options" on focus when `options` is empty by @oddvernes in https://github.com/equinor/design-system/pull/3399
- 💄 `Menu`: focus-ring changed from :focus to :focus-visible by @oddvernes in https://github.com/equinor/design-system/pull/3396

### Fixed

- 🐛 `TextArea`/`TextField`: Fixed scrollbar being inaccessible when `inputIcon` is present by @oddvernes in https://github.com/equinor/design-system/pull/3378
- 🐛 `TextField`: Dynamically update padding when `inputIcon` changes by @torleifhalseth in https://github.com/equinor/design-system/pull/3380
- 🐛 `Button`: fixed misaligned clickbounds on icon/ghost icon variants by @oddvernes in https://github.com/equinor/design-system/pull/3397
- 🔥 `Tabs`: Remove invalid props from `TabListProps` type by @oddvernes in https://github.com/equinor/design-system/pull/3401

## [0.36.1] - 2024-03-01

### Changed

- ⬆️ Updated prod dependencies by @oddvernes in https://github.com/equinor/design-system/pull/3298

### Fixed

- ⬆️ `Autocomplete`: Updated downshift@8.3.3 to fix focus grabbing on load bug by @oddvernes in https://github.com/equinor/design-system/pull/3336

## [0.36.0] - 2024-02-09

### Added

- ✨ `Autocomplete`: Implemented "Select all" functionality, enabled with `allowSelectAll` prop by @yusijs in https://github.com/equinor/design-system/pull/3245
- 💄 `Slider`: option to render "value label" below the track with new `labelBelow` prop by @oddvernes in https://github.com/equinor/design-system/pull/3227

### Fixed

- 🐛 `Slider`: `onChangeCommitted` was not triggered by touch input by @oddvernes in https://github.com/equinor/design-system/pull/3244
- 🐛 `Slider`: fixed bug in Firefox where "value label" did not show on hover by @oddvernes in https://github.com/equinor/design-system/pull/3224
- 🐛 `Snackbar`: A missing check in the autohide timer caused `onClose` to be called twice by @oddvernes and @yusijs in https://github.com/equinor/design-system/pull/3241
- 🐛 `Autocomplete`: with `multiple`, `readOnly` was still accessible when clicking in the input. `readOnly` was still accessible in both modes when using keyboard arrow buttons by @oddvernes in https://github.com/equinor/design-system/pull/3216

### Changed

- 💄`Slider`: design adjustments to the "value label": changed color, reduced padding, removed "arrow" and moved closer to the "thumb" by @oddvernes in https://github.com/equinor/design-system/pull/3227
- 💄 `TextField`/`InputWrapper`: allow line break character to work in `HelperText` by @oddvernes in https://github.com/equinor/design-system/pull/3233
- 🔧 Updated `babel` browserlist from "defaults" to "last 2 versions of chrome/edge/firefox/safari". This reduces build size significantly and removes all the babel runtime helpers. by @oddvernes in https://github.com/equinor/design-system/pull/3219
- 🚸 `Autocomplete` ux-changes: input cleared on blur, added "no options" dropdown and `noOptionsText` prop by @oddvernes in https://github.com/equinor/design-system/pull/3216

## [0.35.1] - 2023-12-21

### Fixed

- 🐛 `Typography`: Bug affecting users of styled-components v6 where line-clamping would be applied to all `Typography` elements on the page if the `lines` prop was set on one of them by @oddvernes in https://github.com/equinor/design-system/pull/3193

## [0.35.0] - 2023-12-13

### Added

- ✨ `Icon`: Added support for multiple paths (type `IconData.svgPathData` is now `string | Array<string>`) by @oddvernes in https://github.com/equinor/design-system/pull/3177

### Fixed

- 🐛 `Autocomplete`: Fixed scrollbar clipping issue that manifested in Firefox by @oddvernes in https://github.com/equinor/design-system/pull/3179
- 🐛 `Slider`: Fixed a bug where label tooltip was always visible for users with `styled-components@5.x.x` by @oddvernes in https://github.com/equinor/design-system/pull/3173

### Changed

- 🧑‍💻 `SideSheet`: `open` prop type changed to required, conditionally render title and close button to reflect the optional types of `title` and `onClose` props by @oddvernes in https://github.com/equinor/design-system/pull/3161

## [0.34.0] - 2023-11-17

### Added

- ✨ `Slider`: added `hideActiveTrack` prop by @oddvernes in https://github.com/equinor/design-system/pull/3131
- ✨ `Slider`: added `labelAlwaysOn` prop by @oddvernes in https://github.com/equinor/design-system/pull/3143
- ✨ `Autocomplete`: Added `variant` (`error`, `warning`, `success`) and `helperText` props by @denektenina in https://github.com/equinor/design-system/pull/3139
- ✨ `Breadcrumbs`: custom `separator` prop by @oddvernes in https://github.com/equinor/design-system/pull/3142

### Changed

- 💄 `Slider`: redesigned value label to tooltip style, increased font size by @oddvernes in https://github.com/equinor/design-system/pull/3143
- ✨ `Label`/`TextField`/`Autocomplete`: The `label` prop type changed from `string` to `ReactNode` to allow it to be more customizable by @FredrikMWold in https://github.com/equinor/design-system/pull/3140
- ⬆️ Updated dependencies by @oddvernes in https://github.com/equinor/design-system/pull/3121 https://github.com/equinor/design-system/pull/3138 https://github.com/equinor/design-system/pull/3137 https://github.com/equinor/design-system/pull/3132 https://github.com/equinor/design-system/pull/3148

### Fixed

- 📱 `Slider`: added touch support for range slider by @oddvernes in https://github.com/equinor/design-system/pull/3144
- 🐛 `Slider`: fixed bug in Safari where slider would grow in width on mouseover by @oddvernes in https://github.com/equinor/design-system/pull/3145

## [0.33.1] - 2023-10-20

### Fixed

- 🐛`Chip`: only hover color when clickable (fixed for error variant) by @oddvernes in https://github.com/equinor/design-system/pull/3096
- 🐛 `Table.Row`: fix Styled-components v6 printing a false positive console warning about `active` prop by @oddvernes in https://github.com/equinor/design-system/pull/3104
- 🐛 `Slider`: change returnvalue type for `onChange` and `onChangeCommitted` from `number[] | number` to `number[]` to reflect reality. And allow value for non-range slider to be number[] (an array with only one number) by @oddvernes in https://github.com/equinor/design-system/pull/3076
- ⬆️ Update `@babel/runtime` to fix a vulnerability in its dependency `@babel/traverse` (https://nvd.nist.gov/vuln/detail/CVE-2023-45133) by @oddvernes in https://github.com/equinor/design-system/pull/3115

## [0.33.0] - 2023-09-26

### Added

- ✨ `Tabs`: controlled mode for use with routers by @oddvernes in https://github.com/equinor/design-system/pull/3036
- 🚸 `Tabs`: added `conditionalRender` prop for `Tabs.Panels` by @oddvernes in https://github.com/equinor/design-system/pull/3062
- ⬆️ Support `Styled-components` v6 by @oddvernes in https://github.com/equinor/design-system/pull/3050

### Changed

- ⬆️ Updated `typescript` from 4.9.x to 5.1.x by @oddvernes in https://github.com/equinor/design-system/pull/3020
- 🚸 `Search`: removed "clear" button when component is disabled by @denektenina in https://github.com/equinor/design-system/pull/3054

### Fixed

- 💄 `Breadcrumbs`: fixed vertical alignment for icons by @oddvernes in https://github.com/equinor/design-system/pull/3023
- 💄 `Radio`/`Checbox`/`Switch` fixed z-index bug where component could show through overlaying content by @oddvernes in https://github.com/equinor/design-system/pull/3032
- 🔒️ Utils: Moved `babel-jest` to dev-dependencies by @oddvernes in https://github.com/equinor/design-system/pull/3055
- 🚸 `SideBar`: add `aria-label` to toggle button by @ingeridhellen in https://github.com/equinor/design-system/pull/3066
- 🐛 `Autocomplete` improved fix for "Maximum update depth exceeded" crash caused by merging refs by @oddvernes in https://github.com/equinor/design-system/pull/3069

## [0.32.4] - 2023-08-15

### Fixed

- 🐛 `Autocomplete`: Added a fix for "Maximum update depth exceeded" error by @oddvernes in https://github.com/equinor/design-system/pull/3005
- 🐛 `Autocomplete`: Fixed issue where externally added eventlisteners (`onFocus`, `onBlur` etc) broke internal functionality by @bjartebore in https://github.com/equinor/design-system/pull/2999
- 🐛 `Dialog`: Fixed open on mount by @oddvernes in https://github.com/equinor/design-system/pull/3003

### Changed

- 🔥 `Chip`: Removed z-index from the x-icon by @oddvernes in https://github.com/equinor/design-system/pull/2992
- 💄 `Chip` removed hover-effect when there is no `onClick` present by @bjartebore in https://github.com/equinor/design-system/pull/2995
- ⬆️ `Autocomplete` Update to Downshift 8.1.0. `Autocomplete` now opens on click instead of focus to comply with ARIA 1.2 by @oddvernes in https://github.com/equinor/design-system/pull/3000
- ⬆️ Updated `floating-UI` to v0.24.3 by @oddvernes in https://github.com/equinor/design-system/pull/3004
- 🦺 `Icon`: removed "height" attribute from svg path to comply with w3 validator by @oddvernes in https://github.com/equinor/design-system/pull/3006

## [0.32.3] - 2023-07-14

### Fixed

- 🐛 `Autocomplete`, `Tooltip`, `Popover` and `Menu` inside a `Dialog` should now render on top by @oddvernes in https://github.com/equinor/design-system/pull/2970

## [0.32.2] - 2023-07-13

### Fixed

- 🐛 `Rollup` config: added `interop: auto`. This fixes an issue with the commonJs build where jest was unable to resolve styled-components in downstream tests

## [0.32.1] - 2023-07-11

### Changed

- ⏪️Added back commonjs build and changed file extension of modules from `.mjs` to `.js` due to a compatability issue with `React 17`.
- 📌 Restricted `styled-components` to below version 6 in `peerDependencies`. this package does not support v6 yet.

## [0.32.0] - 2023-07-10

### Fixed

- 🐛 `Autocomplete`: Allow option value of 0 by @oddvernes in https://github.com/equinor/design-system/pull/2957
- 🐛 `Popover`, `Card`: fixed style-syntax that affected users with `styled-components` v6 in by @oddvernes in https://github.com/equinor/design-system/pull/2953
- 🐛 `Typography`: make `color` a transient prop so it doesn't show up in the dom by @oddvernes in https://github.com/equinor/design-system/pull/2952
- 💄 `Sidebar`: Remove visible scrollbar when collapsed by @oddvernes in https://github.com/equinor/design-system/pull/2863

### Changed

- ♻️🚸 `Dialog`: Refactored to use native dialog under the hood by @oddvernes in https://github.com/equinor/design-system/pull/2950
- ⚡️ `Tabs`: conditionally render tab panels (previously display:none) by @oddvernes in https://github.com/equinor/design-system/pull/2947
- ⬆️ updated dependencies by @oddvernes in https://github.com/equinor/design-system/pull/2925
- ⬆️ Update floating-ui by @oddvernes in https://github.com/equinor/design-system/pull/2922
- ⬆️ Upgrade rollup to v3 by @oddvernes in https://github.com/equinor/design-system/pull/2908
- 🚸 `Scrim`/`Dialog`: trigger dismiss on mousedown to prevent accidental "click outside" by @oddvernes in https://github.com/equinor/design-system/pull/2923
- 📝 `Autocomplete`: Improved selectAll story in storybook by @denektenina in https://github.com/equinor/design-system/pull/2883
- 📝 Storybook, improved documentation: Add null as a possible value for useState hooks that receive HTML elements to avoid type error by @FredrikMWold in https://github.com/equinor/design-system/pull/2891
- ⬆️ Storybook updated to v7 by @oddvernes in https://github.com/equinor/design-system/pull/2866
- 🚸 `SideBar.Accordion`: Made the way `isExpanded` works more intuitive by @denektenina in https://github.com/equinor/design-system/pull/2870

### Added

- ✅ Added test coverage for the new `SideBar.Accordion` and `SideBar.AccordionItem` by @denektenina in https://github.com/equinor/design-system/pull/2867

## [0.31.1] - 2023-04-25

### Fixed

- 🐛 `Menu`: Fixed a warning occurring when using `Menu.Item` as `react-router` `Link` by @oddvernes in https://github.com/equinor/design-system/pull/2858

## [0.31.0] - 2023-04-25

### Added

- ✨ `Autocomplete`: `optionComponent` prop for custom option templates by @oddvernes in https://github.com/equinor/design-system/pull/2852
- ✨ `Sidebar`: Added `Sidebar.Accordion` and `Sidebar.AccordionItem` by @denektenina in https://github.com/equinor/design-system/pull/2797
- ✨ `Typography`: Added fallback css variables for colors by @bjartebore in https://github.com/equinor/design-system/pull/2840
- ✨ `Menu`: polymorphic `Menu.Item` (use `as` prop to override element type) by @oddvernes in https://github.com/equinor/design-system/pull/2817

### Changed

- 💄 `Radio`/`Checkbox`: changed visual size of hover background to conform to design by @oddvernes in https://github.com/equinor/design-system/pull/2824
- 💄 `Switch`: physical size is now same as `Radio`/`Checkbox` to conform to design (from 40x40 to 48x48) by @oddvernes in https://github.com/equinor/design-system/pull/2824
- ⬆️ Updated production dependencies for all packages by @oddvernes in https://github.com/equinor/design-system/pull/2848

## [0.30.0] - 2023-03-15

### Fixed

- 🐛 `NativeSelect`: fixed label not having disabled-style when disabled by @oddvernes in https://github.com/equinor/design-system/pull/2802
- 🐛 `Dialog`: fixed css syntax errors in `Dialog.Header`, `align-items: center; justify-content: space-between;` is now applied by @oddvernes in https://github.com/equinor/design-system/pull/2801

### Added

- ✨`Accordion`: Added `onExpandedChange` prop to `Accordion.Item` to enable controlled mode by @bjartebore in https://github.com/equinor/design-system/pull/2775
- ✨ `Autocomplete`: added `onInputChange` and `loading` props to enable async search-as-you-type use cases. Updated storybook with example by @oddvernes in https://github.com/equinor/design-system/pull/2788
- ✨ `Autocomplete`: added `dropdownHeight` prop allowing users to override default dropdown height by @oddvernes in https://github.com/equinor/design-system/pull/2793
- ✨ `Menu`: added `matchAnchorWidth` prop by @bjartebore in https://github.com/equinor/design-system/pull/2806
- ✨`Breadcrumbs`: added option to not wrap Breadcrumbs with a new `wrap` prop, plus added `forceTooltip` prop. Added storybook example by @oddvernes in https://github.com/equinor/design-system/commit/fdb178be39fd51ec474e85bd008f6a5f9a0f8ef3

### Changed

- 🚸⚡️ `Slider` - new behaviour: min/max thumbs can no longer cross, plus some performance improvements by @oddvernes in https://github.com/equinor/design-system/pull/2783
- 🚸💄 `Input`: added ellipsis to overflowing text, `Autocomplete` input: reduced padding-right by @oddvernes in https://github.com/equinor/design-system/pull/2807

## [0.29.1] - 2023-02-03

### Fixed

- 🚑️ Hotfix: Roll back `@types/react` to `18.0.21` as the newer version created a mismatch in the Icon component type.

## [0.29.0] - 2023-02-03

### Added

- ✨ `Menu` stays open after click on item with the new `closeMenuOnClick` prop by @denektenina in https://github.com/equinor/design-system/pull/2687
- ✨ `Input`: Added css-variable (`--eds-input-background`) to more easily override background-color. Also works on `Autocomplete`, `Textfield`, `Search` and `Textarea` by @oddvernes in https://github.com/equinor/design-system/pull/2718
- 📝 Storybook for `Button` and `Tooltip`: added best practices examples for how to use `Tooltip` with disabled `Button` by @denektenina in https://github.com/equinor/design-system/pull/2742
- ✨ Added `Tooltip` support for `Button.Toggle` by @oddvernes in https://github.com/equinor/design-system/pull/2751

### Fixed

- ⚡️ `Menu`: Fix occasional 1-frame flicker when opening `Menu` by @denektenina in https://github.com/equinor/design-system/pull/2711
- 💄 `Accordion`: Fixed double border between header and content by @denektenina in https://github.com/equinor/design-system/pull/2739
- 💄 `Dialog`: Fixed spacing when `scrollable` is set by @oddvernes in https://github.com/equinor/design-system/pull/2749
- 🎨 `Paper`: Made the `elevation` prop transient so it doesn't clutter the html by @bjartebore in https://github.com/equinor/design-system/pull/2764

## [0.28.0] - 2022-12-21

### Added

- 📝 `Table` storybook: Added example of virtual scrolling by @denektenina in https://github.com/equinor/design-system/pull/2664
- ✨ `Autocomplete` is now virtualized to handle large data sets, and have a new prop `multiline` (multiline, where option text wraps, was previously the default behaviour). Also fixes missing padding for `multiline` when more than 2 lines of text by @oddvernes in https://github.com/equinor/design-system/pull/2689

### Fixed

- 📝 Added missing changelog entry to v0.24.0 regarding `Button` variant `ghost_icon` and `contained_icon` size change by @oddvernes in https://github.com/equinor/design-system/pull/2677
- 📝 Added missing changelog entry to v0.25.0 regarding Autocomplete `variant` by @oddvernes in https://github.com/equinor/design-system/pull/2695
- 📝 `Slider` storybook: Improve docs for `outputFunction` by @Strepto in https://github.com/equinor/design-system/pull/2674
- 📝 Storybook: Fixed wrongly rendered "show code" in certain stories by @denektenina in https://github.com/equinor/design-system/pull/2681
- ⬆️ `Autocomplete`: Upgraded `downshift` to 7.0.5 to fix react 18 issue where the dropdown was open on load in dev enviroment by @oddvernes in https://github.com/equinor/design-system/pull/2697

### Changed

- 🐛♿️ `Autocomplete`: change behaviour on inputBlur by @oddvernes in https://github.com/equinor/design-system/pull/2676

### Removed

- 🔥Storybook: Disable compact stories where it is not implemented yet by @oddvernes in https://github.com/equinor/design-system/pull/2655

## [0.27.0] - 2022-11-17

### Added

- 📝 `Textfield` Storybook: Added validation example by @oddvernes in https://github.com/equinor/design-system/pull/2640

### Fixed

- 🐛 `SideBar`: Fixed `Sidebar.Button` and `Sidebar.Toggle` ref by @oddvernes in https://github.com/equinor/design-system/pull/2650

### Changed

- ⬆️ Upgraded downshift to 7.0.1 (Improves ARIA-patterns in `Autocomplete`) by @denektenina in https://github.com/equinor/design-system/pull/2637

### Removed

- 🔥 Removed deprecated `SingleSelect` and `MultiSelect` by @denektenina in https://github.com/equinor/design-system/pull/2643

## [0.26.0] - 2022-11-04

### Added

- ✨ Added `SideBar` component by @oddvernes in https://github.com/equinor/design-system/pull/2614
- 🚸 Button: `aria-disabled` now adds "disabled" styles by @denektenina in https://github.com/equinor/design-system/pull/2624

### Changed

- ♿️ `Tooltip` better announced by screen readers by @martalalik in https://github.com/equinor/design-system/pull/2596
- 💄 `TopBar.Header` Changed gap to 12px (from from 24px) by @martalalik in https://github.com/equinor/design-system/pull/2623
- ✨ Replaced unnecessary occurrences of `useLayoutEffect` with `useEffect` for better ssr support by @oddvernes in https://github.com/equinor/design-system/pull/2631

### Fixed

- 🐛 `Textfield`: fixed missing id on helpertext for aria-labelledby by @oddvernes in https://github.com/equinor/design-system/pull/2639

## [0.25.0] - 2022-10-19

### Added

- ♿️ Add portal & focusManager to Popover by @martalalik in https://github.com/equinor/design-system/pull/2536
- ✨ New internal component: `InputWrapper` by @mimarz in https://github.com/equinor/design-system/pull/2395

### Removed

- 🔥 Autocomplete **breaking change**: In the `variant` prop, `default` has been removed as an option by @mimarz in https://github.com/equinor/design-system/pull/2395

### Changed

- 💄 Bumped z-index for autocomplete by @denektenina in https://github.com/equinor/design-system/pull/2585
- ♻️ Refactored `Search`, `TextField`, `Autocomplete` to use `InputWrapper` by @mimarz in https://github.com/equinor/design-system/pull/2395

### Fixed

- 🐛 Tooltip: fix arrow persistence by @denektenina in https://github.com/equinor/design-system/pull/2592

## [0.24.0] - 2022-10-12

### Added

- ✨ Autocomplete: Support for toggling if input is cleared on selection by @mimarz in https://github.com/equinor/design-system/pull/2545
- ✨Polymorphic tabs by @oddvernes in https://github.com/equinor/design-system/pull/2556

### Changed

- ♻️ Autocomplete: Always show all options on re-open after selection by @mimarz in https://github.com/equinor/design-system/pull/2562
- ⬆️ upgraded floating-ui to v0.10.1 by @oddvernes in https://github.com/equinor/design-system/pull/2554
- 🔧 Conform packages build, test & linting by @mimarz in https://github.com/equinor/design-system/pull/2555
- 💄 `Button` variant `ghost_icon` and `contained_icon` changed size from 48px to 40px by @mimarz https://github.com/equinor/design-system/pull/2351

### Fixed

- 🐛 Accordion: prevent toggle from submitting form by @oddvernes in https://github.com/equinor/design-system/pull/2567

**Full Changelog**: https://github.com/equinor/design-system/compare/eds-core-react@0.23.0...eds-core-react@0.24.0

## [0.23.0] - 2022-10-05

### Fixed

- 🐛 Accordion: fixed shrinking icon by @oddvernes in https://github.com/equinor/design-system/pull/2540

### Changed

- ⬆️ Upgrade to React 18 by @mimarz in https://github.com/equinor/design-system/pull/2510
- 🐛 Breadcrumb/Typography: use transient props by @oddvernes in https://github.com/equinor/design-system/pull/2542

## [0.22.0] - 2022-09-29

### Fixed

- ♻️ Replaced usage of nullish coalescing operator by @mimarz in https://github.com/equinor/design-system/pull/2530
- 🐛 Popover: removed `overflow: hidden` from `Popover.Content` by @martalalik in https://github.com/equinor/design-system/pull/2524
- 🐛 Tabs, storybook: scroll with prev/next buttons story improvements by @oddvernes in https://github.com/equinor/design-system/pull/2500
- 🐛 Autocomplete: fixed missing z-index on dropdown by @oddvernes in https://github.com/equinor/design-system/pull/2503
- 🐛 Popover: fixed missing arrow by @oddvernes in https://github.com/equinor/design-system/pull/2507

### Added

- ✨ Created new `ToggleButton` component by @martalalik in https://github.com/equinor/design-system/pull/2458
- ✨ Divider: Added `size` prop by @oddvernes in https://github.com/equinor/design-system/pull/2519
- 📝 Sidesheet, storybook: Drag-to-resize sidesheet story by @oddvernes in https://github.com/equinor/design-system/pull/2491
- 📝 Popover, storybook: Persistent popover story by @martalalik in https://github.com/equinor/design-system/pull/2511
- ✨ TopBar: Added `sticky` prop to toggle static or sticky positioning by @martalalik in https://github.com/equinor/design-system/pull/2508

### Changed

- 🎨 Scrim: Use Floating-UI `FloatingOverlay` to improve scroll-lock and remove content jump by @martalalik in https://github.com/equinor/design-system/pull/2513

## [0.21.0] - 2022-09-08

### Fixed

- 💄 Fixes to make sure both `style` and `className` are applied to outermost element (changes to `switch`, `NativeSelect`, `Radio`, `Checkbox`, `Search`, `Autocomplete`) by @oddvernes in https://github.com/equinor/design-system/pull/2367
- 🐛 Popover: changed to `overflow: auto` by @oddvernes in https://github.com/equinor/design-system/pull/2431

### Added

- ✨ `Autocomplete`: Added disable clear button prop (`hideClearButton`) by @Simrayz in https://github.com/equinor/design-system/pull/2378
- ✨ Added `width` prop to `SideSheet` by @martalalik in https://github.com/equinor/design-system/pull/2399
- ✨ `Button` is now a proper overridable component (can be rendered as another component/element-type with the `as` prop and typescript will only allow valid props for that component) by @oddvernes in https://github.com/equinor/design-system/pull/2410
- ✨ Make `Typography` an overridable component by @oddvernes in https://github.com/equinor/design-system/pull/2432
- ✨ Make `Breadcrumb` an overridable component by @oddvernes in https://github.com/equinor/design-system/pull/2442
- ✨ Created `Button.Group` wrapper component by @martalalik in https://github.com/equinor/design-system/pull/2420

### Changed

- ♻️ Replaced `popperjs` with `floating-UI` in `Tooltip` by @oddvernes in https://github.com/equinor/design-system/pull/2377
- ♻️ Replaced `popperjs` with `floating-UI` in `Popover` by @oddvernes in https://github.com/equinor/design-system/pull/2384
- ♻️ Replaced `popperjs` with `floating-UI` in `Menu` by @oddvernes in https://github.com/equinor/design-system/pull/2405
- ♻️ Replaced `popperjs` with `floating-UI` in `Autocomplete` by @oddvernes in https://github.com/equinor/design-system/pull/2460
- 📝 Updated `Typography` documentation in storybook by @martalalik in https://github.com/equinor/design-system/pull/2247
- 🗑️ `Card`: removed logic to style cursor based on `onClick` listener being present by @oddvernes in https://github.com/equinor/design-system/pull/2436
- 💄 `Topbar`: inline padding reduced from 40 to 24px by @oddvernes in https://github.com/equinor/design-system/pull/2451

## [0.20.4] - 2022-06-24

### Added

- 📝 App launcher documentation by @martalalik in https://github.com/equinor/design-system/pull/2303

### Fixed

- 🐛 Using `Icon` `data` should work properly if `size` is not defined by @mimarz in https://github.com/equinor/design-system/pull/2327
- 🐛 Fixed `TextField` `style` prop being sent container and inner input by @mimarz in https://github.com/equinor/design-system/pull/2337
- 🐛 Fixed `Autocomplete` `onOptionsChange` when not controlled & cleaned up react hooks form example by @mimarz in https://github.com/equinor/design-system/pull/2335

## [0.20.3] - 2022-06-20

### Added

- ✨ Elevation options to Card/Banner/TopBar by @oddvernes in https://github.com/equinor/design-system/pull/2313

### Fixed

- 🐛 TypographyTemplate in Tab by @martalalik in https://github.com/equinor/design-system/pull/2316
- 🐛 Improved Autocomplete object comparisons for showing all available options on open by @mimarz in https://github.com/equinor/design-system/pull/2322

## [0.20.2] - 2022-06-16

### Added

- `Accordion` now has a new sub-component; `Accordion.HeaderActions`! This should make it easier to have interactive elements in the `Accordion.Header` while maintaining proper a11y. ([#2091](https://github.com/equinor/design-system/pull/2091))

### Fixed

- `Autocomplete`
  - Should no longer trigger re-renders when closed. ([#2295](https://github.com/equinor/design-system/pull/2295))
  - Should now correctly update if options are changed after initialization. ([#2304](https://github.com/equinor/design-system/pull/2304))
  - `onOptionsChange` should now properly trigger when controlled in single select mode. ([#2300](https://github.com/equinor/design-system/pull/2300))
  - Bumped dropdown `z-index` to match other EDS components. ([#2309](https://github.com/equinor/design-system/pull/2309))

## [0.20.1] - 2022-06-09

### Deprecated

- `ariaLabelledby` has been deprecated on `Slider`. Use `aria-labelledby` instead. ([#2173](https://github.com/equinor/design-system/pull/2173))

## [0.20.0] - 2022-06-08

### Added

- New component! 🎉 `Autocomplete` has been moved from our labs to core! ([#2201](https://github.com/equinor/design-system/pull/2201))
  - This is a new component based on feedback from `MultiSelect` & `SingleSelect` aimed resolving their shortcomings, complexity and improve further development

### Changed

- Improved `Progress` legibility ([#2182](https://github.com/equinor/design-system/pull/2182))
- Improved `Slider` legibility ([#2173](https://github.com/equinor/design-system/pull/2173))
- `Card` is now less opinonated making it easier to use inside flex/grid containers ([#2273](https://github.com/equinor/design-system/pull/2273))
- Upgraded dev dependencies, fixed missing types in Slider & removed `Menu.Item` memo as it was not working as intended ([#2183](https://github.com/equinor/design-system/pull/2183))

### Deprecated

- `MultiSelect` has been deprecated in favour of `<Autocomplete multiple />`. ([#1537](https://github.com/equinor/design-system/pull/1537))
- `SingleSelect` has been deprecated in favour of `<Autocomplete />`. ([#1537](https://github.com/equinor/design-system/pull/1537))

### Fixed

- `Table.Cell` height should now be correct in `Table.Head` ([#2197](https://github.com/equinor/design-system/pull/2197))
- `Tabs` should no longer throw error if `onChange` is not defined ([#2196](https://github.com/equinor/design-system/pull/2196))
- `Popover` should now have correct typings for `onClose` ([#2264](https://github.com/equinor/design-system/pull/2264))
- `Search` should no longer display blue background on Chrome when `autocomplete` is defined ([#2160](https://github.com/equinor/design-system/pull/2160))

## [0.19.0] - 2022-04-06

### Added

- `Menu` now supports keyhandling on anchor element for open & focus on `Enter`/`ArrowUp`/`ArrowDown` ([#1936](https://github.com/equinor/design-system/issues/1936))
  - Users now need to store anchor element in `useState` for correct re-renders & listening events

### Removed

- `Menu` no longer has `focus` property as focus is now handled internally ([#1936](https://github.com/equinor/design-system/issues/1936))

### Changed

- Adjustments to focus outline visibility ([#1733](https://github.com/equinor/design-system/issues/1733))

### Fixed

- `Menu` should no longer crash when using conditional rendering inside on children such as `Menu.Item` or `Menu.Section` ([#2015](https://github.com/equinor/design-system/issues/2015))
- Hide top divider when `Menu.Section` is first child in `Menu` ([#2015](https://github.com/equinor/design-system/issues/2015))
- `Scrim.Content` should now work with global eventlisteneres ([#2092](https://github.com/equinor/design-system/issues/2092))
- `Slider` should now reposition dots correctly if value is changed ([#2118](https://github.com/equinor/design-system/issues/2118))

## [0.18.0] - 2022-02-18

### Added

- Added support for `18`px `Icon` size in preparation for compact mode ([#1827](https://github.com/equinor/design-system/issues/1827))
- `Tabs`: Enabled `Tabs.List` horizontal overflow. ([#1650](https://github.com/equinor/design-system/issues/1650))
  - Added `scrollable` prop which adds `overflow-x: auto` to the tabs for users that wants a scrollbar.
  - Otherwise this is now `overflow-x: hidden` and there is an example added in Storybook for how to implement "previous" and "next" buttons to navigate an overflowed list.
- New dependency: ([@equinor/eds-utils](https://www.npmjs.com/package/@equinor/eds-utils)). Utility functions and hook have been moved out of eds-core-react and into its own package ([#1846](https://github.com/equinor/design-system/issues/1846))

### Changed

- `Dialog` is now opened in a portal and within a scrim. It is now controlled via an `open` property. `isDismissable` and `onClose` properties were also added to conform to other similar components. ([#1177](https://github.com/equinor/design-system/issues/1177))
- `Dialog`: Moved padding from outer element to subcomponents. Added new subcomponent `Dialog.Header`, and added `Dialog.Content` as an alias to `Dialog.CustomContent` ([#1896](https://github.com/equinor/design-system/issues/1896))
- `Popover`: Moved padding from outer element to subcomponents. Added two new subcomponents `Popover.Actions` and `Popover.Header`. Removed fixed close button (see storybook for example of how this can be added using existing components instead). ([#1365](https://github.com/equinor/design-system/issues/1365))
- Increased z-index on certain components to match that of MUI's z-indexes ([#1981](https://github.com/equinor/design-system/issues/1981))

### Fixed

- Fixed a bug where scroll on body was not restored after closing `Scrim` ([#1892](https://github.com/equinor/design-system/issues/1892))
- Fixed an issue with `Menu` `onClose` where potentially a function could be called after unmounting the component. ([#1898](https://github.com/equinor/design-system/issues/1898))
- Fixed `Menu.Item` `onClick` not triggering with keyboard enter ([#1910](https://github.com/equinor/design-system/issues/1910))
- Fixed an issue where opening `Menu` using keyboard navigation while scrolled down would cause page to scroll to top ([#1932](https://github.com/equinor/design-system/issues/1932))
- Removed reference to `window` in `Snackbar` and `Tooltip` which broke server side rendering ([#1970](https://github.com/equinor/design-system/issues/1970))
- Fixed an issue where trying to add a `style` tag to `Tooltip` would break the rendering ([#1982](https://github.com/equinor/design-system/issues/1982))

## [0.17.0] - 2021-12-22

### Added

- `Scrim` is now controlled via an `open` property. ([#1176](https://github.com/equinor/design-system/issues/1176))

### Changed

- Improvements to `Menu` & `Popover` DOM imprint when closed and subsuquent opennings. ([#1675](https://github.com/equinor/design-system/issues/1675))

### Removed

- `event` & `open` was removed as parameters to the `onClose` callback for `Scrim`. ([#1176](https://github.com/equinor/design-system/issues/1176))

### Fixed

- `MultiSelect` should now clear properly on blur and clicking clear button. ([#1664](https://github.com/equinor/design-system/issues/1664))
- Improved `TextField` a11y for when error messages are displayed as `helperText`. ([#1145](https://github.com/equinor/design-system/issues/1145))
- `Button` in tables should now have proper stacking context for sticky table header. ([#1816](https://github.com/equinor/design-system/issues/1816))

## [0.16.1] - 2021-12-07

### Changed

- Bundle tree-shaked ramda instead of having it as dependency to avoid security warning for users by unused ramda functions ([#1768](https://github.com/equinor/design-system/issues/1768))

## [0.16.0] - 2021-12-02

### Changed

- Esm package is now unbundled enabling tree-shaking ([#1043](https://github.com/equinor/design-system/issues/1043))
- Adjusted `browserslist` to `defaults, not IE 11` resulting in less babel transpiled code and polyfill bloat ([#1043](https://github.com/equinor/design-system/issues/1043))

### Added

- Native support for `focus-visible` (enables focus-ring on elements when using `TAB` key). [Browser support](https://caniuse.com/?search=focus-visible) ([#1043](https://github.com/equinor/design-system/issues/1043))

### Removed

- Removed umd package from build. ([#1043](https://github.com/equinor/design-system/issues/1043))
- Removed [focus-visible polyfill](https://github.com/WICG/focus-visible), while still retaining support for it in the components. Users who need to support focus-visible in Safari now have to add the polyfill themselves. ([#1043](https://github.com/equinor/design-system/issues/1043))

## [0.15.0] - 2021-12-01

## Added

- New sub-component `Card.Content` for content inside `Card`. ([#1711](https://github.com/equinor/design-system/issues/1711))

## Changed

- Adjusted `Topbar.Actions` to vertically align elements. ([#1680](https://github.com/equinor/design-system/issues/1680))
- Adjusted `Card.Media` spacings. ([#1713](https://github.com/equinor/design-system/issues/1713))

## Fixed

- `Menu.Item` focus should no longer jump after being re-opened. ([#1681](https://github.com/equinor/design-system/issues/1681))
- Keyboard interaction in `Menu` should now work as intended. ([#1702](https://github.com/equinor/design-system/issues/1702))
- Focus should now return to anchor when `Menu` is closed by esc/enter. ([#1704](https://github.com/equinor/design-system/issues/1704))
- Replaced deprecated `HTMLTableHeaderCellElement` & `HTMLTableDataCellElement` types with `HTMLTableCellElement`.([#1739](https://github.com/equinor/design-system/issues/1739))
- `Search` clear button is now an actual button! Rejoice a11y! ([#1737](https://github.com/equinor/design-system/issues/1737))

### Removed

- `Card` no longer has padding, its now moved to the individual sub-components. Use `Card.Content` for padded content inside `Card`. ([#1711](https://github.com/equinor/design-system/issues/1711))

## [0.14.3] - 2021-11-16

### Fixed

- `Menu` should now have correct focus when clicking & navigating with keyboard ([#1668](https://github.com/equinor/design-system/issues/1668))
- `Menu` now puts `className` on container element so its easier to apply your own styles ([#1672](https://github.com/equinor/design-system/issues/1672))
- `Breadcrumbs.Breadcrumb` will now respect your `href` again ([#1687](https://github.com/equinor/design-system/issues/1687))

### Changed

- `Slider` now accepts decimal values ([#724](https://github.com/equinor/design-system/issues/724))

## [0.14.2] - 2021-10-21

### Fixed

- `Switch` hover effect broke in the previous release, this is now fixed ([#1641](https://github.com/equinor/design-system/issues/1641))

### Changed

- `Radio`, `Checkbox`: Removed extra padding between input clickbounds and label ([#1640](https://github.com/equinor/design-system/issues/1640))

## [0.14.1] - 2021-10-19

### Added

- Hover effects are wrapped with Media Query to only target devices with mouse pointer ([#1589](https://github.com/equinor/design-system/issues/1589))
- `Pagination` control now changes to first page if the `itemsPerPage` value changes ([#1621](https://github.com/equinor/design-system/issues/1621))

### Fixed

- `Tooltip` now works when wrapping `Radio` or `Checkbox` ([#1605](https://github.com/equinor/design-system/issues/1605))
- Fixed an issue where an external themeprovider can overwrite unset values in certain components ([#1617](https://github.com/equinor/design-system/issues/1617))
- `Scrim` now correctly covers entire screen when used in conjunction with the css `zoom` property ([#1625](https://github.com/equinor/design-system/issues/1625))
- `Scrim` now disables scroll on body when open ([#1587](https://github.com/equinor/design-system/issues/1587))

### Changed

- `Radio`, `Checkbox` refactored to no longer be wrapped in `label`-element when no label-prop is provided ([#1610](https://github.com/equinor/design-system/issues/1610))
- `Switch` refactored to no longer be wrapped in `label`-element when no label-prop is provided ([#1613](https://github.com/equinor/design-system/issues/1613))
- Updated `Accordion` non-interactive icons color ([#1296](https://github.com/equinor/design-system/issues/1296))

## [0.14.0] - 2021-09-30

### Added

- New `placement` property for `Snackbar` for more placement variety ([#1488](https://github.com/equinor/design-system/issues/1488))
- "Clear selection" button for `SingleSelect` & `MultiSelect` ([#1411](https://github.com/equinor/design-system/issues/1411))
- `SingleSelect` & `MultiSelect` will show all items when reopnened, with selected items being highlighted ([#1065](https://github.com/equinor/design-system/issues/1065))
- `SingleSelect` & `MultiSelect` will now open on focus ([#1165](https://github.com/equinor/design-system/issues/1165))

### Fixed

- Missing `readOnly` styles for `Textfield` ([#1162](https://github.com/equinor/design-system/issues/1162))
- `Tooltip` should now respect external handlers ([#1558](https://github.com/equinor/design-system/issues/1558))
- `TextField` should now respect external handlers ([#1538](https://github.com/equinor/design-system/issues/1538))
- `Popover` should now only close on `ESC` key when is open ([#1529](https://github.com/equinor/design-system/issues/1529))
- `Breadcrumbs.Breadcrumb` will now be rendered as `span` when `href` is undefined to avoid duplicate `a` elements when used with router packages ([#1505](https://github.com/equinor/design-system/issues/1505))
- `Snackbar` & `Banner` components should now accept `ref` properties! ([#810](https://github.com/equinor/design-system/issues/810))
- `Tooltip` should now work when used in combination with `Popover` or `Menu` with anchor elements ([#1496](https://github.com/equinor/design-system/issues/1496))
- Adjustments and added missing `compact` styling for `Radio` ([#1580 ](https://github.com/equinor/design-system/pull/1580))

### Changed

- Reduced focus offset for `Button` variant `ghost_icon` ([#1565 ](https://github.com/equinor/design-system/issues/1565))
- Cleaned up styling i `Card.Actions` ([#1520 ](https://github.com/equinor/design-system/issues/1520))
- `Search` & `Accordion` icon sizes are aligned with other components ([#1403](https://github.com/equinor/design-system/issues/1403))
- Adjusted colors for select components ([#1514](https://github.com/equinor/design-system/issues/1514))
- Adjusted focus and label spacing for `Switch` ([#1567](https://github.com/equinor/design-system/issues/1567))

### Removed

- `Snackbar` `leftAlignFrom` property is replaced by `placement` for more placement options. ([#1488](https://github.com/equinor/design-system/issues/1488))

## [0.13.1] - 2021-07-16

### Fixed

- Jest/react-testing-library errors in bundle when using with Webpack 5 ([#1490](https://github.com/equinor/design-system/issues/1490)) & ([#1406](https://github.com/equinor/design-system/issues/1406))
- Snackbar timeout improvements to avoid "missed" timeout ([#1486](https://github.com/equinor/design-system/issues/1486))
- Snackbar centering was wrong when used inside certain elements ([#1172](https://github.com/equinor/design-system/issues/1172))
- Snackbar stacking content order, should now be on top most of the time ([#1173](https://github.com/equinor/design-system/issues/1173))

## [0.13.0] - 2021-07-15

### Added

#### Compact components part 1 ([#1249](https://github.com/equinor/design-system/issues/1249))

- Compact mode can be activated by using the `EdsProvider` as a parent component and setting the `density` property to `"compact"`. This will toggle compact mode on all nested components.
- Components with compact support:
  - `TextField`
  - `Input`
  - `Checkbox`
  - `Menu`
  - `NativeSelect`
  - `SingleSelect`
  - `MultiSelect`
  - `Button`
  - `Switch`
  - `Table`
- Example:

```typescript
// This renders a compact Table with compact Button & Checkbox inside
<EdsProvider density="compact">
  <Table>
    <Table.Body>
      <Table.Row>
        <Table.Cell>
          <Button>Compact</Button>
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <Checkbox />
        </Table.Cell>
      </Table.Row>
      ...
    </Table.Body>
  </Table>
</EdsProvider>
```

### Fixed

- `TopBar` missing bottom-border ([#1395](https://github.com/equinor/design-system/issues/1395))
- Wrong types in the `onChange` callback in `Pagination` ([#1397](https://github.com/equinor/design-system/issues/1397))
- Misaligned `Icon` when used inside `Button` variant `ghost_icon` ([#1423](https://github.com/equinor/design-system/issues/1423))
- `TextField` lost focus if `inputIcon` was toggled conditionally ([#1425](https://github.com/equinor/design-system/issues/1425))
- `TextField` with `inputIcon` had wrong border color ([#1425](https://github.com/equinor/design-system/issues/1425))
- Typo in `Accordion` `displayName` ([#1450](https://github.com/equinor/design-system/pull/1450))
- Disabled `Button` was not disabled if `href` was set ([#1456](https://github.com/equinor/design-system/issues/1456))
- Stacking order for overlay components (`Menu`, `Popover`, `Scrim` etc.) ([#1462](https://github.com/equinor/design-system/issues/1462), [#1466](https://github.com/equinor/design-system/issues/1466))

### Changed

- Darker hover background in `Menu` for better accessibility ([#1363](https://github.com/equinor/design-system/issues/1363))
- `Switch` sizes, hover, label spacing and focus frame to match the design in Figma ([#1433](https://github.com/equinor/design-system/issues/1433))
- Optional `label` for `Switch` ([#1445](https://github.com/equinor/design-system/issues/1453)), `Checkbox` ([#1425](https://github.com/equinor/design-system/issues/1453)), `Radio` ([#1459](https://github.com/equinor/design-system/issues/1459))

## [0.12.1] - 2021-05-28

### Fixed 🐛

- Multiline `TextField` did not follow `rowsMax` rules on initial render [(#1367)](https://github.com/equinor/design-system/issues/1367)
- Multiline `TextField` resized on input when having a fixed height [(#1375)](https://github.com/equinor/design-system/issues/1375)
- Wrong spacing in `Button` when an icon was used [(#1364)](https://github.com/equinor/design-system/issues/1364)

### Changed

- Clarified `Radio` story [(#1382)](https://github.com/equinor/design-system/issues/1382)
- Reduced line-height on `Typography` (for `h1`, `h2` & `h3`) [(#1370)](https://github.com/equinor/design-system/issues/1370)

## [0.12.0] - 2021-05-21

### Added

- `TextField` has a new property, `rowsMax` for determining how many rows it will grow before overflow (scrollbars) show [(#1336)](https://github.com/equinor/design-system/issues/1336)

### Fixed 🐛

- `Menu` did not respect anchor position when used with conditional rendering [(#1330)](https://github.com/equinor/design-system/issues/1330)
- Wrong `Tooltip` position if surrounding content would skew its anchor element [(#1331)](https://github.com/equinor/design-system/issues/1331)
- Tweaks to `Menu`, `Popover` & `Tooltip` component and stories in terms of `a11y` use-cases with screen-readers [(#1352)](https://github.com/equinor/design-system/issues/1352)

### Changed

- Improvements to `useCombinedRef` hook [(#1347)](https://github.com/equinor/design-system/issues/1347)
- `Menu` is now using React portals and positioned under `body` [(#1352)](https://github.com/equinor/design-system/issues/1352)
- `Tooltip` is now conditionally rendered internally [(#1341)](https://github.com/equinor/design-system/issues/1341)

## [0.11.1] - 2021-05-06

### Fixed 🐛

- Missing border on "outlined" `Button` ([#1332](https://github.com/equinor/design-system/issues/1332))

## [0.11.0] - 2021-05-05

### Added

- Export types for all sub-components ([#1127](https://github.com/equinor/design-system/issues/1127))

### Fixed 🐛

- Hide `Tooltip` when `title` is empty string ([#1292](https://github.com/equinor/design-system/issues/1292))
- `Tooltip` errors when used in SSR(server-side rendering) ([#1230](https://github.com/equinor/design-system/issues/1230))
- `Tooltip` being stuck when scrolling while open([#1325](https://github.com/equinor/design-system/issues/1325))
- Too big offset on focus-frame for `Button` ([#1218](https://github.com/equinor/design-system/issues/1218))

### Removed

- Sub-components exposed with double names ([#1317](https://github.com/equinor/design-system/issues/1317))

## [0.10.1] - 2021-04-15

### Fixed 🐛

- Missing typescript suggestions on property `placement` ([#1229](https://github.com/equinor/design-system/issues/1229))
- Crashing `Tooltip` component when refreshing using SSR ([#1230](https://github.com/equinor/design-system/issues/1230))

## [0.10.0] - 2021-04-14

### Added ✨

- New `placement` property on `Menu` to define placement of opened `Menu`. List of available values [here](https://storybook.eds.equinor.com/?path=/docs/navigation-menu--introduction) ([#952](https://github.com/equinor/design-system/issues/952))
- New `anchorEl` property on `Popover`. Use this in combination with `ref` on anchor and `open` on `Popover`. ([#673](https://github.com/equinor/design-system/issues/673))
- New `enterDelay` property on `Tooltip` to delay open ([#1154](https://github.com/equinor/design-system/issues/1154))
- `Tooltip` can now be closed on global `ESC` keypress ([#1195](https://github.com/equinor/design-system/issues/1195))
- `Tooltip` can now be used on `td` elements ([#984](https://github.com/equinor/design-system/issues/984))

### Changed 📓

- `Menu`, `Popover` and `Tooltip`
  - Improved popup logic with the use of [popperJS](https://popper.js.org/) ([#673](https://github.com/equinor/design-system/issues/673))
- Streamlined close logic for
  - `Menu`, `Popover` and `Scrim` ([#1175](https://github.com/equinor/design-system/issues/1175))
- `Menu` property `anchorEl` changed from required to optional ([#1193](https://github.com/equinor/design-system/issues/1193))

### Fixed 🐛

- Missing focus frame on `Breadcrumbs` ([#1134](https://github.com/equinor/design-system/issues/1134))
- Missing props table for `Menu` in Storybook ([#1164](https://github.com/equinor/design-system/issues/1164))
- Missing role on `Banner`([#1178](https://github.com/equinor/design-system/issues/1178))
- Clarified use of `Banner.Actions` in Storybook ([#1188](https://github.com/equinor/design-system/issues/1188))
- Missing focus frame on `Typography` links ([#1203](https://github.com/equinor/design-system/issues/1203))
- Missing disabled colours on `TextField` ([#1161](https://github.com/equinor/design-system/pull/1161))
- Wrong offset on `Button` focus frame ([#1218](https://github.com/equinor/design-system/pull/1218))

### Breaking changes ⚠️

- `Placement` values in `Tooltip` and `Popover` are changed to match [popperJS](https://popper.js.org/). List of available values [here](https://storybook.eds.equinor.com/?path=/docs/data-display-popover--introduction)
- `Popover.Anchor` deprecated, please use the `anchorEl` property on `Popover` instead.
- Removed `open` property on `Tooltip` as it was not working as expected

### Deprecated 🗑

- `Popover.Anchor` deprecated due to streamlined popup logic

## [0.9.2] - 2021-03-19

### Fixed

- Bumped eds-tokens version

## [0.9.0] - 2021-03-17

### Added ✨

- TextField ([#1107](https://github.com/equinor/design-system/issues/1107), [#1108](https://github.com/equinor/design-system/issues/1108), [#1111](https://github.com/equinor/design-system/issues/1111), [#1115](https://github.com/equinor/design-system/issues/115), [#1131](https://github.com/equinor/design-system/issues/1131), [#1128](https://github.com/equinor/design-system/issues/1128))
  - `Input` and `Label` is now available as separate components. This will make it easier to customize for more advanced patterns or for making your own custom components for specialized use-cases.
  - `TextField` now support `unit` inside the input field. This is useful for e.g. currency and units of measurement.

### Changed 📓

- Textfield
  - Improvements when using the `Icon` in the `inputIcon` and `helperIcon` props. This makes the behaviour here more similar to the rest of the EDS library. ([#1130](https://github.com/equinor/design-system/issues/1130))
  - Internal fixes and optimization

### Fixed 🐛

- Textfield
  - Fixed missing disabled colors ([#1160](https://github.com/equinor/design-system/issues/1160))

## [0.8.5] - 2021-02-22

### Added ✨

- Progress indicators ([#1090](https://github.com/equinor/design-system/issues/1090), [#1098](https://github.com/equinor/design-system/issues/1098))
  - `Circular`, `Star` and `Dots` now have a `size` property for adjusting size.
  - `Circular` and `Dots` now have a `color` property following the same color scheme as our other components.
  - Refactored as compound components. You can now find the progress indicators under `Progress`, such as `Progress.Dots`, `Progress.Star` etc..
    - The individual `LinearProgress`, `CircularProgress`, `StarProgress` & `DotProgress` will be removed at a later time
- `Accordion.Header` now has an `onToggle` callback to help defer rendering of content when `Accordion` are opened/closed ([#1121](https://github.com/equinor/design-system/pull/1121))

### Fixed 🐛

- Adjusted text and icon placements inside `Button` so that `Icon` (svg) will always align to the sides regardless of button width ([#1085](https://github.com/equinor/design-system/issues/1085))
- Fixed `Menu` story where content would skew the `MenuItem` height (#1104)
- Progress indicators ([#1090](https://github.com/equinor/design-system/issues/1090), [#1098](https://github.com/equinor/design-system/issues/1098))
  - Adjustments so that `Circular` and `Dots` can be used inside `Button`
  - Cleaned up component so that they are pure svgs now (except for `Linear`)

### Changed 📓

- Cleaned up sub-component naming, so no more repeating names such as, `Card.CardActions` or `Menu.MenuSection` ([#1083](https://github.com/equinor/design-system/issues/1083))
  - The old sub-component names are still there but will be removed at a later time
- Updated our storybook stories to better reflect usages of components with sub-components ([#1094](https://github.com/equinor/design-system/issues/1094))

### Deprecated

- Progress indicators ([#1090](https://github.com/equinor/design-system/issues/1090))
  - Removed `variant` property on `Dots` (replaced by `color` property)
- `Button` do no longer force size on nested `Icon`

## [0.8.4] - 2021-01-21

### Added ✨

- Active, error and hover states in `Table` ([#940](https://github.com/equinor/design-system/issues/940))
- Support for toggling sortable Table column styling. New property `sort` on `Table.Cell` ([#983](https://github.com/equinor/design-system/issues/983))
- Sticky Table head (#1031). New property `sticky` on `Table.Head`

### Fixed 🐛

- Tests for Table ([#297](https://github.com/equinor/design-system/issues/297))
- Missing primary color on `Button` `variant="ghost_icon"` ([#986](https://github.com/equinor/design-system/issues/986))
- Hover bug on touch devices ([#987](https://github.com/equinor/design-system/issues/987))
- Icon bug in Storybook when changing name ([#955](https://github.com/equinor/design-system/issues/955))
- `SingleSelect` items are properly updated when changed after initial render (#1064)

### Changed 📓

- Improved `Table.Cell` ([#997](https://github.com/equinor/design-system/issues/997))
- Refactored Table to use React.forwardRef (#1007)

### Deprecated

- `Table.Cell` `as` property on is removed. This had to be done due to technical limitations with new features. `Table.Cell` will now automatically render `th` or `td` based on "parent" element.

## [0.8.3] - 2020-12-14

### Fixed

- Fixed unintended full width on `<Button />` ([#](https://github.com/equinor/design-system/pull/976))

## [0.8.2] - 2020-12-11

### Fixed

- Use newest versions of @equinor/eds-icons and @equinor/eds-tokens

## [0.8.0] - 2020-12-09

### Added ✨

- `SingeSelect` component ([#896](https://github.com/equinor/design-system/issues/896))
- `MultiSelect` component ([#897](https://github.com/equinor/design-system/issues/897))

### Fixed 🐛

- Fix wrong spacings inside `Chip` causing the content to not be proper centered ([#956](https://github.com/equinor/design-system/issues/956))
- Hover size on ghost buttons ([#595](https://github.com/equinor/design-system/issues/595))

### Changed 📓

- Use base tokens in `Button` component ([#831](https://github.com/equinor/design-system/issues/831))
- Use base tokens in `Table` component ([#830](https://github.com/equinor/design-system/issues/830))
- Support for React 17 ([#813](https://github.com/equinor/design-system/issues/813))
- Update dependencies ([#904](https://github.com/equinor/design-system/issues/904))

## [0.7.1] - 2020-11-26

### Changed 📓

- Updated README.md

## [0.7.0] - 2020-11-26

### Added ✨

- Types, as part of the [Typescript Milestone](https://github.com/equinor/design-system/milestone/7?closed=1)
- `NativeSelect` component ([#509](https://github.com/equinor/design-system/issues/509))
- `Table` caption ([#621](https://github.com/equinor/design-system/issues/621))
- `isExpanded` prop to control `Accordion` externally ([#677](https://github.com/equinor/design-system/issues/677))

### Fixed 🐛

- Added a guard clause to handle null values for `Accordion` children ([#688](https://github.com/equinor/design-system/issues/688))
- `CardMedia` spacing bug ([#603](https://github.com/equinor/design-system/issues/603))
- Added props spread to `BannerAction` ([#478](https://github.com/equinor/design-system/issues/478))
- `Pagination` bug ([#647](https://github.com/equinor/design-system/issues/647))
- Bundle improvements ([#627](https://github.com/equinor/design-system/issues/627))
- Cleaned up leaking `devDependencies` ([#862](https://github.com/equinor/design-system/issues/862))
- Hide `Tooltip` when title is empty ([#920](https://github.com/equinor/design-system/issues/920))

### Changed 📓

- Updated `z-index` values for correct layering of the components ([#872](https://github.com/equinor/design-system/issues/872))
- Changed licence from GNU AGPL to MIT ([#852](https://github.com/equinor/design-system/issues/852))
- Clean up use of spacings in `Card` ([#717](https://github.com/equinor/design-system/issues/717))
- Changed module types for better support with `commonjs` and `esm`. Using the `<some-eds-npm-package>/commonjs` path on packages should no longer be needed and will be deprecated in the future ([#887](https://github.com/equinor/design-system/issues/887))
- Removed unused dependencies ([#870](https://github.com/equinor/design-system/issues/870))
- Cleaning and remodelling core-react for the future 💅 ([#887](https://github.com/equinor/design-system/issues/887))

## [0.6.2] - 2020-09-16

### Fixed 🐛

- Fixed `onClose` handler not being called when `MenuItem` was used inside `MenuSection` ([#546](https://github.com/equinor/design-system/issues/546))
- Fixed focus showing when clicking on `MenuItem` ([#544](https://github.com/equinor/design-system/issues/544))
- Fixed an issue where `Divider` did not stretch to full width ([#608](https://github.com/equinor/design-system/issues/608))
- Fixed `Head` styling when `Table` is set to `width: 100%` ([#610](https://github.com/equinor/design-system/issues/610))

### Changed

- Added outside click support for closing `Menu`. Outside clicks will now call the `onClose` handler function. ([#548](https://github.com/equinor/design-system/issues/548))
- Added `data` property to `Icon` component to easily compose icon to be rendered. ([#584](https://github.com/equinor/design-system/issues/584))
  - See `Icon` [README](https://github.com/equinor/design-system/tree/develop/packages/eds-core-react/src/Icon) for more information

## [0.6.1] - 2020-09-04

### Fixed 🐛

- Loosened up on Tabs & TabsPanel typechecking for children ([#539](https://github.com/equinor/design-system/issues/539))

## [0.6.0] - 2020-09-02

### Added

- `<Menu>` component
- `<Pagination>` component

### Fixed 🐛

- Changed background color on `<Tabs>` to transparent ([#533](https://github.com/equinor/design-system/pull/533))
- Improved tooltip inconsistencies when used inside a table ([#488](https://github.com/equinor/design-system/pull/488))
- Fixed Tooltip triggering on some disabled elements ([#479](https://github.com/equinor/design-system/pull/479))
- Fixed misplaced text when using `<Button>` as link or upload ([#482](https://github.com/equinor/design-system/issues/482))
- Fixed wrong color on action buttons in snackbar ([#535](https://github.com/equinor/design-system/issues/535))
- Fixed elevation for dialog ([#534](https://github.com/equinor/design-system/issues/517))

## [0.5.1] - 2020-07-15

### Changed

- Font-weight has been increased to medium in all cases where the font-size is below 16px for improved legibility. This change is most notable in table cells and labels.
- Font-size has been increased and line-height decreased for `<helper>` and `<label>`
- `<Icon>` now uses `currentColor` for its fill value – which means it inherits its fill colour from its parents `color` value
- `<Typography>` now accepts any value for its color property

## [0.4.1] - 2020-07-13

### Added

- `<Typography>` can now limit the number of visible lines, render any typography style in EDS, change the underlying html element and override/extend tokens used for a particular variant
- `<Table>` can now have headers in columns in the table body

### Fixed 🐛

- Fixed horizontal alignment of icons and unintended border-color in `<Button>` in Safari ([#465](https://github.com/equinor/design-system/issues/465))
- Fixed the “off”-colour in `<Switch>`([#466](https://github.com/equinor/design-system/issues/466))
- Fixed an alignment bug in `<Tooltip>`([#408](https://github.com/equinor/design-system/issues/408))
- Fixed alignment of headers in `<Table>`([#407](https://github.com/equinor/design-system/issues/407))

## [0.4.0] - 2020-06-25

### Added

- Breadcrumbs
- Progress
- Snackbar
- `<Button>` can now be rendered as an `<a>` by providing an `href` attribute
- Support for left/right icons inside `<Button`

### Fixed

- Fixed an overflow bug in `<Popover>`([#375](https://github.com/equinor/design-system/issues/375))

### Changed

- Increased `<Button>` icon size to 24px (up from 16px) for greater legibility
- README
  - Moved Progress indicator, Breadcrumbs, Snackbar and Button variations with icons to «Available»
  - Moved Pagination to «In progress»

## [0.3.1] - 2020-06-16

### Fixed

- Fixed a bug where `<Tabs>` steals focus from interactive controls in tab panels. ([#369](https://github.com/equinor/design-system/issues/369))

## [0.3.0] - 2020-06-08

### Added

- Banner
- Popover
- Slider
- Selection controls
- Option to control the `<Search>` component. ([#342](https://github.com/equinor/design-system/issues/342))

### Fixed 🐛

- Fixed a bug where `<Tooltip>` did not close as expected. ([#339](https://github.com/equinor/design-system/issues/339))

### Changed

- README
  - Moved Banner, Popover, Selection controls and Slider to «Available»
  - Moved Progress indicator and Snackbar to «In progress»

## [0.2.2] - 2020-06-02

### Fixed 🐛

- Fixed bug where `<Tabs>` component focused automatically on the active tab on render. ([#329](https://github.com/equinor/design-system/issues/329))

## [0.2.1] - 2020-05-29

### Fixed 🐛

- Fixed bug where `<Search>` component ignored `onFocus` & `onBlur` functions. ([#330](https://github.com/equinor/design-system/issues/330))

## [0.2.0] - 2020-04-30

### Added

- Card
- Tooltip

### Fixed

- `<Button>` component property `type` can now correctly be overridden

### Changed

- README
  - Moved Card and Tooltip to «available»
  - Moved Slider and Popover to «in progress»

## [0.1.4] - 2020-04-20

### Fixed

- Republished with pnpm to fix "workspace:\*" pointers in package.json

## [0.1.3] - 2020-04-16

### Added

- Accordion
- Search
- Table of contents
- Dialog
- Scrim
- Polyfill for :focus-visible

### Changed

- README
  - Moved Accordion, Search, Table of contents, Dialog and Scrim to «available»
  - Moved Tooltip, Navigation Drawer, Menu to «in progress»

## [0.1.2] - 2020-03-23

### Added

- Chips
- Sidesheet

### Changed

- README
  - Moved Chips and Side sheet to «available»
  - Moved Cards, Table of contents, Search and Scrim to «in progress»

## [0.1.1] - 2020-03-11

### Added

- Tabs

### Changed

- README
  - Sorted components alphabetically
  - Moved Tabs to «available»
  - Moved Chips, Dialog and Side Sheet to «in progress»

## [0.1.0] - 2020-02-24

### Added

New components

- Button
  - Ghost icon variant
- List
- TopBar
- Icon
- Tabs

### Changed

- Updated README to me abit more clearer
- Adjustments to to `package.json` to be more in line with our other packages
- New versioning of packages

## [0.0.1-alpha.10] - 2020-01-22

### Fixed

- Faulty build configuration forcing use of umd modules for
- Missing package settings and deprecated npm-script commands
- Malformed changelog

## [0.0.1-alpha.9] - 2020-01-13

### Added

- Textfield alpha component

## [0.0.1-alpha.8] - 2020-01-10

### Changed

- Updated build (wups)

## [0.0.1-alpha.7] - 2020-01-10

### Added

New alpha components:

- Divider
- Table
- Typography

## [0.0.1-alpha.6] - 2019-08-12

### Fixed

- Typo in changelogs

## [0.0.1-alpha.5] - 2019-08-12

### Added

- `@equinor/eds-tokens` as a dependency for tokens

## [0.0.1-alpha.4] - 2019-07-09

### Changed

- Update README

## [0.0.1-alpha.3] - 2019-07-08

### Changed

- Update README

## [0.0.1-alpha.2] - 2019-07-08

### Changed

- Update README
- Add CHANGELOG

## [0.0.1-alpha.1] - 2019-07-08

### Changed

- Publish alpha-version of library
- Copy tokens temporarily to src/tokens
