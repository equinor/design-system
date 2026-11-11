# EDS variable migration (Figma plugin)

A Figma plugin that finds layers bound to variables from the deprecated EDS
libraries and swaps them for variables and text styles from
**EDS Foundation [EDS Beta]**. It applies a fixed mapping, so it runs locally
and uses no AI credits.

The plugin works on layout: the frames, text and shapes a designer built in
their own file. It never changes anything inside an instance, because a change
there becomes an instance override. An instance that still uses old variables
comes from a component that has not been updated in its library; the plugin
reports it and leaves it alone.

The mapping rules are in [`docs/mapping-rules.md`](./docs/mapping-rules.md).

## Status

| Milestone                                     | State                            |
| --------------------------------------------- | -------------------------------- |
| 1. Scaffold, manifest, build, inventory export | Done                             |
| 2. Rules and tests                            | Done                             |
| 3. Read-only scan                             | Done; to be tried in Figma       |
| 4. Mapping view and overrides                 | Next                             |
| 5. Apply                                      |                                  |
| 6. Review and the remaining views             |                                  |
| 7. Report and saved health                    |                                  |
| 8. Release                                    |                                  |

## Build

The plugin is built against the workspace versions of `@equinor/eds-core-react`
and `@equinor/eds-tokens`, so build those first:

```bash
pnpm run build                                                  # at the repository root
pnpm --filter @equinor/eds-figma-migration-plugin run build     # dist/code.js and dist/ui.html
```

`pnpm --filter @equinor/eds-figma-migration-plugin run dev` rebuilds both files
on every change. Figma picks up the new files the next time the plugin runs.

The build has two parts:

- `dist/code.js`, the plugin main thread, which runs in Figma's sandbox. It is
  one IIFE compiled to ES2017 syntax (`vite.plugin.config.ts`).
- `dist/ui.html`, the plugin window, with its JavaScript and CSS inlined,
  because Figma loads the window as one HTML string (`vite.config.ts`).

## Import it into Figma

1. Build the plugin as above.
2. In the Figma desktop app, open a design file and choose **Plugins →
   Development → Import plugin from manifest…**.
3. Select `apps/eds-figma-migration-plugin/manifest.json`.
4. Run it from **Plugins → Development → EDS variable migration → Open**.

Always try the plugin on a duplicate of a frame. The test frame is
**Migration test – old EDS variables** in the AI-Testing file.

## Scan

**Open** scans the current page or the whole file and changes nothing.

- A file scan loads one page at a time with `page.loadAsync()`, so the view
  stays on the page you are on, and shows its progress with a Cancel button.
  The plugin sets `figma.skipInvisibleInstanceChildren` to false, because
  with it on, hidden layers inside instances are skipped. A test on
  2026-11-11 found the same 3,940 layers on a page after `loadAsync()` as
  after switching to it, once that flag was off; with the flag on, 169 hidden
  layers inside instances were missing.
- The list shows each top-level frame, the frames inside sections grouped
  under the section's name, and the loose layers of each page or section,
  lowest health first. The arrow selects the frame and zooms to it.
- Opening a frame lists every binding in it, with the old variable, the
  proposal and the outcome, and the instances in it that still use old
  variables. Clicking a row selects that layer.
- Main components in the file are scanned as their own group, shown and
  counted in the health only when you switch them on.

Health is migrated ÷ (migrated + sure + check + none + in instance). Variables
from other libraries and local variables are counted apart and left out.
The plugin API gives no library name for a main component, so the window says
whether it comes from a library or from this file.

## Developer command: export the inventories

The mapping is checked against two generated files in
`src/mapping/inventory/`:

- `new-library.json`: the variables of the `semantic` collection, the text
  styles, and the mode ids of `density` and `color-scheme` in EDS Foundation
  [EDS Beta].
- `old-libraries.json`: the collection keys of the deprecated libraries.

To regenerate them, run **Plugins → Development → EDS variable migration →
Developer → Export EDS inventories**:

- in EDS Foundation [EDS Beta] for `new-library.json`, because the plugin API
  cannot list the text styles of a library from another file;
- in a file where the deprecated libraries are enabled for
  `old-libraries.json`. The API only lists published collections, so the
  unpublished ones the old variables alias through are carried over from the
  current file.

Copy or download each file, replace it in the repository, run the tests and
raise `MAPPING_VERSION` in `src/mapping/version.ts`.

## Developer command: export the test frame as a fixture

Select the test frame and run **Developer → Export scan of selected frame as
fixture**. Save the file as `test/fixtures/test-frame.json`. The pipeline test
then runs the same classification as the plugin on what the scanner read, and
checks it against the answer key; until the file is there, it is skipped.

`pnpm run build:fixture-script` builds the same reader as a standalone script,
`dist/collect-fixture.js`, for tools that run Plugin API code in a file. It
takes the collection keys as arguments, so it carries no inventory.

## Tests

```bash
pnpm --filter @equinor/eds-figma-migration-plugin run test:run
```

- `test/answer-key.test.ts`: the 59 rows of the answer key for the test frame.
- `test/inventory.test.ts`: runs every published old variable through the
  rules in a set of contexts and checks that each target exists in EDS
  Foundation with a matching type, that a sure proposal fits the property's
  scope, and that `background/backdrop` is never proposed.
- `test/scan.test.ts`: classification, health and the fixture format.
- `test/pipeline.test.ts`: the scan of the test frame against the answer key,
  when the fixture is there.

## Fonts and network access

The EDS components are set in Equinor and Inter. The plugin window loads them
from `cdn.eds.equinor.com`, which is declared in `manifest.json` under
`networkAccess`. Without network access the window falls back to the system
font; everything else works.

## Code

```
manifest.json
src/mapping/     rules, role guesses, inventories; pure, tested without Figma
src/scan/        classification, counting and the fixture format; pure
src/plugin/      the main thread (code.ts), the scanner and the developer commands
src/shared/      message types between the main thread and the window
src/ui/          the plugin window, React and the EDS Beta components
docs/            mapping-rules.md, the source for the rules
test/            Vitest tests and fixtures
BETA-GAPS.md     what was missing or awkward in the Beta while building this
```
