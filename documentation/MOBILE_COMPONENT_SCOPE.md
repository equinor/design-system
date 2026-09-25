# Mobile component scope: current exclusions and renames

The current, maintained list of which components — from EDS web or common mobile patterns — `eds-mobile-components` renames, replaces, or explicitly excludes. For why mobile targets a subset of web rather than full parity, and why this list lives here rather than inside an ADR, see [ADR-0020](./adr/0020-mobile-component-scope-exclusions-and-renames.md).

This is a living document, not a frozen decision. Individual rows get revisited as consuming teams make the case for an exception — update the relevant row directly via a normal PR, reviewed like any other doc change. That doesn't need a new ADR: ADR-0020 already decided the _policy_ of case-by-case scoping; only the _application_ of it to one component is changing.

## Renames and replacements

| Component (old)      | Decision                          | Reason                                                                                                                                                                                                                                                                                                                      |
| -------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OfflineBanner`      | Removed — replaced by `Banner`    | `Banner` is a generic component that covers offline and other use cases, so a dedicated offline variant is unnecessary                                                                                                                                                                                                      |
| `Snackbar` (EDS web) | Renamed to `Toast` on mobile      | Mobile-standard naming for the same pattern — the Material Design and React Native ecosystems both call it a toast                                                                                                                                                                                                          |
| `Environment`        | Removed, no replacement           | It is a `Banner` with fixed text; consuming teams can compose that themselves                                                                                                                                                                                                                                               |
| `PressableHighlight` | Removed — replaced by `Pressable` | `Pressable` is used across all component migrations going forward, so a second pressable primitive is redundant                                                                                                                                                                                                             |
| `Multiselect`        | Removed — replaced by `Combobox`  | The multiselect pattern as previously built is scrapped; multi-select support becomes a dedicated `Combobox` component instead of a variant                                                                                                                                                                                 |
| `Progress`           | Renamed to `Stepper`              | The existing component is a multi-step task tracker (ordered items with status, optional sub-tasks, expandable detail) — a Stepper pattern, not a progress bar. `ProgressIndicator` remains separate and covers the simple loading-bar/spinner case; it's also still unmigrated (present in `tsconfig.json`'s exclude list) |

None of these renames have shipped yet — `Banner`, `Toast`, `Combobox` and `Pressable` are not yet built. `OfflineBanner` and `Environment` still exist as unmigrated, unexported top-level directories inherited from `mad-components`; `Progress` is likewise still unmigrated (present in `tsconfig.json`'s exclude list) and will ship as `Stepper` once its slice lands. `Multiselect` still exists as a file inside the `Select` directory. `PressableHighlight`, however, is not an unmigrated leftover — it is already exported from the package (`src/index.ts`) and has five internal consumers (`Tab`, `Chip`, `Cell`, `CellSwipeItem`, `MenuItem`), so removing it is a breaking change to the published API, not a quiet cleanup: all five consumers need to move to `Pressable` first. `Snackbar` has no mobile counterpart today under any name, so `Toast` is a new build rather than a rename of something present. This table records the decision; the vertical-slice migration and release strategy (tracked in [#5515](https://github.com/equinor/design-system/issues/5515)) governs when each lands. Update this paragraph as each one ships.

`Autocomplete` is a separate, distinct component and is unaffected by the `Multiselect`/`Combobox` decision above — it isn't being merged into or replaced by `Combobox`.

## Explicit exclusions

The following components, from EDS web or common mobile patterns, are not offered as public components on mobile:

| Component     | Reason                                                                                                                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Paper         | Not a consumer-facing component — it stays an internal, unexported primitive that other components (`Dialog`, `Menu`, `Popover`) build on; use surface/canvas tokens directly for anything else |
| List          | Covered by `Cell`                                                                                                                                                                               |
| SwipeableRow  | Too app-specific; Gesture Handler's `Swipeable` primitive covers the use case                                                                                                                   |
| Bottom Sheet  | High complexity; teams should use a dedicated bottom-sheet library rather than a custom implementation                                                                                          |
| Tooltip       | No hover state on mobile; contextual overlays use `Popover` instead                                                                                                                             |
| Slider        | No touch-first equivalent use case; native platform controls serve this need                                                                                                                    |
| Toggle button | `Switch` covers the binary toggle pattern                                                                                                                                                       |
| Date picker   | Use the native platform date picker                                                                                                                                                             |
| Table         | Not a mobile-native pattern; `Cell`-based lists cover tabular data                                                                                                                              |
| App launcher  | Not applicable to mobile apps                                                                                                                                                                   |
| Drawer        | Native navigation handles this                                                                                                                                                                  |
| Pagination    | Not a mobile-native pattern; infinite scroll is preferred                                                                                                                                       |
| Toolbar       | Not a standard pattern on iOS, which is what `eds-mobile-components` targets                                                                                                                    |
| Side sheet    | Native navigation handles contextual panels                                                                                                                                                     |

Everything not listed in either table above — including components with no EDS web equivalent at all, such as `Spacer` and `Cell` — is unaffected by this list and is scoped by the migration slices instead (tracked in [#5515](https://github.com/equinor/design-system/issues/5515)).

## Proposing a change

Neither table is permanent. If a consuming team has a genuine need for an excluded pattern, or a different rename target: build the case, get buy-in from other consuming teams, then open a PR updating the relevant row here with the new decision and reason.
