import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { add, chevron_right, delete_forever } from '@equinor/eds-icons'
import { Button } from './Button'
import { Icon } from '../Icon'
import { ExampleLabel } from './../../../../.storybook/components'
import page from './Button.docs.mdx'

type StoryArgs = React.ComponentProps<typeof Button>

const meta: Meta<StoryArgs> = {
  title: 'EDS 2.0 (beta)/Inputs/Button',
  component: Button,
  tags: ['beta'],
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
      options: ['small', 'default'],
      description: 'Button size',
    },
    tone: {
      control: 'select',
      options: ['accent', 'neutral', 'danger'],
      description: 'Color theme',
    },
    round: {
      control: 'boolean',
      // Only shown once `icon` is on, because it has no effect on a text button.
      if: { arg: 'icon' },
      description: 'Makes an icon-only button circular instead of square',
    },
    icon: {
      control: 'boolean',
      description: 'Icon-only button mode (requires aria-label)',
    },
    children: {
      control: 'text',
      description: 'The label. Ignored in icon-only mode, which shows an icon.',
    },
    // asChild needs a single element as its child, and the playground passes
    // text, so switching it on would render nothing.
    asChild: {
      table: { disable: true },
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
    children: 'Button',
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

export const Introduction: Story = {
  render: ({ icon, children, ...args }) => (
    <Button icon={icon} aria-label={icon ? 'Button' : undefined} {...args}>
      {icon ? <Icon data={add} aria-hidden /> : children}
    </Button>
  ),
}

export const Overview: Story = {
  render: () => (
    <Wrapper direction="row" align="center">
      <Button>Save</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="ghost">Skip</Button>
    </Wrapper>
  ),
}

// ===== Sizes =====

export const Sizes: Story = {
  render: () => (
    <Wrapper direction="row" align="center">
      <Button size="small">Small</Button>
      <Button size="default">Default</Button>
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use `size` to choose the small or the default button. Density is separate: set `data-density` on a parent element and both sizes scale with it.',
      },
    },
  },
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
          'Use `tone` to signal the intent of an action. Every tone works with every variant.',
      },
    },
  },
}

// ===== With Icons =====

export const IconBeforeLabel: Story = {
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

export const IconAfterLabel: Story = {
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
        story:
          'Every variant has a disabled state. A disabled button uses the neutral tone, whatever its initial tone was.',
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
          <ExampleLabel style={{ textTransform: 'capitalize' }}>
            {variant}
          </ExampleLabel>
          <Wrapper direction="row" wrap align="center">
            {(['accent', 'neutral', 'danger'] as const).map((color) => (
              <Wrapper key={color} direction="row" gap={8} align="center">
                <Button variant={variant} tone={color} size="small">
                  Small
                </Button>
                <Button variant={variant} tone={color} size="default">
                  Default
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
        story: 'Every variant in every tone and size.',
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
        story: 'Icon-only buttons support every variant and tone.',
      },
    },
  },
}

// ===== Circular Icon-Only Buttons =====

export const CircularIconOnly: Story = {
  render: () => (
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
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Add `round` to an icon-only button to make it a circle instead of a square. It has no effect on a button with a label.',
      },
    },
  },
}

// ===== asChild =====

export const AsChild: Story = {
  render: () => {
    const CustomLink = (
      props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
    ) => (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a {...props} data-custom-router />
    )
    return (
      <Wrapper direction="row">
        <Button asChild>
          <a href="https://example.com">Link as button</a>
        </Button>
        <Button asChild variant="secondary">
          <CustomLink href="https://example.com">Router link</CustomLink>
        </Button>
        <Button asChild variant="ghost">
          <a href="https://example.com">Ghost link</a>
        </Button>
      </Wrapper>
    )
  },
  decorators: [
    (Story) => (
      // The example links go nowhere. A click scrolls to the top instead of
      // following the link, so the page does not reload. Decorators are left
      // out of the code shown on the docs page.
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('a')) {
            event.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Use `asChild` to render Button styles on a child element, such as an `<a>` or a router link component.',
      },
    },
  },
}

// ===== Density Comparison =====

export const DensityComparison: Story = {
  render: () => (
    <Wrapper gap={32}>
      <div data-density="relaxed">
        <ExampleLabel>Relaxed</ExampleLabel>
        <Wrapper direction="row" align="center" gap={12}>
          <Button size="small">Small</Button>
          <Button size="default">Default</Button>
        </Wrapper>
      </div>
      <div data-density="spacious">
        <ExampleLabel>Spacious (default)</ExampleLabel>
        <Wrapper direction="row" align="center" gap={12}>
          <Button size="small">Small</Button>
          <Button size="default">Default</Button>
        </Wrapper>
      </div>
      <div data-density="comfortable">
        <ExampleLabel>Comfortable</ExampleLabel>
        <Wrapper direction="row" align="center" gap={12}>
          <Button size="small">Small</Button>
          <Button size="default">Default</Button>
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

// ===== Multiline (Anti-pattern) =====

export const MultilineAntiPattern: Story = {
  render: () => (
    <Wrapper gap={32}>
      <div data-density="relaxed">
        <ExampleLabel>Relaxed</ExampleLabel>
        <Wrapper direction="row" align="flex-start" gap={12}>
          <Button multiline size="default">
            Short label
            <br />
            that wraps
          </Button>
        </Wrapper>
      </div>
      <div data-density="spacious">
        <ExampleLabel>Spacious (default)</ExampleLabel>
        <Wrapper direction="row" align="flex-start" gap={12}>
          <Button multiline size="default">
            Short label
            <br />
            that wraps
          </Button>
        </Wrapper>
      </div>
      <div data-density="comfortable">
        <ExampleLabel>Comfortable</ExampleLabel>
        <Wrapper direction="row" align="flex-start" gap={12}>
          <Button multiline size="default">
            Short label
            <br />
            that wraps
          </Button>
        </Wrapper>
      </div>
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A label should fit on one line, so shorten it instead of wrapping it. Use `multiline` only as a last resort, never as a design choice. The button still works, but a label over several lines is harder to scan and a weaker call to action.',
      },
    },
  },
}
