# EDS Variable Migration: a guide for designers

EDS Variable Migration updates your Figma file from the legacy EDS variables
(the deprecated EDS Colours, Spacing and Typography libraries) to the EDS Beta
tokens. In Figma's library list the Beta is called **EDS Foundation [EDS
Beta]**. The plugin runs in your file and uses no AI credits. Inside an
instance it only changes what the instance overrides itself; the rest changes
with the main component.

The plugin is a test version, marked **[WIP BETA]**. Try it on a copy of a
frame or in a branch first, and tell the EDS team what does not work.

## Before you start

1. Enable **EDS Foundation [EDS Beta]** in the file: **Assets → Libraries**.
   The plugin imports its variables and text styles from there.
2. Keep the legacy libraries enabled until you are done. Revert frame needs
   them to put the legacy variables back.
3. Open the plugin: **Plugins → Equinor → EDS Variable Migration [WIP BETA]**.
   The first time, a short introduction explains what the plugin does, what it
   does not do and how to use it. **Settings** (the sliders button in the
   header) opens it again, and holds the display switches, a Dark mode switch
   for the window, the report and a reset for the window size. The switches are kept for you, in every file.

## 1. Scan

Choose a scope and press **Scan**:

- **Selection**: the frames you have selected.
- **Page**: every frame on the current page.
- **File**: every page, one at a time. A large file takes a while; you can
  cancel. **Select pages**, beside File, opens a list of the pages where you
  untick the ones to leave out, such as an archive. The count beside the
  button shows how many are ticked, for example 5/8 pages. The choice is kept
  in the file for everyone who scans it, and a page added later is ticked
  until someone leaves it out.

While the plugin scans, it draws the page: each frame turns coloured when it
has been read, a box shows the frame it is reading now, and grey and green
dots show where it found legacy and migrated values.

## 2. Read the health

The health bar counts every property bound to a variable, every text's typography
and every mode set on a frame:

| Status           | What it means                                                                                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Migrated         | Already uses the EDS Beta tokens. Green, because it is done.                                                                                                                 |
| Ready            | A legacy variable with one clear replacement. Blue: the plugin can apply it.                                                                                                 |
| Needs check ⚠    | The replacement depends on what the layer does, for example interactive or not.                                                                                              |
| Manual fix       | A legacy value Figma lets nobody change where it is, such as an icon size inside an instance. The row says how to fix it in Figma. Shown only when there are some.           |
| No equivalent    | The EDS Beta has no token for it, such as a stroke width on a padding or a palette colour: a gap in the tokens. The plugin proposes a stand-in for you to choose or replace. |
| Inside instances | Comes from an instance's main component. The plugin leaves it: migrate a main component in this file, or swap an instance of a library component to an EDS Beta component.   |

Health is the share that is migrated. It reaches 100% only when no legacy
variable is left: a value you set to **Decide later** still counts as not
migrated. The **i** button next to the legend explains the statuses again. When values sit inside instances, a line under
the legend gives the share migrated outside instances, which is what the
plugin can change in the scope.

A value an instance overrides itself, such as an icon you swapped and gave
another size, gets a status like any other layer, because changing the main
component does not change it. So does a legacy mode set on a layer inside an
instance, such as an Appearance mode left on an icon after its colours were
migrated: Apply clears it once nothing below it uses legacy variables. Figma lets nobody change the width or height
of a layer inside an instance, in the editor or from a plugin, so a legacy
size there is marked **Manual fix**. This happens when an icon was swapped
while its slot still used a legacy size: the swap copied the size onto the
icon, and it stayed when the main component was migrated. The row says how
to fix it: click the row to select the layer, right-click it in Figma and
choose **Reset all changes**. A swapped icon turns back into the icon the
main component has there, with its EDS Beta size; swap it to your icon again,
and the size stays. When the icon was picked with a property of the instance
above it, such as Icon on Error icon in Text Field, the reset keeps the icon
but not the size: set the property to the default icon and back instead, as
the row says. The reset also removes the other changes on the layer and the
layers below it, such as its colour, so the row lists them with the EDS Beta
value to set again. The list also names the swap back and the swap again,
or the property set to the default icon and back, and reminds you of
changes without a variable, such as a hidden layer, which are not listed one
by one but are set again too.

The plugin can make this fix for you, but only after you accept it, since it
is more than a swap of one variable for another. Manual fixes are part of
**Review** and of **Changes**, where they are listed with the other values
(Width and height, on the Size tab) and show as Ready once accepted, since
Apply makes them: the step explains the fix, and **Accept the fix** lets the plugin
read every change on the layer, reset it, swap it back and set the changes
again on the next Apply. It checks each change afterwards; if one cannot be
copied, it leaves the layer as it was and says why. The list of what the
reset removes and the plugin sets again stays in the window after you accept
the fix: on the value in Changes and in the frame, and in **How to fix it**,
which the row's status opens. The plugin puts each of those changes back as it
is now, and the same Apply then changes the Ready ones to the EDS Beta value
the list shows; one that still needs a check stays on its legacy variable
until you decide. So you see everything the next Apply changes on
that layer before you run it. **Decide later** leaves the value for a later
run. When the main component itself still uses a legacy size, or the layer
is not an instance, the plugin cannot make the fix, and the row only gives
the steps.

## 3. Look at what will change

- **Frames** starts with the frames that have the most work left, then lists
  every frame, lowest health first. **Open** shows every value in a frame,
  grouped by layer or by legacy variable. **Go to** selects the layer in
  Figma.
- **Changes** lists every legacy variable in the scope with what it becomes,
  in tabs by kind of value. Values instances take from their main component
  are not part of it; they change with their main component or library. A
  value an instance overrides is listed, marked **Overridden in the
  instance**. A row marked with an eye has a new
  colour that looks clearly different from the legacy one on its layers: the
  mapping is right by role, but check the look. **Looks different** filters
  those rows. A click on the legacy variable selects its
  layers; a click on the target changes it for every layer that uses it.
  The **Typography** tab in Changes lists the instances of the legacy
  Typography component with the text style and colour each one gets (see
  [Typography components](#typography-components)).
- **Instances** lists the instances that still use legacy variables, grouped
  by component. For a component in this file, **Go to main component** takes
  you to it: migrate its page, and every instance follows. The plugin
  migrates variables, not components, so for a component from a library the
  tab asks you to swap the instances to EDS Beta components in Figma; their
  legacy values go with them. Instances of the legacy Typography component
  are not listed here; **Show** opens their tab in Changes.
- **Main components** lists the main components in the scope. On this tab,
  Apply in the footer changes all of them in one run and leaves the frames
  as they are; Apply on Changes or Frames changes the main components and
  the frames together. The tab also lists the main components on other pages
  that instances in the scope use, with **Go to** and **Scan its page** for
  one, and **Scan the whole file** to have them all on the tab.
  A scan of one selected main component or component set opens it
  directly. In a main component, **Instances in this component** lists
  every instance in it, grouped by its own main component, with how many
  legacy values each one overrides (they change here) and takes from its
  main component (they change there).

In a frame, the **Layers** view shows each instance as one row, marked
Instance. Each value in it is marked **Overridden in the instance** or **From
the main component**, and the row says how many are overridden. A legacy value
the instance overrides can be changed there, like any other layer. A value
from the main component cannot: it changes with the main component or its
library.

To change a target, press **Change** on one value or the target of a row, or
tick several values and use the bar at the bottom of the window. The picker
never offers to keep a legacy variable, since the goal is a file with none
left. Its last option, **Decide later**, leaves the value for a later run:
Apply does not change it, it still counts as not migrated, and Review shows it
again. A Ready value you set to Decide later counts as Needs check until you
choose a target. The row's target then says what its values get, so a row
whose values are all set to it says **Decide later**.

The bar at the bottom has these actions for the ticked values:

- **Apply** makes the Ready changes among them, and nothing else in the
  scope. When some of them need a check, have no equivalent or are set to
  Decide later, the button says how many it applies, and the rest are left
  for a later run.
- **Change target** sets one target on all of them, when they are the same
  kind of value.
- **Decide later** leaves all of them for a later run.
- **Reset choices** removes your choice on them, so they get the proposal or
  the change on their row again. It is only there when some of them have a
  choice.
- **Clear selection** unticks them.

The window is too narrow? Drag the grip in its bottom right corner. The
plugin remembers the size.

## 4. Review the ⚠ values

**Review**, in the footer, shows the values that need a check one at a time,
the No equivalent values with a stand-in, and the values you set to Decide
later. The plugin selects the layer, tells you why it was unsure or what the
EDS Beta lacks, and shows its proposal and the other targets that fit. Confirm
the proposal or use the stand-in, choose another target, decide later, or
skip it. A target you choose then counts as Ready. **Decide later** is kept
as your choice, so Changes shows it, and the value comes back in the next
review; **Skip** moves on without a choice.

### No equivalent and stand-ins

Some legacy values have no token in the EDS Beta, such as a stroke width
variable used as a padding, a palette colour, or a colour on a shadow. They
are gaps in the tokens, and the plugin marks them **No equivalent** so the
gaps show in the health bar and the report. Each gets a stand-in, which the
row shows as **Stand-in:** and the target:

- A number gets the EDS Beta variable with the same px in the density the
  layer will have, such as `spacing/xl` for a 24px gap in comfortable. When no
  variable has that px, it gets the px without a variable.
- A colour gets the EDS Beta colour for what the layer is (text, icon, border
  or background, interactive or not) that looks nearest to the legacy colour.
  A colour on a shadow is offered `overlay/scrim` too, the one see-through
  colour.
- A type size gets the nearest text style step.
- For a legacy mode the plugin does not know, the stand-in is to remove the
  mode, so the layer takes the mode set above it.

Apply changes the value once you choose the stand-in or another target, in
Changes or in Review. Until then it counts as not migrated, so the file is
done only when every gap has a target. Only a string or boolean variable, or
a number the plugin could not read, has no stand-in.

## 5. Apply

**Apply**, in the footer, makes every Ready change in the scope, or in one
frame when you are in it. It binds the new variables, applies the text styles, and sets the new
modes on the frames that had the legacy ones:

- Spacious becomes **comfortable**, and Comfortable becomes **compact**. The
  names moved: the old Comfortable was the dense mode.
- Light and Dark become **light** and **dark**.

A legacy mode is removed only when no layer below it uses a legacy variable
any more. While an instance or an icon size below still needs it, it stays,
and the plugin says why. Such a mode is marked **Waiting**: the change is to
clear it, and Apply makes that change once the layers below are migrated. In
the health bar it counts as No equivalent.

Check the frame afterwards. Small differences in colour and spacing come from
the new token values, not from the plugin.

Applying in a main component changes every instance of it in the file. The
confirmation says how many instances there are.

The plugin marks main components in the purple Figma uses for them: the rows
on the Main components tab, an opened main component, and the Apply footer
when it applies to main components only. A selected main component, or a
layer selected inside one, is marked beside the scope too, since a change
there also reaches every instance.

## Typography components

The legacy Typography component can become a text layer with an EDS Beta
text style and colour: **Convert to text** on the Typography tab in Changes.
The tab shows what each instance gets before you convert, with the same rows
as Changes. The **Text style** section has a row for each legacy typography
and text style, and the **Text colour** section a row for each legacy colour.
A click on the target changes it for the row, **Change** on an instance
changes it for that instance only, and **Review** steps through the ones that
need a check. Choose **Decide later** to leave an instance for now.

Convert changes the instances whose text style is Ready, so the number on the
button can be smaller than the number of instances. An instance whose text
style needs a check, has no equivalent, or is set to Decide later stays as it
is until you decide; its Convert button is off, and the row says why. A
colour that is not Ready stays on its legacy variable after converting, and
Changes lists it then.

Some instances need a check because of their text case. The legacy text can
be in upper case, for example, and the EDS Beta text styles have no text
case. Figma detaches the text style from a layer when a text case is set on
it, so converting keeps the style and drops the case, and the text shows as
typed. Confirm the style if that is right, or decide later.

An instance in a main component carries the text of every instance of that
component. Its row says how many instances there are; converting carries the
text each of them shows across to the new text layer. A Typography component
with mono numbers loses them, since a text style cannot carry tabular
figures; the result has a button that selects those texts.

## Undo and revert

- **Ctrl or Cmd+Z** right after an apply undoes the whole apply.
- **Revert frame**, in a frame the plugin has changed, puts the legacy
  variables back later, from a log the plugin keeps on every layer it
  changes. A value you have changed since is left as you made it.
- After an undo or an edit, the plugin says the page has changed since the
  scan, and Apply waits until you scan again.

## Share the result

**Export report**, beside the scope line, makes a Markdown report and a CSV for a spreadsheet, with
the health, the frames, what needs a check, the gaps in the tokens with the
stand-in for each, the values set to Decide later, and the instances. It counts what the window counts, main components in the scope included. The plugin also keeps the latest scan and your choices in the
file, so the next time you open it, you see where you left off.

## Questions

**Why does the plugin not change my instances?** It changes the values an
instance overrides itself, and leaves the values it takes from its main
component. A change to one of those would become an override, which stops the
instance from getting updates. For a component in this file, migrate its main
component, and the instances follow. The plugin migrates variables, not
components, so swap an instance of a library component to an EDS Beta
component in Figma; its legacy values go with it.

**Why is a legacy mode still on my frame?** Something below it still uses a
legacy variable through it: an instance, an icon size, or a value you have
not reviewed yet or set to Decide later.

**Ready and Migrated sound the same.** Ready means the plugin knows the
replacement and can apply it; Migrated means it has been applied.
