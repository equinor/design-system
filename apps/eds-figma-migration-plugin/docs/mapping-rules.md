# Mapping rules

The plugin swaps variables from the deprecated EDS libraries for variables and
text styles in EDS Foundation [EDS Beta]. This file is the source for the
rules. `src/mapping/rules.ts` implements them, and `test/answer-key.test.ts`
checks them against the test frame in the AI-Testing file. Change this file
and the code together, and raise `MAPPING_VERSION` in `src/mapping/version.ts`.

Sections 3 to 6 are copied from the prompt used for the trial with Figma's AI
agent, which follows the 2.0.0-beta tables on
https://eds.equinor.com/docs/Next/foundation/colour/migration and the spacing
and typography pages next to it. One row is corrected: `Bg/Backdrop` becomes `overlay/scrim`, and the plugin
never proposes `background/backdrop`.

In the tables, "report" means the plugin leaves the old binding and lists it
under the outcome **none**. Canvas and Surface on an interactive element were
"report" in the prompt. The plugin proposes the ghost-control fill for a
neutral canvas and the plane for the rest instead, as check items, so a
designer can confirm them rather than leave the old binding (decided
2026-11-12). The section at the end describes what the plugin
adds to the rules to apply them without asking for every binding.

## 3. Modes

| Old mode on a frame                                                                                                                                                                                             | New mode on the same frame                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `🌗 Color scheme`: Light / Dark                                                                                                                                                                                 | `color-scheme`: light / dark                                                                                        |
| `💎 Density`: Spacious                                                                                                                                                                                          | `density`: comfortable                                                                                              |
| `💎 Density`: Comfortable                                                                                                                                                                                       | `density`: compact. The names shifted: the old Comfortable was the dense mode, and its values match the new compact |
| `🎨 Appearance`: any tone                                                                                                                                                                                       | none. The tone goes into each variable name (section 4)                                                             |
| `🅰️ Font and icon size`, `🅰️ Font family`, `🅰️ Line height`, `🅰️ Font weight`, `🅰️ Tracking`, `🪐 Space proportions`, `🪐 Selectable space`, `🪐 Container space`, `⭕️ Border radius`, `📦 Box`, `🖼️ Icon size` | none. These modes select a step; read them and use them in sections 5 and 6                                         |

Clear the old explicit modes only after every binding underneath has been swapped, because you
need them to resolve the old values.

## 4. Colour

`{tone}` is accent, neutral, info, success, warning or danger, in lowercase in the new names.

### Planes and single-purpose tokens

| Old                                                                  | New                                                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Bg/Floating`                                                        | `background/floating`                                                                                                                                                                                                                                                                                                      |
| `Bg/Input`                                                           | `background/input`                                                                                                                                                                                                                                                                                                         |
| `Bg/Disabled`, `Bg/Fill/Emphasis/Disabled`, `Bg/Fill/Muted/Disabled` | `background/interactive/disabled`                                                                                                                                                                                                                                                                                          |
| `Bg/Backdrop`                                                        | `overlay/scrim`, as a check item, since the dimmed layer behind a dialog is the scrim's role. Never bind to `background/backdrop`; it was removed from Tokens Studio and eds-tokens (#5846). The docs have not settled the scrim yet (usage.mdx), and its opacity differs between Figma (40%) and the docs reference (10%) |
| `Border/Focus`                                                       | `border/interactive/focus`                                                                                                                                                                                                                                                                                                 |
| `Border/Disabled`                                                    | `border/interactive/disabled`                                                                                                                                                                                                                                                                                              |
| `Text/Link`                                                          | `text/interactive/link/default` (`/hover`, `/pressed` for those states)                                                                                                                                                                                                                                                    |
| `Text/Disabled`                                                      | `text/interactive/disabled`                                                                                                                                                                                                                                                                                                |

### Fills

Static names carry the tone (`Bg/Info/Fill Muted/Default`). Dynamic names do not
(`Bg/Fill/Muted/Default`); take the tone from the Appearance mode.

| Old                                                    | Interactive element                                                                                                                                                                                                                  | Non-interactive element                                                                               |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `Bg/{Tone}/Canvas`, dynamic `Bg/Canvas`                | Neutral: `background/interactive/neutral/muted/default` (`/hover`, `/pressed`), the ghost-control fill, which is the canvas colour at rest, as a check item. Other tones: the same as for a non-interactive element, as a check item | Neutral page background: `background/canvas`. Other tones: `background/non-interactive/{tone}/muted`  |
| `Bg/{Tone}/Surface`, dynamic `Bg/Surface`              | The same as for a non-interactive element, as a check item. There is no interactive surface                                                                                                                                          | Neutral card or panel: `background/surface`. Other tones: `background/non-interactive/{tone}/default` |
| `Bg/{Tone}/Fill Emphasis/Default`, `/Hover`, `/Active` | `background/interactive/{tone}/emphasis/default`, `/hover`, `/pressed`                                                                                                                                                               | `background/non-interactive/{tone}/emphasis` (Hover and Active: see section 7)                        |
| `Bg/{Tone}/Fill Muted/Default`, `/Hover`, `/Active`    | `background/interactive/{tone}/muted/default`, `/hover`, `/pressed`                                                                                                                                                                  | `background/non-interactive/{tone}/muted` (Hover and Active: see section 7)                           |

Selected elements are the exception. Use `background/interactive/accent/selected/default` or
`background/interactive/neutral/selected/default` (`/hover`, `/pressed` for those states) whatever
the old fill was. 2.0 often used `Fill Muted/Active` for selection, and a plain rename would turn
that into a pressed state. Only accent and neutral have a selected level, since selection is a UI
state rather than a semantic condition (usage.mdx). A selected element in info, success, warning or
danger keeps its tone at the level of its old fill, in the default state (hover stays hover), as a
check item: `Bg/Warning/Fill Muted/Active` → `background/interactive/warning/muted/default`. Its
selection has to show another way, as the Beta Chip does with a check icon (decided 2026-11-12).

### Borders

| Old                                             | Non-interactive element                  | Interactive element                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Border/{Tone}/Subtle`, dynamic `Border/Subtle` | `border/non-interactive/{tone}/muted`    | `border/interactive/{tone}/muted/default`                                                                                                                                                                                                                                                                                                                                      |
| `Border/{Tone}/Medium`, dynamic `Border/Medium` | `border/non-interactive/{tone}/default`  | Outlined buttons, and other controls whose toned border is their main outline: `border/interactive/{tone}/emphasis/default`. Inputs, fields and checkbox outlines: `border/interactive/{tone}/muted/default`. Anything else (a clickable card, row or tile): `border/interactive/{tone}/muted/default` as a check item, with emphasis as the other option (decided 2026-11-12) |
| `Border/{Tone}/Strong`, dynamic `Border/Strong` | `border/non-interactive/{tone}/emphasis` | `border/interactive/{tone}/emphasis/default`                                                                                                                                                                                                                                                                                                                                   |

Use `/hover` and `/pressed` on interactive borders in those states. Interactive borders have only
the muted and emphasis levels.

### Text

Text is named for what it sits on.

| Old                                                        | New                                                                                                                                                                                                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Text/Neutral/Strong`, dynamic `Text/Strong` under Neutral | `text/primary`                                                                                                                                                                                                                       |
| `Text/Neutral/Subtle`, dynamic `Text/Subtle` under Neutral | `text/secondary`                                                                                                                                                                                                                     |
| `Text/{Tone}/Strong`, tone other than Neutral              | On a plain background (canvas, surface, or a control with no fill in its default state, such as outlined and ghost buttons): `text/on-default/{tone}`. On a muted or default tinted fill, or a selected fill: `text/on-muted/{tone}` |
| `Text/{Tone}/Subtle`, tone other than Neutral              | Use the `Strong` rule, since the subtle level has no direct equivalent. It is a check item only when the `Strong` rule is                                                                                                            |
| `Text/{Tone}/Strong on emphasis`                           | `text/on-emphasis/{tone}`                                                                                                                                                                                                            |
| `Text/{Tone}/Subtle on emphasis`                           | `text/on-emphasis/{tone}`, sure: there is one foreground per tone on an emphasis fill now (decided 2026-11-12)                                                                                                                       |

### Icons

When an old `Text/*` variable colours a vector, an icon instance or a shape that draws an icon,
use the `icon/*` twin of the text result: `text/primary` → `icon/primary`, `text/secondary` →
`icon/secondary`, `text/on-default/{tone}` → `icon/on-default/{tone}`, `text/on-muted/{tone}` →
`icon/on-muted/{tone}`, `text/on-emphasis/{tone}` → `icon/on-emphasis/{tone}`,
`text/interactive/disabled` → `icon/interactive/disabled`, `text/interactive/link/*` →
`icon/interactive/link/*`.

## 5. Spacing and corner radius

The old Spacious values equal the new comfortable values, so step names carry over.
The new steps are `none`, `4xs`, `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` and `4xl` to `9xl`.
"One step down" from `md` is `sm`, and "one step up" is `lg`.

| Old                                                                                                                                    | New                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `spacing/horizontal/{step}`, `spacing/vertical/{step}`                                                                                 | `spacing/{step}`                                                                                                                                                                                                                                                                                                                                                                                             |
| `spacing/inset/{size}/horizontal`, `spacing/inset/{size}/vertical-squared`                                                             | `spacing/{size}`                                                                                                                                                                                                                                                                                                                                                                                             |
| `spacing/inset/{size}/vertical-squished`                                                                                               | one step down from `{size}`                                                                                                                                                                                                                                                                                                                                                                                  |
| `spacing/inset/{size}/vertical-stretched`                                                                                              | one step up from `{size}`                                                                                                                                                                                                                                                                                                                                                                                    |
| `spacing-proportions/{size}/horizontal`                                                                                                | `spacing/{size}`                                                                                                                                                                                                                                                                                                                                                                                             |
| `spacing-proportions/{size}/vertical`                                                                                                  | `spacing/{size}` under the `🪐 Space proportions` mode Squared (the default), one step down under Squished, one step up under Stretched                                                                                                                                                                                                                                                                      |
| `Container/Space horizontal`, `Container/Space vertical`, `container-space/*`, `Container/Gap vertical`, `Container/Gap horizontal`    | `spacing/md`. The vertical padding moves one step with Squished or Stretched                                                                                                                                                                                                                                                                                                                                 |
| `Selectable/Space horizontal`, `selectable-space/horizontal`                                                                           | `spacing/{size}`, where `{size}` is the `🪐 Selectable space` mode (XS to XL), and `xs` when none is set                                                                                                                                                                                                                                                                                                     |
| `Selectable/Space vertical`, `selectable-space/vertical`                                                                               | the same size, moved by Space proportions as above                                                                                                                                                                                                                                                                                                                                                           |
| `Generic/Space horizontal`, `Generic/Space vertical`, `Generic/Gap horizontal`, `Generic/Gap vertical`                                 | the step of the `🪐 Horizontal space`, `🪐 Vertical space`, `🪐 Horizontal gap` or `🪐 Vertical gap` mode, through its `💎 Density` alias (sure). Under the mode None the variable is 0px with no alias: sure, 0 without a variable, since the layer shows no space (the docs' `xs` is for code that set no step) A step read only from the modes is a check item, and `spacing/xs` when nothing can be read |
| `spacing/border-radius/none`, `/rounded`, `/pill`                                                                                      | `corner-radius/none`, `/rounded`, `/pill`                                                                                                                                                                                                                                                                                                                                                                    |
| `Border/radius`, `Generic/Corner radius`                                                                                               | `corner-radius/none`, `/rounded` or `/pill`, from the `⭕️ Border radius` mode                                                                                                                                                                                                                                                                                                                                |
| `Border radius` (in `📦 Box`)                                                                                                          | resolve the value: 0 → `corner-radius/none`, values up to 8 → `corner-radius/rounded`, 999 and above → `corner-radius/pill`                                                                                                                                                                                                                                                                                  |
| `sizing/icon/*`, `Icon/Size`, `Selectable/Icon size`, `typography/icon-size`, `Icon container width`, `Deprecated/Icon container size` | sure when a step has the same px in the density the layer will have (`sizing/icon/lg`, 24px → `spacing/xl`), since EDS sizes icons with spacing tokens (spacing usage: an Icon without `size` is `spacing.xl`; the Beta Icon uses the spacing token of the same name). Without an exact match, check, with the two nearest steps. Report it when the size cannot be read                                     |
| `spacing/icon/{size}/gap-*`, `Selectable/Icon + text gap`                                                                              | `spacing/xs` at every icon size (spacing.mdx: no current token grows with the icon)                                                                                                                                                                                                                                                                                                                          |
| Any icon container padding (`*-container-padding-*`, `Icon/Container padding *`, `Selectable/Icon container padding *`)                | check: removed, 0 without a variable. The Beta has no icon container; an icon is sized with a spacing token and has no padding around it, as in Button                                                                                                                                                                                                                                                       |
| `Typography/Baseline adjust top`, `Typography/Baseline adjust bottom`, `*/padding-centred`, `*/padding-baselined`                      | check: removed, 0 without a variable. The Beta does not trim text (ADR-0029); height comes from padding and line height                                                                                                                                                                                                                                                                                      |
| `Min height` (in `📦 Box`)                                                                                                             | check: the minimum height is removed. No Beta component sets one                                                                                                                                                                                                                                                                                                                                             |
| `sizing/selectable/*`, `Selectable/Size`, `Size/Selectables/Size`                                                                      | as icon sizes: the spacing step with the same px, sure on an exact match. Checkbox and Radio size their box with `spacing-lg`                                                                                                                                                                                                                                                                                |
| A variable on an opacity                                                                                                               | check: the opacity in percent without a variable. The Beta has no opacity variable; disabled controls use the disabled colour tokens                                                                                                                                                                                                                                                                         |
| Any variable on a stroke weight (`sizing/stroke/*`, `Stroke/thickness`, `Generic/Stroke width`, border widths)                         | sure. Set the px it resolves to as a number and remove the variable, since EDS has no stroke width variable yet (spacing.mdx: the widths are literals). Report it when the width cannot be read                                                                                                                                                                                                              |

A proposal of `spacing/none` is never bound: a 0 needs no token (in CSS it is `gap: 0`, or no gap at all), so the plugin sets 0 and removes the legacy variable, as it does for border widths.

The old `container-gap` put one step between any two children of a container. It becomes
`spacing/md` without a check, and the row says that `spacing/lg` separates groups and `spacing/xl`
sections inside a container (spacing.mdx), since the plugin cannot tell which a container holds
(decided 2026-11-12).

## 6. Typography

Apply EDS Foundation [EDS Beta] text styles instead of binding variables one by one. A style sets
family, size, line height and weight together, and its values follow the density mode. Applying
it replaces the old `fontFamily`, `fontSize`, `lineHeight`, `fontWeight` and `letterSpacing`
bindings. The fill colour is handled in section 4 and stays separate.

The styles are `header/{step}`, `label/{step}/{default|medium|bold}`, `body/{step}/{default|bold}`
and `mono/{md|lg}/{default|bold}`. "default" is weight 400.

Choose the style in three steps:

1. **Role.** Equinor, or bindings under `typography/header/*` → `header`. Inter (`ui-body`) with
   `line-height-squished` → `label`. Inter with `line-height-default` → `body`, except single-line
   text inside a control (button, chip, table cell, menu item, field label), which takes `label`
   without a check (ADR-0027: label is for single-line functional text; decided 2026-11-12). For the `🗣️ Semantic` typography variables (`Typography/Font size`,
   `Typography/Line height`, `Typography/Font family`, `Typography/Font weight`), read the modes
   in force on the node: `🅰️ Font and icon size` (XS to 6XL) gives the step, `🅰️ Font family`
   (UI Body, Header) the family, and `🅰️ Line height` (Default, Squished) the line height.
2. **Step.** Keep the old step name. `header` has xs to 4xl, `label` xs to 5xl, `body` sm to 3xl.
   When a step does not exist for the role, use the nearest one and report it.
3. **Weight.** `font-weight-normal`, or Regular with no weight binding → `default`.
   `font-weight-bolder`, or Medium → `medium`. Bold → `bold`. `font-weight-lighter` → `default`,
   since the lighter weight is gone. `header` styles have one weight and no suffix. `body` has no
   medium; use `body/{step}/default` and report it.

Read the weight from the font style as well as from bindings, because a text node can be set in
Medium without any weight variable.

## 7. How the plugin applies the rules

Every old variable resolves to one of three outcomes:

- **sure**: one target. The window calls it **Ready**, and the plugin
  applies it without asking.
- **check**: the target depends on the role of the layer. The plugin proposes
  the first candidate, marks it ⚠ **Needs check**, and applies it only after
  a designer confirms it in the review.
- **none**: no equivalent, shown as **No equivalent**. The old binding stays
  and is listed.

### Mode-driven variables are read through their aliases

The variables in `🗣️ Semantic`, the `🪐` collections, `⭕️ Border radius`,
`📦 Box` and the `🅰️` collections alias variables in `💎 Density`, and the
modes on the frame decide which one. The plugin follows the alias chain under
the modes in force on the layer, stops at the first `💎 Density` variable, and
applies the rules in section 5 or 6 to that name. For example,
`Selectable/Space vertical` under the Selectable space mode XS and the Space
proportions mode Squared points to `spacing/inset/xs/vertical-squared`, which
becomes `spacing/xs`. This gives the same result as reading the mode names, as
section 5 describes.

When the chain cannot be read, because the deprecated library is not enabled,
the plugin reads the mode names instead and marks the result as a check item.

The `🎨 Appearance` colours alias the colour scheme palette directly, so their
tone is read from the Appearance mode in force, as section 4 says.

### Role guesses

The role of a layer comes from its own name and the names of its ancestors,
matched against the keywords in `src/mapping/role-hints.json`. Designers can
add keywords there. How far up the plugin looks depends on the layer:

- A frame owns its fill and stroke, so only its own name counts. A table
  inside a frame called "Bottom row" is not taken for a row.
- A shape (rectangle, vector and the like) is usually the background or
  outline of its parent, so its parent's name counts too.
- A text sits inside a container inside the element, so the plugin reads the
  text, its parent and its grandparent.

The search stops at the nearest name with a role keyword. A layer is
interactive when that name has an interactive keyword, when a name says hover
or pressed, when a name says selected, or when it has prototype interactions.
A name that has both an interactive and a non-interactive keyword, such as
"Chip / Status", is treated as non-interactive and marked as a check item.

A chip is interactive, as the Beta Chip is; Badge is its non-interactive
counterpart. A toned chip therefore gets the interactive muted fill and
border, and `text/on-muted/{tone}`, as the Beta Chip uses.

A role-dependent binding is **sure** when nothing points to an interactive or
selected element: plain layout is treated as non-interactive. It is **check**
when something does, so that a designer confirms every guess that changes the
target.

### Additions to the colour rules

- A stroke on one side only is a divider, which is not interactive. This keeps
  the bottom border of a table row non-interactive, even though "Row" is an
  interactive keyword.
- `Hover` in an old fill name is enough to call the element interactive, so
  `Bg/*/Fill */Hover` is sure. On a layer named as non-interactive, the fill
  and the name contradict each other: the plugin proposes the interactive
  state as a check item, with the static fill as the other option (decided
  2026-11-12).
- `Fill Emphasis/Active` is sure as pressed. `Fill Muted/Active` is a check
  item, because 2.0 often used it for selection.
- Text named for what it sits on (section 4, Text) reads the nearest fill
  under the text and resolves that fill with these rules first. The result is
  sure when an ancestor's fill decided it, and a check item when no fill was
  found, since a background drawn as a sibling shape is not seen (decided
  2026-11-12). A hover or
  pressed muted fill under a toned text is taken as a control with no fill in
  its default state, such as a ghost button, so the text gets `on-default`.

### Scopes

When the proposal's variable scopes do not include the property it is bound
to, such as a spacing variable on a corner radius, the plugin marks it as a
check item. Scopes only steer Figma's variable picker, so the binding works,
but a designer should look at it.

One case stays sure: a border colour on the fill of a line drawn as a shape,
such as a connector in a stepper. A shape at most 2px thick and at least four
times as long draws a line, and the `border/*` token is the right one although
it is scoped for strokes.

### Typography

A text style is sure when the role, step and weight are all read from the
variables and the font, and when single-line text in a control takes label
(ADR-0027). It is a check item when the plugin has to choose: the nearest step
for a role, body for text with no line height variable, Semi Bold as medium,
or medium on body.

### Instances

A legacy variable an instance takes from its main component is reported as
**Inside instances** and is not changed, because the main component is where
it changes. A legacy variable the instance overrides itself goes through the
rules above like a value on any other layer (decided 2026-11-13). The scan
reads the overrides from the outermost instance and compares each binding
with the layer at the same place in the main component; the README describes
how.

Figma does not let a plugin bind a variable to the width, height or minimum
and maximum size of a layer inside an instance, and it ignores `resize()` on
such a layer as well; only removing the binding works. Removing the
instance's overrides with `removeOverrides()` would reset the size, but it
also undoes a swapped icon and the icon's colour (tested on FRIOD
2026-11-13). A legacy size the instance overrides on a layer inside it is
therefore a **Manual fix** (category `byHand`, rule
`instance/size-override`, decided 2026-11-13): the plugin flags it, Apply
leaves it, and the row gives the fix in Figma. The fix is a reset of the
layer, which brings back the size of the layer at the same place in the main
component; a swapped icon turns back into the main component's icon, and is
swapped again afterwards, which keeps the size. When that layer in the main
component uses a legacy variable too, the main component is migrated first.
The target is the EDS Beta variable the main component's layer binds, when it
has one, otherwise the variable the rules propose. Since the reset removes
every change on the layer and the layers below it, the row lists the
variables the instance sets there, each with its EDS Beta value to set again.
A size on the instance itself is not affected: a plugin can bind that.

When the layer is an instance and the reset would give an EDS Beta variable
or a number, the plugin can make the fix itself (target `reset:<variable>`).
It is never applied as the rule's outcome: a designer accepts it in Review,
since a reset is more than a swap of variables, and the run then reads every
override on the layer and the layers below it, resets the layer, swaps it
back, sets the overrides again and reads them back. A layer with an override
the plugin cannot copy is refused before anything changes. When the swap was made through an instance-swap property of the instance above, as Text Field does with the Icon property of `.Icon Wrapper`, a reset of the layer keeps the property's icon without the slot's size, so the plugin sets the property to its default and back, which brings the size; the row's steps say the same for a designer. Tested on FRIOD
on 2026-11-13 with a swapped icon, its colour style, stroke weights, a
hidden layer and the plugin's own change log.
