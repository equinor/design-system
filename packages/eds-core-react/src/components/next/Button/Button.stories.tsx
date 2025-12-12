import { StoryFn, Meta } from '@storybook/react-vite'
import { Button } from './Button'
import { ButtonProps } from './Button.types'

const meta: Meta<typeof Button> = {
  title: 'EDS 2.0 (beta)/Button',
  component: Button,
  tags: ['beta'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
    },
    colorAppearance: {
      control: 'select',
      options: ['accent', 'neutral', 'danger'],
    },
    disabled: {
      control: 'boolean',
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
import { Button } from '@equinor/eds-core-react/next'
\`\`\`

Button component for user interactions with support for multiple variants, sizes, and color appearances.
        `,
      },
    },
  },
}

export default meta

export const Introduction: StoryFn<ButtonProps> = (args) => {
  return <Button {...args} />
}
Introduction.args = {
  children: 'Label',
  variant: 'primary',
  size: 'default',
  colorAppearance: 'accent',
}

export const ColorAppearances: StoryFn<ButtonProps> = () => {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button colorAppearance="accent">Accent</Button>
      <Button colorAppearance="neutral">Neutral</Button>
      <Button colorAppearance="danger">Danger</Button>
    </div>
  )
}
ColorAppearances.parameters = {
  docs: {
    description: {
      story:
        'The `colorAppearance` prop controls the color scheme of the button using `data-color-appearance`.',
    },
  },
}

export const Variants: StoryFn<ButtonProps> = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ width: '80px' }}>Primary</span>
        <Button variant="primary" colorAppearance="accent">
          Label
        </Button>
        <Button variant="primary" colorAppearance="neutral">
          Label
        </Button>
        <Button variant="primary" colorAppearance="danger">
          Label
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ width: '80px' }}>Outline</span>
        <Button variant="outline" colorAppearance="accent">
          Label
        </Button>
        <Button variant="outline" colorAppearance="neutral">
          Label
        </Button>
        <Button variant="outline" colorAppearance="danger">
          Label
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ width: '80px' }}>Ghost</span>
        <Button variant="ghost" colorAppearance="accent">
          Label
        </Button>
        <Button variant="ghost" colorAppearance="neutral">
          Label
        </Button>
        <Button variant="ghost" colorAppearance="danger">
          Label
        </Button>
      </div>
    </div>
  )
}
Variants.parameters = {
  docs: {
    description: {
      story:
        'Three variants are available: `primary` (filled), `outline` (bordered), and `ghost` (minimal).',
    },
  },
}

export const Sizes: StoryFn<ButtonProps> = () => {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="large">Large</Button>
      <Button size="default">Default</Button>
      <Button size="small">Small</Button>
    </div>
  )
}
Sizes.parameters = {
  docs: {
    description: {
      story: 'Three sizes are available: `large`, `default`, and `small`.',
    },
  },
}

export const States: StoryFn<ButtonProps> = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ width: '80px' }}>Primary</span>
        <Button variant="primary">Default</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ width: '80px' }}>Outline</span>
        <Button variant="outline">Default</Button>
        <Button variant="outline" disabled>
          Disabled
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ width: '80px' }}>Ghost</span>
        <Button variant="ghost">Default</Button>
        <Button variant="ghost" disabled>
          Disabled
        </Button>
      </div>
    </div>
  )
}
States.parameters = {
  docs: {
    description: {
      story:
        'Buttons can be disabled using the `disabled` prop. Hover and active states are handled via CSS.',
    },
  },
}

export const AllVariantsAndStates: StoryFn<ButtonProps> = () => {
  const variants = ['primary', 'outline', 'ghost'] as const
  const colorAppearances = ['accent', 'neutral', 'danger'] as const

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {colorAppearances.map((appearance) => (
        <div key={appearance}>
          <h3 style={{ marginBottom: '1rem', textTransform: 'capitalize' }}>
            {appearance}
          </h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {variants.map((variant) => (
              <div
                key={variant}
                style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
              >
                <span style={{ width: '80px', textTransform: 'capitalize' }}>
                  {variant}
                </span>
                <Button variant={variant} colorAppearance={appearance}>
                  Default
                </Button>
                <Button variant={variant} colorAppearance={appearance} disabled>
                  Disabled
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
AllVariantsAndStates.parameters = {
  docs: {
    description: {
      story: 'Complete overview of all variants and color appearances.',
    },
  },
}
