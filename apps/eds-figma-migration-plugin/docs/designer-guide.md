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
  [Typography components](#typography-components)). When nothing is left to
  change but values inside instances, Changes says how many, such as
  "Nothing left to change in the scope. 638 legacy values are left inside
  instances", and **Show** opens the Instances tab, which shows where to fix
  them.
- **Instances** shows the instances that still take legacy variables from
  their main component as a tree, drawn as Figma's Layers panel draws
  layers: each frame of the scan, the instances in it in layer order, and
  inside each instance the instances it holds, with slot content under its
  slot. Hidden instances are dimmed and show the hidden icon, so you find the
  ones the canvas does not show. Each row gives the number of legacy values
  in the instance and the instances in it, and **Go to**; a click anywhere
  else on the row opens it. The tree shows only
  the instances that hold such values, and the slots they are in; frames and
  other layers between them are left out, so a level in the tree can be
  deeper in the Layers panel. A component in this file changes every
  instance once its main component is migrated; the Main components tab
  lists it. The plugin migrates variables, not components, so an instance
  of a library component is swapped to an EDS Beta component in Figma, and
  its legacy values go with it. Instances of the legacy Typography component
  are not listed here; **Show** opens their tab in Changes.
  **Check for library updates** finds where the values of each instance can
  be fixed, and labels its row: **Update** (the library has a newer version:
  accept it with Review library updates in Figma's left sidebar),
  **Library** (the library's current version still uses legacy variables:
  swap the instances to EDS Beta components), **This file** (migrate the main
  component on the Main components tab) or **No library** (no library the
  file reaches has the main component: it is from another file, or its
  library no longer publishes it; swap the instances to EDS Beta components,
  migrate the main component in its own file, or detach the
  instances). **Where to fix them** groups the main components the same way,
  with how many values each fix removes and Go to for the instances. The
  check imports the latest version of each library component to compare it
  with the copy in your file, a second or two each. No layer changes, but
  Figma keeps a hidden copy of each latest version in the file, so the check
  runs only when you start it. A line under the button says which component it is checking and, when it ends, what it found, naming the components when there are few, such as "1 not in a library (\_Badge [EDS])"; the library updates open by themselves. **Stop** ends it at once. A main component in your file is labelled
  without a check.
- **Main components** lists the main components in the scope. On this tab,
  Apply in the footer changes all of them in one run and leaves the frames
  as they are; Apply on Changes or Frames changes the main components and
  the frames together. Under the list, **What Apply changes** shows the
  legacy values in those main components the way Changes shows them, with
  the same tabs, status, targets and pickers, so you see every value the
  Apply on this tab changes, and can change it, before you run it. The
  number on Apply is the number of Ready values there, and **Review** in the
  footer goes through the values in those main components that wait for a
  decision. The Typography instances in them are converted on the
  Typography tab, not by this Apply. The tab also lists the main components
  on other pages that instances in the scope use, with **Go to** and
  **Scan its page** for one, and **Scan the whole file** to have them all on
  the tab.
  A scan of one selected main component or component set opens it
  directly. In a main component, **Instances in this component** lists
  every instance in it, grouped by its own main component, with how many
  legacy values each one overrides (they change here) and takes from its
  main component (they change there).

In a frame, the **Layers** view shows each instance as one group, marked
Instance, with everything inside it, the instances in its slots too. In the
group, **Directly in** and the instance's name opens to the values on the
instance's own layers. Under **Inner instances** are the instances in it, in
the same tree as the Instances tab: each opens to the values directly in it,
then the instances inside it, so you can reach a nested instance without
scrolling past a long list. Each value is marked **Overridden in the
instance** or **From the main component**. The group and each row say how
many are overridden, so you can find the values that change here without
opening every row. A legacy value
the instance overrides can be changed there, like any other layer. A value
from the main component cannot: it changes with the main component or its
library.

Content you place in a slot of an instance belongs to that instance once you
edit the slot, and no longer follows the main component. The plugin treats it
like layers in a frame: a legacy value there can be changed like any other,
and an instance you placed there is listed on the Instances tab under the
slot, by the slot's name. In the frame's Layers view, everything in the slot
is in the instance's group under the slot's row: the instances, and the
other layers, such as a frame, under **Directly in** and the slot's name.

To change a target, press **Change** on one value or the target of a row, or
tick several values and use the bar at the bottom of the window. The picker
never offers to keep a legacy variable, since the goal is a file with none
left. Its last option, **Decide later**, leaves the value for a later run:
Apply does not change it, it still counts as not migrated, and Review shows it
again. A Ready value you set to Decide later counts as Needs check until you
choose a target. The row's target then says what its values get, so a row
whose values are all set to it says **Decide later**.

A target you choose on a row reaches every value in it, so it replaces the
choices you made on single values there, such as your answers in Review and
Decide later. The plugin keeps those choices, and the picker says so: "Undo
my change brings back the 3 choices it replaced". **Undo my change** in the
row's picker then removes the row's target and brings back each of those
choices. A value you have given a choice of its own since the change on the
row keeps that one. When you change the row again before you undo, a value
keeps the choice it had before your first change. Choosing the proposal
again on a Ready row works the same way, and Undo my change brings the
choices back there too. Undo my change on a row never removes a choice on a
single value: to remove one, use Undo my change in the value's own picker, or
tick the values and use **Reset choices** in the bar at the bottom.

An open frame and the Main components tab list only their own values of a
row, but the target of a row is the same everywhere: changing it there
changes every value in the row in the scope, as in Changes. The picker
counts all of them, and says how many are elsewhere in the scope and not
listed.

The bar at the bottom has these actions for the ticked values:

- **Apply** makes the Ready changes among them, and nothing else in the
  scope. When some of them need a check, have no equivalent or are set to
  Decide later, the button says how many it applies, and the rest are left
  for a later run. The confirmation counts what the run changes, and names
  each legacy mode that stays because a value below it is not ticked, such as
  "Density: Spacious on Card stays, and is cleared once Icon, width is
  selected and applied".
- **Change target** sets one target on all of them, when they are the same
  kind of value.
- **Decide later** leaves all of them for a later run.
- **Reset choices** removes your choice on them, so they get the proposal or
  the change on their row again. It is only there when some of them have a
  choice.
- **Clear selection** unticks them.

The window is too narrow? Drag the grip in its bottom right corner. The
plugin remembers the size. When Figma has less room than that, the window
shrinks to fit, so the Apply bar stays in view.

## 4. Review the ⚠ values

**Review**, in the footer, shows the values that need a check one at a time,
the No equivalent values with a stand-in, and the values you set to Decide
later. The plugin selects the layer, tells you why it was unsure or what the
EDS Beta lacks, and shows its proposal and the other targets that fit. Confirm
the proposal or use the stand-in, choose another target, or decide later. A
target you choose then counts as Ready. **Decide later** is the way to put a
value off: it is kept as your choice, so Changes shows it, and the value comes
back in the next review. Review has no Skip, so every value you move past
keeps a choice you can see and change in Changes.

### No equivalent and stand-ins

Some legacy values have no token in the EDS Beta, such as a stroke width
variable used as a padding, a palette colour, or a colour on a shadow. They
are gaps in the tokens, and the plugin marks them **No equivalent** so the
gaps show in the health bar and the report. Each gets a stand-in, which the
row shows as **Stand-in:** and the target:

- A number gets the EDS Beta variable with the same px in the density the
  layer will have, such as `spacing/xl` for a 24px gap in comfortable. When no
  variable has that px, it gets the px without a variable. This goes for a
  number on a shadow too, such as its blur. When the plugin cannot read the
  legacy value, for example because the legacy library is not enabled in the
  file, it uses the value the layer has now, and the row says so.
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
a number the plugin could read neither from the variable nor from the layer,
has no stand-in. The report lists these with the other gaps, as "None
possible"; change them in Figma where the EDS Beta has nothing that fits.

## 5. Apply

**Apply**, in the footer, makes every Ready change in the scope, or in one
frame when you are in it. It binds the new variables, applies the text styles, and sets the new
modes on the frames that had the legacy ones:

- Spacious becomes **comfortable**, and Comfortable becomes **compact**. The
  names moved: the old Comfortable was the dense mode.
- Light and Dark become **light** and **dark**.

A legacy mode is removed only when no layer below it uses a legacy variable
any more. While a value below still needs it, it stays, and the plugin says
why. Such a mode is marked **Waiting**: the change is to clear it, and Apply
makes that change once the layers below are migrated. In the health bar it
counts as No equivalent.

The plugin works this out from your choices, so you do not need to scan and
apply twice. A legacy mode above a value that needs a check waits until you
decide the value. Once every value below it is Ready, the mode is Ready too,
and the same Apply changes the values and then removes the mode. It keeps
waiting while a value below stays legacy: inside an instance, No equivalent
without your choice or without a stand-in, a check you have not decided, a
value set to Decide later, or a Manual fix you have not accepted.

Ready means ready to change: the Ready count is what the next Apply changes.
So a legacy mode that would be cleared becomes Waiting as soon as you set a
value below it to Decide later, since Apply would keep the mode for that
value. Its row says what it waits for, such as "Cleared once Icon, width is
decided", or "once the main component Button is migrated" for values inside
instances. **Remove the legacy mode** on such a mode, chosen or confirmed in
Review, clears it once nothing below reads it. To remove it in the next run
anyway, choose **Remove the legacy mode anyway (the values below that read it
change)**: the picker offers it on every legacy mode that values below read,
and the Apply confirmation names each mode removed that way, with the values
below that change. A legacy mode
that sets a new mode, such as Spacious to `density: comfortable`, stays
Ready, since Apply sets the new mode. Its row notes that the legacy mode
stays beside it until the values below are changed, and a later Apply clears
it.

The Apply confirmation counts what the run does: values bound to EDS Beta
variables, numbers set without a variable, text styles applied, new modes
set, legacy modes removed, and layers reset for a Manual fix. It says what
changes inside instances: how many of the changes are values an instance
overrides, which change in that instance, and that a reset also removes the
other overrides on the layer and the layers below it, which the plugin puts
back as they are. It counts the legacy values that instances take from their
main component, which the run does not change in the instance, and says
where they change instead. It names the legacy modes that stay, with what
each waits for, and says that the plugin notes each change in the layer's
plugin data (see [What the plugin writes into the file](#what-the-plugin-writes-into-the-file)).
The confirmation's Apply button is on once the counts are there.

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

Every Convert, for all instances, for a row or for one instance, asks first.
The confirmation counts the instances replaced by text layers with an EDS
Beta text style, the colours changed to EDS Beta, left on their legacy
variable or copied as they are, the text cases dropped, and the main
components whose instances get their text carried across, with how many
instances they have. It lists the instances Convert leaves, with why, and
says that the plugin notes each conversion in the new text layer's plugin
data, so Revert frame can put the instance back. When nothing would be
converted, its Convert button is off.

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

## What the plugin writes into the file

Apply and Convert each open a confirmation that lists what the run changes,
counted from the run itself. Besides those changes, the plugin notes each
change on the layer it changes, and keeps your choices in the file. This is
everything it writes:

- **Variable bindings.** Apply binds the EDS Beta variable on the same
  property of the layer, such as a fill, a stroke, an effect or a padding.
  The other bindings on the layer stay as they are.
- **Text styles.** Apply sets an EDS Beta text style on a text, or on a range
  of it, in place of the legacy typography variables.
- **Modes.** Apply sets the new density or colour scheme mode on the layer
  that had the legacy one. It removes the legacy mode once nothing below it
  reads it, or in the same run when you chose to remove it anyway.
- **Values without a variable.** Where the EDS Beta has no variable, such as
  for a border width, Apply sets the number itself, on the layer or on an
  effect, in place of the legacy variable.
- **Reset layers.** For a Manual fix you accepted, Apply resets the layer
  inside the instance, so it takes its size from the main component again,
  swaps it back if it was a swapped icon, and puts the other overrides on it
  and below it back as they are. The fix lists those in Changes.
- **Converted text layers.** Convert replaces a Typography instance with a
  text layer in the same place, with the same text, an EDS Beta text style
  and a colour. In a main component, the text each instance of the component
  showed is set on the new text layer in that instance.
- **The change log.** On every layer it changes, the plugin notes what it
  changed in the layer's plugin data (shared plugin data, namespace
  `eds_migration`, key `log`): the legacy variable, typography, mode or
  component, what replaced it, whether it was Ready, confirmed or your
  choice, the rule that proposed it, and the time. Revert frame reads this
  note to put the legacy values back. On a layer inside an instance, the note
  is plugin data the instance sets on that layer, so it is an override of the
  instance, as the changed value is. Other plugins can read the note, so a
  team can check a migration with its own tools.
- **Saved choices, health and left-out pages.** In the file's own plugin
  data, the plugin keeps the targets you chose, with the choices a change on
  a row put aside so Undo can bring them back; the result of the latest scan,
  shown as **Last scan** when the plugin opens; and the pages a scan of the
  file leaves out. Everyone who opens the plugin in the file sees them.

Your display settings, the window size and whether you have seen the
introduction are kept for you in Figma, not in the file.

Inside an instance, the plugin changes only the values the instance
overrides and the layers it resets for a Manual fix, and the confirmation
counts both. A value an instance takes from its main component is not
changed in the instance: it changes with the main component, and an instance
of a library component keeps it until you swap the instance to an EDS Beta
component.

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
not reviewed yet or set to Decide later. The mode's row in Changes says
which, and the Apply confirmation lists the modes a run leaves.

**Ready and Migrated sound the same.** Ready means the plugin knows the
replacement and can apply it; Migrated means it has been applied.
