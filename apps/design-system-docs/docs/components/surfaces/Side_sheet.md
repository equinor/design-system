---
title: Side sheet
description: A temporary panel that surfaces supplemental content or actions alongside the primary view.
tags: [surfaces, layout, contextual]
---

# Side sheet

The side sheet reveals supporting content without forcing a full page transition. We use it to keep users oriented while giving them space to review details, adjust settings, or apply filters.

## When to Use

Use a side sheet when you need to:

- Show contextual details about a selected item
- Provide filter, settings, or configuration tools beside primary content
- Let users compare or edit information while keeping the main view visible
- Stage multi-step secondary tasks without losing context

Avoid it when:

- The content is critical and requires full attention (use a full page)
- The interaction blocks primary task flow (consider a modal or inline pattern)
- You only need a small inline disclosure (use accordion or expandable section)

## Structure

Typical layout (top → bottom):

- Header (title, optional description, close action)
- Optional tabs or navigation (segmenting modes)
- Scrollable content region
- Supplemental actions (buttons, secondary controls)
- Footer (primary / secondary actions) – optional

Provide a persistent and predictable close affordance in the header. Keep action density reasonable to avoid cognitive overload.

## Guidelines

Do:

- Anchor consistently (usually right side in LTR layouts)
- Provide clear close action (icon button with accessible label)
- Keep width proportional to task complexity (avoid overly wide panels)
- Maintain separation from main content (shadow or divider)
- Persist unsaved state until explicitly dismissed or saved

Don’t:

- Nest multiple side sheets
- Hide critical primary content beneath it without an alternative path
- Use it for transient notifications (use toast or inline alert)
- Overfill with unrelated settings

Responsive:

- Collapse to full-width overlay on small screens if horizontal space is insufficient
- Ensure focus order remains logical after layout shifts

Semantics & Naming:

- Use a `aside` element when supplemental; use `section` if integral
- Provide `aria-label` or heading for identification

## Accessibility

- Focus: Move focus to the side sheet container or first focusable element when it opens; return focus to the triggering control when it closes
- Dismissal: Support Escape key to close (if non-blocking)
- Roles: Avoid dialog role unless modality is enforced; keep it non-modal when context must remain visible
- Scroll: Prevent background scroll only if interaction risk exists; otherwise allow background awareness
- Labels: Close button needs an accessible label (e.g., “Close side sheet”)
- Announcements: If dynamic content loads, announce updates via polite live region if necessary

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Need another size or interaction pattern? Reach out or open an issue. We evolve the side sheet together to keep it usable, accessible, and purposeful.

---

Last reviewed: 2025-09-15
