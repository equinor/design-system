# Scrim

A _scrim_ is a temporary visual effect that fades the general interface while allowing the user to focus on an overlay.

## Guidelines

Always use a scrim with an overlay component such as a dialog, elevated or elevated navigation (mobile only).

When the scrim is clicked on or the `Esc` key is pressed the overlay component will close, closing the scrim with it.

A `Scrim` shows behind all other surfaces in an app, displaying contextual and actionable content.

- The scrim's back layer is persistent, displaying controls and content that relate to the front layer.
- The scrim focuses attention on one layer at a time.
- The scrim is displayed at full width and holds primary content.
- The scrim can be closed by either interacting with the front layer, using `esc` button or tapping a conceal affordance on either layer.

## Implementation in Figma

### Instructions

1. In Figma go to the **Assets Panel** and search for **Scrim**.
2. Drag and drop the component in your frame.
3. Rename and resize the component if needed.
