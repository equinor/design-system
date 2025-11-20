import type { Meta, StoryObj } from '@storybook/react-vite'
import './Spacing.stories.css'

const meta: Meta = {
  title: 'Foundation/Spacing',
  parameters: {
    docs: {
      description: {
        component: `

The Equinor Design System provides a comprehensive spacing system using CSS custom properties (variables) controlled by data attributes.

## Spacing Concepts

### Selectable Space

Padding for interactive elements like buttons. Uses \`--eds-selectable-space-horizontal\` and \`--eds-selectable-space-vertical\`.

**Controlled by:**
- \`data-selectable-space\`: xs, sm, md, lg, xl (default: xs)
- \`data-space-proportions\`: squished, squared, stretched (default: squared)
- \`data-density\`: spacious, comfortable (default: spacious)

\`\`\`css
.my-button {
  padding: var(--eds-selectable-space-vertical) var(--eds-selectable-space-horizontal);
}
\`\`\`

\`\`\`html
<div data-selectable-space="md" data-space-proportions="squished">
  <button class="my-button">Button</button>
</div>
\`\`\`

### Container Space

Padding for container elements. Uses \`--eds-container-space-horizontal\` and \`--eds-container-space-vertical\`.

**Controlled by:**
- \`data-space-proportions\`: squished, squared, stretched (default: squared)

Fixed at md size (1rem horizontal in spacious mode).

\`\`\`css
.my-container {
  padding: var(--eds-container-space-vertical) var(--eds-container-space-horizontal);
}
\`\`\`

### Page Space

Padding for page-level elements. Uses \`--eds-page-space-horizontal\` and \`--eds-page-space-vertical\`.

**Controlled by:**
- \`data-space-proportions\`: squished, squared, stretched (default: squared)

Fixed at xl size (1.5rem horizontal in spacious mode).

\`\`\`css
.my-page {
  padding: var(--eds-page-space-vertical) var(--eds-page-space-horizontal);
}
\`\`\`

### Generic Gap

Flexible gap spacing for layout containers. Uses \`--eds-generic-gap-horizontal\` and \`--eds-generic-gap-vertical\`.

**Controlled by:**
- \`data-horizontal-gap\`: none, 4xs, 3xs, 2xs, xs, sm, md, lg, xl, 2xl, 3xl (default: xs)
- \`data-vertical-gap\`: none, 4xs, 3xs, 2xs, xs, sm, md, lg, xl, 2xl, 3xl (default: xs)

\`\`\`css
.my-flex-container {
  display: flex;
  gap: var(--eds-generic-gap-vertical) var(--eds-generic-gap-horizontal);
}
\`\`\`

### Generic Space

Flexible padding/margin spacing. Uses \`--eds-generic-space-horizontal\` and \`--eds-generic-space-vertical\`.

**Controlled by:**
- \`data-horizontal-space\`: none, 4xs, 3xs, 2xs, xs, sm, md, lg, xl, 2xl, 3xl (default: xs)
- \`data-vertical-space\`: none, 4xs, 3xs, 2xs, xs, sm, md, lg, xl, 2xl, 3xl (default: xs)

\`\`\`css
.my-element {
  padding: var(--eds-generic-space-vertical) var(--eds-generic-space-horizontal);
}
\`\`\`

### Fixed Gap Variables

Pre-configured gap values for common use cases:

- \`--eds-selectable-gap-horizontal/vertical\`: xs spacing (0.5rem)
- \`--eds-container-gap-horizontal/vertical\`: md spacing (1rem)
- \`--eds-page-gap-horizontal/vertical\`: xl spacing (1.5rem)

\`\`\`css
.button-group {
  display: flex;
  gap: var(--eds-selectable-gap-vertical) var(--eds-selectable-gap-horizontal);
}
\`\`\`
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj

export const SelectableSpace: Story = {
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
    const proportions = ['squished', 'squared', 'stretched'] as const
    const densities = ['spacious', 'comfortable'] as const

    return (
      <div>
        <h2>Selectable Space</h2>
        <p>
          Padding that responds to size, proportions, and density. Use for
          interactive elements like buttons and inputs.
        </p>

        {densities.map((density) => (
          <div key={density} className="spacing-demo-section">
            <h3>Density: {density}</h3>
            <div data-density={density}>
              {sizes.map((size) => (
                <div key={size} className="spacing-demo-container">
                  <h4>Size: {size.toUpperCase()}</h4>
                  <div className="spacing-demo-row">
                    {proportions.map((proportion) => (
                      <div key={proportion} className="spacing-demo-item">
                        <div className="spacing-demo-label">{proportion}</div>
                        <div
                          data-selectable-space={size}
                          data-space-proportions={proportion}
                        >
                          <div className="spacing-demo-box selectable-space-box">
                            Content
                          </div>
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

export const ContainerSpace: Story = {
  render: () => {
    const proportions = ['squished', 'squared', 'stretched'] as const

    return (
      <div>
        <h2>Container Space</h2>
        <p>
          Fixed md-sized padding that responds to proportions. Use for general
          containers.
        </p>

        <div className="spacing-demo-section">
          <div className="spacing-demo-row">
            {proportions.map((proportion) => (
              <div data-space-proportions={proportion} key={proportion}>
                <div className="spacing-demo-item">
                  <div className="spacing-demo-label">{proportion}</div>
                  <div className="spacing-demo-box container-space-box">
                    Container
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <details style={{ marginTop: '2rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
            View CSS Example
          </summary>
          <pre
            style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
            }}
          >
            {`.my-container {
  padding: var(--eds-container-space-vertical) var(--eds-container-space-horizontal);
}

<div data-space-proportions="squished">
  <div class="my-container">Content</div>
</div>`}
          </pre>
        </details>
      </div>
    )
  },
}

export const PageSpace: Story = {
  render: () => {
    const proportions = ['squished', 'squared', 'stretched'] as const

    return (
      <div>
        <h2>Page Space</h2>
        <p>
          Fixed xl-sized padding that responds to proportions. Use for
          page-level layouts.
        </p>

        <div className="spacing-demo-section">
          <div className="spacing-demo-row">
            {proportions.map((proportion) => (
              <div
                key={proportion}
                className="spacing-demo-item"
                data-space-proportions={proportion}
              >
                <div className="spacing-demo-label">{proportion}</div>
                <div className="spacing-demo-box page-space-box">Page</div>
              </div>
            ))}
          </div>
        </div>

        <details style={{ marginTop: '2rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
            View CSS Example
          </summary>
          <pre
            style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
            }}
          >
            {`.my-page {
  padding: var(--eds-page-space-vertical) var(--eds-page-space-horizontal);
}

<div data-space-proportions="squared">
  <main class="my-page">Page content</main>
</div>`}
          </pre>
        </details>
      </div>
    )
  },
}

export const GenericGap: Story = {
  render: () => {
    const sizes = [
      'none',
      '4xs',
      '3xs',
      '2xs',
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
    ] as const

    return (
      <div>
        <h2>Generic Gap</h2>
        <p>
          Flexible gap spacing controlled by data attributes. Use for layout
          containers with CSS gap property.
        </p>

        <div className="spacing-demo-section">
          <h3>Horizontal Gap</h3>
          <div className="spacing-demo-container">
            {sizes.map((size) => (
              <div key={size} className="spacing-demo-item">
                <div className="spacing-demo-label">
                  data-horizontal-gap=&quot;{size}&quot;
                </div>
                <div
                  data-horizontal-gap={size}
                  className="generic-gap-horizontal"
                >
                  <div className="spacing-demo-small-box">A</div>
                  <div className="spacing-demo-small-box">B</div>
                  <div className="spacing-demo-small-box">C</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="spacing-demo-section">
          <h3>Vertical Gap</h3>
          <div className="spacing-demo-row">
            {['none', 'xs', 'md', 'xl', '3xl'].map((size) => (
              <div key={size} className="spacing-demo-item">
                <div className="spacing-demo-label">
                  data-vertical-gap=&quot;{size}&quot;
                </div>
                <div data-vertical-gap={size} className="generic-gap-vertical">
                  <div className="spacing-demo-small-box">A</div>
                  <div className="spacing-demo-small-box">B</div>
                  <div className="spacing-demo-small-box">C</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <details style={{ marginTop: '2rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
            View CSS Example
          </summary>
          <pre
            style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
            }}
          >
            {`.my-flex-container {
  display: flex;
  gap: var(--eds-generic-gap-vertical) var(--eds-generic-gap-horizontal);
}

<div data-horizontal-gap="md" data-vertical-gap="lg">
  <div class="my-flex-container">
    <div>Item 1</div>
    <div>Item 2</div>
  </div>
</div>`}
          </pre>
        </details>
      </div>
    )
  },
}

export const GenericSpace: Story = {
  render: () => {
    const sizes = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const

    return (
      <div>
        <h2>Generic Space</h2>
        <p>
          Flexible padding/margin spacing controlled by data attributes. Use for
          custom spacing needs.
        </p>

        <div className="spacing-demo-section">
          <h3>Horizontal Space</h3>
          <div className="spacing-demo-container">
            {sizes.map((size) => (
              <div key={size} className="spacing-demo-item">
                <div className="spacing-demo-label">
                  data-horizontal-space=&quot;{size}&quot;
                </div>
                <div data-horizontal-space={size}>
                  <div className="spacing-demo-box generic-space-horizontal">
                    Content
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="spacing-demo-section">
          <h3>Vertical Space</h3>
          <div className="spacing-demo-row">
            {['none', 'xs', 'md', 'xl'].map((size) => (
              <div key={size} className="spacing-demo-item">
                <div className="spacing-demo-label">
                  data-vertical-space=&quot;{size}&quot;
                </div>
                <div data-vertical-space={size}>
                  <div className="spacing-demo-box generic-space-vertical">
                    Content
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <details style={{ marginTop: '2rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
            View CSS Example
          </summary>
          <pre
            style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
            }}
          >
            {`.my-element {
  padding: var(--eds-generic-space-vertical) var(--eds-generic-space-horizontal);
}

<div data-horizontal-space="lg" data-vertical-space="md">
  <div class="my-element">Content</div>
</div>`}
          </pre>
        </details>
      </div>
    )
  },
}

export const FixedGapVariables: Story = {
  render: () => (
    <div>
      <h2>Fixed Gap Variables</h2>
      <p>
        Pre-configured gap values for common use cases. These are fixed values
        and don&apos;t require data attributes.
      </p>

      <div className="spacing-demo-section">
        <h3>Selectable Gap (xs = 0.5rem)</h3>
        <p>Use for groups of buttons or interactive elements.</p>
        <div className="selectable-gap-example">
          <div className="spacing-demo-small-box">Button 1</div>
          <div className="spacing-demo-small-box">Button 2</div>
          <div className="spacing-demo-small-box">Button 3</div>
          <div className="spacing-demo-small-box">Button 4</div>
        </div>
        <details style={{ marginTop: '1rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
            View CSS
          </summary>
          <pre
            style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            {`.button-group {
  display: flex;
  gap: var(--eds-selectable-gap-vertical) var(--eds-selectable-gap-horizontal);
}`}
          </pre>
        </details>
      </div>

      <div className="spacing-demo-section">
        <h3>Container Gap (md = 1rem)</h3>
        <p>Use for general container layouts.</p>
        <div className="container-gap-example">
          <div className="spacing-demo-box">Section 1</div>
          <div className="spacing-demo-box">Section 2</div>
          <div className="spacing-demo-box">Section 3</div>
        </div>
        <details style={{ marginTop: '1rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
            View CSS
          </summary>
          <pre
            style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            {`.container-layout {
  display: flex;
  flex-direction: column;
  gap: var(--eds-container-gap-vertical) var(--eds-container-gap-horizontal);
}`}
          </pre>
        </details>
      </div>

      <div className="spacing-demo-section">
        <h3>Page Gap (xl = 1.5rem)</h3>
        <p>Use for page-level layouts with larger spacing.</p>
        <div className="page-gap-example">
          <div className="spacing-demo-box">Page Section 1</div>
          <div className="spacing-demo-box">Page Section 2</div>
          <div className="spacing-demo-box">Page Section 3</div>
        </div>
        <details style={{ marginTop: '1rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
            View CSS
          </summary>
          <pre
            style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            {`.page-layout {
  display: flex;
  flex-direction: column;
  gap: var(--eds-page-gap-vertical) var(--eds-page-gap-horizontal);
}`}
          </pre>
        </details>
      </div>
    </div>
  ),
}

export const PracticalExample: Story = {
  render: () => (
    <div>
      <h2>Practical Example: Button with Card Layout</h2>
      <p>
        Combining different spacing concepts for a complete component example.
      </p>

      <div
        data-space-proportions="squared"
        style={{
          maxWidth: '600px',
          backgroundColor: 'var(--eds-color-bg-neutral-surface)',
          border: '1px solid var(--eds-color-border-neutral-medium)',
          borderRadius: '4px',
        }}
      >
        <div
          style={{
            padding:
              'var(--eds-container-space-vertical) var(--eds-container-space-horizontal)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--eds-container-gap-vertical) var(--eds-container-gap-horizontal)',
          }}
        >
          <div>
            <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Card Title</h3>
            <p
              style={{
                margin: 0,
                color: 'var(--eds-color-text-neutral-subtle)',
              }}
            >
              This card uses container space for padding and container gap for
              vertical spacing between elements.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 'var(--eds-selectable-gap-vertical) var(--eds-selectable-gap-horizontal)',
            }}
            data-selectable-space="md"
            data-space-proportions="squished"
          >
            <button
              style={{
                padding:
                  'var(--eds-selectable-space-vertical) var(--eds-selectable-space-horizontal)',
                backgroundColor:
                  'var(--eds-color-bg-accent-fill-emphasis-default)',
                color: 'var(--eds-color-text-accent-strong-on-emphasis)',
                border: '1px solid var(--eds-color-border-accent-strong)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Primary Action
            </button>
            <button
              style={{
                padding:
                  'var(--eds-selectable-space-vertical) var(--eds-selectable-space-horizontal)',
                backgroundColor: 'var(--eds-color-bg-neutral-surface)',
                color: 'var(--eds-color-text-neutral-strong)',
                border: '1px solid var(--eds-color-border-neutral-medium)',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <details style={{ marginTop: '2rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
          View Complete Code
        </summary>
        <pre
          style={{
            background: '#f5f5f5',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`<div data-space-proportions="squared" class="card">
  <div class="card-content">
    <div>
      <h3>Card Title</h3>
      <p>Description text</p>
    </div>
    
    <div class="button-group" data-selectable-space="md" data-space-proportions="squished">
      <button class="primary-button">Primary Action</button>
      <button class="secondary-button">Cancel</button>
    </div>
  </div>
</div>

<style>
.card-content {
  padding: var(--eds-container-space-vertical) var(--eds-container-space-horizontal);
  display: flex;
  flex-direction: column;
  gap: var(--eds-container-gap-vertical) var(--eds-container-gap-horizontal);
}

.button-group {
  display: flex;
  gap: var(--eds-selectable-gap-vertical) var(--eds-selectable-gap-horizontal);
}

.primary-button,
.secondary-button {
  padding: var(--eds-selectable-space-vertical) var(--eds-selectable-space-horizontal);
}
</style>`}
        </pre>
      </details>
    </div>
  ),
}
