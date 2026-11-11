# Mapping rules

The plugin swaps variables from the deprecated EDS libraries for variables and
text styles in EDS Foundation [EDS Beta]. This file is the source for the
rules. `src/mapping/rules.ts` implements them, and `test/answer-key.test.ts`
checks them against the test frame in the AI-Testing file. Change this file
and the code together, and raise `MAPPING_VERSION` in `src/mapping/version.ts`.

Sections 3 to 6 are copied from the prompt used for the trial with Figma's AI
agent, which follows the 2.0.0-beta tables on
https://eds.equinor.com/docs/Next/foundation/colour/migration and the spacing
and typography pages next to it. One row is corrected: `Bg/Backdrop` has no
equivalent, and the plugin never proposes `background/backdrop`.

In the tables, "report" means the plugin leaves the old binding and lists it
under the outcome **none**. Canvas and Surface on an interactive element were
"report" in the prompt; the plugin proposes the plane as a check item instead,
so a designer can confirm it rather than leave the old binding. The section at the end describes what the plugin
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

| Old                                                                  | New                                                                                                          |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `Bg/Floating`                                                        | `background/floating`                                                                                        |
| `Bg/Input`                                                           | `background/input`                                                                                           |
| `Bg/Disabled`, `Bg/Fill/Emphasis/Disabled`, `Bg/Fill/Muted/Disabled` | `background/interactive/disabled`                                                                            |
| `Bg/Backdrop`                                                        | no equivalent; never bind to `background/backdrop`. It was removed from Tokens Studio and eds-tokens (#5846) |
| `Border/Focus`                                                       | `border/interactive/focus`                                                                                   |
| `Border/Disabled`                                                    | `border/interactive/disabled`                                                                                |
| `Text/Link`                                                          | `text/interactive/link/default` (`/hover`, `/pressed` for those states)                                      |
| `Text/Disabled`                                                      | `text/interactive/disabled`                                                                                  |

### Fills

Static names carry the tone (`Bg/Info/Fill Muted/Default`). Dynamic names do not
(`Bg/Fill/Muted/Default`); take the tone from the Appearance mode.

| Old                                                    | Interactive element                                                                         | Non-interactive element                                                                               |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `Bg/{Tone}/Canvas`, dynamic `Bg/Canvas`                | The same as for a non-interactive element, as a check item. There is no interactive canvas  | Neutral page background: `background/canvas`. Other tones: `background/non-interactive/{tone}/muted`  |
| `Bg/{Tone}/Surface`, dynamic `Bg/Surface`              | The same as for a non-interactive element, as a check item. There is no interactive surface | Neutral card or panel: `background/surface`. Other tones: `background/non-interactive/{tone}/default` |
| `Bg/{Tone}/Fill Emphasis/Default`, `/Hover`, `/Active` | `background/interactive/{tone}/emphasis/default`, `/hover`, `/pressed`                      | `background/non-interactive/{tone}/emphasis` (report Hover and Active)                                |
| `Bg/{Tone}/Fill Muted/Default`, `/Hover`, `/Active`    | `background/interactive/{tone}/muted/default`, `/hover`, `/pressed`                         | `background/non-interactive/{tone}/muted` (report Hover and Active)                                   |

Selected elements are the exception. Use `background/interactive/accent/selected/default` or
`background/interactive/neutral/selected/default` (`/hover`, `/pressed` for those states) whatever
the old fill was. 2.0 often used `Fill Muted/Active` for selection, and a plain rename would turn
that into a pressed state. Only accent and neutral have a selected level; report other tones.

### Borders

| Old                                             | Non-interactive element                  | Interactive element                                                                                                                                                                                                                |
| ----------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Border/{Tone}/Subtle`, dynamic `Border/Subtle` | `border/non-interactive/{tone}/muted`    | `border/interactive/{tone}/muted/default`                                                                                                                                                                                          |
| `Border/{Tone}/Medium`, dynamic `Border/Medium` | `border/non-interactive/{tone}/default`  | Outlined buttons, and other controls whose toned border is their main outline: `border/interactive/{tone}/emphasis/default`. Inputs, fields and checkbox outlines: `border/interactive/{tone}/muted/default`. Report anything else |
| `Border/{Tone}/Strong`, dynamic `Border/Strong` | `border/non-interactive/{tone}/emphasis` | `border/interactive/{tone}/emphasis/default`                                                                                                                                                                                       |

Use `/hover` and `/pressed` on interactive borders in those states. Interactive borders have only
the muted and emphasis levels.

### Text

Text is named for what it sits on.

| Old                                                        | New                                                                                                                                                                                                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Text/Neutral/Strong`, dynamic `Text/Strong` under Neutral | `text/primary`                                                                                                                                                                                                                       |
| `Text/Neutral/Subtle`, dynamic `Text/Subtle` under Neutral | `text/secondary`                                                                                                                                                                                                                     |
| `Text/{Tone}/Strong`, tone other than Neutral              | On a plain background (canvas, surface, or a control with no fill in its default state, such as outlined and ghost buttons): `text/on-default/{tone}`. On a muted or default tinted fill, or a selected fill: `text/on-muted/{tone}` |
| `Text/{Tone}/Subtle`, tone other than Neutral              | Use the `Strong` rule and report it, since the subtle level has no direct equivalent                                                                                                                                                 |
| `Text/{Tone}/Strong on emphasis`                           | `text/on-emphasis/{tone}`                                                                                                                                                                                                            |
| `Text/{Tone}/Subtle on emphasis`                           | `text/on-emphasis/{tone}`, and report it: there is one foreground per tone on an emphasis fill now                                                                                                                                   |

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

| Old                                                                                                                                    | New                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `spacing/horizontal/{step}`, `spacing/vertical/{step}`                                                                                 | `spacing/{step}`                                                                                                                        |
| `spacing/inset/{size}/horizontal`, `spacing/inset/{size}/vertical-squared`                                                             | `spacing/{size}`                                                                                                                        |
| `spacing/inset/{size}/vertical-squished`                                                                                               | one step down from `{size}`                                                                                                             |
| `spacing/inset/{size}/vertical-stretched`                                                                                              | one step up from `{size}`                                                                                                               |
| `spacing-proportions/{size}/horizontal`                                                                                                | `spacing/{size}`                                                                                                                        |
| `spacing-proportions/{size}/vertical`                                                                                                  | `spacing/{size}` under the `🪐 Space proportions` mode Squared (the default), one step down under Squished, one step up under Stretched |
| `Container/Space horizontal`, `Container/Space vertical`, `container-space/*`, `Container/Gap vertical`, `Container/Gap horizontal`    | `spacing/md`. The vertical padding moves one step with Squished or Stretched                                                            |
| `Selectable/Space horizontal`, `selectable-space/horizontal`                                                                           | `spacing/{size}`, where `{size}` is the `🪐 Selectable space` mode (XS to XL), and `xs` when none is set                                |
| `Selectable/Space vertical`, `selectable-space/vertical`                                                                               | the same size, moved by Space proportions as above                                                                                      |
| `Generic/Gap horizontal`                                                                                                               | the step the old modes select, `spacing/xs` when none is set                                                                            |
| `spacing/border-radius/none`, `/rounded`, `/pill`                                                                                      | `corner-radius/none`, `/rounded`, `/pill`                                                                                               |
| `Border/radius`, `Generic/Corner radius`                                                                                               | `corner-radius/none`, `/rounded` or `/pill`, from the `⭕️ Border radius` mode                                                           |
| `Border radius` (in `📦 Box`)                                                                                                          | resolve the value: 0 → `corner-radius/none`, values up to 8 → `corner-radius/rounded`, 999 and above → `corner-radius/pill`             |
| `sizing/icon/*`, `Icon/Size`, `Selectable/Icon size`, `typography/icon-size`, `Icon container width`, `Deprecated/Icon container size` | report. There is no icon size variable                                                                                                  |
| Any icon container padding (`*-container-padding-*`, `Icon/Container padding *`, `Selectable/Icon container padding *`)                | report                                                                                                                                  |
| `Typography/Baseline adjust top`, `Typography/Baseline adjust bottom`, `*/padding-centred`, `*/padding-baselined`                      | report. The Beta has no baseline trim                                                                                                   |
| `Min height` (in `📦 Box`)                                                                                                             | report                                                                                                                                  |

The old `container-gap` put one step between any two children of a container. After the swap,
mention containers where the children differ in how closely they are related, so a designer can
check the gaps. Do not change the gaps yourself.

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
   text inside a control (button, chip, table cell, menu item, field label), which takes `label`;
   report those. For the `🗣️ Semantic` typography variables (`Typography/Font size`,
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

- **sure**: one target. The plugin applies it with "Apply sure".
- **check**: the target depends on the role of the layer. The plugin proposes
  the first candidate, marks it ⚠, and applies it only after a designer
  confirms it in the review.
- **none**: no equivalent. The old binding stays and is listed.

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
  `Bg/*/Fill */Hover` is sure. On a layer named as non-interactive it is
  reported, since non-interactive fills have no states.
- `Fill Emphasis/Active` is sure as pressed. `Fill Muted/Active` is a check
  item, because 2.0 often used it for selection.
- Text named for what it sits on (section 4, Text) reads the nearest fill
  under the text and resolves that fill with these rules first. A hover or
  pressed muted fill under a toned text is taken as a control with no fill in
  its default state, such as a ghost button, so the text gets `on-default`.

### Scopes

When the proposal's variable scopes do not include the property it is bound
to, such as a spacing variable on a corner radius, the plugin marks it as a
check item. Scopes only steer Figma's variable picker, so the binding works,
but a designer should look at it.

### Typography

A text style is sure when the role, step and weight are all read from the
variables and the font. It is a check item when the plugin has to choose: the
nearest step for a role, label for single-line text in a control, body for
text with no line height variable, Semi Bold as medium, or medium on body.
