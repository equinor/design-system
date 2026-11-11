# Figma's Check designs compared with EDS Variable Migration

Check designs is a built-in Figma feature that lists the raw values and
variables in a selection and suggests a variable or style from a library for
each. It is opened from the **Actions** menu (search for "Check designs") with
layers selected. It was run on 2026-11-11 on **Migration test – old EDS
variables unwired** (node `2321:4243` in the AI Testing file), a copy of the
test frame where most bindings are replaced by raw values.

The published EDS Variable Migration plugin was run in the same file, on the
test frame and on its duplicate, to compare.

## Screenshots

| File                                                                             | What it shows                                                                           |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [check-designs-01-colors.jpg](check-designs-01-colors.jpg)                       | The panel on the Colors tab, with every library enabled: legacy variables are suggested |
| [check-designs-02-suggestion-picker.jpg](check-designs-02-suggestion-picker.jpg) | The picker behind a suggestion, and the layers a row selects on the canvas              |
| [check-designs-03-settings.jpg](check-designs-03-settings.jpg)                   | Settings: row counts, contrast level, and the libraries to suggest from                 |
| [check-designs-04-beta-library.jpg](check-designs-04-beta-library.jpg)           | Colors with only EDS Foundation [EDS Beta]: suggestions by nearest value, Apply 0       |
| [check-designs-05-dimensions.jpg](check-designs-05-dimensions.jpg)               | Dimensions: radii and gaps, legacy variables shown with their value                     |
| [check-designs-06-typography.jpg](check-designs-06-typography.jpg)               | Typography: font, size and line height, with a text style suggested for each            |
| [plugin-01-open.jpg](plugin-01-open.jpg)                                         | The published plugin when it opens, with the last scan kept in the file                 |
| [plugin-02-scanned.jpg](plugin-02-scanned.jpg)                                   | The plugin after a scan of the test frame                                               |
| [plugin-03-applied.jpg](plugin-03-applied.jpg)                                   | The plugin after Apply on the duplicate: 273 changes on 65 layers, health 92%           |
| [plugin-04-reverted.jpg](plugin-04-reverted.jpg)                                 | The plugin after Revert frame: all 273 changes put back                                 |

## What Check designs does

1. **A floating panel for the selection.** It has a title, a button to check a
   new selection, a button to refocus the original layer, and a close button.
2. **Tabs by kind of value**: Colors, Dimensions, Typography and Components,
   each with its number of rows.
3. **Groups by layer type and property**, such as "Frame › Fill", "Frame ›
   Corner radius", "Frame › Horizontal gap" and "Text style". Clicking a group
   heading selects every layer in it.
4. **One row per distinct value**: how many layers have it, the value now (a
   hex, a number, or the variable bound now with its value, such as
   `spacing/horizontal/sm · 8`, or font, size and line height for text), and
   the mode in force where one applies (Comfortable, Dark, Squished, Danger,
   Warning). An arrow leads to the suggestion.
5. **The suggestion** shows a swatch or icon and a name, then **Match** when the
   value is the same, or the suggestion's own value (`16`, `16/20`) when it is
   not. A chevron opens a picker with a search across libraries and the
   suggested variables first, grouped by library and collection.
6. **Clicking a row selects its layers** on the canvas.
7. **Settings**: row counts on or off, contrast level AA or AAA, and which
   libraries suggestions come from.
8. **A contrast check** that can be turned on.
9. **A footer** that says what Apply does ("Update 39 colors across 68 items")
   and an **Apply N** button.

## How it decides, and what that means for EDS

Check designs matches by value. With the deprecated libraries enabled it
suggested legacy variables, most of them exact matches. With only EDS
Foundation [EDS Beta], no colour matched exactly, so Apply counted 0 colours,
and it suggested the nearest value instead:

- The dark menu's `#202223` became `background/inverted`. In EDS, that layer is
  `background/floating` in the dark colour scheme; the value is the same, the
  role is different.
- `spacing/horizontal/sm` (8 in the old Spacious density) became `spacing/xs`,
  the new step with the same value. The EDS migration table maps it by step to
  `spacing/sm`, which the plugin follows. The two tools disagree on purpose:
  Check designs keeps the value, the plugin keeps the step.
- Text was matched to the nearest text style by size and line height, without
  the label or body role, or the weight read from the font style.

It does not know about roles (interactive or not, selected), the density
name shift, legacy modes, instances, or the bindings it cannot match.

## Mapping onto the plugin

| Check designs                                     | The plugin now                                                                        | In the prototype                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Runs on the selection from the Actions menu       | Scope: Selection, Page or File                                                        | Kept                                                                              |
| Tabs by kind of value with counts                 | Property chips (Colour, Typography, Spacing, Size, Corner radius, Modes) under Status | Property tabs as the first level of the Mapping view, like Check designs          |
| Groups by layer type and property                 | Groups by legacy variable, or by layer in a frame                                     | Kept, since a legacy variable is what the designer replaces                       |
| One row per value with a layer count              | One row per legacy variable and proposal, with ×count                                 | Kept                                                                              |
| The mode in force on a row                        | Not shown                                                                             | Shown where it decides the target, such as Dark or Comfortable                    |
| Match, or the suggestion's value                  | Values only in the picker                                                             | The old and the new value side by side: swatches for colours, numbers for spacing |
| A group heading selects all its layers            | Go to layers                                                                          | Kept                                                                              |
| A row selects its layers                          | Go to on each binding                                                                 | Kept, with the whole row as the target                                            |
| Picker with search, suggestions first, by library | Picker with search, Proposed first, by path, with swatches and values                 | Kept                                                                              |
| Library settings                                  | The target is always EDS Foundation [EDS Beta]                                        | Not needed                                                                        |
| Contrast check                                    | Out of scope in the plan                                                              | A link to the contrast guidance in the review step                                |
| Footer: what Apply does, and Apply N              | Apply N ready under the health bar                                                    | A sticky footer that says what Apply changes, on how many layers                  |
| Check a new selection                             | Scan                                                                                  | Scan again from the header once a scan is shown                                   |

What the plugin does that Check designs does not: it picks targets by role
and states why when it is unsure (Needs check), shifts the density names,
sets the new modes and keeps a legacy mode while something below needs it,
leaves instances alone and lists them, scores the health of every frame,
logs each change for Revert frame, and exports a report.
