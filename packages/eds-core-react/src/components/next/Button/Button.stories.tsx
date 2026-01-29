import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { add, chevron_right, delete_forever } from '@equinor/eds-icons'
import { Button } from './Button'
import { Icon } from '../Icon'
import page from './Button.docs.mdx'

type StoryArgs = React.ComponentProps<typeof Button>

const meta: Meta<StoryArgs> = {
  title: 'EDS 2.0 (beta)/Button',
  component: Button,
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Button size',
    },
    tone: {
      control: 'select',
      options: ['accent', 'neutral', 'danger'],
      description: 'Color theme',
    },
    round: {
      control: 'boolean',
      description:
        'Makes icon-only buttons circular (only applies to icon-only buttons)',
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
    variant: 'primary',
    size: 'default',
    tone: 'accent',
    icon: false,
    disabled: false,
  },
}

export default meta

const Wrapper = ({
  children,
  gap = 16,
  direction = 'column',
  align = 'flex-start',
  wrap = false,
  ...rest
}: {
  children: ReactNode
  gap?: number
  direction?: 'row' | 'column'
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  wrap?: boolean
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    style={{
      display: 'flex',
      flexDirection: direction,
      gap: `${gap}px`,
      alignItems: align,
      flexWrap: wrap ? 'wrap' : undefined,
    }}
    {...rest}
  >
    {children}
  </div>
)

type Story = StoryObj<StoryArgs>

// ===== Basic Examples =====

export const Default: Story = {
  render: ({ icon, ...args }) => (
    <Button icon={icon} aria-label={icon ? 'Button' : undefined} {...args}>
      {icon ? <Icon data={add} aria-hidden /> : 'Button'}
    </Button>
  ),
}

// ===== Sizes =====

export const Sizes: Story = {
  render: () => (
    <Wrapper direction="row" align="center">
      <Button size="small">Small</Button>
      <Button size="default">Default</Button>
      <Button size="large">Large</Button>
    </Wrapper>
  ),
}

// ===== Color Appearances =====

export const Tones: Story = {
  render: () => (
    <Wrapper>
      <Wrapper direction="row">
        <Button tone="accent">Accent</Button>
        <Button tone="neutral">Neutral</Button>
        <Button tone="danger">Danger</Button>
      </Wrapper>
      <Wrapper direction="row">
        <Button variant="secondary" tone="accent">
          Accent
        </Button>
        <Button variant="secondary" tone="neutral">
          Neutral
        </Button>
        <Button variant="secondary" tone="danger">
          Danger
        </Button>
      </Wrapper>
      <Wrapper direction="row">
        <Button variant="ghost" tone="accent">
          Accent
        </Button>
        <Button variant="ghost" tone="neutral">
          Neutral
        </Button>
        <Button variant="ghost" tone="danger">
          Danger
        </Button>
      </Wrapper>
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The `tone` prop controls the color scheme using `data-color-appearance`.',
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
    <Wrapper direction="row">
      <Button variant="primary" disabled>
        Primary
      </Button>
      <Button variant="secondary" disabled>
        Secondary
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
    </Wrapper>
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
    <Wrapper gap={24}>
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <div key={variant}>
          <h3 style={{ marginBottom: '12px', textTransform: 'capitalize' }}>
            {variant}
          </h3>
          <Wrapper direction="row" wrap align="center">
            {(['accent', 'neutral', 'danger'] as const).map((color) => (
              <Wrapper key={color} direction="row" gap={8} align="center">
                <Button variant={variant} tone={color} size="small">
                  <Icon data={add} aria-hidden />
                  Small
                </Button>
                <Button variant={variant} tone={color} size="default">
                  <Icon data={add} aria-hidden />
                  Default
                </Button>
                <Button variant={variant} tone={color} size="large">
                  <Icon data={add} aria-hidden />
                  Large
                </Button>
              </Wrapper>
            ))}
          </Wrapper>
        </div>
      ))}
    </Wrapper>
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
    <Wrapper direction="row">
      <Button variant="primary" tone="danger">
        <Icon data={delete_forever} aria-hidden />
        Delete
        <Icon data={delete_forever} aria-hidden />
      </Button>
      <Button variant="secondary" tone="danger">
        Cancel
      </Button>
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use `tone="danger"` for destructive actions.',
      },
    },
  },
}
// ===== Icon-Only Buttons =====

export const IconOnly: Story = {
  render: () => (
    <Wrapper direction="row" align="center">
      <Button icon aria-label="Add" size="small">
        <Icon data={add} aria-hidden />
      </Button>
      <Button icon aria-label="Add" size="default">
        <Icon data={add} aria-hidden />
      </Button>
      <Button icon aria-label="Add" size="large">
        <Icon data={add} aria-hidden />
      </Button>
    </Wrapper>
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
    <Wrapper>
      <Wrapper direction="row" align="center">
        <Button variant="primary" icon aria-label="Add">
          <Icon data={add} aria-hidden />
        </Button>
        <Button variant="secondary" icon aria-label="Add">
          <Icon data={add} aria-hidden />
        </Button>
        <Button variant="ghost" icon aria-label="Add">
          <Icon data={add} aria-hidden />
        </Button>
      </Wrapper>
      <Wrapper direction="row" align="center">
        <Button variant="primary" tone="danger" icon aria-label="Delete">
          <Icon data={delete_forever} aria-hidden />
        </Button>
        <Button variant="secondary" tone="danger" icon aria-label="Delete">
          <Icon data={delete_forever} aria-hidden />
        </Button>
        <Button variant="ghost" tone="danger" icon aria-label="Delete">
          <Icon data={delete_forever} aria-hidden />
        </Button>
      </Wrapper>
    </Wrapper>
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
    <Wrapper>
      <Wrapper direction="row" align="center">
        <Button icon round aria-label="Add" size="small">
          <Icon data={add} aria-hidden />
        </Button>
        <Button icon round aria-label="Add" size="default">
          <Icon data={add} aria-hidden />
        </Button>
        <Button icon round aria-label="Add" size="large">
          <Icon data={add} aria-hidden />
        </Button>
      </Wrapper>
      <Wrapper direction="row" align="center">
        <Button variant="primary" icon round aria-label="Add">
          <Icon data={add} aria-hidden />
        </Button>
        <Button variant="secondary" icon round aria-label="Add">
          <Icon data={add} aria-hidden />
        </Button>
        <Button variant="ghost" icon round aria-label="Add">
          <Icon data={add} aria-hidden />
        </Button>
      </Wrapper>
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use `round` on icon-only buttons to create circular buttons.',
      },
    },
  },
}

// ===== Density Comparison =====

export const DensityComparison: Story = {
  render: () => (
    <Wrapper gap={32}>
      <div data-density="spacious">
        <h3 style={{ marginBottom: '12px' }}>Spacious (default)</h3>
        <Wrapper direction="row" align="center" gap={12}>
          <Button size="small">Small</Button>
          <Button size="default">Default</Button>
          <Button size="large">Large</Button>
          <Button size="small" icon aria-label="Add">
            <Icon data={add} aria-hidden />
          </Button>
          <Button size="default" icon aria-label="Add">
            <Icon data={add} aria-hidden />
          </Button>
          <Button size="large" icon aria-label="Add">
            <Icon data={add} aria-hidden />
          </Button>
        </Wrapper>
      </div>
      <div data-density="comfortable">
        <h3 style={{ marginBottom: '12px' }}>Comfortable</h3>
        <Wrapper direction="row" align="center" gap={12}>
          <Button size="small">Small</Button>
          <Button size="default">Default</Button>
          <Button size="large">Large</Button>
          <Button size="small" icon aria-label="Add">
            <Icon data={add} aria-hidden />
          </Button>
          <Button size="default" icon aria-label="Add">
            <Icon data={add} aria-hidden />
          </Button>
          <Button size="large" icon aria-label="Add">
            <Icon data={add} aria-hidden />
          </Button>
        </Wrapper>
      </div>
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of all button sizes across density modes. Use `data-density` on a parent container to control density.',
      },
    },
  },
}
