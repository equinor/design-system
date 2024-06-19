import { Heading, HeadingProps } from './Heading'
import { StoryFn, Meta } from '@storybook/react'
import { BaselineGrid } from './../../../../.storybook/components'

const TEXT = 'The quick brown fox jumps over the lazy dog'

const meta: Meta<typeof Heading> = {
  title: 'Typography/Heading',
  component: Heading,
  args: {
    size: 'lg',
    as: 'h2',
  },
  argTypes: {
    as: {
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
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
  return (
    <Heading {...args}>The quick brown fox jumps over the lazy dog</Heading>
  )
}

export const Demo: StoryFn<HeadingProps> = () => {
  return (
    <>
      <Heading size="lg" as="h1">
        Heading
      </Heading>
      <Heading size="xs" as="h2">
        Subheading
      </Heading>

      <Heading size="md" as="h2">
        {TEXT}
      </Heading>
    </>
  )
}

export const Sizes: StoryFn<HeadingProps> = () => {
  return (
    <>
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
      <Heading size="6xl" as="h4">
        6xl: {TEXT}
      </Heading>
    </>
  )
}

export const Levels: StoryFn<HeadingProps> = () => {
  return (
    <>
      <Heading as="h6">{TEXT}</Heading>
      <Heading as="h5">{TEXT}</Heading>
      <Heading as="h4">{TEXT}</Heading>
      <Heading as="h3">{TEXT}</Heading>
      <Heading as="h2">{TEXT}</Heading>
      <Heading as="h1">{TEXT}</Heading>
    </>
  )
}
