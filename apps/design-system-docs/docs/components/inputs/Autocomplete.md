---
title: Autocomplete
description: Input that filters and selects one or multiple options from a list.
tags: [input, selection]
---

# Autocomplete

The autocomplete component allows users to choose one or multiple options from a list.

## When to Use

Use when the option list is long or filtering helps discovery. Use single variant for one choice; multi variant for multiple selections. Avoid for very short static lists (use radio or select). (Criteria matrix to be added soon.)

## Structure

- Input field (text entry)
- Dropdown/list overlay (filtered options)
- Option item (label + optional icon) – To be added soon
- Multi-selection tokens / chips – To be added soon
- Clear / reset affordance – To be added soon

## Guidelines

Supports filtering, sorting, and data submission contexts. Native select may be preferable in constrained environments. Single vs multi variants determine selection behavior. Additional guidance on async loading, empty states, and virtualization to be added soon.

Do:

- Highlight matched text in results (implementation guidance to be added soon)
- Provide keyboard navigation and typeahead

Don’t:

- Overload with unrelated status messages inside list
- Use multi selection without clear deselect affordance

## Accessibility

Accessibility specifics (combobox role, aria-expanded, active descendant, multi-select announcements) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on async search, debouncing strategy, and badge token overflow will be added soon. Reach out if needed earlier.
