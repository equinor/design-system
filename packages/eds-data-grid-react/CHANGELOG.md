# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.4](https://github.com/equinor/design-system/compare/eds-data-grid-react@v1.2.3...eds-data-grid-react@v1.2.4) (2026-03-03)


### 🐛 Fixed

* **eds-data-grid-react:** reexport RowModel type ([e48496e](https://github.com/equinor/design-system/commit/e48496e407c0d8ac096a790688a8c8a4b444497e))

## [1.2.3](https://github.com/equinor/design-system/compare/eds-data-grid-react@v1.2.2...eds-data-grid-react@v1.2.3) (2026-02-11)


### 🐛 Fixed

* **config:** revert .mjs extension for ESM builds ([#4482](https://github.com/equinor/design-system/issues/4482)) ([4fb957f](https://github.com/equinor/design-system/commit/4fb957f0a9885e0004e4951e9b5a846b8f0c443d))

## [1.2.2](https://github.com/equinor/design-system/compare/eds-data-grid-react@v1.2.1...eds-data-grid-react@v1.2.2) (2026-02-03)


### 🐛 Fixed

* **config:** use .mjs extension for ESM builds ([#4463](https://github.com/equinor/design-system/issues/4463)) ([476a40e](https://github.com/equinor/design-system/commit/476a40ebfd73080e469898ae45d78fcb6cd612d9))

## [1.2.1](https://github.com/equinor/design-system/compare/eds-data-grid-react@v1.2.0...eds-data-grid-react@v1.2.1) (2025-12-15)

### 🐛 Fixed

- **eds-data-grid-react:** update eds-core-react peerDependency to support v2 ([b8f59b9](https://github.com/equinor/design-system/commit/b8f59b9ceb73ee85a000e1b5fc27c6aae9885fab))

## [1.2.0](https://github.com/equinor/design-system/compare/eds-data-grid-react@v1.1.0...eds-data-grid-react@v1.2.0) (2025-12-11)

### ✨ Added

- **eds-color-palette-generator:** fix memory leak from uncleaned debounce timeouts on unmount ([#4260](https://github.com/equinor/design-system/issues/4260)) ([b226edb](https://github.com/equinor/design-system/commit/b226edbc087b1f10ef0a2108d927939819fedc0e))

### 🔧 Chores

- release main ([#4254](https://github.com/equinor/design-system/issues/4254)) ([1313fa1](https://github.com/equinor/design-system/commit/1313fa1f2e2e908a8200f6b8f00e158ef88e917b))

## [1.1.0](https://github.com/equinor/design-system/compare/eds-data-grid-react@v1.0.2...eds-data-grid-react@v1.1.0) (2025-10-29)

### ✨ Added

- **eds-core-react, eds-utils:** Create base typography component and opinionated heading and paragraph ([b2130c6](https://github.com/equinor/design-system/commit/b2130c6f2be82e63549caacf876f263253292f87)), closes [#4125](https://github.com/equinor/design-system/issues/4125)

### 🐛 Fixed

- Use semver ranges for internal eds dependencies ([#4163](https://github.com/equinor/design-system/issues/4163)) ([7cc8abe](https://github.com/equinor/design-system/commit/7cc8abe64f64f4e5a9081e21e19f71947f354c14))

### 🔧 Chores

- ⬆️ Update dependencies ([#4158](https://github.com/equinor/design-system/issues/4158)) ([344e555](https://github.com/equinor/design-system/commit/344e555ff53ed307026ebb68761281a563c3d3cf))

## [1.0.2](https://github.com/equinor/design-system/compare/eds-data-grid-react@v1.0.1...eds-data-grid-react@v1.0.2) (2025-10-22)

### 🔧 Chores

- Rename follow-up ([#4129](https://github.com/equinor/design-system/issues/4129)) ([cae9fc0](https://github.com/equinor/design-system/commit/cae9fc0b3d32394da8d89ddb09c747142dd66f38))

## [1.0.1](https://github.com/equinor/design-system/compare/eds-data-grid-react@1.0.0...eds-data-grid-react@v1.0.1) (2025-10-16)

### 🔧 Chores

- 🔧 Align peer deps across packages ([#4066](https://github.com/equinor/design-system/issues/4066)) ([869afad](https://github.com/equinor/design-system/commit/869afadb4a5a34b2c0f105cd1b834e4c824213aa))

## [1.0.0] - 2025-10-09

This release marks the data grid as **production-ready**. The v1.0.0 milestone signals API stability and our commitment to semantic versioning.

### BREAKING CHANGES ⚠️

- **React 19 Required**: This version requires React >= 19.0.0 and React DOM >= 19.0.0. Previous versions are not compatible with React 19, and this version is not compatible with React 18.

### Changed

- chore: React 19 upgrade by @pomfrida in https://github.com/equinor/design-system/pull/4007

## [0.9.1] - 2025-09-11

### Fixed

- 🐛 Fix virtualization unmount crash in data grid when navigating away from tabs by @Copilot @torleifhalseth @pomfrida in https://github.com/equinor/design-system/pull/3969

### Changed

- 🔥 Remove individual package lockfiles by @pomfrida in https://github.com/equinor/design-system/pull/3930
- ⬆️ Upgrade dependencies in all packages by @pomfrida in https://github.com/equinor/design-system/pull/3933
- ⬆️ Upgrade pnpm to v10 and node to v22 by @torleifhalseth in https://github.com/equinor/design-system/pull/3964
- ⬆️ Storybook v9 upgrade by @pomfrida in https://github.com/equinor/design-system/pull/3976

## [0.9.0] - 2025-08-27

### Added

- ✨ New `ClickableCell` component by @pomfrida in https://github.com/equinor/design-system/pull/3868

### Fixed

- 🐛 Virtual table and rows with dynamic height by @arkadiy93 in https://github.com/equinor/design-system/pull/3840

### Changed

- ⬆️ Upgrade dependencies by @pomfrida in https://github.com/equinor/design-system/pull/3881

## [0.8.1] - 2025-06-13

### Fixed

- 🐛 Fix sticky-ness of grouped headers by @yusijs in https://github.com/equinor/design-system/pull/3830

## [0.8.0] - 2025-05-19

### Fixed

- 🐛 Fix Storybook docs page error by @pomfrida in https://github.com/equinor/design-system/pull/3797
- 🐛 Add mockup to test @pomfrida in https://github.com/equinor/design-system/pull/3802

### Added

- ✨ Enable external filters, hide filter-icon when not active by @yusijs in https://github.com/equinor/design-system/pull/3764

### Changed

- 🔥 Remove redundant placeholder in DebouncedInput by @pomfrida in https://github.com/equinor/design-system/pull/3807

## [0.7.7] - 2025-05-06

### Fixed

- :bug: Prevent triggering sorting on resize by @torleifhalseth & @pomfrida in https://github.com/equinor/design-system/pull/3782

### Added

- ✨ Add class to pagination wrapper by @o-jorgensen in https://github.com/equinor/design-system/pull/3780

## [0.7.6] - 2025-04-11

### Fixed

- 🐛 Add [effect](https://github.com/equinor/design-system/blob/main/packages/eds-data-grid-react/src/EdsDataGrid.tsx#L385-L391) to recalculate virtualization when density changes

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
