import type { Meta, StoryObj } from '@storybook/react-vite'
import { add, chevron_right, delete_forever } from '@equinor/eds-icons'
import { Button } from './Button'
import { Icon } from '../Icon'

const meta: Meta<typeof Button> = {
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
import { add } from '@equinor/eds-icons'

<Button variant="primary" colorAppearance="accent">
  Submit
</Button>

<Button variant="outline" iconStart={<Icon data={add} />}>
  Add item
</Button>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
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
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    iconStart: {
      control: false,
      description: 'Icon before label',
    },
    iconEnd: {
      control: false,
      description: 'Icon after label',
    },
    children: {
      control: 'text',
      description: 'Button label',
    },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'default',
    colorAppearance: 'accent',
  },
}

export default meta
type Story = StoryObj<typeof Button>

// ===== Basic Examples =====

export const Default: Story = {}

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

export const WithIconStart: Story = {
  args: {
    iconStart: <Icon data={add} />,
    children: 'Add Item',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use `iconStart` to add an icon before the label.',
      },
    },
  },
}

export const WithIconEnd: Story = {
  args: {
    iconEnd: <Icon data={chevron_right} />,
    children: 'Next',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use `iconEnd` to add an icon after the label.',
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
                <Button
                  variant={variant}
                  colorAppearance={color}
                  size="small"
                  iconStart={<Icon data={add} />}
                >
                  Small
                </Button>
                <Button
                  variant={variant}
                  colorAppearance={color}
                  size="default"
                  iconStart={<Icon data={add} />}
                >
                  Default
                </Button>
                <Button
                  variant={variant}
                  colorAppearance={color}
                  size="large"
                  iconStart={<Icon data={add} />}
                >
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
      <Button
        variant="primary"
        colorAppearance="danger"
        iconStart={<Icon data={delete_forever} />}
      >
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

// ===== Focus State Demo =====

export const FocusState: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Button variant="primary">Focus me</Button>
      <Button variant="outline">Focus me</Button>
      <Button variant="ghost">Focus me</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tab to the button to see the focus ring styling.',
      },
    },
  },
}
