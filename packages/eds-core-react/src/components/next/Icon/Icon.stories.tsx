import { StoryFn, Meta } from '@storybook/react-vite'
import { save, add, warning_filled } from '@equinor/eds-icons'
import { Icon, IconProps } from '.'
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

type LabelSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

const Text = ({
  children,
  size = 'md',
  secondary,
}: {
  children: ReactNode
  size?: LabelSize
  secondary?: boolean
}) => (
  <p
    style={{
      margin: 0,
      fontFamily: 'var(--eds-font-family-ui)',
      fontSize: `var(--eds-typography-label-${size}-font-size)`,
      lineHeight: `var(--eds-typography-label-${size}-line-height)`,
      color: secondary ? 'var(--eds-text-secondary)' : undefined,
    }}
  >
    {children}
  </p>
)

const IconDemo = ({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) => (
  <div style={{ textAlign: 'center' }}>
    <Text size="xs" secondary>
      {label}
    </Text>
    {children}
  </div>
)

const SIZES = [
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
] as const

const DENSITIES = ['compact', 'comfortable', 'relaxed'] as const

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
      options: [undefined, ...SIZES],
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
**Beta:** safe to adopt alongside EDS 1.0. The API may still change in small ways before EDS 2.0 becomes stable. See [About EDS 2.0](?path=/docs/eds-2-0-beta-about--docs) for what beta means.

\`\`\`bash
npm install @equinor/eds-core-react@beta
\`\`\`

\`\`\`tsx
import { Icon } from '@equinor/eds-core-react/next'
import { save } from '@equinor/eds-icons'

// Default size, --eds-spacing-xl
<Icon data={save} />

// Explicit size, --eds-spacing-md
<Icon data={save} size="md" />
\`\`\`

## Sizing

- **No \`size\` prop**: the icon is \`--eds-spacing-xl\` (24px at comfortable), the same as \`size="xl"\`. The size does not follow the surrounding text.
- **\`size\` prop**: the spacing token of the same name, so \`size="md"\` is \`--eds-spacing-md\`, the variable Figma binds.
- **Inside a component**, such as Button or Chip, the component sets the icon size and the \`size\` prop has no effect.

Every size follows the density set on an ancestor.
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
}

export const ExplicitSizes: StoryFn<IconProps> = () => (
  <Stack gap={16} align="flex-end">
    {SIZES.map((size) => (
      <IconDemo key={size} label={size}>
        <Icon data={save} size={size} />
      </IconDemo>
    ))}
  </Stack>
)
ExplicitSizes.parameters = {
  docs: {
    description: {
      story: `
Each size is the spacing token of the same name. Without \`size\`, the icon is \`xl\`.

| Size  | Token               | Comfortable |
|-------|---------------------|-------------|
| sm    | \`--eds-spacing-sm\`  | 12px        |
| md    | \`--eds-spacing-md\`  | 16px        |
| lg    | \`--eds-spacing-lg\`  | 20px        |
| xl    | \`--eds-spacing-xl\`  | 24px        |
| 2xl   | \`--eds-spacing-2xl\` | 28px        |
| 3xl   | \`--eds-spacing-3xl\` | 32px        |
| 4xl   | \`--eds-spacing-4xl\` | 40px        |
| 5xl   | \`--eds-spacing-5xl\` | 48px        |
| 6xl   | \`--eds-spacing-6xl\` | 64px        |
| 7xl   | \`--eds-spacing-7xl\` | 80px        |
      `,
    },
  },
}

export const InlineWithText: StoryFn<IconProps> = () => (
  <Stack direction="column" gap={16}>
    <Text size="lg">
      <Icon data={warning_filled} /> Label lg with the default icon size
    </Text>
    <Text size="md">
      <Icon data={warning_filled} size="lg" /> Label md with{' '}
      <code>size=&quot;lg&quot;</code>
    </Text>
    <Text size="sm">
      <Icon data={warning_filled} size="md" /> Label sm with{' '}
      <code>size=&quot;md&quot;</code>
    </Text>
  </Stack>
)
InlineWithText.parameters = {
  docs: {
    description: {
      story:
        'The icon size does not follow the text. Next to smaller text, set `size` to the spacing token the design uses. An inline icon is centred on the text.',
    },
  },
}

export const Densities: StoryFn<IconProps> = () => (
  <Stack gap={48}>
    {DENSITIES.map((density) => (
      <div key={density} data-density={density}>
        <Text size="sm" secondary>
          {density}
        </Text>
        <Stack gap={16} align="flex-end">
          {(['md', 'lg', 'xl'] as const).map((size) => (
            <IconDemo key={size} label={size}>
              <Icon data={save} size={size} />
            </IconDemo>
          ))}
          <IconDemo label="default">
            <Icon data={add} />
          </IconDemo>
        </Stack>
      </div>
    ))}
  </Stack>
)
Densities.parameters = {
  docs: {
    description: {
      story:
        'Set `data-density` on an ancestor. Every size, including the default, follows the spacing scale and changes with the density.',
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
      <pre style={{ fontSize: '12px', padding: '8px' }}>
        {'<Icon data={save} />'}
      </pre>
    </div>
    <div>
      <p>
        <strong>Semantic</strong> (announced by screen readers):
      </p>
      <Icon data={save} size="lg" title="Save document" />
      <pre style={{ fontSize: '12px', padding: '8px' }}>
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
