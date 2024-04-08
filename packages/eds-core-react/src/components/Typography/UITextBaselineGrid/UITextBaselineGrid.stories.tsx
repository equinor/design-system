import { UITextBaselineGrid } from './UITextBaselineGrid'
import { StoryFn, Meta } from '@storybook/react'
import { BaselineGrid } from '../_components/BaselineGrid'
import { UITextProps } from '../typography.types'
import { PropertyDocumentation } from '../_components/PropertyDocumentation'
import { uiTextTokens } from '../_typography.tokens'
import { UIText } from '../UIText/UIText'

const TEXT = 'This is some text, hi ho! This is line two'

const meta: Meta<typeof UITextBaselineGrid> = {
  title: 'Typography/UITextBaselineGrid',
  component: UITextBaselineGrid,
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
  return <UITextBaselineGrid {...args} />
}

export const Demo: StoryFn<UITextProps> = () => {
  return (
    <BaselineGrid>
      <UITextBaselineGrid size="LG" as="h1">
        LG
      </UITextBaselineGrid>
      <UITextBaselineGrid size="2XS" as="h2">
        2XS
      </UITextBaselineGrid>

      <UITextBaselineGrid size="BASE" as="h2">
        {TEXT}
      </UITextBaselineGrid>
    </BaselineGrid>
  )
}

export const UITextAndUITextBaselineGrid: StoryFn<UITextProps> = () => {
  return (
    <BaselineGrid>
      <UIText size="BASE">
        {TEXT} {TEXT}
      </UIText>
      <UITextBaselineGrid size="BASE">
        {TEXT} {TEXT}
      </UITextBaselineGrid>
    </BaselineGrid>
  )
}

export const Sizes: StoryFn<UITextProps> = () => {
  return (
    <>
      <UITextBaselineGrid size="3XS">{TEXT}</UITextBaselineGrid>
      <PropertyDocumentation size="3XS" tokens={uiTextTokens} />
      <UITextBaselineGrid size="2XS">{TEXT}</UITextBaselineGrid>
      <PropertyDocumentation size="2XS" tokens={uiTextTokens} />
      <UITextBaselineGrid size="XS">{TEXT}</UITextBaselineGrid>
      <PropertyDocumentation size="XS" tokens={uiTextTokens} />
      <UITextBaselineGrid size="SM">{TEXT}</UITextBaselineGrid>
      <PropertyDocumentation size="SM" tokens={uiTextTokens} />
      <UITextBaselineGrid size="BASE" as="h2">
        {TEXT}
      </UITextBaselineGrid>
      <PropertyDocumentation size="BASE" tokens={uiTextTokens} />
      <UITextBaselineGrid size="LG" as="h1">
        {TEXT}
      </UITextBaselineGrid>
      <PropertyDocumentation size="LG" tokens={uiTextTokens} />
    </>
  )
}
