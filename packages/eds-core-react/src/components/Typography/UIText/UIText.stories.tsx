import { UIText } from './UIText'
import { StoryFn, Meta } from '@storybook/react'
import { BaselineGrid } from '../_components/BaselineGrid'
import { UITextProps } from '../typography.types'
import { PropertyDocumentation } from '../_components/PropertyDocumentation'
import { uiTextTokens } from '../_typography.tokens'

const TEXT = 'This is some text, hi ho! This is line two'

const meta: Meta<typeof UIText> = {
  title: 'Typography/UIText',
  component: UIText,
  args: {
    children: TEXT,
    size: 'BASE',
  },
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

export const Introduction: StoryFn<UITextProps> = (args) => {
  return <UIText {...args} />
}

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
    <>
      <UIText size="3XS">{TEXT}</UIText>
      <PropertyDocumentation size="3XS" tokens={uiTextTokens} />
      <UIText size="2XS">{TEXT}</UIText>
      <PropertyDocumentation size="2XS" tokens={uiTextTokens} />
      <UIText size="XS">{TEXT}</UIText>
      <PropertyDocumentation size="XS" tokens={uiTextTokens} />
      <UIText size="SM">{TEXT}</UIText>
      <PropertyDocumentation size="SM" tokens={uiTextTokens} />
      <UIText size="BASE" as="h2">
        {TEXT}
      </UIText>
      <PropertyDocumentation size="BASE" tokens={uiTextTokens} />
      <UIText size="LG" as="h1">
        {TEXT}
      </UIText>
      <PropertyDocumentation size="LG" tokens={uiTextTokens} />
    </>
  )
}
