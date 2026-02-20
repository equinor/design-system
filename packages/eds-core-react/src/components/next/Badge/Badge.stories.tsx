import type { Meta, StoryObj } from '@storybook/react-vite'
import { save, check_circle_outlined, error_outlined } from '@equinor/eds-icons'
import page from './Badge.docs.mdx'
import { Badge } from './Badge'
import type { BadgeProps, BadgeColor } from './Badge.types'

type StoryArgs = BadgeProps & { color?: BadgeColor }

const meta: Meta<StoryArgs> = {
  title: 'EDS 2.0 (beta)/Data Display/Badge',
  component: Badge,
  parameters: {
    docs: {
      page,
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['md', 'sm', 'xs'],
      description: 'Size of the badge',
    },
    emphasis: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual emphasis level',
    },
    color: {
      control: 'select',
      options: [
        'neutral',
        'accent',
        'danger',
        'warning',
        'info',
        'success',
        'moss-green',
        'energy-red',
        'weathered-red',
        'slate-blue',
        'spruce-wood',
        'mist-blue',
        'lichen-green',
        'purple-berry',
        'pink-rose',
        'pink-salmon',
        'green-cucumber',
        'green-succulent',
        'green-mint',
        'blue-ocean',
        'blue-overcast',
        'blue-sky',
      ],
      description: 'Colour — semantic or data-visualisation',
    },
  },
  args: {
    children: 'Label',
    size: 'md',
    emphasis: 'primary',
    color: 'neutral',
  },
}

export default meta

type Story = StoryObj<StoryArgs>

const Wrapper = ({
  children,
  gap = 8,
}: {
  children: React.ReactNode
  gap?: number
}) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap,
    }}
  >
    {children}
  </div>
)

/* ------------------------------------------------------------------ */
/*  Introduction                                                      */
/* ------------------------------------------------------------------ */

export const Introduction: Story = {
  args: {
    children: 'Label',
  },
}

/* ------------------------------------------------------------------ */
/*  All Variants                                                      */
/* ------------------------------------------------------------------ */

const SEMANTIC_COLORS: BadgeColor[] = [
  'neutral',
  'accent',
  'info',
  'success',
  'warning',
  'danger',
]

const SIZES: Array<{ value: BadgeProps['size']; label: string }> = [
  { value: 'md', label: 'Default' },
  { value: 'sm', label: 'Small' },
  { value: 'xs', label: 'Extra small' },
]

const EMPHASIS: Array<{ value: BadgeProps['emphasis']; label: string }> = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
]

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div style={{ overflow: 'auto' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontFamily: 'Equinor, sans-serif',
          fontSize: '0.875rem',
        }}
      >
        <thead>
          <tr
            style={{
              background: '#c4c4c4',
              color: '#3d3d3d',
            }}
          >
            <th style={{ padding: '8px 16px' }}>Size</th>
            <th style={{ padding: '8px 16px' }}>Emphasis</th>
            {SEMANTIC_COLORS.map((c) => (
              <th
                key={c}
                style={{
                  padding: '8px 16px',
                  textTransform: 'capitalize',
                }}
              >
                {c === 'danger' ? 'Error' : c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SIZES.map((size) =>
            EMPHASIS.map((emphasis) => (
              <tr
                key={`${size.value}-${emphasis.value}`}
                style={{
                  background:
                    SIZES.indexOf(size) % 2 === 0
                      ? '#f0f0f0'
                      : '#fff',
                }}
              >
                {emphasis.value === 'primary' && (
                  <td
                    rowSpan={2}
                    style={{
                      padding: '12px 16px',
                      fontWeight: 500,
                      verticalAlign: 'middle',
                    }}
                  >
                    {size.label}
                  </td>
                )}
                <td style={{ padding: '12px 16px' }}>{emphasis.label}</td>
                {SEMANTIC_COLORS.map((color) => (
                  <td
                    key={color}
                    style={{ padding: '12px 16px' }}
                  >
                    <Badge
                      size={size.value}
                      emphasis={emphasis.value}
                      color={color}
                    >
                      Label
                    </Badge>
                  </td>
                ))}
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete matrix of all size, emphasis, and semantic colour combinations.',
      },
    },
  },
}

/* ------------------------------------------------------------------ */
/*  With Icons                                                        */
/* ------------------------------------------------------------------ */

export const WithIcons: Story = {
  name: 'With icons',
  render: () => (
    <Wrapper>
      <Badge icon={save} color="accent">
        Saved
      </Badge>
      <Badge icon={check_circle_outlined} color="success">
        Approved
      </Badge>
      <Badge icon={error_outlined} color="danger">
        Error
      </Badge>
      <Badge icon={save} color="accent" emphasis="secondary">
        Saved
      </Badge>
      <Badge icon={check_circle_outlined} color="success" emphasis="secondary">
        Approved
      </Badge>
      <Badge icon={error_outlined} color="danger" emphasis="secondary">
        Error
      </Badge>
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Badges with leading icons for added visual context.',
      },
      source: {
        code: `<Badge icon={save} color="accent">Saved</Badge>
<Badge icon={check_circle_outlined} color="success">Approved</Badge>
<Badge icon={error_outlined} color="danger">Error</Badge>`,
      },
    },
  },
}

/* ------------------------------------------------------------------ */
/*  Dataviz Colors                                                    */
/* ------------------------------------------------------------------ */

const DATAVIZ_COLORS: BadgeColor[] = [
  'moss-green',
  'energy-red',
  'weathered-red',
  'slate-blue',
  'spruce-wood',
  'mist-blue',
  'lichen-green',
  'purple-berry',
  'pink-rose',
  'pink-salmon',
  'green-cucumber',
  'green-succulent',
  'green-mint',
  'blue-ocean',
  'blue-overcast',
  'blue-sky',
]

export const DatavizColors: Story = {
  name: 'Data-visualisation colors',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Wrapper>
        {DATAVIZ_COLORS.map((color) => (
          <Badge key={color} color={color}>
            {color}
          </Badge>
        ))}
      </Wrapper>
      <Wrapper>
        {DATAVIZ_COLORS.map((color) => (
          <Badge key={color} color={color} emphasis="secondary">
            {color}
          </Badge>
        ))}
      </Wrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Data-visualisation palette in both primary and secondary emphasis.',
      },
    },
  },
}

/* ------------------------------------------------------------------ */
/*  Sizes                                                             */
/* ------------------------------------------------------------------ */

export const Sizes: Story = {
  render: () => (
    <Wrapper>
      <Badge size="md" color="accent">
        Default
      </Badge>
      <Badge size="sm" color="accent">
        Small
      </Badge>
      <Badge size="xs" color="accent">
        Extra small
      </Badge>
      <Badge size="md" color="accent" emphasis="secondary">
        Default
      </Badge>
      <Badge size="sm" color="accent" emphasis="secondary">
        Small
      </Badge>
      <Badge size="xs" color="accent" emphasis="secondary">
        Extra small
      </Badge>
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Three sizes: `md` (20 px, default), `sm` (16 px), and `xs` (12 px). Extra-small secondary badges use bold uppercase text for legibility at small sizes.',
      },
      source: {
        code: `<Badge size="md">Default</Badge>
<Badge size="sm">Small</Badge>
<Badge size="xs">Extra small</Badge>`,
      },
    },
  },
}
