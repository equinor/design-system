import { StoryFn, Meta } from '@storybook/react-vite'
import { save, add, warning_filled, info_circle } from '@equinor/eds-icons'
import { Icon, IconProps } from '.'

const meta: Meta<typeof Icon> = {
  title: 'EDS 2.0 (beta)/Icon',
  component: Icon,
  tags: ['beta'],
  argTypes: {
    color: {
      control: 'color',
    },
    size: {
      control: 'select',
      options: [
        undefined,
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        '6xl',
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
**⚠️ Beta Component** - This component is under active development and may have breaking changes.

\`\`\`bash
npm install @equinor/eds-core-react@beta
\`\`\`

\`\`\`tsx
import { Icon } from '@equinor/eds-core-react/next'
import { save } from '@equinor/eds-icons'

<Icon data={save} />
\`\`\`

## Sizing Priority

1. **Explicit \`size\` prop** - Highest priority, uses \`--eds-sizing-icon-{size}\` tokens
2. **Parent's \`data-font-size\`** - Inherits \`--eds-typography-icon-size\` from parent
3. **Dynamic fallback** - Uses \`1.5em\` for automatic scaling with font-size

## Key Features

- **Token-based sizing** - Uses EDS design tokens for consistent sizing
- **Automatic sizing** - Scales with parent's \`data-font-size\` attribute
- **Dynamic fallback** - Scales with font-size (1.5em) when no tokens are set
- **Accessible** - WCAG 2.1 AA compliant with proper ARIA attributes
        `,
      },
    },
  },
}

export default meta

export const Introduction: StoryFn<IconProps> = (args) => {
  return <Icon {...args} />
}
Introduction.args = {
  data: save,
  title: 'Save document',
  size: 'md',
}

export const ExplicitSizes: StoryFn<IconProps> = () => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <Icon data={save} size="xs" />
      <p style={{ fontSize: '12px', margin: '4px 0 0' }}>xs (16px)</p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Icon data={save} size="sm" />
      <p style={{ fontSize: '12px', margin: '4px 0 0' }}>sm (18px)</p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Icon data={save} size="md" />
      <p style={{ fontSize: '12px', margin: '4px 0 0' }}>md (20px)</p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Icon data={save} size="lg" />
      <p style={{ fontSize: '12px', margin: '4px 0 0' }}>lg (24px)</p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Icon data={save} size="xl" />
      <p style={{ fontSize: '12px', margin: '4px 0 0' }}>xl (28px)</p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Icon data={save} size="2xl" />
      <p style={{ fontSize: '12px', margin: '4px 0 0' }}>2xl (32px)</p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Icon data={save} size="3xl" />
      <p style={{ fontSize: '12px', margin: '4px 0 0' }}>3xl (37px)</p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Icon data={save} size="4xl" />
      <p style={{ fontSize: '12px', margin: '4px 0 0' }}>4xl (42px)</p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Icon data={save} size="5xl" />
      <p style={{ fontSize: '12px', margin: '4px 0 0' }}>5xl (48px)</p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Icon data={save} size="6xl" />
      <p style={{ fontSize: '12px', margin: '4px 0 0' }}>6xl (56px)</p>
    </div>
  </div>
)
ExplicitSizes.parameters = {
  docs: {
    description: {
      story: `
Use the \`size\` prop for explicit sizing. Maps to \`--eds-sizing-icon-{size}\` tokens.

| Size | Default (token) | Default (px) | Compact (token) | Compact (px) |
|------|-----------------|--------------|-----------------|--------------|
| xs   | 1rem            | 16px         | 0.875rem        | 14px         |
| sm   | 1.125rem        | 18px         | 1rem            | 16px         |
| md   | 1.25rem         | 20px         | 1.125rem        | 18px         |
| lg   | 1.5rem          | 24px         | 1.25rem         | 20px         |
| xl   | 1.75rem         | 28px         | 1.5rem          | 24px         |
| 2xl  | 2rem            | 32px         | 1.75rem         | 28px         |
| 3xl  | 2.313rem        | 37px         | 2rem            | 32px         |
| 4xl  | 2.625rem        | 42px         | 2.313rem        | 37px         |
| 5xl  | 3rem            | 48px         | 2.625rem        | 42px         |
| 6xl  | 3.5rem          | 56px         | 3rem            | 48px         |
      `,
    },
  },
}

export const AutoSizeFromDataFontSize: StoryFn<IconProps> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div
      data-font-size="xs"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(0,0,0,0.05)',
        padding: '8px',
      }}
    >
      <Icon data={warning_filled} color="orange" />
      <span>data-font-size="xs" - icon auto-sizes to match</span>
    </div>
    <div
      data-font-size="sm"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(0,0,0,0.05)',
        padding: '8px',
      }}
    >
      <Icon data={warning_filled} color="orange" />
      <span>data-font-size="sm" - icon auto-sizes to match</span>
    </div>
    <div
      data-font-size="md"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(0,0,0,0.05)',
        padding: '8px',
      }}
    >
      <Icon data={warning_filled} color="orange" />
      <span>data-font-size="md" - icon auto-sizes to match</span>
    </div>
    <div
      data-font-size="lg"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(0,0,0,0.05)',
        padding: '8px',
      }}
    >
      <Icon data={warning_filled} color="orange" />
      <span>data-font-size="lg" - icon auto-sizes to match</span>
    </div>
    <div
      data-font-size="xl"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(0,0,0,0.05)',
        padding: '8px',
      }}
    >
      <Icon data={warning_filled} color="orange" />
      <span>data-font-size="xl" - icon auto-sizes to match</span>
    </div>
    <div
      data-font-size="2xl"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(0,0,0,0.05)',
        padding: '8px',
      }}
    >
      <Icon data={warning_filled} color="orange" />
      <span>data-font-size="2xl" - icon auto-sizes to match</span>
    </div>
  </div>
)
AutoSizeFromDataFontSize.parameters = {
  docs: {
    description: {
      story: `
Icons automatically inherit size from parent's \`data-font-size\` attribute via the \`--eds-typography-icon-size\` CSS variable.
This is the recommended approach when using icons inline with text in EDS components.
      `,
    },
  },
}

export const DensityModes: StoryFn<IconProps> = () => (
  <div style={{ display: 'flex', gap: '48px' }}>
    <div data-density="spacious">
      <h4 style={{ margin: '0 0 16px' }}>Spacious (default)</h4>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Icon data={save} size="sm" />
          <p style={{ fontSize: '12px', margin: '4px 0 0' }}>sm (18px)</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Icon data={save} size="md" />
          <p style={{ fontSize: '12px', margin: '4px 0 0' }}>md (20px)</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Icon data={save} size="lg" />
          <p style={{ fontSize: '12px', margin: '4px 0 0' }}>lg (24px)</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Icon data={save} size="xl" />
          <p style={{ fontSize: '12px', margin: '4px 0 0' }}>xl (28px)</p>
        </div>
      </div>
    </div>
    <div data-density="comfortable">
      <h4 style={{ margin: '0 0 16px' }}>Comfortable (compact)</h4>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Icon data={save} size="sm" />
          <p style={{ fontSize: '12px', margin: '4px 0 0' }}>sm (16px)</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Icon data={save} size="md" />
          <p style={{ fontSize: '12px', margin: '4px 0 0' }}>md (18px)</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Icon data={save} size="lg" />
          <p style={{ fontSize: '12px', margin: '4px 0 0' }}>lg (20px)</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Icon data={save} size="xl" />
          <p style={{ fontSize: '12px', margin: '4px 0 0' }}>xl (24px)</p>
        </div>
      </div>
    </div>
  </div>
)
DensityModes.parameters = {
  docs: {
    description: {
      story: `
Icons respect the \`data-density\` attribute for density-aware sizing. The same \`size\` prop renders differently based on the density context.

- **Spacious** (default): Larger icons for more breathing room
- **Comfortable**: Smaller icons for compact UIs

This is controlled by CSS custom properties (\`--eds-sizing-icon-{size}\`) that change based on the density mode.
      `,
    },
  },
}

export const DynamicFallback: StoryFn<IconProps> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <p style={{ fontSize: '14px', margin: 0 }}>
      <Icon data={info_circle} /> 14px font-size → ~21px icon (1.5em)
    </p>
    <p style={{ fontSize: '16px', margin: 0 }}>
      <Icon data={info_circle} /> 16px font-size → 24px icon (1.5em)
    </p>
    <p style={{ fontSize: '20px', margin: 0 }}>
      <Icon data={info_circle} /> 20px font-size → 30px icon (1.5em)
    </p>
    <p style={{ fontSize: '24px', margin: 0 }}>
      <Icon data={info_circle} /> 24px font-size → 36px icon (1.5em)
    </p>
    <p style={{ fontSize: '32px', margin: 0 }}>
      <Icon data={info_circle} /> 32px font-size → 48px icon (1.5em)
    </p>
  </div>
)
DynamicFallback.parameters = {
  docs: {
    description: {
      story: `
When no \`size\` prop or \`data-font-size\` is set, icons use \`1.5em\` for dynamic scaling.
This means icons are always 1.5x the surrounding font-size.
      `,
    },
  },
}

export const Color: StoryFn<IconProps> = () => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <Icon data={save} size="lg" color="red" />
    <Icon data={save} size="lg" color="green" />
    <Icon data={save} size="lg" color="blue" />
    <Icon data={save} size="lg" color="currentColor" />
  </div>
)
Color.parameters = {
  docs: {
    description: {
      story:
        'Icons inherit `currentColor` by default, making them adapt to text color automatically.',
    },
  },
}

export const Accessibility: StoryFn<IconProps> = () => (
  <div style={{ display: 'flex', gap: '32px' }}>
    <div>
      <p>
        <strong>Decorative</strong> (hidden from screen readers):
      </p>
      <Icon data={save} size="lg" />
      <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '8px' }}>
        {'<Icon data={save} />'}
      </pre>
    </div>
    <div>
      <p>
        <strong>Semantic</strong> (announced by screen readers):
      </p>
      <Icon data={save} size="lg" title="Save document" />
      <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '8px' }}>
        {'<Icon data={save} title="Save document" />'}
      </pre>
    </div>
  </div>
)
Accessibility.parameters = {
  docs: {
    description: {
      story:
        'Icons without a `title` prop are decorative (`aria-hidden`). Icons with a `title` prop are semantic (`role="img"`).',
    },
  },
}

export const InlineWithText: StoryFn<IconProps> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div>
      <h4 style={{ margin: '0 0 8px' }}>Inline text (no size prop)</h4>
      <p style={{ background: 'rgba(0,0,0,0.05)', padding: '8px', margin: 0 }}>
        Click <Icon data={save} /> to save or <Icon data={add} /> to add a new
        item
      </p>
      <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0' }}>
        Negative margins align icon with text baseline
      </p>
    </div>
    <div>
      <h4 style={{ margin: '0 0 8px' }}>Flex layout (with size prop)</h4>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0,0,0,0.05)',
          padding: '8px',
        }}
      >
        <Icon data={add} size="md" />
        <span>Add new item</span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0,0,0,0.05)',
          padding: '8px',
          marginTop: '4px',
        }}
      >
        <span>Save changes</span>
        <Icon data={save} size="md" />
      </div>
      <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0' }}>
        No margins when using size prop - layout controlled by flex gap
      </p>
    </div>
  </div>
)
InlineWithText.parameters = {
  docs: {
    description: {
      story: `
**Best practice for icon usage:**

| Context | Usage | Why |
|---------|-------|-----|
| Inline text | \`<Icon data={save} />\` | Auto-sizes to 1.5em, negative margins for optical alignment |
| Flex/Button | \`<Icon data={save} size="md" />\` | Fixed size from tokens, no margins (layout via flex gap) |

The \`size\` prop removes negative margins, giving full control to your layout system.
      `,
    },
  },
}
