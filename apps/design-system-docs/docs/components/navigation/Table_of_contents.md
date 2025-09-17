---
title: Table of contents
description: Lists anchored headings on the current page for quick in-page navigation.
tags: [navigation, in-page]
---

# Table of contents

A table of contents is a list of hyperlinks that scroll to anchored text on the same page.

## When to Use

Use when a page has multiple sections or is long enough that quick scanning and direct jumps improve usability. Avoid when content is very short or has only a single heading level. (More detailed criteria to be added soon.)

## Structure

- Container (may be sticky or inline)
- List of anchor links (ordered by page hierarchy)
- Current section indicator – To be added soon
- Optional nested lists for subsections – To be added soon
  Details on markup and heading level filtering to be added soon.

## Guidelines

Also known as anchors or article navigation, links always point to sections within the current page. Placement options: directly under the main heading (scrolls with content) or to the right of the main content as a sticky element. Additional guidance on maximum depth, truncation, and collapsing subsections to be added soon.

Do:

- Reflect the actual heading order
- Keep labels identical to on-page headings

Don’t:

- Invent labels not present in the content
- Over-nest beyond meaningful hierarchy

## Accessibility

Accessibility specifics (skip navigation relationship, aria-current/aria-selected for active section, focus handling on jump) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Further guidance on active section tracking, scroll spy performance, and responsive placement will be added soon. Reach out if needed earlier.
