# EDS Variable Migration: a guide for designers

EDS Variable Migration updates your Figma file from the legacy EDS variables
(the deprecated EDS Colours, Spacing and Typography libraries) to the EDS Beta
tokens. In Figma's library list the Beta is called **EDS Foundation [EDS
Beta]**. The plugin runs in your file, uses no AI credits, and never changes
anything inside an instance.

The plugin is a test version, marked **[WIP BETA]**. Try it on a copy of a
frame or in a branch first, and tell the EDS team what does not work.

## Before you start

1. Enable **EDS Foundation [EDS Beta]** in the file: **Assets → Libraries**.
   The plugin imports its variables and text styles from there.
2. Keep the legacy libraries enabled until you are done. Revert frame needs
   them to put the legacy variables back.
3. Open the plugin: **Plugins → Equinor → EDS Variable Migration [WIP BETA]**.

## 1. Scan

Choose a scope and press **Scan**:

- **Selection**: the frames you have selected.
- **Page**: every frame on the current page.
- **File**: every page, one at a time. A large file takes a while; you can
  cancel.

## 2. Read the health

The health bar counts every property bound to a variable, every text's typography
and every mode set on a frame:

| Status           | What it means                                                                           |
| ---------------- | --------------------------------------------------------------------------------------- |
| Migrated         | Already uses the EDS Beta tokens. Green, because it is done.                            |
| Ready            | A legacy variable with one clear replacement. Blue: the plugin can apply it.            |
| Needs check ⚠    | The replacement depends on what the layer does, for example interactive or not.         |
| No equivalent    | There is nothing to replace it with yet, such as icon sizes. The legacy variable stays. |
| Inside instances | Inside an instance. The plugin leaves it; its main component has to be migrated.        |

Health is the share that is migrated. The **i** button next to the legend
explains the statuses again. When values sit inside instances, a line under
the legend gives the share migrated outside instances, which is what the
plugin can change in the scope.

## 3. Look at what will change

- **Frames** starts with the frames that have the most work left, then lists
  every frame, lowest health first. **Open** shows every value in a frame,
  grouped by layer or by legacy variable. **Go to** selects the layer in
  Figma.
- **Changes** lists every legacy variable in the scope with what it becomes,
  in tabs by kind of value. Values inside instances are not part of it; they
  change with their main component or library. A click on the legacy variable selects its
  layers; a click on the target changes it for every layer that uses it.
- **Instances** lists the instances that still use legacy variables, grouped
  by component. For a component in this file, **Go to main component** takes
  you to it: migrate its page, and every instance follows.
- **Main components** lists the main components in the scope, which Apply
  changes together with the frames, and the main components on other pages
  that instances in the scope use, with **Go to** and **Scan its page**.

In a frame, the **Layers** view shows each instance as one row, marked
Instance: the plugin changes nothing inside it.

To change a target, press **Change** on one value or the target of a row, or
tick several values and use the bar at the bottom of the window. You can also
choose **Leave as it is**.

The window is too narrow? Drag the grip in its bottom right corner. The
plugin remembers the size.

## 4. Review the ⚠ values

**Review**, in the footer, shows the values that need a check one at a time. The plugin
selects the layer, tells you why it was unsure, and shows its proposal and
the other targets that fit. Confirm the proposal, choose another target,
leave the value, or skip it for later. Whatever you choose then counts as
Ready, or as No equivalent when you leave it.

## 5. Apply

**Apply**, in the footer, makes every Ready change in the scope, or in one
frame when you are in it. It binds the new variables, applies the text styles, and sets the new
modes on the frames that had the legacy ones:

- Spacious becomes **comfortable**, and Comfortable becomes **compact**. The
  names moved: the old Comfortable was the dense mode.
- Light and Dark become **light** and **dark**.

A legacy mode is removed only when no layer below it uses a legacy variable
any more. While an instance or an icon size below still needs it, it stays,
and the plugin says why.

Check the frame afterwards. Small differences in colour and spacing come from
the new token values, not from the plugin.

Applying in a main component changes every instance of it in the file. The
confirmation says how many instances there are.

## Typography components

The legacy Typography component can become a text layer with the matching
text style: **Convert to text** in the Instances tab. In a main component,
each instance of that component keeps the text it showed. A Typography
component with mono numbers loses them, since a text style cannot carry
tabular figures; the result has a button that selects those texts.

## Undo and revert

- **Ctrl or Cmd+Z** right after an apply undoes the whole apply.
- **Revert frame**, in a frame the plugin has changed, puts the legacy
  variables back later, from a log the plugin keeps on every layer it
  changes. A value you have changed since is left as you made it.
- After an undo or an edit, the plugin says the page has changed since the
  scan, and Apply waits until you scan again.

## Share the result

**Export report**, beside the scope line, makes a Markdown report and a CSV for a spreadsheet, with
the health, the frames, what needs a check, what has no equivalent and the
instances. It counts what the window counts, main components in the scope included. The plugin also keeps the latest scan and your choices in the
file, so the next time you open it, you see where you left off.

## Questions

**Why does the plugin not change my instances?** A change inside an instance
becomes an override, which stops the instance from getting updates. For a
component in this file, migrate its main component; for a library component,
update it in its library and publish it. The instances follow.

**Why is a legacy mode still on my frame?** Something below it still uses a
legacy variable through it: an instance, an icon size, or a value you have
not reviewed yet.

**Ready and Migrated sound the same.** Ready means the plugin knows the
replacement and can apply it; Migrated means it has been applied.
