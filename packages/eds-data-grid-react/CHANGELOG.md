# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0](https://github.com/equinor/design-system/compare/eds-data-grid-react@1.0.0...eds-data-grid-react@v1.1.0) (2025-10-14)


### ✨ Added

* **data-grid:** Add column pinning feature ([#3176](https://github.com/equinor/design-system/issues/3176)) ([e60f98f](https://github.com/equinor/design-system/commit/e60f98fcfdb3e8e8d6b7a48fc25a9c391cd220b8)), closes [#3042](https://github.com/equinor/design-system/issues/3042)
* **data-grid:** Add functionality for manual/external sorting ([#3172](https://github.com/equinor/design-system/issues/3172)) ([0d3cb4d](https://github.com/equinor/design-system/commit/0d3cb4d831864f46a34a0e18ef7d35d2723d33ce))
* **data-grid:** Allow controlling size ([#3268](https://github.com/equinor/design-system/issues/3268)) ([36e1050](https://github.com/equinor/design-system/commit/36e10500820a17ea1b3e4fdf67f7f695e3b44b6f))
* **data-grid:** Expose expansion-state controls ([#3292](https://github.com/equinor/design-system/issues/3292)) ([a4310cd](https://github.com/equinor/design-system/commit/a4310cd1e7b636500eb888a2dcc9e40e6f8c52b2))
* **data-grid:** Expose table-instance via ref ([#3670](https://github.com/equinor/design-system/issues/3670)) ([6869b88](https://github.com/equinor/design-system/commit/6869b88be2b55ab30ea80d9edc5206dad693a5a2)), closes [#3586](https://github.com/equinor/design-system/issues/3586)
* **datagrid:** Hide filter icon when not applied & enable external filters ([#3764](https://github.com/equinor/design-system/issues/3764)) ([a446bb4](https://github.com/equinor/design-system/commit/a446bb43d6f8d2f5ad300d7000cdd4cb7c684d22))
* **datepicker:** Enable custom date-formats ([#3415](https://github.com/equinor/design-system/issues/3415)) ([2f91ed9](https://github.com/equinor/design-system/commit/2f91ed92797bdf42c682e421b86bbaf67247257f))
* **eds-data-grid-react:** ✨ New `ClickableCell` component ([#3868](https://github.com/equinor/design-system/issues/3868)) ([d4a982c](https://github.com/equinor/design-system/commit/d4a982c8c22f2b258e241a27f1b7db5d884b729d))
* **eds-data-grid-react:** 🔥 remove redundant placeholder in DebouncedInput ([#3807](https://github.com/equinor/design-system/issues/3807)) ([3ad09b7](https://github.com/equinor/design-system/commit/3ad09b70c72150fe2a3646402fb2e62e5514784d))
* **eds-data-grid:** add Table Footer component ([5f8015c](https://github.com/equinor/design-system/commit/5f8015c3817b7e9437d3436b65f37552be261da4))
* Table footer in `eds-core-react` & `eds-data-grid-react` ([#3624](https://github.com/equinor/design-system/issues/3624)) ([5f8015c](https://github.com/equinor/design-system/commit/5f8015c3817b7e9437d3436b65f37552be261da4))


### 🐛 Fixed

* **datagrid:** Fix sticky-ness of grouped headers ([#3830](https://github.com/equinor/design-system/issues/3830)) ([3004536](https://github.com/equinor/design-system/commit/3004536f011c6f5dbffb481de2d870df82b35756))
* **eds-core-react, eds-data-grid-react:** :bug: prevent triggering sorting on resize ([#3782](https://github.com/equinor/design-system/issues/3782)) ([066d91a](https://github.com/equinor/design-system/commit/066d91a32b5b0a0a7c8cf2b52a5e12df74cd8563))
* **eds-data-grid-react:** :bug: change module type to ESNext in tsconfig.spec.json ([#3826](https://github.com/equinor/design-system/issues/3826)) ([6f0c22f](https://github.com/equinor/design-system/commit/6f0c22f4d80bf00f882e91c51f54a58ad69b7ae4))
* **eds-data-grid-react:** :bug: Correct story reference ([#3797](https://github.com/equinor/design-system/issues/3797)) ([28ebe3d](https://github.com/equinor/design-system/commit/28ebe3d2c9ed7b808f21d88faffff19f1f443eda))
* **eds-data-grid-react:** 🐛  resolve dynamic row height scrolling issue in virtualised tables ([#3840](https://github.com/equinor/design-system/issues/3840)) ([51f975a](https://github.com/equinor/design-system/commit/51f975a547190c0875d25e6a635f8dc2b6aea4ac))
* **eds-data-grid-react:** 🐛 Add mockup to test to fix test ([#3802](https://github.com/equinor/design-system/issues/3802)) ([47c4ad4](https://github.com/equinor/design-system/commit/47c4ad410c00a64491d8b62b713e76299c3ab85a))
* **eds-data-grid-react:** 🐛 Fix virtualization unmount crash in data grid when navigating away from tabs ([#3969](https://github.com/equinor/design-system/issues/3969)) ([df01e7d](https://github.com/equinor/design-system/commit/df01e7d60571aca8b15377308bed7017661a1837))
* **eds-data-grid-react:** Sortindicator was hidden on custom filters, but should be opposite ([#3599](https://github.com/equinor/design-system/issues/3599)) ([48b11dc](https://github.com/equinor/design-system/commit/48b11dcdb27ea3392ba9dfc49ab063d8dfa12c49))


### 🔧 Chores

* :arrow_up: Upgrade dependencies ([#3795](https://github.com/equinor/design-system/issues/3795)) ([8b5b025](https://github.com/equinor/design-system/commit/8b5b02531eb11949bb85dba719849ed3801ae220))
* ⬆️ Storybook v9 upgrade ([#3976](https://github.com/equinor/design-system/issues/3976)) ([fe76b10](https://github.com/equinor/design-system/commit/fe76b101e344d9dc6889562bb63730768125279f))
* ⬆️ Upgrade dependencies ([#3824](https://github.com/equinor/design-system/issues/3824)) ([3519425](https://github.com/equinor/design-system/commit/35194255d59abbc12b66d2d29bd3446792570ab8))
* ⬆️ Upgrade dependencies ([#3858](https://github.com/equinor/design-system/issues/3858)) ([4f20d86](https://github.com/equinor/design-system/commit/4f20d861c7a2bcf2e810fdc95d3ece80b7a0bd9b))
* ⬆️ Upgrade dependencies ([#3881](https://github.com/equinor/design-system/issues/3881)) ([23479f7](https://github.com/equinor/design-system/commit/23479f7c2eabfdc3bf12243b7904545277595431))
* ⬆️ Upgrade dependencies in all packages ([#3933](https://github.com/equinor/design-system/issues/3933)) ([e67ed39](https://github.com/equinor/design-system/commit/e67ed398d3bc40004366eeff44dda8051691b2dd))
* 🔖 Release eds-core-react, eds-data-grid-react, eds-lab-react, eds-tokens, eds-utils ([#3982](https://github.com/equinor/design-system/issues/3982)) ([f250771](https://github.com/equinor/design-system/commit/f2507710d68e926edf0b2a5164ce896984cb2e20))
* 🔥 Remove individual package lockfiles ([#3930](https://github.com/equinor/design-system/issues/3930)) ([f813224](https://github.com/equinor/design-system/commit/f8132240a2c20ad54db54c2c38e53731852f8c7a))
* **eds-core-react, eds-data-grid-react:** 🔖 Release eds-core-react@0.45.1, eds-data-grid-react@0.7.7 ([#3792](https://github.com/equinor/design-system/issues/3792)) ([fd19cd5](https://github.com/equinor/design-system/commit/fd19cd50ad6b0d8945aceda76ab566d5cd9cae4a))
* **eds-core-react, eds-data-grid-react:** 🔖 Release eds-core-react@0.46.0 and eds-data-grid-react@0.8.0 ([#3809](https://github.com/equinor/design-system/issues/3809)) ([1843474](https://github.com/equinor/design-system/commit/18434740c918e5511487b8a25b00ea1070587d61))
* **eds-core-react, eds-data-grid-react:** 🔖 Release eds-core-react@0.47.0 and eds-data-grid-react@0.8.1 ([f795cb3](https://github.com/equinor/design-system/commit/f795cb34c1c688fb2385a70dd7845461ec1deb53))
* expose createColumnHelper from react-table ([#3451](https://github.com/equinor/design-system/issues/3451)) ([861d752](https://github.com/equinor/design-system/commit/861d7520b9283fa97506fa644d1e5168f0983238))
* extract Resizer and TableCell components ([5f8015c](https://github.com/equinor/design-system/commit/5f8015c3817b7e9437d3436b65f37552be261da4))
* React 19 upgrade ([#4007](https://github.com/equinor/design-system/issues/4007)) ([645e090](https://github.com/equinor/design-system/commit/645e090d66eb7c1d864c8108497d19003e0cf24e))
* update dependencies ([#3783](https://github.com/equinor/design-system/issues/3783)) ([8fb9f2d](https://github.com/equinor/design-system/commit/8fb9f2d9f7c5ea420e67d34e981d9ed7cf694c50))
* upgrade pnpm to v10 and node to v22 ([#3964](https://github.com/equinor/design-system/issues/3964)) ([d8b9848](https://github.com/equinor/design-system/commit/d8b98482913c76dff41f12ff4a1ee2425dcd9b6c))

## [0.9.1] - 2025-09-11

## Fixed

- 🐛 Fix virtualization unmount crash in data grid when navigating away from tabs by @Copilot @torleifhalseth @pomfrida in https://github.com/equinor/design-system/pull/3969

## Changed

- 🔥 Remove individual package lockfiles by @pomfrida in https://github.com/equinor/design-system/pull/3930
- ⬆️ Upgrade dependencies in all packages by @pomfrida in https://github.com/equinor/design-system/pull/3933
- ⬆️ Upgrade pnpm to v10 and node to v22 by @torleifhalseth in https://github.com/equinor/design-system/pull/3964
- ⬆️ Storybook v9 upgrade by @pomfrida in https://github.com/equinor/design-system/pull/3976

## [0.9.0] - 2025-08-27

## Added

- ✨ New `ClickableCell` component by @pomfrida in https://github.com/equinor/design-system/pull/3868

## Fixed

- 🐛 Virtual table and rows with dynamic height by @arkadiy93 in https://github.com/equinor/design-system/pull/3840

## Changed

- ⬆️ Upgrade dependencies by @pomfrida in https://github.com/equinor/design-system/pull/3881

## [0.8.1] - 2025-06-13

## Fixed

- 🐛 Fix sticky-ness of grouped headers by @yusijs in https://github.com/equinor/design-system/pull/3830

## [0.8.0] - 2025-05-19

## Fixed

- 🐛 Fix Storybook docs page error by @pomfrida in https://github.com/equinor/design-system/pull/3797
- 🐛 Add mockup to test @pomfrida in https://github.com/equinor/design-system/pull/3802

## Added

- ✨ Enable external filters, hide filter-icon when not active by @yusijs in https://github.com/equinor/design-system/pull/3764

## Changed

- 🔥 Remove redundant placeholder in DebouncedInput by @pomfrida in https://github.com/equinor/design-system/pull/3807

## [0.7.7] - 2025-05-06

### Fixed

- :bug: Prevent triggering sorting on resize by @torleifhalseth & @pomfrida in https://github.com/equinor/design-system/pull/3782

### Added

- ✨ Add class to pagination wrapper by @o-jorgensen in https://github.com/equinor/design-system/pull/3780

## [0.7.6] - 2025-04-11

### Fixed

- 🐛 Add [effect](https://github.com/equinor/design-system/blob/develop/packages/eds-data-grid-react/src/EdsDataGrid.tsx#L385-L391) to recalculate virtualization when density changes

## [0.7.5] - 2025-01-17

### Added

- ✨ Expose `onRowDoubleClick` event by @oleksiishv in https://github.com/equinor/design-system/pull/3718

## [0.7.4] - 2024-11-15

### Fixed

- 🎨 `ref` is now forwarded to Datagrid by @arkadiy93 in https://github.com/equinor/design-system/pull/3685

## [0.7.3] - 2024-11-11

### Added

- ✨ Expose table-instance via ref (tableInstanceRef) by @yusijs in https://github.com/equinor/design-system/pull/3670

## [0.7.2] - 2024-10-24

### Added

- ✨ Exposed `onRowContextMenu` to enable context menu on right click by @tlastad in https://github.com/equinor/design-system/pull/3658

## [0.7.1] - 2024-10-11

### Added

- ✨ Expose `enableSortingRemoval` flag by @arkadiy93 in https://github.com/equinor/design-system/pull/3636

### Fixed

- 🐛 Added missing `{...props}` spread to allow passing `className`, `style` etc to component by @arkadiy93 in https://github.com/equinor/design-system/pull/3648

## [0.7.0] - 2024-09-17

### Added

- ✨ Support for new table footer sub-component `<Table.Foot>` from eds-core-react. New props: `enableFooter`, `stickyFooter`, `footerClass`, `footerStyle` by @zulu-eq-bouvet in https://github.com/equinor/design-system/pull/3624

## [0.6.2] - 2024-08-28

### Fixed

- 🐛 Sortindicator should be hidden on custom filters by @yusijs in https://github.com/equinor/design-system/pull/3599

## [0.6.1] - 2024-06-04

### Fixed

- 🐛 package.json: restored "engine" requirements to old values

## [0.6.0] - 2024-06-04

### Added

- ✨Expose `enableSubRowSelection` from `react-table` and make it disabled by default by @ana-cepuran in https://github.com/equinor/design-system/pull/3472

## [0.5.0] - 2024-05-27

### Added

- ✨ Added possibility for custom filters by @yusijs in https://github.com/equinor/design-system/pull/3359
- ✨ Expose `createColumnHelper` from `react-table` by @magnh in https://github.com/equinor/design-system/pull/3451
- ✨ Allow enabling/disabling multi row selection with `enableMultiRowSelection` by @mhwaage in https://github.com/equinor/design-system/pull/3355

### Changed

- 📌 Bump required styled-components version to 5.1 by @oddvernes in https://github.com/equinor/design-system/pull/3459
- 🚸✨ Align selection state props with react table by @magnh in https://github.com/equinor/design-system/pull/3456

#### Details of https://github.com/equinor/design-system/pull/3456:

- Warn developer in developer environment when using deprecated props.
- Rename `selectedRows` to `rowSelectionState` and deprecated `selectedRows`.
- Rename `rowSelection` to `enableRowSelection` and deprecated `rowSelection`.
- Add `onRowClick` and `onCellClick` handlers as props.

## [0.4.0] - 2024-02-29

### Added

- ✨ Expose expansion-state controls to allow having multiple nested rows by @yusijs in https://github.com/equinor/design-system/pull/3292
- ✨ Added `defaultColumn` prop to allow overriding things like size, cells etc by @yusijs in https://github.com/equinor/design-system/pull/3300

### Changed

- 🗑️ Deprecated `virtualHeight` prop by @yusijs in https://github.com/equinor/design-system/pull/3301

### Fixed

- 🐛 Fixed prop-spreading that caused warning in next.js applications by @yusijs in https://github.com/equinor/design-system/pull/3300

## [0.3.0] - 2024-02-15

### Added

- ✨ Allow controlling size with new `columnSizing` and `onColumnResize` props by @yusijs in https://github.com/equinor/design-system/pull/3268

### Changed

- 🔧 Update babel compile target to "last 2 Chrome versions, last 2 firefox versions, last 2 safari versions, last 2 edge versions, not dead" by @oddvernes in https://github.com/equinor/design-system/pull/3219
- ⚡️ Improve performance by enabling `contain: strict` when width and height is provided by @magnh in https://github.com/equinor/design-system/pull/3273
- ✨ Improve data grid by @magnh in https://github.com/equinor/design-system/pull/3231

#### Details of https://github.com/equinor/design-system/pull/3231:

- ✨ Reexport `@tanstack/react-table` types to ease typing in apps using the data grid
- 📌 Move `eds-core-react` to peer dependencies
  - This is neccessary because EDS uses React Context and the grid and the project should
    have the same React instance running. This makes it possible to set EDS Density of the
    table above the component.
- ♻️ Move text truncating into default cell to enable overwriting cell content
  - This enables custom cells like popover, autocomplete or other cells that overflows the cell itself.
- 🐛 Inherit row background color for pinned cells
  - This ensures hover color on the whole row when columns are pinned
- 🐛 Support 100% width
  - Support string `width` and `height`
- ✨ Allow setting `minWidth` of table
- ✨ Expose `getRowId` callback from react-table
- ✨ Expose virtualizer ref
  - This is needed to be able to run "scroll to" functionality in apps.
- 🐛 Hide virtualizer rows top and bottom rows when not needed

## [0.2.0] - 2023-12-13

### Added

- ✨ Column pinning feature (adding `columnPinState`, `scrollbarHorizontal`, `width` and `height` props) by @yusijs in https://github.com/equinor/design-system/pull/3176
- ✨ Functionality for manual/external sorting (adding `manualSorting`, `onSortingChange` and `sortingState` props) by @yusijs in https://github.com/equinor/design-system/pull/3172
- ✨ Support for external paginator via a new `externalPaginator` prop by @yusijs in https://github.com/equinor/design-system/pull/3162

### Changed

- 💄 Design improvements to filter functionality by @yusijs in https://github.com/equinor/design-system/pull/3162

## [0.1.0-beta.3] - 2023-09-26

### Added

- ⬆️ Support `Styled-components` v6 by @oddvernes in https://github.com/equinor/design-system/pull/3050

## [0.1.0-beta.2] - 2023-07-13

- ⬆️ Bump to eds-core-react@0.32.2 and added `^` semver range to `eds-core-react`, `eds-utils` and `eds-icons` dependencies
- 📦️ Added commonjs build to output

## [0.1.0-beta.1] - 2023-07-12

- 🎉 Implement `@equinor/eds-data-grid-react` package by @yusijs in https://github.com/equinor/design-system/pull/2931
