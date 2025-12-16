import { StoryFn, Meta } from '@storybook/react-vite'
import { save, add, warning_filled, info_circle } from '@equinor/eds-icons'
import { Icon, IconProps } from '.'
import { TypographyNext as Typography } from '../../Typography'
import { CSSProperties, ReactNode } from 'react'

/* Story helper components - keeps code preview clean */
const Stack = ({
  children,
  direction = 'row',
  gap = 16,
  align,
}: {
  children: ReactNode
  direction?: 'row' | 'column'
  gap?: number
  align?: CSSProperties['alignItems']
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: direction,
      gap: `${gap}px`,
      alignItems: align,
    }}
  >
    {children}
  </div>
)

const Box = ({
  children,
  bg,
  padding = 8,
}: {
  children: ReactNode
  bg?: boolean
  padding?: number
}) => (
  <div
    style={{
      background: bg ? 'rgba(0,0,0,0.05)' : undefined,
      padding: `${padding}px`,
    }}
  >
    {children}
  </div>
)

const Label = ({ children }: { children: ReactNode }) => (
  <Typography family="ui" size="xs" baseline="grid" style={{ margin: '0 0 4px', color: '#666' }}>
    {children}
  </Typography>
)

const IconDemo = ({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) => (
  <div style={{ textAlign: 'center' }}>
    <Label>{label}</Label>
    {children}
  </div>
)

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
import { TypographyNext as Typography } from '@equinor/eds-core-react'
import { save } from '@equinor/eds-icons'

// Auto-sized from Typography
<Typography size="md">
  Click <Icon data={save} /> to save
</Typography>

// Explicit size for standalone usage
<Icon data={save} size="lg" />
\`\`\`

## Sizing Priority

1. **Explicit \`size\` prop** - Highest priority, uses \`--eds-sizing-icon-{size}\` tokens
2. **Parent Typography** - Inherits \`--eds-typography-icon-size\` from Typography component
3. **Dynamic fallback** - Uses \`1.5em\` for automatic scaling with font-size

## Key Features

- **Token-based sizing** - Uses EDS design tokens for consistent sizing
- **Automatic sizing** - Scales with parent Typography component
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
  <Stack gap={16}>
    <IconDemo label="xs (16px)">
      <Icon data={save} size="xs" />
    </IconDemo>
    <IconDemo label="sm (18px)">
      <Icon data={save} size="sm" />
    </IconDemo>
    <IconDemo label="md (20px)">
      <Icon data={save} size="md" />
    </IconDemo>
    <IconDemo label="lg (24px)">
      <Icon data={save} size="lg" />
    </IconDemo>
    <IconDemo label="xl (28px)">
      <Icon data={save} size="xl" />
    </IconDemo>
    <IconDemo label="2xl (32px)">
      <Icon data={save} size="2xl" />
    </IconDemo>
    <IconDemo label="3xl (37px)">
      <Icon data={save} size="3xl" />
    </IconDemo>
    <IconDemo label="4xl (42px)">
      <Icon data={save} size="4xl" />
    </IconDemo>
    <IconDemo label="5xl (48px)">
      <Icon data={save} size="5xl" />
    </IconDemo>
    <IconDemo label="6xl (56px)">
      <Icon data={save} size="6xl" />
    </IconDemo>
  </Stack>
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

export const AutoSizeFromTypography: StoryFn<IconProps> = () => (
  <Stack direction="column" gap={16}>
    <Box bg padding={8}>
      <Typography family="ui" size="xs" baseline="grid">
        <Icon data={warning_filled} color="orange" /> Typography
        size=&quot;xs&quot; - icon auto-sizes to match
      </Typography>
    </Box>
    <Box bg padding={8}>
      <Typography family="ui" size="sm" baseline="grid">
        <Icon data={warning_filled} color="orange" /> Typography
        size=&quot;sm&quot; - icon auto-sizes to match
      </Typography>
    </Box>
    <Box bg padding={8}>
      <Typography family="ui" size="md" baseline="grid">
        <Icon data={warning_filled} color="orange" /> Typography
        size=&quot;md&quot; - icon auto-sizes to match
      </Typography>
    </Box>
    <Box bg padding={8}>
      <Typography family="ui" size="lg" baseline="grid">
        <Icon data={warning_filled} color="orange" /> Typography
        size=&quot;lg&quot; - icon auto-sizes to match
      </Typography>
    </Box>
    <Box bg padding={8}>
      <Typography family="ui" size="xl" baseline="grid">
        <Icon data={warning_filled} color="orange" /> Typography
        size=&quot;xl&quot; - icon auto-sizes to match
      </Typography>
    </Box>
    <Box bg padding={8}>
      <Typography family="ui" size="2xl" baseline="grid">
        <Icon data={warning_filled} color="orange" /> Typography
        size=&quot;2xl&quot; - icon auto-sizes to match
      </Typography>
    </Box>
  </Stack>
)
AutoSizeFromTypography.parameters = {
  docs: {
    description: {
      story: `
Icons automatically inherit size from \`Typography\` component via the \`--eds-typography-icon-size\` CSS variable.
This is the recommended approach when using icons inline with text in EDS components.
      `,
    },
  },
}

export const DensityModes: StoryFn<IconProps> = () => (
  <Stack gap={48}>
    <div data-density="spacious">
      <h4 style={{ margin: '0 0 16px' }}>Spacious (default)</h4>
      <Stack gap={16}>
        <IconDemo label="sm (18px)">
          <Icon data={save} size="sm" />
        </IconDemo>
        <IconDemo label="lg (24px)">
          <Icon data={save} size="lg" />
        </IconDemo>
        <IconDemo label="2xl (32px)">
          <Icon data={save} size="2xl" />
        </IconDemo>
        <IconDemo label="5xl (48px)">
          <Icon data={save} size="5xl" />
        </IconDemo>
      </Stack>
    </div>
    <div data-density="comfortable">
      <h4 style={{ margin: '0 0 16px' }}>Comfortable (compact)</h4>
      <Stack gap={16}>
        <IconDemo label="sm (16px)">
          <Icon data={save} size="sm" />
        </IconDemo>
        <IconDemo label="lg (20px)">
          <Icon data={save} size="lg" />
        </IconDemo>
        <IconDemo label="2xl (28px)">
          <Icon data={save} size="2xl" />
        </IconDemo>
        <IconDemo label="5xl (42px)">
          <Icon data={save} size="5xl" />
        </IconDemo>
      </Stack>
    </div>
  </Stack>
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
  <Stack direction="column" gap={16}>
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
  </Stack>
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
  <Stack gap={16}>
    <Icon data={save} size="lg" color="red" />
    <Icon data={save} size="lg" color="green" />
    <Icon data={save} size="lg" color="blue" />
    <Icon data={save} size="lg" color="currentColor" />
  </Stack>
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
  <Stack gap={32}>
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
  </Stack>
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
  <Stack direction="column" gap={16}>
    <div>
      <h4 style={{ margin: '0 0 8px' }}>Inline text (no size prop)</h4>
      <Box bg padding={8}>
        <Typography family="ui" size="md" baseline="grid">
          Click <Icon data={save} /> to save or <Icon data={add} /> to add a new
          item
        </Typography>
      </Box>
      <Label>Negative margins align icon with text baseline</Label>
    </div>
    <div>
      <h4 style={{ margin: '0 0 8px' }}>Flex layout (with size prop)</h4>
      <Box bg padding={8}>
        <Stack gap={8} align="center">
          <Icon data={add} size="md" />
          <Typography family="ui" size="md" baseline="grid">
            Add new item
          </Typography>
        </Stack>
      </Box>
      <Box bg padding={8}>
        <Stack gap={8} align="center">
          <Typography family="ui" size="md" baseline="grid">
            Save changes
          </Typography>
          <Icon data={save} size="md" />
        </Stack>
      </Box>
      <Label>
        No margins when using size prop - layout controlled by flex gap
      </Label>
    </div>
  </Stack>
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
