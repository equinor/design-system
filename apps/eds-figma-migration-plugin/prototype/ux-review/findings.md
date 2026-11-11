# UX review of EDS Variable Migration, as Kari

The review follows the persona in `.local-eddi-notes/2026-11-11-migration-plugin-persona.md`:
Kari Solberg, the only designer in a product team, moving a file with 9
pages and about 120 frames from the EDS 2.0 libraries to EDS Foundation
[EDS Beta]. Kari knows Figma variables and modes, but not the Beta token
names, and will not let a tool change a file without seeing what it does.

It was done on 2026-11-11 in the HTML prototype (`prototype/review/before/`),
which runs the plugin window as it is in the published version, against a
mock file built from the scan of the test frame: three pages, a frame with
nothing migrated, a copy that is half way, an alarm list with 14 legacy icon
instances, frames without EDS variables and a local component. The plugin
was also run in Figma on the test file, and Figma's own Check designs was
compared ([research/check-designs.md](../research/check-designs.md)).

The persona file lists three gaps in the build it was written for (no
Apply, choices lost between sessions, no report). All three are closed in
this version: Apply and Revert frame work, choices and the last scan are kept
in the file, and the report can be exported.

## The persona's tasks

Before is the plugin as published (`review/before/`); after is the prototype
with the fixes below (`review/`).

| Task                                                     | Before | After  | What changed                                                                                                          |
| -------------------------------------------------------- | ------ | ------ | --------------------------------------------------------------------------------------------------------------------- |
| Find the frame with the most work left after a file scan | Partly | Passed | Most work left lists the three frames with most legacy values across pages, and the busiest page opens (F3)           |
| Explain Ready, Needs check and No equivalent             | Passed | Passed | The legend no longer speaks of bindings or token names (F5)                                                           |
| Understand why one binding needs a check                 | Failed | Passed | The review leads with a plain sentence, keeps the rule under Details, and says what each target is for (F2)           |
| Confirm a Needs check proposal, then change another one  | Passed | Passed | The step title says where the layer is (F10)                                                                          |
| Change the same wrong proposal on 16 layers at once      | Partly | Passed | The Mapping tab has tabs by kind, a row per legacy variable, and the target with its swatch opens the picker (F6, F7) |
| Look at a layer on the canvas and come back              | Passed | Passed | No change                                                                                                             |
| Undo a change                                            | Partly | Passed | The result of an apply in a frame offers Revert (F11)                                                                 |
| Decide what to do about instances with legacy variables  | Passed | Passed | No change                                                                                                             |
| Tell two frames with the same name apart                 | Passed | Passed | Last scan counts repeated names (F12)                                                                                 |

## Findings

Severity: **High** stops or misleads Kari in a task; **Medium** slows the
task or makes Kari unsure; **Low** is polish.

### F1 High: the work starts below the fold in a frame

In a 720 px window, a frame shows the header, the health bar, the legend,
Apply and Review, two rows of status chips and two rows of property chips
before the first layer. Kari opens a frame to see what changes and has to
scroll past filters first ([before-04-frame.jpg](before-04-frame.jpg)).

Fix: keep the health bar, Apply and Review, and fold the filters into one
**Filter** line that says what is shown ("All statuses · All properties")
and opens the chips when asked.

### F2 High: Needs check is explained in token terms

The review is where Kari's judgement is needed, and the reason reads like a
rule: "Text is named for what it sits on background/surface on “Card /
Actions”", or "Not interactive (“Chip / Status” matches both Chip, which is
interactive, and Status, which is not)". The two proposed targets,
`text/on-default/accent` and `text/on-muted/accent`, are not explained
either ([before-05-review.jpg](before-05-review.jpg)).

Fix: lead with a plain sentence ("This text sits on a card. EDS names text
colours after what they sit on."), keep the rule's own words under
**Details**, and give each proposed target a one-line meaning ("Text on the
page, a card or another default surface", "Text on a light, tinted fill").

### F3 High: no way to see where the work is after a file scan

A file scan shows one accordion item per page, all closed. To find the frame
with the most work, Kari opens every page and compares "454 legacy" against
"94 legacy" ([before-02-file-scan.jpg](before-02-file-scan.jpg)). With 9 pages
and 120 frames this is the task Kari does first every week.

Fix: a **Most work left** list at the top of the Frames tab, with the three
frames that have the most values to migrate across all pages, and Open on
each. The page with the most work opens by itself.

### F4 Medium: the scope ignores what is selected

Kari opens the plugin with a frame selected, and the scope is Page. Scanning
then covers the whole page, not the frame Kari had in mind
([before-01-open.jpg](before-01-open.jpg)).

Fix: start on **Selection** when something is selected when the plugin
opens, and on Page otherwise.

### F5 Medium: "binding", "legacy" and "In instance" slow Kari down

Counts read "293 legacy · 15 need check", "8 bindings" and "Select all 14 to
change", and a category is called "In instance". The persona asks "What is a
binding?".

Fix: count **values**, the word Figma uses in its own panels: "293 legacy
values", "8 values", "Select all 14". Call the category **Inside
instances**.

### F6 Medium: the Mapping tab shows names, not what changes

The Mapping tab lists `Text/Neutral/Strong → text/primary ×25` with no
colour or number. Figma's Check designs shows a swatch, the value and
whether it matches; Kari wants to see whether a swap changes the look
before applying it ([before-06-mapping.jpg](before-06-mapping.jpg)).

Fix: a swatch for colours in the current theme, the value for spacing and
radii, and the size and line height for text styles, next to each target in
the Mapping tab and in the frame view.

### F7 Medium: the Mapping tab mixes every kind of value

The list starts with `spacing/border-radius/rounded`, `spacing/vertical/xs`
and `spacing/horizontal/md`, because it is ordered by count. Kari thinks in
colours, type and spacing, as Check designs' tabs do.

Fix: tabs for **All**, **Colour**, **Typography**, **Spacing**, **Corner
radius**, **Size** and **Modes**, with counts, as the first level of the
Mapping tab, in place of the property chips.

### F8 Medium: Apply does not say where it applies

From a file scan, "Apply 492 changes in the scope?" does not say that it
covers four frames on two pages. Kari applies page by page and wants to know
the reach before confirming.

Fix: the confirmation names the reach: "492 changes on 374 layers in 4
frames on 2 pages", and how many values still need a check and stay.

### F9 Low: empty filters

The status chips include categories with no values ("Migrated 0", "In
instance 0"), which add a row without adding a choice.

Fix: show only the categories that have values, and All.

### F10 Low: the review step names the layer, not where it is

Many layers share a name ("Label", "Cell"). The step title reads "Label ·
Fill", and the path is in small text below.

Fix: title the step with the layer and its parent ("Label in Button /
Outlined") and keep the full path below.

### F11 Low: undo is spread out, and Revert frame only lives in a frame

After an apply from a frame, the result banner says what happened but does
not offer the way back. Kari has to find Revert frame, which is only in the
frame view.

Fix: the result banner of an apply in a frame has **Revert** next to the
message. After an apply across frames, it says that each frame can be
reverted from the frame.

### F12 Low: Last scan repeats names

When the plugin opens, Last scan lists the frames with the lowest health,
and the same name can show several times without telling them apart.

Fix: one line per name and page, with a count when a name repeats.

## What the prototype changes

Every finding is fixed in the prototype's copy of the window
(`prototype/src/ui`). The plugin itself is unchanged.

| Finding | In the prototype                                                                                                                                     | Screenshot                                                                                           |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| F1      | A frame shows "Showing every status · every property" with **Filter**; the chips open on request, and the layers start about 290 px higher           | [after-05-frame.jpg](after-05-frame.jpg)                                                             |
| F2      | `prototype/src/ui/plain.ts` turns each rule's reason into a sentence and gives each target a meaning, in the review step and in the picker           | [after-06-review.jpg](after-06-review.jpg)                                                           |
| F3      | **Most work left** at the top of the Frames tab, and the page with the most work open                                                                | [after-02-file-scan.jpg](after-02-file-scan.jpg)                                                     |
| F4      | The scope starts on Selection when something is selected, until the designer chooses or scans                                                        | [after-01-open.jpg](after-01-open.jpg)                                                               |
| F5      | "legacy values", "values", "to check" and **Inside instances** in the counts, the legend and the dialogs                                             | [after-02-file-scan.jpg](after-02-file-scan.jpg)                                                     |
| F6, F7  | The Mapping tab follows Check designs: tabs by kind with counts, sections by property, one row per legacy variable with the target's swatch or value | [after-04-mapping.jpg](after-04-mapping.jpg), [after-09-mapping-dark.jpg](after-09-mapping-dark.jpg) |
| F8      | Apply moves to a footer that says "Change 492 values in 3 frames on 2 pages", with Review beside it; the confirmation says what stays                | [after-07-apply-confirm.jpg](after-07-apply-confirm.jpg)                                             |
| F9      | Only the statuses that have values are offered as filters                                                                                            | [after-05-frame.jpg](after-05-frame.jpg)                                                             |
| F10     | "Label in Button / Outlined", with the property and the path below                                                                                   | [after-06-review.jpg](after-06-review.jpg)                                                           |
| F11     | The result of an apply in a frame has **Revert**; after an apply across frames it says each frame can be reverted                                    | [after-08-applied.jpg](after-08-applied.jpg)                                                         |
| F12     | Last scan shows one line per name and page, with ×N for repeats                                                                                      | [after-03-last-scan.jpg](after-03-last-scan.jpg)                                                     |

To carry a fix into the plugin, compare the file in `prototype/src/ui` with
the same file in `src/ui`; the fork started as an exact copy.

## Not fixed in the prototype

- **The mode in force** (Dark, Comfortable), which Check designs shows on
  each row, would help in the review, but the plugin does not send the modes
  with each binding yet. The scan has them, so this is a change in the
  plugin's messages rather than in the window.
- **A thumbnail of the layer** in the review step would spare Kari the look
  at the canvas, but needs an export of each layer, which costs time on a
  large file.
