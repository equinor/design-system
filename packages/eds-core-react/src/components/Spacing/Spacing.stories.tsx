import type { Meta, StoryObj } from '@storybook/react-vite'
import './Spacing.stories.css'

const meta: Meta = {
  title: 'Foundation/Spacing',
  parameters: {
    docs: {
      description: {
        component: `

The Equinor Design System uses a systematic spacing scale based on a 4px baseline grid. 
Spacing provides visual rhythm and hierarchy throughout the interface.

## Categories

### Inline Spacing
Horizontal spacing between elements. Use for spacing items in a row or horizontal layout.

### Stack Spacing
Vertical spacing between stacked elements. Use for spacing items in a column or vertical layout.

### Inset Spacing
Padding within elements. Available in three variations:
* **Squished**: Reduced vertical padding, creates compact UI elements
* **Squared**: Equal vertical and horizontal padding
* **Stretched**: Increased vertical padding, creates more spacious UI elements

### Icon Spacing
Optimized spacing for icons paired with text, scaled proportionally to text size.

### Border Radius
Corner rounding values for consistent visual treatment.

## Density Modes

All spacing values support two density modes:
* **Spacious**: Larger spacing values (default)
* **Comfortable**: Compact spacing values

The density mode can be controlled via the \`data-density\` attribute on a parent element.

## Usage

### Utility Classes

Apply spacing classes directly to elements:

\`\`\`tsx
<div className="spacing-stack-md">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
\`\`\`

For inset spacing:

\`\`\`tsx
<button className="spacing-inset-md-squared">
  Click me
</button>
\`\`\`

### Data Attributes

Use data attributes for dynamic spacing control:

\`\`\`tsx
<div data-spacing-stack="md">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
\`\`\`

For inset spacing with data attributes:

\`\`\`tsx
<button 
  data-spacing-inset-size="md" 
  data-spacing-inset-variation="squared"
>
  Click me
</button>
\`\`\`

#### Available Data Attributes

- \`data-spacing-inline\`: Horizontal gap spacing (values: 4xs to 3xl)
- \`data-spacing-stack\`: Vertical gap spacing (values: 4xs to 3xl)
- \`data-spacing-inset-size\`: Inset padding size (values: xs, sm, md, lg, xl)
- \`data-spacing-inset-variation\`: Inset padding style (values: inline, stack-squished, stack-squared, stack-stretched, squished, squared, stretched)
- \`data-spacing-border-radius\`: Corner radius (values: none, rounded, pill)
- \`data-spacing-icon-gap\`: Icon-text gap (values: xs to 6xl)
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj

export const InlineSpacing: Story = {
  render: () => (
    <div className="spacing-demo-container">
      <div>
        <p className="spacing-demo-label">
          <strong>4xs</strong> (spacious: 2px, comfortable: 1px)
        </p>
        <div className="spacing-demo-box-container spacing-inline-4xs">
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
        </div>
      </div>

      <div>
        <p className="spacing-demo-label">
          <strong>3xs</strong> (spacious: 4px, comfortable: 2px)
        </p>
        <div className="spacing-demo-box-container spacing-inline-3xs">
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
        </div>
      </div>

      <div>
        <p className="spacing-demo-label">
          <strong>2xs</strong> (spacious: 6px, comfortable: 4px)
        </p>
        <div className="spacing-demo-box-container spacing-inline-2xs">
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
        </div>
      </div>

      <div>
        <p className="spacing-demo-label">
          <strong>xs</strong> (spacious: 8px, comfortable: 6px)
        </p>
        <div className="spacing-demo-box-container spacing-inline-xs">
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
        </div>
      </div>

      <div>
        <p className="spacing-demo-label">
          <strong>sm</strong> (spacious: 12px, comfortable: 8px)
        </p>
        <div className="spacing-demo-box-container spacing-inline-sm">
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
        </div>
      </div>

      <div>
        <p className="spacing-demo-label">
          <strong>md</strong> (spacious: 16px, comfortable: 12px)
        </p>
        <div className="spacing-demo-box-container spacing-inline-md">
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
        </div>
      </div>

      <div>
        <p className="spacing-demo-label">
          <strong>lg</strong> (spacious: 20px, comfortable: 16px)
        </p>
        <div className="spacing-demo-box-container spacing-inline-lg">
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
        </div>
      </div>

      <div>
        <p className="spacing-demo-label">
          <strong>xl</strong> (spacious: 24px, comfortable: 20px)
        </p>
        <div className="spacing-demo-box-container spacing-inline-xl">
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
        </div>
      </div>

      <div>
        <p className="spacing-demo-label">
          <strong>2xl</strong> (spacious: 28px, comfortable: 24px)
        </p>
        <div className="spacing-demo-box-container spacing-inline-2xl">
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
        </div>
      </div>

      <div>
        <p className="spacing-demo-label">
          <strong>3xl</strong> (spacious: 32px, comfortable: 28px)
        </p>
        <div className="spacing-demo-box-container spacing-inline-3xl">
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
        </div>
      </div>
    </div>
  ),
}

export const StackSpacing: Story = {
  render: () => (
    <div className="spacing-demo-row">
      <div className="spacing-demo-item">
        <p className="spacing-demo-label">
          <strong>4xs</strong>
        </p>
        <div className="spacing-demo-box-container-column spacing-stack-4xs">
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
        </div>
      </div>

      <div className="spacing-demo-item">
        <p className="spacing-demo-label">
          <strong>3xs</strong>
        </p>
        <div className="spacing-demo-box-container-column spacing-stack-3xs">
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
        </div>
      </div>

      <div className="spacing-demo-item">
        <p className="spacing-demo-label">
          <strong>2xs</strong>
        </p>
        <div className="spacing-demo-box-container-column spacing-stack-2xs">
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
        </div>
      </div>

      <div className="spacing-demo-item">
        <p className="spacing-demo-label">
          <strong>xs</strong>
        </p>
        <div className="spacing-demo-box-container-column spacing-stack-xs">
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
        </div>
      </div>

      <div className="spacing-demo-item">
        <p className="spacing-demo-label">
          <strong>sm</strong>
        </p>
        <div className="spacing-demo-box-container-column spacing-stack-sm">
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
        </div>
      </div>

      <div className="spacing-demo-item">
        <p className="spacing-demo-label">
          <strong>md</strong>
        </p>
        <div className="spacing-demo-box-container-column spacing-stack-md">
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
        </div>
      </div>

      <div className="spacing-demo-item">
        <p className="spacing-demo-label">
          <strong>lg</strong>
        </p>
        <div className="spacing-demo-box-container-column spacing-stack-lg">
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
        </div>
      </div>

      <div className="spacing-demo-item">
        <p className="spacing-demo-label">
          <strong>xl</strong>
        </p>
        <div className="spacing-demo-box-container-column spacing-stack-xl">
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
        </div>
      </div>

      <div className="spacing-demo-item">
        <p className="spacing-demo-label">
          <strong>2xl</strong>
        </p>
        <div className="spacing-demo-box-container-column spacing-stack-2xl">
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
        </div>
      </div>

      <div className="spacing-demo-item">
        <p className="spacing-demo-label">
          <strong>3xl</strong>
        </p>
        <div className="spacing-demo-box-container-column spacing-stack-3xl">
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
        </div>
      </div>
    </div>
  ),
}

export const InsetSpacing: Story = {
  render: () => (
    <div className="spacing-demo-container">
      <h3 className="spacing-demo-heading">Inset Spacing Variations</h3>

      <div>
        <h4 className="spacing-demo-subheading">Extra Small (xs)</h4>
        <div className="spacing-demo-row">
          <div>
            <p className="spacing-demo-label">
              <strong>Squished</strong>
            </p>
            <div className="spacing-inset-xs-squished spacing-demo-inset">
              Button Text
            </div>
          </div>
          <div>
            <p className="spacing-demo-label">
              <strong>Squared</strong>
            </p>
            <div className="spacing-inset-xs-squared spacing-demo-inset">
              Button Text
            </div>
          </div>
          <div>
            <p className="spacing-demo-label">
              <strong>Stretched</strong>
            </p>
            <div className="spacing-inset-xs-stretched spacing-demo-inset">
              Button Text
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="spacing-demo-subheading">Small (sm)</h4>
        <div className="spacing-demo-row">
          <div>
            <p className="spacing-demo-label">
              <strong>Squished</strong>
            </p>
            <div className="spacing-inset-sm-squished spacing-demo-inset">
              Button Text
            </div>
          </div>
          <div>
            <p className="spacing-demo-label">
              <strong>Squared</strong>
            </p>
            <div className="spacing-inset-sm-squared spacing-demo-inset">
              Button Text
            </div>
          </div>
          <div>
            <p className="spacing-demo-label">
              <strong>Stretched</strong>
            </p>
            <div className="spacing-inset-sm-stretched spacing-demo-inset">
              Button Text
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="spacing-demo-subheading">Medium (md)</h4>
        <div className="spacing-demo-row">
          <div>
            <p className="spacing-demo-label">
              <strong>Squished</strong>
            </p>
            <div className="spacing-inset-md-squished spacing-demo-inset">
              Button Text
            </div>
          </div>
          <div>
            <p className="spacing-demo-label">
              <strong>Squared</strong>
            </p>
            <div className="spacing-inset-md-squared spacing-demo-inset">
              Button Text
            </div>
          </div>
          <div>
            <p className="spacing-demo-label">
              <strong>Stretched</strong>
            </p>
            <div className="spacing-inset-md-stretched spacing-demo-inset">
              Button Text
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="spacing-demo-subheading">Large (lg)</h4>
        <div className="spacing-demo-row">
          <div>
            <p className="spacing-demo-label">
              <strong>Squished</strong>
            </p>
            <div className="spacing-inset-lg-squished spacing-demo-inset">
              Button Text
            </div>
          </div>
          <div>
            <p className="spacing-demo-label">
              <strong>Squared</strong>
            </p>
            <div className="spacing-inset-lg-squared spacing-demo-inset">
              Button Text
            </div>
          </div>
          <div>
            <p className="spacing-demo-label">
              <strong>Stretched</strong>
            </p>
            <div className="spacing-inset-lg-stretched spacing-demo-inset">
              Button Text
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="spacing-demo-subheading">Extra Large (xl)</h4>
        <div className="spacing-demo-row">
          <div>
            <p className="spacing-demo-label">
              <strong>Squished</strong>
            </p>
            <div className="spacing-inset-xl-squished spacing-demo-inset">
              Button Text
            </div>
          </div>
          <div>
            <p className="spacing-demo-label">
              <strong>Squared</strong>
            </p>
            <div className="spacing-inset-xl-squared spacing-demo-inset">
              Button Text
            </div>
          </div>
          <div>
            <p className="spacing-demo-label">
              <strong>Stretched</strong>
            </p>
            <div className="spacing-inset-xl-stretched spacing-demo-inset">
              Button Text
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const BorderRadius: Story = {
  render: () => (
    <div className="spacing-demo-row">
      <div>
        <p className="spacing-demo-label">
          <strong>None</strong>
        </p>
        <div className="spacing-border-radius-none spacing-demo-border-none">
          0px
        </div>
      </div>

      <div>
        <p className="spacing-demo-label">
          <strong>Rounded</strong>
        </p>
        <div className="spacing-border-radius-rounded spacing-demo-border-rounded">
          4px
        </div>
      </div>

      <div>
        <p className="spacing-demo-label">
          <strong>Pill</strong>
        </p>
        <div className="spacing-border-radius-pill spacing-demo-border-pill">
          1000px
        </div>
      </div>
    </div>
  ),
}

export const IconSpacing: Story = {
  render: () => (
    <div className="spacing-demo-container">
      <h3 className="spacing-demo-heading">Icon Gap Spacing</h3>
      <p className="spacing-demo-text">
        Optimized spacing between icons and text, scaled to text size.
      </p>

      <div className="spacing-demo-container">
        <div className="spacing-icon-gap-xs spacing-demo-icon spacing-demo-icon-xs">
          <div className="spacing-demo-icon-box" />
          <span>XS Icon Gap (0.75rem text)</span>
        </div>

        <div className="spacing-icon-gap-sm spacing-demo-icon spacing-demo-icon-sm">
          <div className="spacing-demo-icon-box" />
          <span>SM Icon Gap (0.875rem text)</span>
        </div>

        <div className="spacing-icon-gap-md spacing-demo-icon spacing-demo-icon-md">
          <div className="spacing-demo-icon-box" />
          <span>MD Icon Gap (1rem text)</span>
        </div>

        <div className="spacing-icon-gap-lg spacing-demo-icon spacing-demo-icon-lg">
          <div className="spacing-demo-icon-box" />
          <span>LG Icon Gap (1.125rem text)</span>
        </div>

        <div className="spacing-icon-gap-xl spacing-demo-icon spacing-demo-icon-xl">
          <div className="spacing-demo-icon-box" />
          <span>XL Icon Gap (1.25rem text)</span>
        </div>

        <div className="spacing-icon-gap-2xl spacing-demo-icon spacing-demo-icon-2xl">
          <div className="spacing-demo-icon-box" />
          <span>2XL Icon Gap (1.5rem text)</span>
        </div>
      </div>
    </div>
  ),
}

export const DensityModes: Story = {
  render: () => (
    <div className="spacing-demo-density-section">
      <div>
        <h3 className="spacing-demo-heading">Spacious Mode (Default)</h3>
        <p className="spacing-demo-text">
          Larger spacing values for comfortable, accessible interfaces.
        </p>
        <div className="spacing-demo-density-container" data-density="spacious">
          <div className="spacing-inset-md-squared spacing-border-radius-rounded spacing-demo-button-primary">
            Spacious Button
          </div>
          <div className="spacing-demo-box-container spacing-inline-md">
            <div className="spacing-demo-box" />
            <div className="spacing-demo-box" />
            <div className="spacing-demo-box" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="spacing-demo-heading">Comfortable Mode</h3>
        <p className="spacing-demo-text">
          Compact spacing values for information-dense layouts.
        </p>
        <div
          className="spacing-demo-density-container"
          data-density="comfortable"
        >
          <div className="spacing-inset-md-squared spacing-border-radius-rounded spacing-demo-button-primary">
            Comfortable Button
          </div>
          <div className="spacing-demo-box-container spacing-inline-md">
            <div className="spacing-demo-box" />
            <div className="spacing-demo-box" />
            <div className="spacing-demo-box" />
          </div>
        </div>
      </div>
    </div>
  ),
}

export const DataAttributeAPI: Story = {
  render: () => (
    <div className="spacing-demo-container">
      <h3 className="spacing-demo-heading">Data Attribute API</h3>
      <p className="spacing-demo-text">
        The spacing system supports data attributes for dynamic spacing control,
        similar to the typography system. This is particularly useful for
        component libraries and dynamic UIs.
      </p>

      <div>
        <h4 className="spacing-demo-subheading">Inline Spacing</h4>
        <p className="spacing-demo-label">
          Use <code>data-spacing-inline</code> attribute
        </p>
        <div className="spacing-demo-box-container" data-spacing-inline="md">
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
        </div>
      </div>

      <div>
        <h4 className="spacing-demo-subheading">Stack Spacing</h4>
        <p className="spacing-demo-label">
          Use <code>data-spacing-stack</code> attribute
        </p>
        <div
          className="spacing-demo-box-container-column"
          data-spacing-stack="sm"
        >
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
          <div className="spacing-demo-box-horizontal" />
        </div>
      </div>

      <div>
        <h4 className="spacing-demo-subheading">Inset Spacing</h4>
        <p className="spacing-demo-label">
          Use <code>data-spacing-inset-size</code> and{' '}
          <code>data-spacing-inset-variation</code> attributes
        </p>
        <div className="spacing-demo-row">
          <div
            className="spacing-demo-inset"
            data-spacing-inset-size="sm"
            data-spacing-inset-variation="squished"
          >
            Squished
          </div>
          <div
            className="spacing-demo-inset"
            data-spacing-inset-size="md"
            data-spacing-inset-variation="squared"
          >
            Squared
          </div>
          <div
            className="spacing-demo-inset"
            data-spacing-inset-size="lg"
            data-spacing-inset-variation="stretched"
          >
            Stretched
          </div>
        </div>
      </div>

      <div>
        <h4 className="spacing-demo-subheading">Border Radius</h4>
        <p className="spacing-demo-label">
          Use <code>data-spacing-border-radius</code> attribute
        </p>
        <div className="spacing-demo-row">
          <div
            className="spacing-demo-border-none"
            data-spacing-border-radius="none"
          >
            None
          </div>
          <div
            className="spacing-demo-border-rounded"
            data-spacing-border-radius="rounded"
          >
            Rounded
          </div>
          <div
            className="spacing-demo-border-pill"
            data-spacing-border-radius="pill"
          >
            Pill
          </div>
        </div>
      </div>

      <div>
        <h4 className="spacing-demo-subheading">Complete Example</h4>
        <p className="spacing-demo-label">
          Building a card using data attributes
        </p>
        <div
          className="spacing-demo-card"
          data-spacing-inset-size="lg"
          data-spacing-inset-variation="squared"
          data-spacing-border-radius="rounded"
        >
          <div className="spacing-demo-card-content" data-spacing-stack="md">
            <h4 className="spacing-demo-card-title">Data Attribute Card</h4>
            <p className="spacing-demo-card-text">
              This card is built entirely using data attributes instead of
              utility classes, providing a cleaner API for dynamic UIs.
            </p>
            <div className="spacing-demo-card-actions" data-spacing-inline="sm">
              <button
                className="spacing-demo-button-primary"
                data-spacing-inset-size="sm"
                data-spacing-inset-variation="squished"
                data-spacing-border-radius="rounded"
              >
                Primary
              </button>
              <button
                className="spacing-demo-button-secondary"
                data-spacing-inset-size="sm"
                data-spacing-inset-variation="squished"
                data-spacing-border-radius="rounded"
              >
                Secondary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const SelectableSpace: Story = {
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
    const proportions = ['squished', 'squared', 'stretched'] as const

    return (
      <div className="spacing-demo-selectable-container">
        <div>
          <h3 className="spacing-demo-heading">Selectable Space Utilities</h3>
          <p className="spacing-demo-text">
            Selectable space utilities provide padding that responds to density,
            selectable space size, and space proportions. Requires both{' '}
            <code>data-selectable-space</code> and{' '}
            <code>data-space-proportions</code> attributes.
          </p>
        </div>

        {sizes.map((size) => (
          <div key={size} className="spacing-demo-selectable-section">
            <h4 className="spacing-demo-subheading">
              Size: <strong>{size.toUpperCase()}</strong>
            </h4>
            <div className="spacing-demo-selectable-row">
              {proportions.map((proportion) => (
                <div
                  key={`${size}-${proportion}`}
                  className="spacing-demo-selectable-item"
                >
                  <p className="spacing-demo-label">
                    <strong>
                      {proportion.charAt(0).toUpperCase() + proportion.slice(1)}
                    </strong>
                    <br />
                    <code>
                      data-selectable-space="{size}"
                      <br />
                      data-space-proportions="{proportion}"
                    </code>
                  </p>
                  <div
                    data-selectable-space={size}
                    data-space-proportions={proportion}
                    className="selectable-padding spacing-demo-selectable-box"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
}

export const SelectableSpaceDensityComparison: Story = {
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
    const proportions = ['squished', 'squared', 'stretched'] as const
    const densities = ['spacious', 'comfortable'] as const

    return (
      <div className="spacing-demo-selectable-container">
        <div>
          <h3 className="spacing-demo-heading">
            Selectable Space with Density Modes
          </h3>
          <p className="spacing-demo-text">
            Selectable space adapts to density modes (spacious/comfortable) set
            via the <code>data-density</code> attribute.
          </p>
        </div>

        {densities.map((density) => (
          <div key={density} className="spacing-demo-density-section">
            <h3 className="spacing-demo-heading">
              {density.charAt(0).toUpperCase() + density.slice(1)} Mode
            </h3>
            <div
              className="spacing-demo-density-container"
              data-density={density}
            >
              {sizes.map((size) => (
                <div key={size} className="spacing-demo-selectable-section">
                  <h4 className="spacing-demo-subheading">
                    Size: <strong>{size.toUpperCase()}</strong>
                  </h4>
                  <div className="spacing-demo-selectable-row">
                    {proportions.map((proportion) => (
                      <div
                        key={`${density}-${size}-${proportion}`}
                        className="spacing-demo-selectable-item"
                      >
                        <p className="spacing-demo-label">
                          <strong>
                            {proportion.charAt(0).toUpperCase() +
                              proportion.slice(1)}
                          </strong>
                        </p>
                        <div
                          data-selectable-space={size}
                          data-space-proportions={proportion}
                          className="selectable-padding spacing-demo-selectable-box"
                        >
                          {size}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
}

export const Examples: Story = {
  render: () => (
    <div className="spacing-demo-container">
      <div>
        <h3 className="spacing-demo-heading">Button Group</h3>
        <div className="spacing-demo-flex spacing-inline-sm">
          <button className="spacing-inset-sm-squished spacing-border-radius-rounded spacing-demo-button-primary">
            Save
          </button>
          <button className="spacing-inset-sm-squished spacing-border-radius-rounded spacing-demo-button-secondary">
            Cancel
          </button>
        </div>
      </div>

      <div>
        <h3 className="spacing-demo-heading">Card with Content</h3>
        <div className="spacing-inset-lg-squared spacing-border-radius-rounded spacing-demo-card">
          <div className="spacing-stack-md spacing-demo-card-content">
            <h4 className="spacing-demo-card-title">Card Title</h4>
            <p className="spacing-demo-card-text">
              This card demonstrates proper spacing using the EDS spacing
              system.
            </p>
            <div className="spacing-inline-sm spacing-demo-card-actions">
              <button className="spacing-inset-sm-squished spacing-border-radius-rounded spacing-demo-button-primary">
                Action
              </button>
              <button className="spacing-inset-sm-squished spacing-border-radius-rounded spacing-demo-button-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="spacing-demo-heading">Form Layout</h3>
        <div className="spacing-stack-md spacing-demo-form">
          <div className="spacing-stack-2xs spacing-demo-form-field">
            <label htmlFor="name" className="spacing-demo-form-label">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="spacing-inset-sm-squished spacing-border-radius-rounded spacing-demo-form-input"
              placeholder="Enter your name"
            />
          </div>

          <div className="spacing-stack-2xs spacing-demo-form-field">
            <label htmlFor="email" className="spacing-demo-form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="spacing-inset-sm-squished spacing-border-radius-rounded spacing-demo-form-input"
              placeholder="Enter your email"
            />
          </div>

          <button className="spacing-inset-sm-squared spacing-border-radius-rounded spacing-demo-form-submit">
            Submit
          </button>
        </div>
      </div>

      <div>
        <h3 className="spacing-demo-heading">Navigation List</h3>
        <nav className="spacing-inset-xs-squared spacing-demo-nav">
          <ul className="spacing-stack-3xs spacing-demo-nav-list">
            <li>
              <a href="#home" className="spacing-demo-nav-item">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="spacing-demo-nav-item">
                About
              </a>
            </li>
            <li>
              <a href="#services" className="spacing-demo-nav-item">
                Services
              </a>
            </li>
            <li>
              <a href="#contact" className="spacing-demo-nav-item">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  ),
}
