# EDS Variable Migration: a guide for designers

EDS Variable Migration moves the layers in your Figma file from the legacy EDS
variables (the deprecated EDS Colours, Spacing and Typography libraries) to
**EDS Foundation [EDS Beta]**. It runs in your file, uses no AI credits, and
never changes anything inside an instance.

The plugin is a test version, marked **[WIP BETA]**. Try it on a copy of a
frame or in a branch first, and tell the EDS team what does not work.

## Before you start

1. Enable **EDS Foundation [EDS Beta]** in the file: **Assets → Libraries**.
   The plugin imports its variables and text styles from there.
2. Keep the legacy libraries enabled until you are done. Revert frame needs
   them to put bindings back.
3. Open the plugin: **Plugins → Equinor → EDS Variable Migration [WIP BETA]**.

## 1. Scan

Choose a scope and press **Scan**:

- **Selection**: the frames you have selected.
- **Page**: every frame on the current page.
- **File**: every page, one at a time. A large file takes a while; you can
  cancel.

## 2. Read the health

The health bar counts every binding to a variable, every text's typography
and every mode set on a frame:

| Status        | What it means                                                                             |
| ------------- | ----------------------------------------------------------------------------------------- |
| Migrated      | Already uses EDS Foundation. Green, because it is done.                                   |
| Ready         | A legacy variable with one clear replacement. Blue: the plugin can apply it.              |
| Needs check ⚠ | The replacement depends on what the layer does, for example interactive or not.           |
| No equivalent | There is nothing to replace it with yet, such as icon sizes. The binding stays.           |
| In instance   | Inside an instance. The plugin leaves it; the component has to be updated in its library. |

Health is the share that is migrated. The **i** button next to the legend
explains the statuses again.

## 3. Look at what will change

- **Frames** lists the frames, lowest health first. **Open** shows every
  binding in a frame, grouped by layer or by legacy variable. **Go to**
  selects the layer in Figma.
- **Mapping** lists every legacy variable in the scope with what it becomes.
  **Change all** changes the target for every layer that uses it.
- **Instances** lists the instances that still use legacy variables, grouped
  by component.

To change a target, press **Change** on one binding, **Change all** on a row,
or tick several bindings and use the bar at the bottom of the window. You can
also choose **Leave as it is**.

## 4. Review the ⚠ bindings

**Review** shows the bindings that need a check one at a time. The plugin
selects the layer, tells you why it was unsure, and shows its proposal and
the other targets that fit. Confirm the proposal, choose another target,
leave the binding, or skip it for later. Whatever you choose then counts as
Ready, or as No equivalent when you leave it.

## 5. Apply

**Apply** makes every Ready change in the scope, or in one frame when you are
in it. It binds the new variables, applies the text styles, and sets the new
modes on the frames that had the legacy ones:

- Spacious becomes **comfortable**, and Comfortable becomes **compact**. The
  names moved: the old Comfortable was the dense mode.
- Light and Dark become **light** and **dark**.

A legacy mode is removed only when no layer below it uses a legacy variable
any more. While an instance or an icon size below still needs it, it stays,
and the plugin says why.

Check the frame afterwards. Small differences in colour and spacing come from
the new token values, not from the plugin.

## Undo and revert

- **Ctrl or Cmd+Z** right after an apply undoes the whole apply.
- **Revert frame**, in a frame the plugin has changed, puts the legacy
  variables back later, from a log the plugin keeps on every layer it
  changes. A binding you have changed since is left as you made it.

## Share the result

**Export report** makes a Markdown report and a CSV for a spreadsheet, with
the health, the frames, what needs a check, what has no equivalent and the
instances. The plugin also keeps the latest scan and your choices in the
file, so the next time you open it, you see where you left off.

## Questions

**Why does the plugin not change my instances?** A change inside an instance
becomes an override, which stops the instance from getting updates. Update
the component in its library and publish it; the instances follow.

**Why is a legacy mode still on my frame?** Something below it still uses a
legacy variable through it: an instance, an icon size, or a binding you have
not reviewed yet.

**Ready and Migrated sound the same.** Ready means the plugin knows the
replacement and can apply it; Migrated means it has been applied.
