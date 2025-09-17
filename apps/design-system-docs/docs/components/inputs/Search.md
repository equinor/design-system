---
title: Search
description: Enables users to locate or refine content via keyword queries.
tags: [input, search]
---

# Search

Search allows users to locate or refine content based on words or phrases.

## When to Use

Use when users must discover or filter information across datasets or pages. Avoid if direct navigation or categorical browsing suffices. (Criteria for embedding vs standalone to be added soon.)

## Structure

- Input field (with or without icon button trigger)
- Optional scope selector (pre-filter)
- Optional autocomplete/suggestions dropdown
- Clear / reset control – To be added soon
- Submit behavior (Enter or explicit icon)

## Guidelines

On submit (Enter) show results. May surface autocomplete suggestions, recent searches, or scoped filters (via autocomplete component). Global search placeholder should be "Search". May replace top bar center content or expand from an icon. Scoping defaults to “All”. Dark theme availability note limited to Figma currently.

Do:

- Support keyboard-only interaction
- Provide recent searches when helpful (privacy considerations to be added soon)

Don’t:

- Overload placeholder with instructions
- Mix results and suggestions indistinctly (labelling guidance to be added soon)

## Accessibility

Accessibility specifics (form role, aria-label vs placeholder, announcing suggestion counts, escape behavior) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on debounced search, zero-results patterns, and query highlighting will be added soon. Reach out if needed sooner.
