---
title: Date/time picker
description: Allows selection of a date, time, or date/time range via interactive overlay.
tags: [input, date-time]
---

# Date/time picker

Date/time pickers allow users to select a date and/or time, or a range of dates and times.

## When to Use

Use for scheduling, filtering by date/time, or specifying time-bound parameters. Avoid for vague temporal ranges (use predefined quick range chips) or when manual free text is more efficient for expert users. (Detailed decision guidance to be added soon.)

## Structure

- Trigger input (text field)
- Overlay panel (calendar grid / time list)
- Navigation controls (month/year selectors) – To be added soon
- Range start/end highlight – To be added soon
- Time selection list / input – To be added soon
- Confirmation / apply actions (if not auto-apply) – To be added soon

## Guidelines

Activated on focus or click of the associated input. Calendar enables single date or range selection; time list enables precise time selection. Selected values reflect immediately in the input. Additional guidance on timezone handling, relative ranges, min/max constraints, and invalid date feedback to be added soon.

Do:

- Indicate range hover state during selection
- Provide clear disabled styling for out-of-range dates

Don’t:

- Force manual typing when a structured picker is present
- Overload with multiple mixed selection paradigms

## Accessibility

Accessibility specifics (grid role for calendar, keyboard navigation across days/months, announcing selected range, time list semantics) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on internationalization (locales, first day of week), time zones, and range presets will be added soon. Reach out if needed earlier.

---

Last reviewed: 2025-09-17
