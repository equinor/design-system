# EDS Variable Migration: prototype for review

An HTML prototype of the plugin window, for UX review without Figma. It runs
the plugin's window in a rough Figma (pages, a canvas with the test frame,
and the plugin window beside it) against a mock file, so every function of
the plugin works: scan the selection, a page or the file, the health bars,
the frames and the frame view, the Mapping tab, changing targets one, a row
or many at a time, the ⚠ review, Apply and Revert frame, the Instances tab,
local components, the report, Last scan and dark theme.

## Open it

Open [`review/index.html`](review/index.html) in a browser, straight from
disk. [`review/before/index.html`](review/before/index.html) is the window
as it is in the published plugin, kept for comparison.

The bar at the top of the page sets Figma's theme, the selection on the
canvas, closes and opens the plugin (to see Last scan), and resets the mock
file. Go to highlights the selected layers on the canvas image. The mock file
keeps its choices and its last scan in the browser's storage, as the plugin
does in the Figma file.

## What is in it

| Path                                                     | What it is                                                                                                       |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [research/check-designs.md](research/check-designs.md)   | Figma's Check designs, run on the unwired test frame, with screenshots and how its functions map onto the plugin |
| [ux-review/findings.md](ux-review/findings.md)           | The UX review as the persona Kari, the twelve findings, and what the prototype changes for each                  |
| `src/ui/`                                                | The plugin window, forked from `../src/ui` and changed only here after the review                                |
| `src/mock/`                                              | The mock file built from the scan of the test frame, and a stand-in for the plugin's main thread                  |
| `src/shell/`                                             | The page around the window: pages, canvas and controls                                                           |
| `review/`                                                | The built prototype, two single HTML files; `review/before/` is the window before the review                     |

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
(`pnpm run build` at the repository root). `review/before/` is not rebuilt:
it is the snapshot taken before the review, and its theme switch does not
work, because the shell then reached into the window in a way a page opened
from disk does not allow.
