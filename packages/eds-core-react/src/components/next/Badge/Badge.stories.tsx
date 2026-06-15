import type { Meta, StoryFn } from '@storybook/react-vite'
import { Badge, type BadgeProps } from '.'

const meta: Meta<typeof Badge> = {
  title: 'EDS 2.0 (beta)/Data Display/Badge',
  component: Badge,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component: `
⚠️ **Beta Component** — this component is under active development.

\`\`\`tsx
import { Badge } from '@equinor/eds-core-react/next'
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'accent', 'success', 'info', 'warning', 'danger'],
    },
    emphasis: {
      control: 'select',
      options: ['low', 'medium'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'outlined'],
    },
  },
}

export default meta

export const Introduction: StoryFn<BadgeProps> = (args) => {
  return <Badge {...args}>Label</Badge>
}

Introduction.args = {
  tone: 'neutral',
  emphasis: 'low',
  variant: 'solid',
}

export const Tones: StoryFn<BadgeProps> = () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Badge tone="neutral">Neutral</Badge>
    <Badge tone="accent">Accent</Badge>
    <Badge tone="success">Success</Badge>
    <Badge tone="info">Info</Badge>
    <Badge tone="warning">Warning</Badge>
    <Badge tone="danger">Danger</Badge>
  </div>
)

export const Emphasis: StoryFn<BadgeProps> = () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Badge tone="accent" emphasis="low">
      Low
    </Badge>
    <Badge tone="accent" emphasis="medium">
      Medium
    </Badge>
  </div>
)

export const Variants: StoryFn<BadgeProps> = () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Badge tone="accent" variant="solid">
      Solid
    </Badge>
    <Badge tone="accent" variant="outlined">
      Outlined
    </Badge>
  </div>
)

export const AllCombinations: StoryFn<BadgeProps> = () => {
  const tones = [
    'neutral',
    'accent',
    'success',
    'info',
    'warning',
    'danger',
  ] as const
  const emphases = ['low', 'medium'] as const
  const variants = ['solid', 'outlined'] as const

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {emphases.map((emphasis) =>
        variants.map((variant) => (
          <div
            key={`${emphasis}-${variant}`}
            style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
          >
            <span style={{ fontSize: '12px', width: '120px', flexShrink: 0 }}>
              {emphasis} / {variant}
            </span>
            {tones.map((tone) => (
              <Badge
                key={tone}
                tone={tone}
                emphasis={emphasis}
                variant={variant}
              >
                Label
              </Badge>
            ))}
          </div>
        )),
      )}
    </div>
  )
}
