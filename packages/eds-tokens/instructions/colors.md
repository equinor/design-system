---
applyTo: '**'
---

# Colour system introduction

This guide introduces the EDS 3.x colour tokens: how a token name is built, how to choose a token, which foreground goes on which background, and how contrast is measured. [colors-static.md](./colors-static.md) shows the same names in CSS and TypeScript. The full documentation is on the EDS site under [Colour](https://eds.equinor.com/docs/Next/foundation/colour/getting_started/).

:::note

The 3.x tokens ship on the beta line, `@equinor/eds-tokens@beta`, under the `@equinor/eds-tokens/next/*` paths. The `next` prefix is removed before the stable release; the token names stay the same. The default `@equinor/eds-tokens/css/variables` export still serves the frozen 2.x names (`--eds-color-*`), which this guide does not describe.

:::

## Reading a token name

A name answers up to five questions, from left to right:

| Segment   | Question                   | Example                                                                     |
| --------- | -------------------------- | --------------------------------------------------------------------------- |
| Surface   | What am I colouring?       | `background`, `border`, `text`, `icon`                                      |
| Behaviour | Can the user act on it?    | `interactive`, `non-interactive`                                            |
| Tone      | What does it mean?         | `accent`, `neutral`, `info`, `success`, `warning`, `danger`                 |
| Level     | How visually strong is it? | `muted`, `emphasis`, and `default` or `selected` depending on the behaviour |
| State     | What is happening now?     | `default`, `hover`, `pressed`                                               |

`background.interactive.accent.emphasis.hover` has all five. Non-interactive names have no state (`background.non-interactive.warning.muted`), and some names give a role directly (`background.surface`, `text.primary`).

`default` means two things. On the interactive branch it is a **state** and comes last (`background.interactive.accent.emphasis.default`). On the non-interactive branch it is a **level** (`background.non-interactive.accent.default`).

## Choosing a token

1. **Check for a dedicated role first.** These tokens name their job and are not chosen from the tone and level matrix:

   | Token                                                | Job                                                    |
   | ---------------------------------------------------- | ------------------------------------------------------ |
   | `background.canvas`                                  | The page behind everything                             |
   | `background.surface`                                 | The plane content sits on: cards, panels, table bodies |
   | `background.floating`, `background.dialog`           | Menus and dialogs                                      |
   | `background.input`                                   | Form field fills                                       |
   | `background.inverted`                                | Surfaces that stand apart, such as snackbars           |
   | `background.interactive.disabled`, `.read-only`      | Disabled and read-only controls                        |
   | `border.interactive.focus`                           | Focus rings                                            |
   | `text.interactive.link.*`, `icon.interactive.link.*` | Links, with `default`, `hover` and `pressed`           |
   | `text.primary`, `.secondary`, `.tertiary`            | Text hierarchy on the surface and the canvas           |
   | `icon.primary`, `.secondary`, `.tertiary`            | The icon equivalents                                   |
   | `text.inverted`, `icon.inverted`                     | Foregrounds on `background.inverted`                   |

2. **Choose the behaviour.** Use `interactive` only when the user can act on the element. A static panel stays `non-interactive` even when it contains a button; the button uses its own interactive tokens.
3. **Choose the tone.** `accent` for primary actions and selection, `neutral` for structure and secondary actions, and `info`, `success`, `warning` or `danger` when the content communicates that meaning.
4. **Choose the level.**
   - Interactive backgrounds: `muted`, `emphasis`, and `selected` for persistent selection (`accent` and `neutral` only).
   - Interactive borders: `muted` and `emphasis`.
   - Non-interactive backgrounds and borders: `muted`, `default` and `emphasis`.
5. **Use every state the level brings.** An interactive level has a `default`, `hover` and `pressed` token. Do not derive a state with `opacity` or `filter: brightness()`: the result breaks on tinted surfaces, inverts wrongly in dark and has no token name.

## Foreground pairing

A foreground is the text or icon on a background. Choose it from the background it sits on:

| Background                                           | Text                                      | Icon                                      |
| ---------------------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| a `muted` fill of a tone                             | `text.on-muted.<tone>`                    | `icon.on-muted.<tone>`                    |
| a `default` non-interactive fill of a tone           | `text.on-default.<tone>`                  | `icon.on-default.<tone>`                  |
| an `emphasis` fill of a tone                         | `text.on-emphasis.<tone>`                 | `icon.on-emphasis.<tone>`                 |
| `background.surface`, `background.canvas`            | `text.primary`, `.secondary`, `.tertiary` | `icon.primary`, `.secondary`, `.tertiary` |
| `background.interactive.{accent,neutral}.selected.*` | `text.primary`                            | `icon.primary`                            |
| `background.inverted`                                | `text.inverted`                           | `icon.inverted`                           |

The tone has to match as well as the level: `background.non-interactive.danger.muted` takes `text.on-muted.danger`, not `text.on-muted.accent`. Do not use `text.inverted` on a solid fill; use `text.on-emphasis.<tone>`. When a component specifies another foreground, follow the component.

The selected fills have no foreground of their own. Check `text.primary` on them in every state and both schemes before you use it: on `accent`, the hover and pressed states fall below the contrast target, the minimum or both, depending on the scheme.

## Contrast

EDS measures a colour pair on two levels:

- **The minimum** is WCAG 2.1 AA, which every pair must meet: 4.5:1 for text, and 3:1 for large text and for non-text content such as icons.
- **The targets** are what EDS measures against and aims for, in APCA: Lc 90 for body text and Lc 60 for secondary text and interactive elements, against `background.surface`.

EDS measures each text and icon token against one background:

- `text.primary`, `.secondary` and `.tertiary` and the icon equivalents against `background.surface`. They are used on `background.canvas` as well, but the targets are set against the surface, so EDS measures them there and not on the canvas.
- Each `on-<level>.<tone>` role against the fill of the same level and tone.
- `text.primary` and `icon.primary` against the selected fills.
- `text.inverted` and `icon.inverted` against `background.inverted`.
- The link tokens against `background.surface`.

Measured that way, every text and icon token meets the minimum in both schemes and every state, with two exceptions:

- `text.tertiary` and `icon.tertiary` fall below it in light. Use tertiary only where WCAG does not require contrast, such as disabled controls, never for text people need to read.
- `text.primary` on the accent selected fills falls below it on `background.interactive.accent.selected.pressed` in light, and on `.hover` and `.pressed` in dark. `icon.primary` falls below 3:1 on `.pressed` in dark. The neutral selected fills meet the minimum in every state.

WCAG 1.4.11 asks for 3:1 only on what identifies a control or its state. `background.interactive.neutral.muted.default` resolves to the same colour as `background.canvas` in both schemes, because it is the resting state of a ghost control, which its label identifies. It does not need 3:1, so do not swap `muted` for `emphasis` to raise it.

On any other pairing, check the two colours yourself, in both schemes and every state, and report both the ratio and the Lc. A token name alone does not guarantee contrast. See [Accessibility § Colour](https://eds.equinor.com/docs/Next/foundation/accessibility/#colour) and [Usage § Foreground pairing](https://eds.equinor.com/docs/Next/foundation/colour/usage/#foreground-pairing).

## Colour schemes

The tokens follow the `data-color-scheme` attribute:

```html
<!-- Light, the default -->
<html data-color-scheme="light"></html>

<!-- Dark -->
<html data-color-scheme="dark"></html>
```

Set it once, at the top of the page or application, so the whole interface switches together. In CSS you write one name and the attribute decides the value; in TypeScript, light and dark are separate objects (see [colors-static.md](./colors-static.md)).

## Installation

```bash
pnpm add @equinor/eds-tokens@beta
```

## Output formats

| Format            | Import path                                           | Use case                                                    |
| ----------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| **CSS variables** | `@equinor/eds-tokens/next/css/variables.css`          | Standard web styling                                        |
| **TypeScript**    | `@equinor/eds-tokens/next/ts/semantic/{light,dark}`   | Places a CSS custom property cannot reach, such as a canvas |
| **DTCG JSON**     | `@equinor/eds-tokens/next/dtcg/semantic/default.json` | Tooling and custom transforms                               |

## Next steps

- **Names in CSS and TypeScript:** see [colors-static.md](./colors-static.md)
- **The 2.x dynamic approach:** [colors-dynamic.md](./colors-dynamic.md) is deprecated and only describes the 2.x names
