import type { Meta, StoryObj } from '@storybook/react-vite'
import './Spacing.stories.css'

const meta: Meta = {
  title: 'Foundation/Spacing',
  parameters: {
    docs: {
      description: {
        component: `

The Equinor Design System provides a simplified spacing utility system focused on practical use cases.

## Utility Classes

### Selectable Padding

Padding utilities for interactive elements like buttons, cards, and other selectable items:

* **\`.selectable-p\`** or **\`[data-selectable-padding]\`**: Applies both horizontal and vertical padding
* **\`.selectable-px\`**: Horizontal padding only
* **\`.selectable-py\`**: Vertical padding only

These padding utilities respond to:
- Density mode (\`data-density\`: spacious/comfortable)
- Selectable space size (\`data-selectable-space\`: xs/sm/md/lg/xl)
- Space proportions (\`data-space-proportions\`: squished/squared/stretched)

### Gap Utilities

Gap spacing for layout containers:

* **\`.selectable-gap\`**: For groups of selectable items (uses xs spacing)
* **\`.container-gap\`**: For general container layouts (uses md spacing)
* **\`.page-gap\`**: For page-level layouts (uses xl spacing)

Each gap utility also has directional variants:
- \`*-x\`: Horizontal gap only
- \`*-y\`: Vertical gap only

## Usage Examples

### Selectable Padding with Data Attributes

\`\`\`tsx
<button
  className="selectable-p"
  data-selectable-space="md"
  data-space-proportions="squished"
>
  Click me
</button>
\`\`\`

### Gap Utilities

\`\`\`tsx
<div className="selectable-gap" style={{ display: 'flex' }}>
  <button>Button 1</button>
  <button>Button 2</button>
</div>

<div className="container-gap" style={{ display: 'flex' }}>
  <div>Section 1</div>
  <div>Section 2</div>
</div>
\`\`\`

### Density Control

\`\`\`tsx
<div data-density="comfortable">
  <button className="selectable-p" data-selectable-space="md">
    Compact Button
  </button>
</div>
\`\`\`
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj

export const SelectablePadding: Story = {
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
    const proportions = ['squished', 'squared', 'stretched'] as const

    return (
      <div className="font-ui spacing-demo-selectable-container">
        <div>
          <h3 className="spacing-demo-heading">Selectable Padding</h3>
          <p className="spacing-demo-text">
            The <code>.selectable-p</code> utility provides padding that
            responds to density, selectable space size, and space proportions.
            Requires both <code>data-selectable-space</code> and{' '}
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
                      data-selectable-space=&quot;{size}&quot;
                      <br />
                      data-space-proportions=&quot;{proportion}&quot;
                    </code>
                  </p>
                  <div
                    data-selectable-space={size}
                    data-space-proportions={proportion}
                    className="selectable-p spacing-demo-selectable-box"
                  >
                    {size}
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

export const DensityModes: Story = {
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
    const proportions = ['squished', 'squared', 'stretched'] as const
    const densities = ['spacious', 'comfortable'] as const

    return (
      <div className="font-ui spacing-demo-selectable-container">
        <div>
          <h3 className="spacing-demo-heading">Density Modes</h3>
          <p className="spacing-demo-text">
            Selectable padding adapts to density modes (spacious/comfortable)
            set via the <code>data-density</code> attribute on a parent element.
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
                          className="selectable-p spacing-demo-selectable-box"
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

export const GapUtilities: Story = {
  render: () => (
    <div className="font-ui spacing-demo-container">
      <div>
        <h3 className="spacing-demo-heading">Selectable Gap</h3>
        <p className="spacing-demo-text">
          Use <code>.selectable-gap</code> for groups of selectable items like
          buttons. Uses xs spacing.
        </p>
        <div
          className="selectable-gap"
          style={{ display: 'flex', flexWrap: 'wrap' }}
        >
          <button
            className="selectable-p spacing-demo-button-primary"
            data-selectable-space="sm"
            data-space-proportions="squished"
          >
            Button 1
          </button>
          <button
            className="selectable-p spacing-demo-button-primary"
            data-selectable-space="sm"
            data-space-proportions="squished"
          >
            Button 2
          </button>
          <button
            className="selectable-p spacing-demo-button-primary"
            data-selectable-space="sm"
            data-space-proportions="squished"
          >
            Button 3
          </button>
        </div>
      </div>

      <div>
        <h3 className="spacing-demo-heading">Container Gap</h3>
        <p className="spacing-demo-text">
          Use <code>.container-gap</code> for general container layouts. Uses md
          spacing.
        </p>
        <div
          className="container-gap"
          style={{ display: 'flex', flexWrap: 'wrap' }}
        >
          <div
            className="selectable-p spacing-demo-card"
            data-selectable-space="md"
            data-space-proportions="squared"
            style={{ minWidth: '200px' }}
          >
            <div className="spacing-demo-card-title">Card 1</div>
            <div className="spacing-demo-card-text">Container content</div>
          </div>
          <div
            className="selectable-p spacing-demo-card"
            data-selectable-space="md"
            data-space-proportions="squared"
            style={{ minWidth: '200px' }}
          >
            <div className="spacing-demo-card-title">Card 2</div>
            <div className="spacing-demo-card-text">Container content</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="spacing-demo-heading">Page Gap</h3>
        <p className="spacing-demo-text">
          Use <code>.page-gap</code> for page-level layouts. Uses xl spacing.
        </p>
        <div
          className="page-gap"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <div
            className="selectable-p spacing-demo-card"
            data-selectable-space="lg"
            data-space-proportions="squared"
          >
            <div className="spacing-demo-card-title">Section 1</div>
            <div className="spacing-demo-card-text">Page-level content</div>
          </div>
          <div
            className="selectable-p spacing-demo-card"
            data-selectable-space="lg"
            data-space-proportions="squared"
          >
            <div className="spacing-demo-card-title">Section 2</div>
            <div className="spacing-demo-card-text">Page-level content</div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const DirectionalGaps: Story = {
  render: () => (
    <div className="font-ui spacing-demo-container">
      <div>
        <h3 className="spacing-demo-heading">Horizontal Gap Only</h3>
        <p className="spacing-demo-text">
          Use the <code>-x</code> suffix for horizontal gap only.
        </p>
        <div
          className="selectable-gap-x"
          style={{ display: 'flex', flexWrap: 'wrap' }}
        >
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
          <div className="spacing-demo-box" />
        </div>
      </div>

      <div>
        <h3 className="spacing-demo-heading">Vertical Gap Only</h3>
        <p className="spacing-demo-text">
          Use the <code>-y</code> suffix for vertical gap only.
        </p>
        <div
          className="container-gap-y"
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 'fit-content',
          }}
        >
          <div
            className="spacing-demo-box-horizontal"
            style={{ width: '200px' }}
          />
          <div
            className="spacing-demo-box-horizontal"
            style={{ width: '200px' }}
          />
          <div
            className="spacing-demo-box-horizontal"
            style={{ width: '200px' }}
          />
        </div>
      </div>
    </div>
  ),
}

export const DirectionalPadding: Story = {
  render: () => (
    <div className="font-ui spacing-demo-container">
      <div>
        <h3 className="spacing-demo-heading">Horizontal Padding Only</h3>
        <p className="spacing-demo-text">
          Use <code>.selectable-px</code> for horizontal padding only.
        </p>
        <div
          className="selectable-px spacing-demo-selectable-box"
          data-selectable-space="lg"
          data-space-proportions="squared"
        >
          Horizontal padding only
        </div>
      </div>

      <div>
        <h3 className="spacing-demo-heading">Vertical Padding Only</h3>
        <p className="spacing-demo-text">
          Use <code>.selectable-py</code> for vertical padding only.
        </p>
        <div
          className="selectable-py spacing-demo-selectable-box"
          data-selectable-space="lg"
          data-space-proportions="squared"
        >
          Vertical padding only
        </div>
      </div>
    </div>
  ),
}

export const PracticalExamples: Story = {
  render: () => (
    <div className="font-ui spacing-demo-container">
      <div>
        <h3 className="spacing-demo-heading">Button Group</h3>
        <div
          className="selectable-gap"
          style={{ display: 'flex', flexWrap: 'wrap' }}
        >
          <button
            className="selectable-p spacing-demo-button-primary"
            data-selectable-space="md"
            data-space-proportions="squished"
          >
            Save
          </button>
          <button
            className="selectable-p spacing-demo-button-secondary"
            data-selectable-space="md"
            data-space-proportions="squished"
          >
            Cancel
          </button>
        </div>
      </div>

      <div>
        <h3 className="spacing-demo-heading">Card with Actions</h3>
        <div
          className="selectable-p spacing-demo-card"
          data-selectable-space="lg"
          data-space-proportions="squared"
          style={{ maxWidth: '400px' }}
        >
          <div
            className="container-gap"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <h4 className="spacing-demo-card-title">Card Title</h4>
            <p className="spacing-demo-card-text">
              This card demonstrates the new spacing utilities with selectable
              padding and gap utilities.
            </p>
            <div className="selectable-gap" style={{ display: 'flex' }}>
              <button
                className="selectable-p spacing-demo-button-primary"
                data-selectable-space="sm"
                data-space-proportions="squished"
              >
                Action
              </button>
              <button
                className="selectable-p spacing-demo-button-secondary"
                data-selectable-space="sm"
                data-space-proportions="squished"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}
