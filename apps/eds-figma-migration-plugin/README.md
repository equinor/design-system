# EDS variable migration (Figma plugin)

A Figma plugin that finds layers bound to variables from the deprecated EDS
libraries and swaps them for variables and text styles from
**EDS Foundation [EDS Beta]**. It applies a fixed mapping, so it runs locally
and uses no AI credits.

The plugin works on layout: the frames, text and shapes a designer built in
their own file. It does not change a value an instance takes from its main
component, because a change there becomes an instance override. An instance
that still uses old variables that way comes from a component that has not
been updated in its library; the plugin reports it and leaves it alone. The
plugin migrates variables, not components, so a designer swaps such an
instance to an EDS Beta component in Figma, and its legacy values go with it.

A value the instance overrides itself is different: it is already an
override, stored on the instance, and updating the main component does not
reach it. The scan finds these with `InstanceNode.overrides` on the
outermost instance, which lists the fields this instance overrides on each
layer below it and leaves out what it inherits. That list says
`boundVariables` for any bound field, so the scan also compares the binding
with the layer at the same child position in the main component: the value is
the instance's own when that layer binds another variable, or when there is
no such layer, as below a swapped instance. These values go through the same
rules as any other layer. Figma ignores a plugin that binds a variable to the
width or height of a layer inside an instance, and ignores `resize()` there
too, so a legacy size override there is flagged as **Manual fix** (category
`byHand`, rule `instance/size-override`). The row says how to fix it in
Figma: reset the layer, swap it again if it was a swapped icon (a swap keeps
the slot's size), and set its other changes again. What the reset also
removes and sets again is kept apart from those steps, in `resetEffects` on
the record and on its value in Changes (`src/scan/classify.ts`): the swap
back to the main component's layer and the swap again, or the instance-swap
property set to its default and back; each change with a variable on the
layer and the layers below it, with its EDS Beta value; and the changes
without a variable, such as a hidden layer. The window shows that list
whatever the status, so it stays in view once the fix is accepted and
Ready, and the report prints it after the steps. The target is the EDS
Beta variable the main component uses at that place. Such a legacy size
comes from a swap made while the slot used a legacy size: the swap copies
the size onto the icon as an override (tested on FRIOD 2026-11-13). The
plugin can make the fix itself (target `reset:<variable>`,
`src/mapping/reset.ts`), but only after a designer accepts it in Review;
`src/plugin/apply/reset.ts` reads the layer's overrides, calls
`removeOverrides()`, swaps it back, sets the overrides again and reads them
back, and refuses a layer with an override it cannot copy. Apply reads
every binding back to report the ones Figma did not take. An explicit
mode on a layer inside an instance is the instance's own
when `overrides` lists `explicitVariableModes` for that layer and the layer
at the same place in the main component sets another mode, or none, for the
collection. Such a mode goes through the mode rules and is cleared once
nothing below it uses legacy variables (Core Components, Text Field:
`↳ ↳ Leading Icon Item` in `↳ Right Adornment` sets the legacy Appearance
mode Neutral, and its main component sets none). While values the instance
takes from its main component read the mode, it stays in Inside instances
(rule `mode/from-main`). Clearing a mode on a layer inside an instance and
setting it again both work from a plugin, also when the main component's
layer sets another mode; the layer then has no mode, not the main
component's (tested on FRIOD 2026-11-16).

Slot content an instance owns starts over. A slot in an instance follows its
main component, and its layers have ids of the form `I<instance>;<layer>`,
until the slot is edited in the instance. From then on its content gets ids
below the slot's own (`I<instance>;<slot>;<new id>`), no longer follows the
main component and is missing from the instance's `overrides`
(`isOwnedSlotContent` in `src/scan/slots.ts`, tested on FRIOD 2026-11-19).
The scan, the change log and the reset of a Manual fix read that content like
the layers of a frame: a layer there has no `instanceId`, and an instance
there is the outermost instance of its own layers and reads its own
`overrides` (`outermostInstance`). The change log once read it against the
outer instance's `overrides`, so Revert frame put nothing back there (found
on FRIOD 2026-11-19). A layer a session adds to the slot, such as the text
layer Convert puts there, keeps a plain id in that session until the file is
opened again, while other sessions see it below the slot's id; a plain id in a
slot of an instance is owned content as well, since content that follows the
main component always has an `I` id. For the same reason Convert and Revert
find a layer among its parent's children with `indexAmongChildren`, not
`indexOf` alone, and Revert removes the Typography instance it made when
putting it back fails, instead of leaving it on the page. Revert finds the
logged layers by walking `children`: in the session that added a layer to a
slot, `findAllWithCriteria` returns another layer for it, which is not in its
parent's list. Every value also records the
full chain of instances it is in (`instances`, outermost first, through owned
slot content too), and each instance on the Instances tab carries a tree of the
instances in it with the legacy values each takes from its main component
(`buildInstanceTree` in `src/scan/instance-tree.ts`). An instance in owned slot
content names the instance it sits in (`within`).

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
- While it scans, the window draws a map of the page from its top-level
  layers (`scan-map`, built in `src/plugin/scan/trace.ts`): each frame,
  component or loose layer fills in when it is read, a box marks the one being
  read, and dots mark a sample of the layers with legacy or Beta values. The
  progress bar weighs a layer half by its area and half by its count, since
  the scan cannot count the layers inside a frame before it reads it. The
  first scan after the window opens fills the window and ends with the health
  for a moment; a later scan is a card above the faded results. With reduced
  motion, nothing animates and the first scan shows its results at once.
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
  `sure` in the code), Needs check, Manual fix (`byHand`), No
  equivalent and Inside instances. Ready is
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
  on Selection when something is selected. With File chosen, **Select pages**
  and a count such as 5/8 pages appear beside it. The page picker keeps the
  pages it leaves out in the file's shared plugin data (`left-out-pages`), so
  a page added later is scanned, and page dividers are never scanned. After a scan it shows **Go to
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
value in it and replaces the choices made on single values there, such as the
ones Review saves and Decide later (otherwise a row change on a reviewed value
showed nowhere). The window sends a choice on a row as one `row-choice`
message, and the plugin makes it in one step (`withRowChoice` in
`src/scan/mapping.ts`): it removes the choices on the row's values and puts
them aside in `replaced`, by row key and value. A second change on the row
adds the choices made since to them, and a value put aside before keeps the
choice it had then. **Undo my change** in the row's picker removes the row's
choice and brings back the choices put aside, except on a value that has a
choice of its own again, made after the change on the row, which is kept.
Then nothing stays put aside for the row. Choosing the proposal again on a
Ready row stores no choice on the row, but puts the values' choices aside all
the same, so Undo my change brings them back there too. Undo my change on a
row never removes a choice on a single value, so a row with only those has no
Undo; Undo my change on the value, or Reset choices in the bulk bar, removes
them. When a target replaces choices, the picker says "Undo my change brings
back the N choices it replaced". A row in an open frame or on the Main components tab lists only its values
there, but its target is stored by the row's key and reaches every value in
the row, so the picker works on the whole row of Changes (`wholeRow`): it
counts all its values, replaces the choices on all of them and puts them
aside, and says how many are elsewhere in the scope and not listed. Ticking
values opens a bar with **Apply**, **Change target**, **Decide later**,
**Reset choices** and **Clear selection**. Apply there
makes only the Ready changes among the ticked values (the `apply-selected`
message), behind the same kind of confirmation as Apply in the footer. Its
counts come from a preview of that run, so it names the legacy modes that
stay because a value below them is not ticked ("Density: Spacious on Card
stays, and is cleared once Icon, width is selected and applied").
Reset choices removes the choices on the ticked values, and is only shown
when some of them have one. The target of a row follows every choice in it,
so a row whose values are all set to Decide later says "Decide later"
instead of the proposal.

The picker follows Figma's variable picker: a search field, the proposed
targets with a line that says what each is for, then every variable or text
style that fits the property, grouped by path, with colour swatches in the
current theme and the comfortable value of numbers. On a Ready value,
choosing the proposal again removes the change. On a value that needs a check
or has no equivalent, choosing a target settles it: the value then counts as
Ready, and the health bars follow. Saving the choice a value or row already
has keeps it. On a legacy mode, **Remove the legacy mode** (`CLEAR_MODE`)
always means clearing it once no value below reads it: chosen or confirmed in
Review, Apply keeps the mode while a value below waits. The picker of a
legacy mode that values below read, and that the next Apply leaves, has one
more option of its own, **Remove the legacy mode anyway (the values below
that read it change)** (`REMOVE_ANYWAY` in `src/scan/classify.ts`). It is
never a proposal, and it is the only choice that removes such a mode in the
next run; the change is logged as `confirmed`.

The picker never offers to keep a legacy variable, since the goal is a file
with no legacy variable left (decided 2026-11-16). Its last option, **Decide
later** (`DECIDE_LATER` in `src/scan/mapping.ts`), leaves the value for a
later run: Apply does not change it, and it keeps counting as not migrated,
so health reaches 100% only when no legacy variable is left. A Ready value
set to Decide later becomes Needs check, since it waits for a designer; a
Needs check, No equivalent or Manual fix value keeps its status. Review lists
it again, and its row says "Decide later" as the target, marked as the
designer's choice. The bulk bar, Review and the Manual fix picker offer the
same choice.

No equivalent means that the EDS Beta has no token for the value, which is a
gap in the tokens. Such a value gets a stand-in where one is possible: its
row says "Stand-in:" and the target while its status stays No equivalent,
and Apply changes the value once a designer chooses the stand-in or another
target. Choices are kept across scans and in the file.

The window counts **values**: a value is a property bound to a variable, the
typography of a text or a range, or a mode. The categories are Migrated,
Ready, Needs check, Manual fix, No equivalent and Inside instances.

Health is migrated ÷ (migrated + ready + needs check + manual fix + no equivalent + in instance). Variables
from other libraries and local variables are counted apart and left out.
The plugin API gives no library name for a main component, so the window says
whether it comes from a library or from this file.

## Apply and revert

**Apply**, in the footer of the scope, of a frame or of the Main components
tab, makes every Ready change, after a confirmation that says what stays.
Ready is short for ready to change: the Ready count is the number of changes
the next run makes. As the confirmation opens, the window sends a `preview`
message, and the plugin answers with the counts of the run it would make
(`previewRun` in `src/scan/apply-plan.ts`, from the same `planChanges` as the
run): values bound to EDS Beta variables, numbers set without a variable,
text styles applied, new modes set, legacy modes removed, layers reset for a
Manual fix, how many of the changes are values an instance overrides, the
legacy modes a designer removes anyway, with the values below that change,
the legacy modes that stay, each with what it waits for, and the legacy
values in the scope that instances take from their main component
(`fromMain`), by where they change: with a main component in this file, when
an instance of a library component is swapped, or when a Typography
instance is converted.

The window builds the text of every Apply confirmation (the footer of the
scope, of a frame and of the Main components tab, and Apply on ticked
values) from those counts alone, with `applyText` in `src/ui/preview.ts`, so
each sentence follows from the run: what changes inside instances (the
values an instance overrides, and what a reset for a Manual fix removes and
puts back), the values left to their main component, the main components and
how many instances follow them, the values left for a later run, and the
change log the run writes. Until 2026-11-17 the confirmation said "Nothing
inside an instance changes" whenever the preview counted no override, also
when the run reset a layer inside an instance; that sentence is gone
(`test/confirmations.test.ts`). Apply in the confirmation waits for the
preview, and is disabled when the run changes nothing. The run:

- binds the EDS Foundation variable on the same field, paint or effect, and
  keeps the other bindings on the layer;
- sets a number without a variable, such as a border width, on the field of
  the layer, or on the field of an effect, such as the blur of a shadow: the
  legacy variable is removed from the effect's field
  (`setBoundVariableForEffect` with null) and the number set there, with
  `withEffectNumber` in `src/shared/effect-numbers.ts`, since Figma keeps the
  offset of a shadow in `offset` but binds it as `offsetX` and `offsetY`;
- applies the text style to a text or a range of text, after loading its
  fonts, and keeps the fill bindings;
- sets the new `density` or `color-scheme` mode on the layer that had the
  legacy one (Spacious → comfortable, Comfortable → compact, Light → light,
  Dark → dark);
- clears a legacy mode only when no layer below it uses a legacy variable
  through it any more, including inside instances. A binding only depends on
  the nearest legacy mode above it of a collection in its own library, colour
  or spacing and typography. The window knows before the run which legacy
  modes stay (see the kept modes below).

An icon size (`sizing/icon/*` and the like) is proposed as the spacing token with the same px in the layer's density (`sizing/icon/lg`, 24px → `spacing/xl`), Ready on an exact match and a Needs check otherwise, since EDS sizes icons with spacing tokens. A variable on a stroke weight becomes the number it resolves to, without a variable, since EDS has no stroke width variable yet; Revert frame binds the legacy variable again.

Where the EDS Beta has no token for a legacy variable, the value is No
equivalent with a stand-in (decided 2026-11-16, `docs/mapping-rules.md`
section 7): a number gets the EDS Beta variable with the same px in the
layer's density, or the px without a variable (rules `number/same-px` and
`number/as-px`); a colour gets the EDS Beta colour for the layer's role that
looks nearest to the legacy colour (`colour/nearest-by-role`); a type size
gets the nearest step (`type/nearest-step`); an unknown legacy mode gets
removing it. A number on an effect, such as the blur of a shadow, is a
spacing number like the others, so with no spacing token at its px it gets
the px without a variable, which Apply sets on the effect. When the scan
cannot read the legacy value of a number, for example because the legacy
library is not enabled, it reads the value the layer has now for the field
(`layerValue` on the unit, from the node or from the effect in
`src/plugin/scan/collect.ts`), and the stand-in takes that as its px; the
reason says the px is the layer's current value. Only a string or boolean
variable, or a number whose value can be read neither from the variable nor
from the layer, has no stand-in; the report lists them among the token gaps
as "None possible", with a note that no stand-in is possible.

Bindings that need a check are not applied until a designer has chosen a
target for them. Inside an instance only its own overrides change, and the
layers an accepted Manual fix resets. Before each change the
plugin checks that the layer still has the legacy binding from the scan, and
lists what it could not change, with Go to. One run is one step in Figma's
undo history (`figma.commitUndo`). After the run the plugin scans the same
layers again.

Every change is logged on its layer in shared plugin data (namespace
`eds_migration`, key `log`): the property, the legacy variable, typography or
mode, what replaced it, whether it was sure, confirmed or an override, the
rule that proposed the target (from 2026-11-16, so a value migrated to a
stand-in can be found), the rules version and the time. **Revert frame**, in a frame that has changes,
puts the legacy bindings, typography and modes back from that log, newest
first, as long as the legacy libraries are still published. A number set
without a variable gets its legacy variable back, on the layer's field or on
the effect's field. The next scan counts such a number as migrated while the
layer or the effect still has it. A binding someone
has changed since the apply is left alone and reported. Shared plugin data is
used because private plugin data needs a published plugin id, so a
development copy could not keep a log. On a layer inside an instance, the log
is plugin data the instance sets on that layer (`appendLog(…, inherited)`,
see `logIsInherited`), so an override of the instance. Every Apply
confirmation ends on the log: "The plugin notes each change in the layer's
plugin data, so Revert frame can undo it later", with ", and inside an
instance that note is an override of the instance" when the run changes a
value an instance overrides or resets a layer (`changeLogLine`).

A legacy mode is kept while a value below still reads its collection: its own
collection or one in its alias chain (a colour reads its whole library and the
colour scheme). The row then says what the mode waits for, the status icon
explains why, and the picker offers removing the mode anyway, for a designer
who accepts that the legacy values below change. A ⚠ or ⓘ at the end of a row
has a tooltip with the reason, and a click opens it in full.

Whether a run keeps a mode depends on the designer's choices: a Needs check
below changes in the run once it is confirmed, and a Ready value set to
Decide later does not. So the rules leave every legacy mode with its own
outcome, Ready with clearing as the proposal for a mode that only selects a
tone or a step, and the plugin works out the kept modes again with every
count (`keptModes` in `src/scan/apply-plan.ts`). Until 2026-11-16 the scan
held a mode above values that were not Ready (rules `mode/kept` and
`mode/after-review`), so a mode above a Needs check stayed after the value
was confirmed and applied, and needed a second scan and Apply; now the same
Apply clears it. `holdModes` in `src/scan/classify.ts` only decides two
cases: a legacy mode whose EDS Beta mode is already set on the layer is only
cleared, and a mode an instance sets itself that values from the main
component read stays in Inside instances (`mode/from-main`). The plugin
plans the run, takes the
bindings it changes, and finds the mode changes above a legacy binding that
the run leaves (`keptModeChanges`, with the bindings that keep each mode in place, from
`modeBlockers` in `src/scan/classify.ts`). `applyChanges` keeps the modes
with the same `keptModeChanges`, from the bindings it did change, so the two
differ only where a binding fails. The plugin sends the kept modes, each
with what it waits for, in a `kept-modes` message before every summary, and:

- a kept legacy mode that is only cleared counts as No equivalent in the
  health bar and is marked **Waiting** in Changes, the frame and the report,
  with the target "Kept while values below wait" and what it waits for:
  "Cleared once Icon, width is decided", or "once the main component Button
  is migrated" for values inside instances;
- a kept mode that sets a new mode stays Ready, since the run sets the new
  mode, with the note "The legacy mode stays beside it until …".

Review leaves a kept mode out, and steps through the values below it instead.
Once every value below that reads the mode is Ready and in the same run, the
mode is Ready as well, and the run clears it after those values. A Ready mode set to
Decide later comes back in Review; when values below read it, the step says
what clearing it waits for, **Clear it once nothing below reads it** stores
the proposal (the mode is then Waiting), and the picker there offers removing
it anyway too. The plugin sends, with the kept modes, every legacy mode that
values below read and the next Apply leaves (`blocked`, from `modeWaits`),
which the pickers and Review use. The Apply confirmation names each mode a
designer removes anyway, with the values below that change.

Saved choices from earlier versions can contain clearing on a mode the rules
kept, which then removed it whatever read it below. They are read as they
are, since the stored choices do not say whether the mode was held, and now
clear the mode once nothing below reads it. A choice saved on the row of a
mode the rules held is keyed to that row's No equivalent outcome, so it no
longer matches the mode's row, which is Ready now; a choice saved on the mode
itself still applies.

A legacy mode stays beside another new mode a designer chooses, too, while
values below read it: only removing it anyway removes it before that.

## Review, instances and local components

**Review N ⚠**, next to Apply, steps through the values that need a check,
and the No equivalent values with a stand-in, that nobody has decided on or
that are set to Decide later (a Ready value set to Decide later included), one
at a time, in the order of the Changes tab. A legacy mode marked Waiting is
left out, since it waits for the values below it. Each step selects the layer
in Figma and says where it is ("Label in Button / Outlined"), why the rule was
unsure or what the EDS Beta lacks, in plain words where there are some (with
the rule's own words under Details), the proposal and every other target that
fits. **Confirm proposal** (**Use the stand-in** for No equivalent) and **Use
this target** store the choice, so the value counts as Ready. **Decide later**
stores that choice instead, so Changes shows it, and the value comes back in
the next review. It is the only way to put a value off: Review has no Skip
since 2026-11-16, so every value a designer moves past has a choice that is
saved. A Manual fix has **Accept the fix** and **Decide later**. The review
ends with what was confirmed, changed and set to Decide later
(`reviewSummary` in `src/ui/review.ts`). From a frame, the review covers that
frame only.

Changes lists Manual fixes too, so every value Apply counts is on a tab: an
accepted fix is Ready and made by Apply. Their rows have no checkbox, since a
fix is decided one at a time, and their pickers offer only the fix or Decide
later. Each value says what resetting its layer also removes and the plugin
sets again, for every status, and so do the value in the frame and the
Review step. The row's status opens How to fix it, also once the fix is
accepted, with the steps and that list for each layer in the row.

**Typography components.** The legacy Typography component is a text in a
component. When the scan finds instances of it (outside other instances),
Changes gets a Typography tab after the kinds of value. The Instances tab
leaves them out of its list and count, and links to that tab instead. Each
instance can become a text layer with the same text, an EDS Foundation text
style and colour, and the same place and sizing.

The text style and colour are decided at scan time, so the tab shows them
before anything changes (decided 2026-11-16). For each instance, the scan
classifies the typography and the text colour of the text layer in it as if
the text were not in an instance (`src/scan/conversions.ts`), which gives the
records `convert:<instanceId>|typography` and `convert:<instanceId>|fill`.
They stand for the instance: a row selects it, and its text names it. They
are kept in their own list, `conversions`, beside the scan's records, so
health keeps counting the instance's values once, as Inside instances, until
it is converted. Their legacy keys start with `convert:`, so a choice on a
row in Changes and one on the Typography tab never reach each other's
values. The plugin sends them grouped the way Changes groups its values.

The tab lists them with the same rows as Changes (`ChangeRow`): a Text style
section by legacy typography and text style, then a Text colour section, each
row with its status, the target picker (text styles, or colours, and Decide
later), the reason it needs a check, and its instances, each with Change,
**Convert** and **Go to**. **Review N ⚠** on the tab steps through the text
styles and colours that wait for a decision, and stores the choices the way
Review does for Changes.

**Convert N to text**, for all of them, for a row or for one instance, uses
the targets after the designer's choices (`planConversions` in
`src/scan/apply-plan.ts`). An instance is converted when its text style is Ready:
the proposal of a Ready row, or a style a designer chose or confirmed. A text
style that needs a check, has no equivalent and no choice, or is set to
Decide later leaves the instance as it is: its Convert is disabled with the
reason, the count leaves it out, and the result lists it. The colour is the
Ready or chosen EDS Foundation variable; otherwise the legacy variable is
copied to the text layer, and Changes lists it after converting, which the
row says beforehand. The change log notes how the text style came about
(`sure`, `confirmed` or `override`) and the rule.

Each Convert opens a confirmation first. As it opens, the window sends
`preview-convert` with the instances, and the plugin answers with
`convert-preview`: `previewConversions` in `src/scan/apply-plan.ts` counts
the same plan `convert` runs (`planConversions`), with the instances
replaced by text layers, the colours changed to EDS Beta, left on their
legacy variable (`legacyFill` on the planned conversion) or copied as they
are, the text cases dropped (the conversion's text style record keeps the
legacy `textCase`, and `dropsTextCase` compares it with the style the
conversion uses), the main components whose instances get their text carried
across, with their instances when the tab has had them counted
(`typography-components`), and the instances Convert leaves, by reason.
`convertText` in `src/ui/preview.ts` builds the text, and ends on the change
log on the new text layer, which Revert frame, or Revert main component for
an instance in a main component, reads. That layer takes the instance's
place, so it is never inside an instance. The confirmation's Convert waits
for the preview and is disabled when nothing converts. Mono numbers are not
in the preview, since the scan does not read the component's properties;
the result counts them.

A text case is a text style property, and setting one on a text layer
detaches its text style in Figma. The scan reads the case of the legacy text
(`textCase` on the typography unit, MIXED for more than one), and when it
differs from the case of the proposed style, the text style is Needs check,
with a reason that says the conversion drops the case. The inventory of the
EDS Beta text styles records no text case (export of 2026-11-11), so every
style counts as having none, and any legacy text in upper case, for example,
needs a check. In a main component, a Typography instance carries the text of
every instance of that component; the instance's row says how many instances
there are, counted when the tab opens, and that their text is carried across
to the new text layer. Mono numbers cannot be carried by a text style, so the
result says how many used them. The text layer logs the component it
replaced, its properties, modes, sizing and colour, so Revert frame puts the
instance back as it was. Typography instances inside other components stay
until those components are updated.

**The Instances tab** shows every other instance in the scope that still uses
legacy variables as a tree in Figma's Layers panel style
(`src/ui/components/InstanceTree.tsx`, phase 2 of the nested-instances plan,
2026-11-19): the entries of the scan at the top with Figma's frame and main
component icons, the outermost instances in each in layer order, and in each
instance the instances it holds (`OldInstance.tree`), with slot content under
a row for its slot (`instanceForest`, `entryForest` in `src/ui/instances.ts`).
Rows are 32px at 11px with a 24px indent, instances and slots in Figma's
component purple and slot pink, read from Figma's stylesheet, hidden
instances dimmed with the hidden icon; each row has the legacy count and a
Go to. Only instances with legacy values from their main components are in
the tree, and the slots that hold them; frames and other layers between them
are left out. The design was reviewed on `prototype/review/tree.html`, built
with `vite build -c prototype/vite.config.ts --mode tree`. The plugin does not change what an instance takes
from its main component, and it never swaps a component (decided
2026-11-16). For instances of a library component the tab says: "The plugin
migrates variables, not components. Swap these to EDS Beta components in
Figma; their legacy values go with them." A component in this file changes
with its main component, which **Go to main component** opens. Overrides of
an instance are listed with the other changes instead.

A layer inside an instance reads the change log of the main component's
layer until the instance has plugin data of its own on it (`pluginData` in
`overrides`). The scan and Revert frame only read a log the instance owns, and
Apply starts the instance's own log empty, so a main component's changes are
never reverted through one of its instances.

**Main components** lists the main components in the scope, which count in
the health bar, each with how many times it is used in the file. On this tab
the Apply footer changes the main components only, all in one run; on
Changes and Frames it changes them with the frames. Under them,
**What Apply changes** lists the rows of Changes for the values in those main
components, so every value that Apply changes is shown with its target,
status and picker before the run. `filterGroups` in `src/scan/mapping.ts`
narrows the rows to the entries of the main components, recounts the rows
and groups, and keeps each row's key, outcome, proposal, candidates, reason
and rule, so the choices stored by row key apply there too; an open frame's
Variables view is narrowed the same way. The list is `MappingView`, with the
same choices, kept modes, status filters, pickers, ticking for the bulk bar,
and Review in the footer, limited to those main components. The footer's
Ready count is `readyCount` of that list, with the choices and the legacy
modes the run keeps, which is the Ready count of the main components in the
health bar and the number of changes in the preview of the run
(`test/main-components.test.ts`). The conversions on the Typography tab are
not part of this Apply. The tab also lists the main components on other
pages that instances in the scope use, with Go to and Scan its page, and Scan
the whole file to bring them all into the scope.
In a frame, the Layers view shows each instance as one row.

Main components, and layers selected inside one, are marked in Figma's
component purple, `#8A38F5`. The value is `--main-component-colour` in
`src/ui/ui.css`, local to the plugin since EDS has no token for it. It is
used as a fill with white text (5.3:1) and as an edge, never as a text
colour, which would measure 3.3:1 on the dark canvas.

## Report and what the plugin keeps in the file

**Export report**, beside the scope line and in Settings, makes a Markdown report (health,
every frame with its health and the layers the plugin changed, the bindings
that need a check, the gaps in the tokens (No equivalent) with each value's
stand-in, the legacy modes that wait for the values below them, the values
set to Decide later, the instances with legacy variables grouped by component,
and the rules version) and a CSV
with one row per binding, where a stand-in nobody has chosen yet reads
"Stand-in:" and the target. Both can be downloaded; the Markdown can also be copied, for where a
download from the plugin window is blocked.

Besides the changes each run makes and the change log on each changed layer,
the plugin keeps these in the shared plugin data of the document (namespace
`eds_migration`), which the designer guide lists under "What the plugin
writes into the file":

- `health`: the latest scan summary (when, where, the totals and the frames
  with the lowest health). It is shown as **Last scan** when the plugin opens,
  before the designer scans again.
- `choices`: the targets the designer chose, so a review can continue another
  day, with the choices on single values that a change on a row put aside
  (`replaced`), so Undo my change on the row still brings them back. When
  they are too many to keep, the window says so. Choices saved before
  `replaced` existed load as they are, without it. Earlier versions
  stored `null` for a value whose legacy variable was kept (Excluded);
  `savedChoices` in `src/scan/mapping.ts` reads it as Decide later.
  The saved `health` totals of such a version can have an `excluded` count,
  which `savedCounts` in `src/scan/summary.ts` adds to Needs check.
- `left-out-pages`: the pages a scan of the file leaves out, chosen in
  **Select pages**, for everyone who scans the file.

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
takes the collection keys as arguments, so it carries no inventory, and it
must stay below the 50 kB code limit of the Figma MCP server's `use_figma`:
the reader imports nothing from the rules (`INSTANCE_LOCKED_FIELDS` lives in
`src/scan/locked-fields.ts` for that reason; imported from
`src/scan/classify.ts` it pulled the rules and the inventory in, at 87 kB).
A large frame's export is too big to return through the MCP server, so
`test/fixtures/nested-instances.json` keeps only the legacy units and the
layers, variables and instances they refer to.

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
- `test/nested-instances.test.ts`: owned slot content, the chain of
  instances and the tree, on the FRIOD test frame 2100:1825 (Casper's case).

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
