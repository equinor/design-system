---
title: Chip
sidebar_position: 1
---

# Chip

Chips are compact, interactive elements that represent a small piece of information users can select, filter, remove, or expand. They work well for filters, tags, selections, or quickly triggering a menu. With variants for visual weight, tones for intent, and built-in support for selectable, deletable, and dropdown behaviours, chips help surface bite-sized actions without stealing focus from the surrounding UI.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-data-display-chip--default"
  width="100%"
  height="96"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-data-display-chip--default)

## When to Use

Use a chip when you need a compact, interactive element for selection, filtering, tagging, or triggering a small menu. Chips work especially well in groups - filter bars, saved searches, recipient pickers, or active filter summaries.

**Avoid chips for:**

- Primary calls to action - use **Button** instead
- Navigating between pages - use **Link** instead

## Structure

A chip is always a button. Based on the props you pass, it takes on one of four behaviours:

- **Selectable** (default): toggles a selected state, showing a leading check icon when active
- **Deletable**: shows a trailing close icon; clicking anywhere on the chip (or pressing Backspace / Delete while focused) fires `onDelete`
- **Dropdown**: shows a trailing arrow that flips up when the chip is selected, signalling an open menu
- **Custom icons**: pass icons as children for full control over leading and/or trailing content

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-data-display-chip--types"
  width="100%"
  height="96"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-data-display-chip--types)

## Guidelines

### Variants

Variants control the visual weight of the chip. Pick the one that matches how much attention the chip should draw in its surroundings.

| Variant       | Emphasis | Use Case                                                 |
| ------------- | -------- | -------------------------------------------------------- |
| Default       | Medium   | Standard chips on neutral surfaces                       |
| Outlined      | Low      | Quiet chips that shouldn't compete with surrounding UI   |
| High contrast | High     | Prominent chips that need to stand out, e.g. key filters |

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-data-display-chip--variants"
  width="100%"
  height="96"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-data-display-chip--variants)

### Tones

Tones communicate the meaning or category behind a chip:

- **Neutral**: The default tone for general-purpose chips
- **Accent**: Brand colour for highlighted selections or saved items
- **Success**: Positive or confirmed states
- **Info**: Informational chips
- **Warning**: Caution or attention-needed states
- **Danger**: Destructive or error states

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-data-display-chip--tones"
  width="100%"
  height="96"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-data-display-chip--tones)

### Selectable chips

Selectable chips are controlled components - manage `selected` in your own state and pass an `onClick` handler to flip it. When `selected` is true, the chip shows a leading check icon. Selection is ideal for filter chips, tag pickers, or any group where one or more options can be active at the same time.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-data-display-chip--selectable"
  width="100%"
  height="96"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-data-display-chip--selectable)

### Deletable chips

Pass `onDelete` to turn a chip into a removable tag. The entire chip becomes the delete target - clicking anywhere on it, or pressing Backspace / Delete while focused, fires the callback. Deletable chips are a great fit for active-filter summaries or recipient lists.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-data-display-chip--deletable"
  width="100%"
  height="96"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-data-display-chip--deletable)

### Dropdown chips

Use `dropdown` to add a trailing arrow that signals the chip opens a menu. Combine `dropdown` with `selected` while the menu is open - the arrow flips from down to up. The chip owns the trigger and visual state; you own the popover or menu behaviour.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-data-display-chip--dropdown"
  width="100%"
  height="96"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-data-display-chip--dropdown)

### Custom icons

For chips that need a leading icon, a different trailing icon, or both, pass icons directly as children. Two common patterns: a saved filter with a leading bookmark icon, and recipient chips that combine a leading person icon with the built-in `onDelete` close icon.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-data-display-chip--custom-icons"
  width="100%"
  height="255"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-data-display-chip--custom-icons)

### Density

Chips respond to a `data-density` attribute on a parent element, so they feel at home in both roomy and compact layouts:

- **Spacious** (default): Comfortable padding for general-purpose use
- **Comfortable**: A denser option for toolbars, tables, and data-heavy views. As with other EDS components, provide a way to switch back to spacious mode for accessibility.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-data-display-chip--density"
  width="100%"
  height="247"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-data-display-chip--density)

### Tone × variant

Every tone works with every variant. Here's the full matrix for picking the right combination.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-data-display-chip--tone-variant-matrix"
  width="100%"
  height="362"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-data-display-chip--tone-variant-matrix)

### Chip text

- Keep labels short - one or two words is ideal
- Use sentence case (capitalise only the first word)
- Make chips in the same group follow a consistent pattern (e.g. all nouns, or all `Key: value` pairs)

## Accessibility

**Selectable chips**

- Rendered as a `<button>` with `aria-pressed` reflecting the `selected` state, so assistive tech announces the toggle state correctly
- **Keyboard**: Tab to focus, Enter or Space to toggle

**Deletable chips**

- The whole chip is the delete target, which is easier to hit than a small close icon
- **Keyboard**: Tab to focus, Enter or Space to activate, Backspace or Delete also trigger removal
- The trailing close icon carries a "Remove" title so it's announced to screen readers

**Dropdown chips**

- The component automatically sets `aria-expanded` based on the `selected` prop - keep `selected` in sync with the actual open/closed state of the paired menu
- **Keyboard**: Tab to focus, Enter or Space to open or close the menu

**Comfortable density**

Comfortable density should come with the option to switch to spacious mode for accessibility reasons.

**Colour and contrast**

- Don't rely on tone alone to convey meaning - always pair tone with a clear label
- Chips meet WCAG 2.1 AA contrast across every tone and variant combination

## Figma

### Components

- **Chip [EDS]**: The chip component in Figma, covering all tones, variants, types, and states

### Using the Chip in Figma

1. In Figma, go to the **Assets Panel** and search for **Chip**
2. Drag the component into your frame
3. Select the component to see its properties in the **Design Panel**

### Property Structure

The Chip component exposes these properties:

- **Tone** - Neutral, Accent, Success, Info, Warning, Danger
- **Type** - Default (selectable), Deletable, Checked (selected), Dropdown
- **Style** - Default, Outlined, High contrast
- **State** - Default, Hover, Focus, etc.

Switch **Type** to _Deletable_ for a trailing close icon, _Dropdown_ for a trailing arrow, or _Checked_ to preview the selected state with its leading check icon.

## Do's and Don'ts

:::info **Do**

- Use chips in groups when users pick from a short, related set of options
- Pick the variant that matches how much attention the chip should draw
- Pair tone with a clear label so the meaning doesn't rely on colour alone
- Use `onDelete` for chips that represent removable items like filters or recipients
- Use `dropdown` when a chip triggers a menu, and keep `selected` in sync with the menu's open state
- Allow switching from comfortable to spacious density for accessibility
  :::

:::danger **Don't**

- Use a chip as a primary action - reach for **Button** instead
- Use a chip for navigation between pages - reach for **Link** instead
- Wrap chip labels over multiple lines - keep text short
- Rely on tone alone to communicate meaning
- Mix deletable and selectable chips in the same group without a clear visual distinction
- Use more than one chip shape within the same group (pick one variant and stay consistent)
  :::
