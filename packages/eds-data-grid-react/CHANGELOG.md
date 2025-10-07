# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.9.2](https://github.com/equinor/design-system/compare/eds-data-grid-react@0.9.1...eds-data-grid-react@v0.9.2) (2025-10-07)


### 🔧 Chores

* React 19 upgrade ([#4007](https://github.com/equinor/design-system/issues/4007)) ([645e090](https://github.com/equinor/design-system/commit/645e090d66eb7c1d864c8108497d19003e0cf24e))

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
