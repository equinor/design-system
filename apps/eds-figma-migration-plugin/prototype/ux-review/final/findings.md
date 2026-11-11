# Final UX review: the prototype built on Check designs

This is the final review, done on 2026-11-11 on the prototype that combines
the current plugin with Figma's Check designs
([`review/check-designs/`](../../review/check-designs/index.html)). The
first review, of the published plugin, is in [../findings.md](../findings.md);
its fixes are kept in this design.

What the design takes from Check designs
([research](../../research/check-designs.md)):

- **Header actions**: go to the scanned layers, scan again, and a settings
  menu (layer counts, frames without EDS variables, local components, export
  report), as Check designs has refocus, check new selection and settings.
- **Changes** is the first tab after a scan, with **tabs by kind of value**
  (Colour, Typography, Spacing, Size, Corner radius, Modes) and their counts.
- **Sections by property** (Text colour, Fill, Stroke, Padding and gaps, …),
  each with Go to all, as Check designs' "Frame › Fill" groups.
- **One row per legacy variable and target**: the number of layers, the
  legacy variable, an arrow and the target with its swatch or value. A click
  on the legacy variable selects its layers; a click on the target opens the
  picker; the chevron lists the layers.
- **A footer** that says what Apply changes, with Review and Apply, as Check
  designs' "Update 39 colors across 68 items" and Apply.
- **Scope and Scan on one line** once a scan is shown.

Everything else in the plugin is kept: the health bar and legend, Frames
with pages and Most work left, the frame view, the ⚠ review, Instances,
bulk changes, the picker, Apply, Revert frame, the report and Last scan.

The review follows the persona Kari Solberg
(`.local-eddi-notes/2026-11-11-migration-plugin-persona.md`) through the
same nine tasks as the first review, and adds the persona's goal of handing
the developers a report.

## The persona's tasks

| Task                                                     | Result | What happened                                                                                    |
| -------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------ |
| Find the frame with the most work left after a file scan | Partly | The window opens on Changes, by kind of value; Most work left is one tab away under Frames (FR1) |
| Explain Ready, Needs check and No equivalent             | Passed | The legend and the plain wording carry over                                                      |
| Understand why one binding needs a check                 | Passed | The review step's plain reasons carry over ([09-review.jpg](09-review.jpg))                      |
| Confirm a Needs check proposal, then change another one  | Passed | No change                                                                                        |
| Change the same wrong proposal on 16 layers at once      | Partly | Quick in Colour; in Typography and Modes the rows cannot be read (FR2, FR3)                      |
| Look at a layer on the canvas and come back              | Passed | A click on a row selects its layers, as in Check designs                                         |
| Undo a change                                            | Passed | No change                                                                                        |
| Decide what to do about instances with legacy variables  | Passed | No change                                                                                        |
| Tell two frames with the same name apart                 | Passed | No change                                                                                        |
| Hand the developers a report                             | Partly | Export report has moved into the settings menu (FR4)                                             |

## Findings

### FR1 Medium: the first view after a file scan is not where the work is

Changes is the first tab, as in Check designs, which checks a selection. After
a scan of a page or the file, Kari's first question is which frames to start
with, and Most work left is under Frames ([02-changes.jpg](02-changes.jpg),
[06-frames.jpg](06-frames.jpg)).

Fix: open on Changes after a scan of the selection, and on Frames after a
scan of a page or the file.

### FR2 High: Typography rows cannot be read

The legacy side is a list of variable names cut to "typography/ui-bod…", and
the target's name is cut to "l…" beside its size and font
([11-typography.jpg](11-typography.jpg)). Kari cannot tell which text style
a row becomes without opening the picker.

Fix: write the legacy typography as a short summary ("UI body · sm ·
squished"), and the target on two lines: the text style's name, then its size
and font.

### FR3 Medium: Mode rows lose the collection and the target

A mode row reads "3 Danger → Clear the mode …"
([05-modes.jpg](05-modes.jpg)). The collection, Appearance, is in small text
below, and the target is cut off. The density modes, whose names moved
(Spacious → comfortable), are the ones Kari most needs to see.

Fix: the legacy side says "Appearance: Danger", and the target says what
happens in a few words: "Remove the legacy mode" or "density: comfortable".

### FR4 Medium: Export report is hidden in the settings menu

The persona's goal is to hand the developers frames and a report. In this
design, the report is the last item of the settings menu
([03-settings.jpg](03-settings.jpg)).

Fix: Export report back beside the scope line, and kept in the menu.

### FR5 Medium: local components disappear behind a setting

A local component that still uses legacy variables, and is used 12 times in
the file, is only shown when Local components is ticked in the settings
menu. The first design had a switch under the frames that said how many main
components there are.

Fix: when the setting is off and a component uses legacy variables, the
Frames tab says so in one line, with Show.

### FR6 Low: the header icons do not say what they do

Three icons sit in the header: a target, a circular arrow and sliders. The
target selects the scanned layers, which neither its shape nor its place
says; the label only shows on hover.

Fix: move Go to beside Scan as a text button ("Go to scope"), and keep only
the settings icon in the header.

### FR7 Low: Scan appears twice

After a scan there is a Scan button in the scope line and a Scan again icon
in the header, which do the same.

Fix: one button in the scope line, labelled Scan again after a scan; the
header icon goes.

### FR8 Medium: the kind tabs hide Corner radius and Modes

The tabs run off the right edge of the window, cutting Corner radius and
hiding Modes, with nothing that says the row scrolls
([02-changes.jpg](02-changes.jpg)).

Fix: shorter labels (Colour, Type, Spacing, Radius, Size, Modes) and tighter
spacing, so all six fit in the window.

### FR9 Medium: a frame shows the same data in another layout

In a frame, the Variables view is the earlier accordion: legacy variables
without their targets or swatches, and long names that run out of the window
([08-frame-variables.jpg](08-frame-variables.jpg)). In Changes, the same
data is a row with the target and its swatch.

Fix: the frame's Variables view uses the Changes layout, for the bindings in
that frame.

### FR10 Low: Changes and the health bar count differently

Colour shows "Needs check 38" while the health bar says 36, because Changes
includes the local component and the health bar leaves it out until Local
components is on.

Fix: Changes follows the Local components setting.

### FR11 Low: every row repeats its collection

Under each row, beside the status, the collection name is repeated
("Semantic", "Density"). It adds a line to every row without helping the
choice.

Fix: the collection moves into the legacy variable's tooltip.

## What the prototype changes after this review

Every finding is fixed in the prototype ([`review/index.html`](../../review/index.html));
the design as reviewed is kept in [`review/check-designs/`](../../review/check-designs/index.html).
The plugin itself is unchanged.

| Finding | In the prototype                                                                                                                       | Screenshot                                                   |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| FR1     | A scan of the selection opens on Changes; a scan of a page or the file opens on Frames, with Most work left at the top                 | [after-01-file-scan.jpg](after-01-file-scan.jpg)             |
| FR2     | Typography reads "UI body · sm · squished", and the target shows its text style and, below, its size and font                          | [after-03-type.jpg](after-03-type.jpg)                       |
| FR3     | Modes read "Density: Comfortable → density: compact" and "Appearance: Danger → Remove the legacy mode"                                 | [after-04-modes.jpg](after-04-modes.jpg)                     |
| FR4     | Export report is back beside the scope line, and still in the menu                                                                     | [after-01-file-scan.jpg](after-01-file-scan.jpg)             |
| FR5     | Frames says "1 local component uses legacy variables and is used 12 times in the file." with Show                                      | [after-01-file-scan.jpg](after-01-file-scan.jpg)             |
| FR6     | Go to scope is a text button beside Scan; only Settings stays in the header                                                            | [after-01-file-scan.jpg](after-01-file-scan.jpg)             |
| FR7     | One button, Scan again, in the scope line                                                                                              | [after-01-file-scan.jpg](after-01-file-scan.jpg)             |
| FR8     | The kind tabs are called Colour, Type, Spacing, Size, Radius and Modes, and all six fit                                                | [after-02-changes.jpg](after-02-changes.jpg)                 |
| FR9     | A frame's Variables view is the Changes layout for that frame                                                                          | [after-05-frame-variables.jpg](after-05-frame-variables.jpg) |
| FR10    | Changes leaves out local components until they are shown, so its counts match the health bar (Needs check 36)                          | [after-02-changes.jpg](after-02-changes.jpg)                 |
| FR11    | The collection is in the legacy variable's tooltip; each row has only its status under it; names wrap to two lines before they are cut | [after-02-changes.jpg](after-02-changes.jpg)                 |

After the fixes, Kari passes all ten tasks.

## Not fixed in the prototype

- **The legacy value.** Check designs shows the value now and marks a
  suggestion Match when the value is the same. The plugin does not send the
  colours and numbers of the legacy variables, so the prototype cannot show
  whether a swap changes the look. The scan can read them; this is a change
  in the plugin.
- **The mode in force** on a row, for the same reason.
