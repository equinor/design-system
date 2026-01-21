import type { Meta, StoryObj } from '@storybook/react-vite'
import { add, chevron_right, delete_forever } from '@equinor/eds-icons'
import { Button } from './Button'
import { Icon } from '../Icon'

type StoryArgs = React.ComponentProps<typeof Button> & {
  label: string
  iconStart: boolean
  iconEnd: boolean
}

const meta: Meta<StoryArgs> = {
  title: 'EDS 2.0 (beta)/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `
Button component for triggering actions.

## Usage

\`\`\`tsx
import { Button } from '@equinor/eds-core-react/next'
import { Icon } from '@equinor/eds-core-react/next'
import { add, chevron_right } from '@equinor/eds-icons'

// Text only
<Button variant="primary" colorAppearance="accent">
  Submit
</Button>

// Icon before label
<Button variant="outline">
  <Icon data={add} aria-hidden />
  Add item
</Button>

// Icon after label
<Button>
  Next
  <Icon data={chevron_right} aria-hidden />
</Button>

// Icon-only button (requires aria-label)
<Button icon aria-label="Add item">
  <Icon data={add} aria-hidden />
</Button>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Button label text',
    },
    iconStart: {
      control: 'boolean',
      description: 'Show icon before label',
    },
    iconEnd: {
      control: 'boolean',
      description: 'Show icon after label',
    },
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'ghost'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Button size',
    },
    colorAppearance: {
      control: 'select',
      options: ['accent', 'neutral', 'danger'],
      description: 'Color theme',
    },
    radius: {
      control: 'select',
      options: ['default', 'rounded'],
      description: 'Border radius (only applies to icon-only buttons)',
    },
    icon: {
      control: 'boolean',
      description: 'Icon-only button mode (requires aria-label)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
  args: {
    label: 'Button',
    iconStart: false,
    iconEnd: false,
    variant: 'primary',
    size: 'default',
    colorAppearance: 'accent',
    icon: false,
    disabled: false,
  },
}

export default meta
type Story = StoryObj<StoryArgs>

// ===== Basic Examples =====

export const Default: Story = {
  render: ({ label, iconStart, iconEnd, icon, ...rest }) => (
    <Button icon={icon} aria-label={icon ? label : undefined} {...rest}>
      {iconStart && <Icon data={add} aria-hidden />}
      {!icon && label}
      {iconEnd && <Icon data={chevron_right} aria-hidden />}
    </Button>
  ),
}

// ===== Sizes =====

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Button size="small">Small</Button>
      <Button size="default">Default</Button>
      <Button size="large">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Three sizes are available: `small` (28px), `default` (36px), and `large` (44px).',
      },
    },
  },
}

// ===== Color Appearances =====

export const ColorAppearances: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button colorAppearance="accent">Accent</Button>
        <Button colorAppearance="neutral">Neutral</Button>
        <Button colorAppearance="danger">Danger</Button>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button variant="outline" colorAppearance="accent">
          Accent
        </Button>
        <Button variant="outline" colorAppearance="neutral">
          Neutral
        </Button>
        <Button variant="outline" colorAppearance="danger">
          Danger
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button variant="ghost" colorAppearance="accent">
          Accent
        </Button>
        <Button variant="ghost" colorAppearance="neutral">
          Neutral
        </Button>
        <Button variant="ghost" colorAppearance="danger">
          Danger
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The `colorAppearance` prop controls the color scheme using `data-color-appearance`.',
      },
    },
  },
}

// ===== With Icons =====

export const WithIconBefore: Story = {
  render: () => (
    <Button>
      <Icon data={add} aria-hidden />
      Add Item
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Place an Icon before the text as a child to show it before the label.',
      },
    },
  },
}

export const WithIconAfter: Story = {
  render: () => (
    <Button>
      Next
      <Icon data={chevron_right} aria-hidden />
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Place an Icon after the text as a child to show it after the label.',
      },
    },
  },
}

// ===== States =====

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
}

export const DisabledVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Button variant="primary" disabled>
        Primary
      </Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All variants support the disabled state.',
      },
    },
  },
}

// ===== All Variants Matrix =====

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {(['primary', 'outline', 'ghost'] as const).map((variant) => (
        <div key={variant}>
          <h3 style={{ marginBottom: '12px', textTransform: 'capitalize' }}>
            {variant}
          </h3>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {(['accent', 'neutral', 'danger'] as const).map((color) => (
              <div
                key={color}
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <Button variant={variant} colorAppearance={color} size="small">
                  <Icon data={add} aria-hidden />
                  Small
                </Button>
                <Button
                  variant={variant}
                  colorAppearance={color}
                  size="default"
                >
                  <Icon data={add} aria-hidden />
                  Default
                </Button>
                <Button variant={variant} colorAppearance={color} size="large">
                  <Icon data={add} aria-hidden />
                  Large
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete overview of all variants, sizes, and color appearances.',
      },
    },
  },
}

// ===== Danger Action Example =====

export const DangerAction: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Button variant="primary" colorAppearance="danger">
        <Icon data={delete_forever} aria-hidden />
        Delete
      </Button>
      <Button variant="outline" colorAppearance="danger">
        Cancel
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use `colorAppearance="danger"` for destructive actions.',
      },
    },
  },
}
// ===== Icon-Only Buttons =====

export const IconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button icon aria-label="Add" size="small">
        <Icon data={add} aria-hidden />
      </Button>
      <Button icon aria-label="Add" size="default">
        <Icon data={add} aria-hidden />
      </Button>
      <Button icon aria-label="Add" size="large">
        <Icon data={add} aria-hidden />
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use the `icon` prop for icon-only buttons. They are square with uniform padding. Always provide `aria-label` for accessibility.',
      },
    },
  },
}

export const IconOnlyVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button variant="primary" icon aria-label="Add">
          <Icon data={add} aria-hidden />
        </Button>
        <Button variant="outline" icon aria-label="Add">
          <Icon data={add} aria-hidden />
        </Button>
        <Button variant="ghost" icon aria-label="Add">
          <Icon data={add} aria-hidden />
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button
          variant="primary"
          colorAppearance="danger"
          icon
          aria-label="Delete"
        >
          <Icon data={delete_forever} aria-hidden />
        </Button>
        <Button
          variant="outline"
          colorAppearance="danger"
          icon
          aria-label="Delete"
        >
          <Icon data={delete_forever} aria-hidden />
        </Button>
        <Button
          variant="ghost"
          colorAppearance="danger"
          icon
          aria-label="Delete"
        >
          <Icon data={delete_forever} aria-hidden />
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icon-only buttons support all variants and color appearances.',
      },
    },
  },
}

// ===== Circular Icon-Only Buttons =====

export const CircularIconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button icon radius="rounded" aria-label="Add" size="small">
          <Icon data={add} aria-hidden />
        </Button>
        <Button icon radius="rounded" aria-label="Add" size="default">
          <Icon data={add} aria-hidden />
        </Button>
        <Button icon radius="rounded" aria-label="Add" size="large">
          <Icon data={add} aria-hidden />
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button variant="primary" icon radius="rounded" aria-label="Add">
          <Icon data={add} aria-hidden />
        </Button>
        <Button variant="outline" icon radius="rounded" aria-label="Add">
          <Icon data={add} aria-hidden />
        </Button>
        <Button variant="ghost" icon radius="rounded" aria-label="Add">
          <Icon data={add} aria-hidden />
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use `radius="rounded"` on icon-only buttons to create circular buttons.',
      },
    },
  },
}
