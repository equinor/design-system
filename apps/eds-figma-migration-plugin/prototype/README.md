# EDS Variable Migration: prototype for review

An HTML prototype of the plugin window, for UX review without Figma. It runs
the plugin's window in a rough Figma (pages, a canvas with the test frame,
and the plugin window beside it) against a mock file, so every function of
the plugin works: scan the selection, a page or the file, the health bars,
the frames and the frame view, the Mapping tab, changing targets one, a row
or many at a time, the ⚠ review, Apply and Revert frame, the Instances tab,
local components, the report, Last scan and dark theme.

## Open it

The prototype has three builds, each opened straight from disk:

| Build                                                                | What it is                                                                                       |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [`review/index.html`](review/index.html)                             | The prototype after the final review: the design built on Check designs, with its fixes          |
| [`review/check-designs/index.html`](review/check-designs/index.html) | The design built on the current plugin and Figma's Check designs, as it was for the final review |
| [`review/before/index.html`](review/before/index.html)               | The window as it is in the published plugin                                                      |

The bar at the top of the page sets Figma's theme, the selection on the
canvas, closes and opens the plugin (to see Last scan), and resets the mock
file. Go to highlights the selected layers on the canvas image. The mock file
keeps its choices and its last scan in the browser's storage, as the plugin
does in the Figma file.

## How it was made

1. Figma's Check designs was run on the unwired test frame, and its functions
   mapped onto the plugin ([research/check-designs.md](research/check-designs.md)).
2. A first review of the published plugin as the persona Kari
   ([ux-review/findings.md](ux-review/findings.md)) gave twelve findings,
   fixed in the prototype.
3. On top of that, the prototype was designed with Check designs' structure:
   header actions and a settings menu, Changes as the first tab with tabs by
   kind of value, sections by property, rows of count, legacy variable and
   target with its swatch, the Apply footer, and scope and Scan on one line
   ([`review/check-designs/`](review/check-designs/index.html)).
4. The final review of that design, as Kari
   ([ux-review/final/findings.md](ux-review/final/findings.md)), gave eleven
   findings, fixed in [`review/index.html`](review/index.html).

## What is in it

| Path                                                       | What it is                                                                                                       |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [research/check-designs.md](research/check-designs.md)     | Figma's Check designs, run on the unwired test frame, with screenshots and how its functions map onto the plugin |
| [ux-review/findings.md](ux-review/findings.md)             | The first UX review, of the published plugin, and what the prototype changes for each finding                    |
| [ux-review/final/findings.md](ux-review/final/findings.md) | The final UX review, of the design built on Check designs, and its fixes                                         |
| `src/ui/`                                                  | The plugin window, forked from `../src/ui` and changed only here after the review                                |
| `src/mock/`                                                | The mock file built from the scan of the test frame, and a stand-in for the plugin's main thread                 |
| `src/shell/`                                               | The page around the window: pages, canvas and controls                                                           |
| `review/`                                                  | The built prototype, two single HTML files per build                                                             |

The mock uses the plugin's own code for the rules, counting, choices, the
apply plan and the report (`../src/scan`, `../src/mapping`). It simplifies
what only Figma can do: Apply marks bindings as migrated instead of binding
variables, and legacy modes are kept or cleared from the same rule as the
plugin, without checking the document. The counts after an apply can
therefore differ by a mode or two from the plugin in Figma.

## Build it

```sh
pnpm --filter @equinor/eds-figma-migration-plugin run prototype
```

This builds `review/index.html` and `review/window.html`. It needs
`eds-core-react` and `eds-tokens` built first, as the plugin does
(`pnpm run build` at the repository root). `review/before/` and
`review/check-designs/` are snapshots and are not rebuilt; the theme switch
does not work in `review/before/`, because its shell reached into the window
in a way a page opened from disk does not allow.
