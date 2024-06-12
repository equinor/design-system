import { BodyText, BodyTextProps } from './BodyText'
import { StoryFn, Meta } from '@storybook/react'
import { BaselineGrid } from '../_components/BaselineGrid'
import { Heading } from '../Heading/Heading'

const TEXT = 'The quick brown fox jumps over the lazy dog'

const meta: Meta<typeof BodyText> = {
  title: 'Typography/BodyText',
  component: BodyText,
  args: {
    size: 'md',
  },
  argTypes: {
    as: {
      options: ['p', 'span', 'div'],
      control: {
        type: 'select',
      },
    },
    size: {
      table: {
        type: {
          summary: 'TypographySize',
        },
      },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
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

export const Introduction: StoryFn<BodyTextProps> = (args) => {
  return (
    <BodyText {...args}>
      The XXX quick brown fox jumps over the lazy dog
    </BodyText>
  )
}

export const Demo: StoryFn<BodyTextProps> = () => {
  return (
    <>
      <Heading size="lg" as="h2">
        Lorem Ipsum
      </Heading>
      <BodyText>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </BodyText>
      <BodyText as="a" href="#q">
        As a link
      </BodyText>
      <BodyText>
        Duis aute irure dolor in <a href="#t">an inline link</a> reprehenderit
        in voluptate velit esse cillum dolore eu fugiat. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
        id est laborum.
      </BodyText>
      <Heading as="h2">Lorem Ipsum</Heading>
      <BodyText>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </BodyText>
      <section></section>
    </>
  )
}

export const Sizes: StoryFn<BodyTextProps> = () => {
  return (
    <>
      <BodyText size="xs">{TEXT}</BodyText>
      <BodyText size="sm">{TEXT}</BodyText>
      <BodyText size="md">{TEXT}</BodyText>
      <BodyText size="lg">{TEXT}</BodyText>
      <BodyText size="xl">{TEXT}</BodyText>
    </>
  )
}
