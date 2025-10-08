# Scrim

A _scrim_ is a temporary visual effect that fades the general interface while allowing the user to focus on an overlay.

<iframe 
        class="sb-iframe"
        src="
        https://storybook.eds.equinor.com/iframe.html?globals=&args=isDismissable:!true;open:!false&id=feedback-scrim--introduction
        "
        width="100%"
        height="500"
        frameborder="1"
        ></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/docs/feedback-scrim--docs&args=color:primary)

## When to use

A `Scrim` shows behind all other surfaces in an app, displaying contextual and actionable content.

- The scrim's back layer is persistent, displaying controls and content that relate to the front layer
- The scrim focuses attention on one layer at a time
- The scrim is displayed at full width and holds primary content
- The scrim can be closed by either interacting with the front layer, pressing the `Esc` key, or tapping a conceal affordance on either layer

## Guidelines

Always use a scrim with an overlay component such as a dialog, elevated _side sheet_ or elevated navigation _drawer_ (mobile only).

When the scrim is clicked on or the `Esc` key is pressed the overlay component will close, closing the scrim with it.

## Implementation in Figma

1. In Figma go to the **Assets Panel** and search for **Scrim**.
2. Drag and drop the component in your frame.
3. Rename and resize the component if needed.
   <<<<<<< HEAD
   =======

## Code

[View in Storybook](https://storybook.eds.equinor.com/index.html?path=/docs/feedback-scrim--docs)

> > > > > > > d84ca2f8 (added storybook iframe to all components, adjust size to fit better with component size)
