import { Heading, HeadingProps } from './Heading'
import { StoryFn, Meta } from '@storybook/react'
import { BaselineGrid } from './../../../../.storybook/components'

const TEXT = 'The quick brown fox jumps over the lazy dog'

const meta: Meta<typeof Heading> = {
  title: 'Typography/Heading (Beta)',
  component: Heading,
  args: {
    size: 'lg',
    as: 'h2',
    children: TEXT,
  },
  argTypes: {
    as: {
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      control: {
        type: 'select',
      },
    },
    color: {
      options: [
        'primary',
        'secondary',
        'tertiary',
        'quaternary',
        'maximal',
        'disabled',
        'inverted',
      ],
      control: {
        type: 'select',
      },
    },
    children: {
      control: {
        type: 'text',
      },
    },
    size: {
      table: {
        type: {
          summary: 'TypographySize',
        },
      },
      options: [
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
      control: {
        type: 'select',
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <BaselineGrid>
          <Story />
        </BaselineGrid>
      )
    },
  ],
}

export default meta

export const Introduction: StoryFn<HeadingProps> = (args) => {
  return <Heading {...args} />
}

export const Sizes: StoryFn<HeadingProps> = () => {
  return (
    <div style={{ '--override-text-color': 'red', gap: 'inherit' }}>
      <Heading size="xs" as="h4">
        xs: {TEXT}
      </Heading>
      <Heading size="sm" as="h4">
        sm: {TEXT}
      </Heading>
      <Heading size="md" as="h4">
        md: {TEXT}
      </Heading>
      <Heading size="lg" as="h4">
        lg: {TEXT}
      </Heading>
      <Heading size="xl" as="h4">
        xl: {TEXT}
      </Heading>
      <Heading size="2xl" as="h4">
        2xl: {TEXT}
      </Heading>
      <Heading size="3xl" as="h4">
        3xl: {TEXT}
      </Heading>
      <Heading size="4xl" as="h4">
        4xl: {TEXT}
      </Heading>
      <Heading size="5xl" as="h4">
        5xl: {TEXT}
      </Heading>
      <Heading size="6xl" as="h4" color="quaternary">
        6xl: {TEXT}
      </Heading>
    </div>
  )
}
