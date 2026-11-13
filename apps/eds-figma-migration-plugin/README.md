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

The mapping rules are in [`docs/mapping-rules.md`](./docs/mapping-rules.md),
and the guide for designers in [`docs/designer-guide.md`](./docs/designer-guide.md).

## Status

| Milestone                                      | State                                                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1. Scaffold, manifest, build, inventory export | Done                                                                                              |
| 2. Rules and tests                             | Done                                                                                              |
| 3. Read-only scan                              | Done                                                                                              |
| 4. Mapping view and overrides                  | Done; tested on the test file in Figma                                                            |
| 5. Apply                                       | Done; tested on a duplicate of the test frame in Figma                                            |
| 6. Review and the remaining views              | Done; tested in Figma                                                                             |
| 7. Report and saved health                     | Done; tested in Figma                                                                             |
| 8. Release                                     | Test version published privately to Equinor; publish again for this build. Designer guide written |

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

## The window

The window follows the prototype in [`prototype/`](./prototype/README.md),
which was designed on Figma's Check designs and reviewed twice with a
designer persona ([`prototype/ux-review/final/findings.md`](./prototype/ux-review/final/findings.md)).

- **The header** has the title and a **settings** menu: layer counts in the
  rows, frames without EDS variables, local components, and Export report.
- **The scope line** has Selection, Page and File, and Scan. The scope starts
  on Selection when something is selected. After a scan it shows **Go to
  scope**, which selects the scanned layers, and **Scan again**.
- **The footer** says what Apply changes ("Change 492 values in 3 frames on
  2 pages") and has **Review** and **Apply**. While values are ticked, the
  bulk bar takes its place.
- **The size**: drag the grip in the bottom right corner, or focus it and use
  the arrow keys. Figma does not let people resize a plugin window, so the
  grip asks the main thread to resize it (`figma.ui.resize`), and the size is
  kept per person in `figma.clientStorage` for the next time. The window is
  between 380 × 480 and 1600 × 1400.

## Changes, frames and instances

After a scan of the selection the window opens on **Changes**; after a scan
of a page or the file it opens on **Frames**, where the work is.

- **Changes** is laid out like Check designs: tabs by kind of value (Colour,
  Type, Spacing, Size, Radius, Modes) with counts, sections by what the values
  are on (Text colour, Fill, Stroke, Padding and gaps, Text style, Mode, …),
  and one row per legacy variable and target: the number of layers, the
  legacy variable, and the target with its swatch or value. The legacy side shows the colour a legacy variable resolves to on its layers as a swatch, beside the new one. A row that needs a check says why in plain words under it. Both sides show their numbers in px: the legacy variable as it resolves on each layer, and the target in the density the layer will have (Spacious → comfortable, Comfortable → compact), so a change in size shows before it is applied. Rows are compact, one line each, with the status as a dot in the colours of the health bar (and ⚠ for Needs check); the full names are in the tooltip. Typography reads
  "UI body, sm, squished", and a mode reads "Density: Comfortable →
  density: compact". A click on the legacy variable selects its layers, a
  click on the target opens the picker and changes every value in the row,
  and the chevron lists the layers, each with its own **Change**.
- **Frames** starts with **Most work left**, the three frames with the most
  legacy values, then the frames by page and section, lowest health first.
  A file scan lists one page at a time, and the page with the most work is
  open. Frames without EDS variables are hidden behind a button. A local
  component that uses legacy variables is mentioned in one line, with Show.
- **A frame** shows its health, a **Filter** line, and a **Layers** /
  **Variables** switch: Layers groups the values by layer in an accordion,
  Variables is the Changes layout for that frame.

Targets can be changed for one value, one row or many values at a time:
**Change** on a value wins over its row, the target of a row changes every
value in it, and ticking values opens a bar with **Apply**, **Change
target**, **Exclude**, **Reset choices** and **Clear selection**. Apply there
makes only the Ready changes among the ticked values (the `apply-selected`
message), behind the same kind of confirmation as Apply in the footer.
Reset choices removes the choices on the ticked values, and is only shown
when some of them have one. The target of a row follows every choice in it,
so a row whose values are all excluded says "Keeps the legacy variable"
instead of the proposal.

The picker follows Figma's variable picker: a search field, the proposed
targets with a line that says what each is for, then every variable or text
style that fits the property, grouped by path, with colour swatches in the
current theme and the comfortable value of numbers. On a Ready value,
choosing the proposal again removes the change. On a value that needs a check
or has no equivalent, any choice settles it: the value then counts as Ready,
or as Excluded when it keeps the legacy variable, and the health bars follow.
Excluded is never set by the rules, so No equivalent only means that the EDS
Beta has nothing for the value.
Choices are kept across scans and in the file.

The window counts **values**: a value is a property bound to a variable, the
typography of a text or a range, or a mode. The categories are Migrated,
Ready, Needs check, No equivalent, Excluded and Inside instances.

Health is migrated ÷ (migrated + ready + needs check + no equivalent + excluded + in instance). Variables
from other libraries and local variables are counted apart and left out.
The plugin API gives no library name for a main component, so the window says
whether it comes from a library or from this file.

## Apply and revert

**Apply**, in the footer of the scope or of a frame, makes every Ready
change, after a confirmation that says what stays:

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

An icon size (`sizing/icon/*` and the like) is proposed as the spacing token with the same px in the layer's density (`sizing/icon/lg`, 24px → `spacing/xl`), as a Needs check, since EDS sizes icons with spacing tokens. A variable on a stroke weight becomes the number it resolves to, without a variable, since EDS has no stroke width variable yet; Revert frame binds the legacy variable again.

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

A legacy mode is kept while a value below still reads its collection: its own
collection or one in its alias chain (a colour reads its whole library and the
colour scheme). The row then says "Kept: legacy values below read it" or "Kept
until the values below are reviewed", the status icon explains why, and
removing the mode is still offered, for a designer who accepts that the
legacy values below change. A ⚠ or ⓘ at the end of a row has a tooltip with
the reason, and a click opens it in full.

## Review, instances and local components

**Review N ⚠**, next to Apply, steps through the values that need a check
and that nobody has decided on, one at a time, in the order of the Changes
tab. Each step selects the layer in Figma and says where it is ("Label in
Button / Outlined"), why the rule was unsure in plain words (with the rule's
own words under Details), the proposal and every other target that fits. **Confirm
proposal**, **Use this target** and **Exclude** store the choice, so
the binding counts as Ready or Excluded; **Skip** leaves it for later.
The review ends with what was confirmed, changed, excluded and skipped. From a
frame, the review covers that frame only.

**Typography components.** The legacy Typography component is a text in a
component. When the scan finds instances of it (outside other instances), the
overview says how many, and the Instances tab offers **Convert to text**, for
all of them or one at a time. Each instance becomes a text layer with the same
text, the matching EDS Foundation text style, the same place and sizing, and
its colour as an EDS Foundation variable when the rule is sure (otherwise the
legacy colour stays, for the review). Mono numbers cannot be carried by a text
style, so the result says how many used them. The text layer logs the
component it replaced, its properties, modes, sizing and colour, so Revert
frame puts the instance back as it was. Typography instances inside other
components stay until those components are updated.

**The Instances tab** lists every instance in the scope that still uses
legacy variables, grouped by main component, with the number of instances,
whether the component is in this file or in a library, and Go to for one
instance or all of them. The plugin never changes inside an instance; a
library component is updated in its library, and a component in this file
changes with its main component.

**Main components** lists the main components in the scope, which count in
the health bar and which Apply changes with the frames, each with how many
times it is used in the file. It also lists the main components on other
pages that instances in the scope use, with Go to and Scan its page. In a
frame, the Layers view shows each instance as one row.

## Report and what the plugin keeps in the file

**Export report**, beside the scope line and in Settings, makes a Markdown report (health,
every frame with its health and the layers the plugin changed, the bindings
that need a check or have no equivalent, the instances with legacy variables
grouped by component, and the rules version) and a CSV with one row per
binding. Both can be downloaded; the Markdown can also be copied, for where a
download from the plugin window is blocked.

The plugin keeps two things in the shared plugin data of the document
(namespace `eds_migration`):

- `health`: the latest scan summary (when, where, the totals and the frames
  with the lowest health). It is shown as **Last scan** when the plugin opens,
  before the designer scans again.
- `choices`: the targets the designer chose, so a review can continue another
  day. When they are too many to keep, the window says so.

The window follows Figma's light or dark theme. A scope without EDS
variables, a scope with nothing left to migrate, an empty Changes or
Instances tab and a search without matches each say so in the window.

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
4. `manifest.json` has the id Figma created at the first publish
   (`1702357333472971124`), so publishing again updates the same plugin.
   Figma keeps the version history, so there is no version number to raise.

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
docs/            mapping-rules.md, the source for the rules, and designer-guide.md
test/            Vitest tests and fixtures
BETA-GAPS.md     what was missing or awkward in the Beta while building this
prototype/       an HTML prototype for UX review, the Check designs comparison and the UX review
```
