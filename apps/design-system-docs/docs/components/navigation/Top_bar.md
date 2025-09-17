---
title: Top bar
description: Persistent header displaying global navigation, context, and utility actions.
tags: [navigation, layout, header]
---

# Top bar

The top bar, also known as a header, displays navigation and actions relating to the interface.

## When to Use

Use when a product needs persistent global navigation, context (title/subtitle), and always-available utilities. Avoid when a single-view tool has minimal actions (simpler layout may suffice). (More detailed criteria to be added soon.)

## Structure

- Container (full-width, fixed, non-scrolling)
- Leading area: title (and optional subtitle), primary navigation icon (App launcher or Navigation Drawer toggle)
- Center area: optional custom content (tabs, search, button menus)
- Actions area (far right): fullscreen, notifications, accessibility (mandatory), user profile (mandatory)
  Details on responsive collapse and overflow handling to be added soon.

## Guidelines

Top bars span the full width and remain visible. A consistent title appears across the application group; optional subtitle may reflect sub-app context. Provide a single main navigation icon on the far left when needed. Allowed center content: tabs (including nested menus), search bars, buttons as menus. Right-aligned actions: fullscreen, notifications (menu), accessibility (theme/font size menu; mandatory), user profile (account/log out menu; mandatory). Additional spacing, density, and theming guidance to be added soon.

Do:

- Keep the action set focused on global utilities
- Maintain consistent ordering of right-side actions
- Use clear iconography with accessible labels

Don’t:

- Overload with page-specific actions
- Reorder actions between routes

- Search bars
- Buttons as menus

### Actions

The actions on the far-right are standard. This area is for the following common actions within the application:

- Fullscreen: Users can choose to launch the interface to be fullscreen.
- Notifications: This opens a `Menu` for the user to see their notifications.
- Accessibility: This opens a `Menu` with choices for the users to choose light/dark mode and their font size. *This button is mandatory to keep.*
- User profile: This opens a `Menu` where the user can see more account details and log out. *This button is mandatory to keep.*
