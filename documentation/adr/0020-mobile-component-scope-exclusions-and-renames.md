# Mobile component scope: exclusions and renames relative to EDS web

- **Status:** Accepted (recorded retrospectively 2026-09-23)
- **Date:** 2026-04 (opened as design-system-internal#256 on 2026-04-09, settled through 2026-06-25)
- **Decision makers:** Chibuzor Nwemambu, EDS Core Team

## Context

[ADR-0019](./0019-adopt-only-the-component-library-from-mad.md) brought the whole `mad-components` tree into `eds-mobile-components` as a starting point, including components with no counterpart in EDS web and components that only made sense inside MAD's own apps. Migrating that inherited tree toward a library that matches EDS web means going through every component and deciding, one at a time, whether it stays under its existing name, is renamed to fit a mobile idiom, or is excluded for a stated reason — most commonly because the platform already covers the need natively, or because the pattern only makes sense in a pointer/desktop context.

Left undecided, this becomes a question asked once per consuming team: "why doesn't mobile have a date picker / toolbar / bottom sheet?" A gap or a rename with no written reason reads as an oversight instead of a decision. This ADR is the answer, written down once.

Two related notes came out of the same discussion and are recorded here for completeness, though neither is a scope decision in itself:

- `EDSProvider` (with Portal, Scrim, ErrorBoundary) is infrastructure, not a UI component — it underpins every other component and is out of scope for a keep/rename/exclude list.
- The icon set is currently MaterialCommunity Icons; the long-term choice is still pending and not decided by this ADR.

## Decision Drivers

- A component only earns a place in the mobile library if it has a genuine mobile-native usage pattern. Hover-dependent and pointer-dependent web patterns don't translate directly to touch.
- Where the platform or an established third-party library already solves a problem well (native date pickers, native navigation drawers, a dedicated bottom-sheet library), mobile should point to that instead of reimplementing it.
- Where a web term doesn't match mobile vocabulary, rename to the mobile-standard term rather than carry web naming across platforms for its own sake.
- Duplicate components serving the same purpose should be collapsed to one, even if that means retiring a component MAD already had.
- The list of what won't be built has to be explicit and citable, not tribal knowledge repeated per team that asks.

## Options Considered

### Option 1: Build full parity with EDS web

Implement every EDS web component on mobile, including ones with no clear mobile usage pattern.

**Pros:**

- No gaps to explain — every web component has a mobile counterpart
- Consuming teams never have to ask why something is missing

**Cons:**

- Several web components exist only because of a pointer/hover interaction model (Tooltip) or a desktop information density (Table, Pagination, Toolbar) that mobile doesn't have
- Building components with no real mobile usage pattern inflates the maintenance surface for capabilities the platform, or a dedicated library, already covers better (native date picker, native drawer navigation, a dedicated bottom-sheet library)
- Effort goes into components nobody would reach for on mobile instead of the ones consuming teams are actually waiting on

### Option 2: Scope mobile to a mobile-idiomatic subset, with an explicit exclusion and rename list

Implement the web components that map to a real mobile pattern, rename the ones where mobile vocabulary differs, and write down every deliberate gap with its reason.

**Pros:**

- Matches what mobile apps at Equinor actually need instead of mirroring web for its own sake
- Every exclusion has a stated reason instead of being a silent gap, which is what a consuming team can be pointed to directly
- Renames happen once, with a reason, instead of drifting name-by-name as different people migrate different components

**Cons:**

- The list needs periodic revisiting as new mobile patterns or requests surface — it is a default, not a permanent embargo
- A consuming team with a genuine edge-case need for an excluded pattern has to request an explicit exception rather than finding it already built

### Option 3: Decide component-by-component on request, without a standing policy

Take no upfront position; answer each "can we get X" question as it comes in.

**Pros:**

- No upfront documentation effort
- Maximally flexible to whatever a team asks for next

**Cons:**

- The same question gets answered differently depending on who is asked and when, producing exactly the kind of unexplained gap or drifted rename this ADR exists to prevent
- No source of truth for a new team member, or a new consuming team, to check against
- Nothing stops the same excluded component from being quietly rebuilt by a different team later

## Decision

**Adopt Option 2.** `eds-mobile-components` targets a mobile-idiomatic subset of the EDS web component library. Every component in the inherited `mad-components` tree, and every EDS web component, falls into one of three categories: kept under its existing name, renamed or replaced, or explicitly excluded with a reason.

### Renames and replacements

| Component (old)      | Decision                          | Reason                                                                                                                                                                                                                                              |
| -------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OfflineBanner`      | Removed — replaced by `Banner`    | `Banner` is a generic component that covers offline and other use cases, so a dedicated offline variant is unnecessary                                                                                                                              |
| `Snackbar` (EDS web) | Renamed to `Toast` on mobile      | Mobile-standard naming for the same pattern                                                                                                                                                                                                         |
| `Environment`        | Removed, no replacement           | It is a `Banner` with fixed text; consuming teams can compose that themselves                                                                                                                                                                       |
| `PressableHighlight` | Removed — replaced by `Pressable` | `Pressable` is used across all component migrations going forward, so a second pressable primitive is redundant                                                                                                                                     |
| `Multiselect`        | Removed — replaced by `Combobox`  | The multiselect pattern as previously built is scrapped; multi-select support becomes a dedicated `Combobox` component instead of a variant                                                                                                         |
| `Progress`           | Renamed to `Stepper`              | The existing component is a multi-step task tracker (ordered items with status, optional sub-tasks, expandable detail) — a Stepper pattern, not a progress bar. `ProgressIndicator` remains separate and covers the simple loading-bar/spinner case |

None of these renames have shipped yet as of this ADR — `Banner`, `Toast`, `Combobox` and `Pressable` are not yet built. `OfflineBanner`, `Environment` and `PressableHighlight` still exist as unmigrated, unexported top-level directories inherited from `mad-components`, and `Multiselect` still exists as a file inside the `Select` directory. This table records the decision; the vertical-slice migration and release strategy (tracked in [#5515](https://github.com/equinor/design-system/issues/5515)) governs when each lands.

### Explicit exclusions

The following EDS web components are not being implemented on mobile:

| Component     | Reason                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| Paper         | Not a component — use surface/canvas tokens instead                                                    |
| List          | Covered by `Cell`                                                                                      |
| SwipeableRow  | Too app-specific; Gesture Handler's `Swipeable` primitive covers the use case                          |
| Bottom Sheet  | High complexity; teams should use a dedicated bottom-sheet library rather than a custom implementation |
| Tooltip       | No hover state on mobile; contextual overlays use `Popover` instead                                    |
| Slider        | No touch-first equivalent use case; native platform controls serve this need                           |
| Toggle button | `Switch` covers the binary toggle pattern                                                              |
| Date picker   | Use the native platform date picker                                                                    |
| Table         | Not a mobile-native pattern; `Cell`-based lists cover tabular data                                     |
| App launcher  | Not applicable to mobile apps                                                                          |
| Drawer        | Native navigation handles this                                                                         |
| Pagination    | Not a mobile-native pattern; infinite scroll is preferred                                              |
| Toolbar       | Not a standard iOS pattern                                                                             |
| Side sheet    | Native navigation handles contextual panels                                                            |

Everything not listed in either table above — including components with no EDS web equivalent at all, such as `Spacer` and `Cell` — is unaffected by this ADR and is scoped by the migration slices instead.

Neither table is permanent. If a consuming team has a genuine need for an excluded pattern, or a different rename target, that's a request to reopen this decision for that one component, not an exception to work around — build the case, get buy-in from other consuming teams, and a new ADR supersedes this one for that component.

### Consequences

- Good: consuming teams asking why a web component is missing on mobile now get a citable reason instead of an unexplained gap.
- Good: the mobile library stops carrying two components for one purpose (`Multiselect`/`Combobox`, `PressableHighlight`/`Pressable`, `OfflineBanner`/`Banner`), so migration effort isn't spent maintaining both.
- Good: effort is concentrated on components with a real mobile usage pattern rather than spread across web parity for its own sake.
- Bad: the exclusion list can go stale if a genuine mobile need for an excluded pattern emerges later, and nothing here automatically flags that — it has to be caught in review.
- Bad: the renamed components (`Banner`, `Toast`, `Combobox`, `Pressable`) don't exist yet, so until the relevant migration slice ships, the old names remain in the inherited tree and could be confused for the target state by anyone reading the source directly.

### Confirmation

- New component proposals for mobile are checked against the exclusion table before implementation. Building an excluded component means writing a new ADR that supersedes this one for that component, not a silent exception — see the note above on how that request gets made.
- Renames in the table above are the target names for the corresponding migration slice; a slice should not ship a renamed component under its old MAD name.

## Related

- Source discussion: [design-system-internal#256](https://github.com/equinor/design-system-internal/discussions/256)
- Parent discussion, covering the vertical-slice roadmap this ADR does not itself decide: [design-system-internal#255](https://github.com/equinor/design-system-internal/discussions/255)
- [ADR-0019](./0019-adopt-only-the-component-library-from-mad.md) — why the full `mad-components` tree was migrated in the first place, which is the tree this ADR now scopes down
- Tracking issue for this ADR batch: [#5515](https://github.com/equinor/design-system/issues/5515)
