import { UIText } from './UIText'
import { StoryFn, Meta } from '@storybook/react'
import { BaselineGrid } from '../_components/BaselineGrid'
import { UITextProps } from '../typography.types'
import { PropertyDocumentation } from '../_components/PropertyDocumentation'
import { uiTextTokens } from '../_typography.tokens'

const meta: Meta<typeof UIText> = {
  title: 'Typography/UIText',
  component: UIText,
  argTypes: {
    as: {
      options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      control: {
        type: 'select',
      },
    },
    size: {
      description: 'Size of the UIText',
      table: {
        type: {
          summary: 'TypographySize',
        },
      },
      options: ['3XS', '2XS', 'XS', 'SM', 'BASE', 'LG'],

      control: {
        type: 'select',
      },
    },
  },
}

export default meta

const TEXT = 'This is some text, hi ho! This is line two'

export const Demo: StoryFn<UITextProps> = () => {
  return (
    <BaselineGrid>
      <UIText size="LG" as="h1">
        LG
      </UIText>
      <UIText size="2XS" as="h2">
        2XS
      </UIText>

      <UIText size="BASE" as="h2">
        {TEXT}
      </UIText>
    </BaselineGrid>
  )
}

export const Sizes: StoryFn<UITextProps> = () => {
  return (
    <BaselineGrid>
      <UIText size="3XS">{TEXT}</UIText>
      <UIText size="2XS">{TEXT}</UIText>
      <UIText size="XS">{TEXT}</UIText>
      <UIText size="SM">{TEXT}</UIText>
      <UIText size="BASE" as="h2">
        {TEXT}
      </UIText>
      <UIText size="LG" as="h1">
        {TEXT}
      </UIText>
      <PropertyDocumentation size="LG" tokens={uiTextTokens} />
    </BaselineGrid>
  )
}

export const Elements: StoryFn<UITextProps> = () => {
  return (
    <>
      <UIText as="h6">{TEXT}</UIText>
      <UIText as="h5">{TEXT}</UIText>
      <UIText as="h4">{TEXT}</UIText>
      <UIText as="h3">{TEXT}</UIText>
      <UIText as="h2">{TEXT}</UIText>
      <UIText as="h1">{TEXT}</UIText>
    </>
  )
}
