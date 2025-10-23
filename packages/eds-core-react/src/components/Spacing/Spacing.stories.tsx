import type { Meta, StoryObj } from '@storybook/react-vite'
import '../src/components/Typography/spacing.css'
import './Spacing.stories.css'

const meta: Meta = {
  title: 'Design Tokens/Spacing',
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
* **Spacious**: Larger spacing values for comfortable, accessible interfaces
* **Comfortable**: Compact spacing values for information-dense layouts

The density mode can be controlled via the \`data-density\` attribute on a parent element.

## Usage

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
      <h3 className="spacing-demo-heading">Inline Spacing (Horizontal Gap)</h3>

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
