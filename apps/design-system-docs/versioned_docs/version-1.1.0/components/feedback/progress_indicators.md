# Progress indicators

_Progress indicators_ are animated helpers that indicate waiting time as content loads.

## When to Use

- Progress indicators inform users about the current loading state giving them insight into the process
- Progress indicators look and animate in ways that reflect the status of a process. They are never simply decorative
- Progress indicators should be applied to all cases of a process in a consistent format

## Variants

#### Circular

Circular progress indicators are great for places like icons and empty pages. They should be used for short waiting times. They can be applied directly to a surface, such as a button or card.

<iframe 
        class="sb-iframe"
        src="
        https://storybook.eds.equinor.com/iframe.html?globals=&args=color:primary&id=feedback-progress-indicators-circular--introduction
        "
        width="100%"
        height="150"
        frameborder="1"
        ></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/docs/surfaces-card--docs)

#### Dots

Dot progress indicators are for use within _buttons_.

<iframe 
        class="sb-iframe"
        src="
        https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=feedback-progress-indicators-dots--introduction
        "
        width="100%"
        height="150"
        frameborder="1"
        ></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/docs/feedback-progress-indicators-dots--docs&args=color:primary)

Dot progress indicators are for use within _buttons_.

#### Linear

Linear progress indicators are great to focus attention to an area. They are great for places like empty pages, at the bottom of the _top bar_, and in _cards_ and _lists_.

<iframe 
        class="sb-iframe"
        src="
        https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=feedback-progress-indicators-linear--introduction
        "
        width="100%"
        height="150"
        frameborder="1"
        ></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/docs/feedback-progress-indicators-linear--docs)

Linear progress indicators are great to focus attention to an area. They are great for places like empty pages, at the bottom of the _top bar_, and in cards and _lists_.

#### Star

Star progress indicators are to be used on splash screens and empty pages only. The Indeterminate star indicator spins along the invisible track.

<iframe 
        class="sb-iframe"
        src="
        https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=feedback-progress-indicators-star--introduction
        "
        width="100%"
        height="150"
        frameborder="1"
        ></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/docs/feedback-progress-indicators-star--docs)

## Guidelines

Determinate progress indicators indicate how long the process will take. They should be used once there is an estimate of wait time available.

Indeterminate progress indicators indicate an unknown amount of time the process will take. They should be used when there is _not_ an estimated wait time available.

## Accessibility

Progress indicators have `role="progressbar"` and therefore either `aria-describedby` or `aria-label` should be included. Click the button with keyboard and a screen reader activated to test.

## Implementation in Figma

1. In Figma go to the **Assets Panel** and search for **Progress Indicator**.
2. Drag and drop the component in your frame.
3. Rename and resize the component if needed.
4. Choose the variant from the **Design Panel**.

## Do's and don'ts

✅ Progress indicators should be applied to all cases of a process in a consistent format.
