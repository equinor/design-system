# Spacing System Documentation

The <abbr title="Equinor Design System">EDS</abbr> spacing system provides a comprehensive set of utility classes for consistent spacing across all components and layouts. Built on a **4px baseline grid**, the system ensures visual harmony and predictable spacing patterns throughout your application.

## Overview

Spacing is a fundamental aspect of visual design that rivals color in its frequency of use. The EDS spacing system addresses three key challenges:

- **Consistency** -- Maintains uniform spacing across components and layouts
- **Density control** -- Supports spacious and comfortable density modes
- **Intentional design** -- Uses semantic concepts (stack, inline, inset) rather than arbitrary values

## Core Concepts

The spacing system is organized around five primary concepts, inspired by [Nathan Curtis's "Space in Design Systems"](https://medium.com/eightshapes-llc/space-in-design-systems-188bcbae0d62):

### 1. Inline Spacing

Horizontal spacing between elements arranged side-by-side. Use inline spacing for elements that flow horizontally, such as button groups, breadcrumbs, or horizontal lists.

**CSS Classes:** `.spacing-inline-{size}`

**Available sizes:** `4xs`, `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`

### 2. Stack Spacing

Vertical spacing between elements stacked on top of each other. Use stack spacing for vertically arranged content like paragraphs, form fields, or card content.

**CSS Classes:** `.spacing-stack-{size}`

**Available sizes:** `4xs`, `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`

### 3. Inset Spacing

Padding within elements. Inset spacing comes in three variations to accommodate different design needs:

#### Squared (Default)

Equal padding on all sides, creating a balanced feel.

**CSS Classes:** `.spacing-inset-{size}-squared`

**Available sizes:** `xs`, `sm`, `md`, `lg`, `xl`

#### Squished

Reduced vertical padding (typically 50% of horizontal), ideal for compact elements like buttons and table cells.

**CSS Classes:** `.spacing-inset-{size}-squished`

**Available sizes:** `xs`, `sm`, `md`, `lg`, `xl`

#### Stretched

Increased vertical padding, suitable for form inputs and text areas that need more breathing room.

**CSS Classes:** `.spacing-inset-{size}-stretched`

**Available sizes:** `xs`, `sm`, `md`, `lg`, `xl`

#### Directional Inset

Apply padding only horizontally or vertically:

- **Inline only:** `.spacing-inset-{size}-inline` (horizontal padding)
- **Stack only:** `.spacing-inset-{size}-stack-{variation}` (vertical padding with squared/squished/stretched)

### 4. Border Radius

Corner rounding for visual polish and hierarchy.

**CSS Classes:**

- `.spacing-border-radius-rounded` -- Standard rounded corners
- `.spacing-border-radius-pill` -- Fully rounded (1000px)
- `.spacing-border-radius-none` -- No rounding (0)

### 5. Icon Spacing

Specialized spacing for icon-text pairings, ensuring proper visual balance between icons and adjacent text.

**CSS Classes:** `.spacing-icon-gap-{size}`

**Available sizes:** `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`

## Usage Guidelines

### Basic Usage

Apply spacing utilities directly to container elements that use CSS Flexbox or Grid:

```jsx
// Inline spacing - horizontal button group
<div className="spacing-inline-sm" style={{ display: 'flex' }}>
  <Button>Cancel</Button>
  <Button>Save</Button>
  <Button>Submit</Button>
</div>

// Stack spacing - vertical form fields
<div className="spacing-stack-md" style={{ display: 'flex', flexDirection: 'column' }}>
  <TextField label="Name" />
  <TextField label="Email" />
  <TextField label="Message" />
</div>

// Inset spacing - padded card
<div className="spacing-inset-lg-squared spacing-border-radius-rounded">
  <h3>Card Title</h3>
  <p>Card content with consistent padding on all sides.</p>
</div>
```

### Component Application

#### Selectables (Buttons, Chips, Form Controls)

Use **squished inset** for compact, actionable elements:

```jsx
<button className="spacing-inset-sm-squished spacing-border-radius-rounded">
  Click me
</button>
```

**Recommended for:**

- Buttons
- Chips
- Autocomplete options
- Search fields
- Text fields
- Menu items
- Checkboxes
- Radio buttons
- Switches

#### Containers (Cards, Dialogs, Panels)

Use **squared or stretched inset** for content areas:

```jsx
<div className="spacing-inset-xl-squared spacing-border-radius-rounded">
  <h2>Dialog Title</h2>
  <div className="spacing-stack-md">
    <p>Dialog content with proper internal spacing.</p>
    <div className="spacing-inline-sm">
      <Button>Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </div>
  </div>
</div>
```

**Recommended for:**

- Popovers
- Tables
- Cards
- Sidebars
- Accordions
- Paper components
- Sidesheets
- Banners
- Tooltips
- Dialogs
- Snackbars
- Menus
- Lists

#### Pages and Layouts

Use **larger spacing values** for macro-level layout:

```jsx
<main className="spacing-inset-2xl-squared">
  <div className="spacing-stack-xl">
    <header>Page Header</header>
    <section>Main Content</section>
    <footer>Page Footer</footer>
  </div>
</main>
```

### Surface Considerations

#### Existing Surfaces

When elements have visible backgrounds (cards, dialogs, buttons), apply inset spacing to the element itself:

```jsx
<div
  className="spacing-inset-md-squared"
  style={{ background: 'var(--eds-color-surface-elevated)' }}
>
  Content with visible surface
</div>
```

#### Non-Visible Surfaces

For elements without backgrounds (text, lists, form groups), use stack or inline spacing on the parent container:

```jsx
<div className="spacing-stack-sm">
  <label>Label text</label>
  <label>Another label</label>
</div>
```

## Size Scale

The spacing system uses a **t-shirt sizing scale** with a non-linear progression based on the 4px baseline grid:

| Size  | Typical Value\* | Use Case                            |
| ----- | --------------- | ----------------------------------- |
| `4xs` | 2px             | Minimal spacing, tight layouts      |
| `3xs` | 4px             | Very tight spacing                  |
| `2xs` | 6px             | Compact spacing                     |
| `xs`  | 8px             | Small spacing, dense UIs            |
| `sm`  | 12px            | Below-medium spacing                |
| `md`  | 16px            | Default/medium spacing              |
| `lg`  | 24px            | Above-medium spacing                |
| `xl`  | 32px            | Large spacing                       |
| `2xl` | 40px            | Very large spacing                  |
| `3xl` | 48px            | Extra large spacing, major sections |

_\*Actual values vary by density mode (spacious/comfortable) and context._

## Density Modes

The spacing system automatically adapts to density preferences through CSS custom properties. All spacing utilities support both **spacious** and **comfortable** modes:

- **Spacious** -- More breathing room, better for accessibility and readability
- **Comfortable** -- Tighter spacing, fits more content on screen

Density is controlled at the application level and doesn't require changes to your component code.

## Combining Utilities

Mix and match spacing utilities to create complex layouts:

```jsx
// Card with multiple spacing concerns
<div className="spacing-inset-lg-squared spacing-border-radius-rounded">
  {/* Vertical spacing for content */}
  <div className="spacing-stack-md">
    <h3>Card Title</h3>

    {/* Horizontal spacing for action buttons */}
    <div className="spacing-inline-sm">
      <Button>Action 1</Button>
      <Button>Action 2</Button>
    </div>

    {/* Icon with text */}
    <div
      className="spacing-icon-gap-sm"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <Icon name="info" />
      <span>Information text</span>
    </div>
  </div>
</div>
```

## Best Practices

### Do's

:::tip

- **Use semantic spacing concepts** -- Choose inline, stack, or inset based on the layout intent, not arbitrary pixel values
- **Respect the baseline grid** -- All spacing values align to the 4px grid for visual consistency
- **Leverage density modes** -- Design components that work in both spacious and comfortable modes
- **Combine utilities** -- Mix inline, stack, and inset spacing to create complex layouts
- **Test with real content** -- Verify spacing works with varying content lengths

:::

### Don'ts

:::warning

- **Avoid custom padding/margin** -- Use spacing utilities instead of inline styles or custom CSS
- **Don't mix spacing systems** -- Stick to EDS spacing utilities throughout your application
- **Don't use arbitrary values** -- If a spacing value seems missing, consult the design team rather than creating custom spacing
- **Avoid nested insets unnecessarily** -- Too many layers of padding can create excessive whitespace

:::

## Alignment with Design Patterns

- **Semantic concepts** -- Stack, inline, inset instead of margin/padding property names
- **T-shirt sizing** -- Memorable xs, sm, md, lg, xl scale
- **Non-linear progression** -- Doubling scale that limits choices and increases clarity
- **Density control** -- Built-in support for spacious and comfortable modes
- **Modern CSS** -- Uses `gap` property for cleaner, more predictable layouts

## Implementation Details

### CSS Custom Properties

All spacing utilities reference CSS custom properties from the design tokens:

```css
.spacing-inline-md {
  --spacing-value: var(--eds-spacing-inline-md);
  gap: var(--spacing-value);
}

.spacing-inset-lg-squared {
  padding-inline: var(--eds-spacing-inset-lg-inline);
  padding-block: var(--eds-spacing-inset-lg-stack-squared);
}
```

### Browser Support

The spacing system uses modern CSS properties:

- **`gap`** -- Supported in all modern browsers for Flexbox (2021+) and Grid (2017+)
- **`padding-inline` / `padding-block`** -- Logical properties for internationalization
- **CSS custom properties** -- Universal support in evergreen browsers

### Performance

Spacing utilities are lightweight and performant:

- **No JavaScript required** -- Pure CSS implementation
- **Minimal specificity** -- Single class selectors for easy overrides if needed
- **Efficient** -- CSS custom properties allow dynamic density switching without recompiling

## Support

For questions or issues with the spacing system:

- **GitHub Issues** -- Report bugs or request features
- **Slack** -- #eds-design-system channel
- **Documentation** -- [EDS Documentation Site](https://eds.equinor.com)

---

_Last updated: October 2025_
