---
title: Design tokens
hide_title: true
description: 'Design tokens are the named values behind every EDS component: colour, spacing, typography, corner radius and elevation. Designers and developers use the same names, in Figma and in code.'
---

## How tokens work

A design token is a named value, such as `spacing.md` or `background.surface`. Components and layouts refer to the name instead of a fixed value, so the value can change without anyone having to find and replace it.

In Figma, the tokens are variables in the EDS libraries. In code, they are CSS custom properties from the `@equinor/eds-tokens` package. The CSS name is the token name in kebab case with an `--eds-` prefix, so `spacing.md` becomes `--eds-spacing-md`.

## Modes

Some tokens have a different value in each mode, while the name stays the same:

| Mode          | Values                        | Set in code with                                                                 | Changes                               |
| ------------- | ----------------------------- | -------------------------------------------------------------------------------- | ------------------------------------- |
| Colour scheme | Light, Dark                   | `data-color-scheme="light"` or `data-color-scheme="dark"`                        | Colour                                |
| Density       | Compact, Comfortable, Relaxed | `data-density="compact"` or `data-density="relaxed"`; Comfortable is the default | Spacing, typography and corner radius |

Set the attribute on a container, and everything inside it follows. In Figma, set the same modes on the frame.

## Token groups

| Group                                                        | What it covers                                                              |
| ------------------------------------------------------------ | --------------------------------------------------------------------------- |
| [Colour](/docs/Next/foundation/colour/intro)                 | Backgrounds, text, borders, icons and data visualisation, in light and dark |
| [Spacing](/docs/Next/foundation/design-tokens/spacing)       | Padding and gaps, inside and between components                             |
| [Typography](/docs/Next/foundation/design-tokens/typography) | Font families, sizes, line heights and weights                              |
| [Shape](/docs/Next/foundation/design-tokens/shape)           | Corner radius                                                               |
| [Elevation](/docs/Next/foundation/design-tokens/elevation)   | Shadows for UI that floats above the page                                   |
