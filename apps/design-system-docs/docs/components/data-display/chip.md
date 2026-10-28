---
title: Chip
sidebar_position: 1
hide_title: true
description: 'Chips are compact, interactive elements that represent a small piece of information users can select, filter, remove, or expand. They work well for filters, tags, selections, or quickly triggering a menu. With variants for visual weight, tones for intent, and built-in support for selectable, deletable, and dropdown behaviours, chips help surface bite-sized actions without stealing focus from the surrounding UI.'
---

<StoryCanvas of="Chip/Default" showLink />

## When to Use

Use a chip when you need a compact, interactive element for selection, filtering, tagging, or triggering a small menu. Chips work especially well in groups - filter bars, saved searches, recipient pickers, or active filter summaries.

**Avoid chips for:**

- Primary calls to action - use **Button** instead
- Navigating between pages - use **Link** instead

## Structure

A chip is always a button, with one of four behaviours:

- **Selectable** (default): toggles a selected state, showing a leading check icon when active
- **Deletable**: shows a trailing close icon; clicking anywhere on the chip, or pressing Backspace or Delete while it has focus, removes it
- **Dropdown**: shows a trailing arrow that flips up when the chip is selected, signalling an open menu
- **Custom icons**: a leading icon, a trailing icon or both, chosen for the content of the chip

<StoryCanvas of="Chip/Types" showLink />

## Guidelines

### Variants

Variants control the visual weight of the chip. Pick the one that matches how much attention the chip should draw in its surroundings.

| Variant       | Emphasis | Use Case                                                 |
| ------------- | -------- | -------------------------------------------------------- |
| Default       | Medium   | Standard chips on neutral surfaces                       |
| Outlined      | Low      | Quiet chips that shouldn't compete with surrounding UI   |
| High contrast | High     | Prominent chips that need to stand out, e.g. key filters |

<StoryCanvas of="Chip/Variants" showLink />

### Tones

Tones communicate the meaning or category behind a chip:

- **Neutral**: The default tone for general-purpose chips
- **Accent**: Brand colour for highlighted selections or saved items
- **Success**: Positive or confirmed states
- **Info**: Informational chips
- **Warning**: Caution or attention-needed states
- **Danger**: Destructive or error states

<StoryCanvas of="Chip/Tones" showLink />

### Selectable chips

A selectable chip toggles between selected and not selected, and shows a leading check icon while it is selected. Selection is ideal for filter chips, tag pickers, or any group where one or more options can be active at the same time.

<StoryCanvas of="Chip/Selectable" showLink />

### Deletable chips

A deletable chip is a removable tag. The entire chip is the delete target, so clicking anywhere on it, or pressing Backspace or Delete while it has focus, removes it. Deletable chips are a great fit for active-filter summaries or recipient lists.

<StoryCanvas of="Chip/Deletable" showLink />

### Dropdown chips

A dropdown chip has a trailing arrow that signals the chip opens a menu. While the menu is open, the chip is selected and the arrow flips from down to up. The chip is only the trigger, so the menu itself comes from another component.

<StoryCanvas of="Chip/Dropdown" showLink />

### Custom icons

Some chips need a leading icon, a different trailing icon, or both. Two common patterns: a saved filter with a leading bookmark icon, and recipient chips that combine a leading person icon with the close icon of a deletable chip.

<StoryCanvas of="Chip/CustomIcons" showLink />

### Density

Chips follow the density set on a parent element, so their padding, label size and icon size change together with the rest of the layout. A chip is 20px high at Compact, 28px at Comfortable and 36px at Relaxed:

- **Compact**: For dense views such as tables, toolbars and dashboards, where showing more on screen is worth smaller targets
- **Comfortable**: The default, for ordinary application UI
- **Relaxed**: For touch screens and pages where targets need to be larger

The [density guidelines](/docs/Next/foundation/design-tokens/spacing#density) explain how to choose between them.

<StoryCanvas of="Chip/Density" showLink />

### Tone × variant

Every tone works with every variant. Here's the full matrix for picking the right combination.

<StoryCanvas of="Chip/ToneVariantMatrix" showLink />

### Chip text

- Keep labels short - one or two words is ideal
- Use sentence case (capitalise only the first word)
- Make chips in the same group follow a consistent pattern (e.g. all nouns, or all `Key: value` pairs)

## Accessibility

**Selectable chips**

- Implements the WAI-ARIA toggle button pattern, so assistive technology announces whether the chip is selected
- **Keyboard**: Tab to focus, Enter or Space to toggle

**Deletable chips**

- The whole chip is the delete target, which is easier to hit than a small close icon
- **Keyboard**: Tab to focus, Enter or Space to activate, Backspace or Delete also trigger removal
- The trailing close icon carries a "Remove" title so it's announced to screen readers

**Dropdown chips**

- Assistive technology announces whether the menu is open, so keep the chip selected while its menu is open, and only then
- **Keyboard**: Tab to focus, Enter or Space to open or close the menu

**Density and target size**

Chips are smaller at Compact density, where a chip is 20px high. Check that chips are large enough to hit at the density you ship, as described in the [target size guidelines](/docs/Next/foundation/accessibility#target-size).

**Colour and contrast**

- Don't rely on tone alone to convey meaning - always pair tone with a clear label
- Chips meet WCAG 2.1 AA contrast across every tone and variant combination

## Figma

### Components

- **Chip [EDS Beta]**: The chip component in Figma, covering all tones, styles, behaviours and states

### Using the Chip in Figma

1. In Figma, go to the **Assets Panel** and search for **Chip**
2. Drag the component into your frame
3. Select the component to see its properties in the **Design Panel**

Density is not a property of the component. Set the density with a variable mode on your top-level frame, and every chip inside it follows.

### Property Structure

The Chip component exposes these properties:

- **Tone** - Neutral, Accent, Info, Success, Warning, Danger
- **Variants** - Default (selectable), Checked (selected), Deletable, Dropdown, 💠 Custom
- **Style** - Default, Outlined, High contrast
- **State** - Default, Hover, Focus, Active

The names differ from the ones on this page. What this page calls variants is the **Style** property in Figma, and the behaviours are the **Variants** property.

Switch **Variants** to _Checked_ to show the selected state with its leading check icon, _Deletable_ for a trailing close icon, or _Dropdown_ for a trailing arrow. _💠 Custom_ shows a leading and a trailing icon, which you swap with **Leading Icon** and **Trailing Icon**.

## Do's and Don'ts

:::info **Do**

- Use chips in groups when users pick from a short, related set of options
- Pick the variant that matches how much attention the chip should draw
- Pair tone with a clear label so the meaning doesn't rely on colour alone
- Use deletable chips for removable items like filters or recipients
- Use a dropdown chip when a chip opens a menu
  :::

:::danger **Don't**

- Use a chip as a primary action - reach for **Button** instead
- Use a chip for navigation between pages - reach for **Link** instead
- Wrap chip labels over multiple lines - keep text short
- Rely on tone alone to communicate meaning
- Mix deletable and selectable chips in the same group without a clear visual distinction
- Use more than one chip shape within the same group (pick one variant and stay consistent)
  :::
