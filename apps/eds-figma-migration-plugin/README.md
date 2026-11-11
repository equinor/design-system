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

| Milestone                                      | State                                                  |
| ---------------------------------------------- | ------------------------------------------------------ |
| 1. Scaffold, manifest, build, inventory export | Done                                                   |
| 2. Rules and tests                             | Done                                                   |
| 3. Read-only scan                              | Done                                                   |
| 4. Mapping view and overrides                  | Done; tested on the test file in Figma                 |
| 5. Apply                                       | Done; tested on a duplicate of the test frame in Figma |
| 6. Review and the remaining views              | Next                                                   |
| 7. Report and saved health                     |                                                        |
| 8. Release                                     |                                                        |

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

**Open** scans the selected layers, the current page or the whole file, and changes nothing. The window calls the variables from the deprecated libraries _legacy_, since EDS 1.0 may be added later.

- A file scan loads one page at a time with `page.loadAsync()`, so the view
  stays on the page you are on, and shows its progress with a Cancel button.
  The plugin sets `figma.skipInvisibleInstanceChildren` to false, because
  with it on, hidden layers inside instances are skipped. A test on
  2026-11-11 found the same 3,940 layers on a page after `loadAsync()` as
  after switching to it, once that flag was off; with the flag on, 169 hidden
  layers inside instances were missing.
- The list shows each top-level frame, the frames inside sections grouped
  under the section's name, and the loose layers of each page or section,
  lowest health first. Each row is labelled Frame, Layer or Component, and
  each group Page or Section. **Open** shows the bindings in the row, and
  **Go to** selects it and zooms to it.
- Opening a row lists every binding in it, with the legacy variable, the
  proposal and the outcome, filtered by the same categories as the health
  bar, and the instances in it that still use legacy variables. Clicking a
  binding selects that layer.
- The categories are Migrated, Ready (one target, applied without asking;
  `sure` in the code), Needs check, No equivalent and In instance. Ready is
  blue, since it still has to be applied; only Migrated is green. The info
  button next to the legend explains each category in a dialog.
- The bindings in a row can be filtered by status, with the same names as the
  legend, and by property: colour, typography, spacing, size, corner radius
  and modes.
- The window runs in the comfortable density. The rules version is not
  shown; it goes into the change log and the report.
- Main components in the file are scanned as their own group, shown and
  counted in the health only when you switch them on.

## Mapping and overrides

Bindings are shown in accordions, so a layer or a variable appears once with
what changes under it:

- **In a frame**, a **Layers** / **Variables** switch groups the bindings by
  layer, or by legacy variable with the most used first.
- **The Mapping tab** has one accordion item per legacy variable in the
  scope. It opens to one row per proposal, since the same variable can get
  different targets in different places, with the layers under each row.
  **Go to layers** selects every layer that uses the variable.
- **A file scan** lists one page at a time, each with its own health bar.

Targets can be changed one binding, one row or many bindings at a time:

- **Change** on a binding changes that binding only, and wins over its row.
- **Change all** on a row in the Mapping tab changes every binding in it.
- **Ticking bindings**, or “Select all” in an accordion item, opens a bar at
  the bottom of the window: **Change target**, **Leave as they are** and
  **Undo my changes**. Change target is offered when the ticked bindings take
  the same kind of value, such as only colours.

The picker follows Figma's variable picker: a search field, the proposed
targets, then every variable or text style that fits the property, grouped by
path, with colour swatches in the current theme and the comfortable value of
numbers. On a Ready binding, choosing the proposal again removes the change.
On a binding that needs a check or has no equivalent, any choice settles it:
the binding then counts as Ready, or as No equivalent when it is left as it
is, and the health bars follow. Choices are kept while the plugin is open,
also across scans, since they are stored by layer and property and by legacy
variable and proposal.

Health is migrated ÷ (migrated + ready + needs check + no equivalent + in instance). Variables
from other libraries and local variables are counted apart and left out.
The plugin API gives no library name for a main component, so the window says
whether it comes from a library or from this file.

## Apply and revert

**Apply N ready**, under the health bar of the scope or of a frame, makes
every Ready change, after a confirmation:

- binds the EDS Foundation variable on the same field, paint or effect, and
  keeps the other bindings on the layer;
- applies the text style to a text or a range of text, after loading its
  fonts, and keeps the fill bindings;
- sets the new `density` or `color-scheme` mode on the layer that had the
  legacy one (Spacious → comfortable, Comfortable → compact, Light → light,
  Dark → dark);
- clears a legacy mode only when no layer below it uses a legacy variable
  through it any more, including inside instances. A binding only depends on
  the nearest legacy mode above it of a collection in its own library, colour
  or spacing and typography.

Bindings that need a check are not applied until a designer has chosen a
target for them. Nothing inside an instance changes. Before each change the
plugin checks that the layer still has the legacy binding from the scan, and
lists what it could not change, with Go to. One run is one step in Figma's
undo history (`figma.commitUndo`). After the run the plugin scans the same
layers again.

Every change is logged on its layer in shared plugin data (namespace
`eds_migration`, key `log`): the property, the legacy variable, typography or
mode, what replaced it, whether it was sure, confirmed or an override, the
rules version and the time. **Revert frame**, in a frame that has changes,
puts the legacy bindings, typography and modes back from that log, newest
first, as long as the legacy libraries are still published. A binding someone
has changed since the apply is left alone and reported. Shared plugin data is
used because private plugin data needs a published plugin id, so a
development copy could not keep a log.

A legacy mode that has nothing to do yet counts as No equivalent, with the
reason: it stays for good above a binding in an instance or with no
equivalent, and until the review above a binding that needs a check.

## Publish a test version to Equinor

The test version is published privately to the Equinor organisation as
**EDS Variable Migration [WIP BETA]**. Publishing is only possible from the
Figma desktop app, with the plugin imported from `manifest.json`:

1. Build it: `pnpm run build` at the root, then
   `pnpm --filter @equinor/eds-figma-migration-plugin run build`. Figma uploads
   `dist/code.js` and `dist/ui.html` as they are when you publish.
2. Choose **Plugins → Development → Manage plugins in development**, open the
   menu on **EDS Variable Migration [WIP BETA]** and choose **Publish**.
3. Publish to **Equinor** (private to the organisation), not to the Community.
4. The `id` in `manifest.json` is a placeholder. If the publish dialog asks
   for an ID, or says the ID is not valid, let Figma create one and put it in
   `manifest.json`, so later versions update the same plugin.

Figma's documentation and forum disagree on whether any member or only an
admin can publish a private plugin. If Publish is not offered, ask the Figma
admin.

The published test version keeps the Developer menu. Both commands only read
the file.

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
src/plugin/      the main thread (code.ts), the scanner, apply and revert, and the developer commands
src/shared/      message types between the main thread and the window
src/ui/          the plugin window, React and the EDS Beta components
docs/            mapping-rules.md, the source for the rules
test/            Vitest tests and fixtures
BETA-GAPS.md     what was missing or awkward in the Beta while building this
```
