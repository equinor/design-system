import { UIText, UITextProps } from './UIText'
import { StoryFn, Meta } from '@storybook/react'
import { BaselineGrid } from '../_components/BaselineGrid'

const TEXT = 'The quick brown fox jumps over the lazy dog'

const meta: Meta<typeof UIText> = {
  title: 'Typography/UIText',
  component: UIText,
  args: {
    size: 'md',
  },
  argTypes: {
    as: {
      options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
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

export const Introduction: StoryFn<UITextProps> = (args) => {
  return <UIText {...args}>The quick brown fox jumps over the lazy dog</UIText>
}

export const Demo: StoryFn<UITextProps> = () => {
  return (
    <>
      <UIText size="lg">lg</UIText>
      <UIText size="xs">xs</UIText>
      <UIText>{TEXT}</UIText>
    </>
  )
}

export const Sizes: StoryFn<UITextProps> = () => {
  return (
    <>
      <UIText size="xs">{TEXT}</UIText>
      <UIText size="sm">{TEXT}</UIText>
      <UIText size="md">{TEXT}</UIText>
      <UIText size="lg">{TEXT}</UIText>
      <UIText size="xl">{TEXT}</UIText>
    </>
  )
}
