# App launcher

### Not in SB

An app launcher provides seamless navigation between related applications, helping users move effortlessly across our interconnected ecosystem. Designed with care to maintain context while exploring different tools and services, it creates a unified experience that inspires productivity and discovery.

<iframe 
        class="sb-iframe"
        src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=data-display-popover--app-launcher"
        width="100%"
        height="500"
        frameborder="1"
        ></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/data-display-popover--app-launcher)

## When to Use

Use an app launcher when you need to provide navigation across different applications that are related or relevant to the current application. This component is perfect for creating a cohesive experience across multiple products while maintaining clear visual hierarchy and user orientation.

## Structure

The app launcher consists of:

- **Product icons** that provide instant visual recognition for each application
- **Clear labels** that give concise direction and purpose
- **Active state indication** to show the current application context
- **Responsive layout** that adapts gracefully to different screen sizes

Each application entry is thoughtfully designed to communicate its purpose while maintaining consistency across the entire launcher interface.

## Guidelines

- The current application should always display as active in the app launcher to maintain user orientation
- Each application must include both a product icon and descriptive label for optimal accessibility and recognition
- When labels exceed the maximum width, they will be truncated with an ellipsis and should include a tooltip for the full text
- Organize applications logically, grouping related tools together when possible
- Ensure sufficient contrast and spacing between items for comfortable scanning and selection

## Implementation in Figma

### Instructions

1. In Figma go to the **Assets Panel** and search for **app launcher**
2. Drag and drop the component in your frame

### How to use

1. Place the `Navigation: App launcher/Listing/Desktop` on your artboard, just under the `Top bar` aligned to the start of the application drawer button (use `System icons/Navigations/apps`)
2. Toggle the grid layout on/off by using the following shortcut:
   - Mac: Control + G
   - PC: Ctrl + Shift + 4
3. Locate the **Design** tab in the **Inspector Panel**
4. Under the **Alignment** section, set the alignment to "Align left"
5. Under the **Constraints** section, set up the following constraints:
   - **Left**, **Top** and **Fix position when scrolling**
6. Drag the component to the height needed. As you drag, more items will appear
7. Rename the labels to your needs
8. Toggle on/off the app buttons as needed
9. Make sure to change the active applications to the `Active` state
