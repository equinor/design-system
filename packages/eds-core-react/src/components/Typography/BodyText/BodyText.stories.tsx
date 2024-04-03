import { BodyText } from './BodyText'
import { StoryFn, Meta } from '@storybook/react'
import { BaselineGrid } from '../_components/BaselineGrid'
import { PropertyDocumentation } from '../_components/PropertyDocumentation'
import { bodyTextTokens, uiTextTokens } from '../_typography.tokens'
import { BodyTextProps } from '../typography.types'

const meta: Meta<typeof BodyText> = {
  title: 'Typography/BodyText',
  component: BodyText,
  argTypes: {
    as: {
      options: ['p', 'span', 'div'],
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

export const Demo: StoryFn<BodyTextProps> = () => {
  return (
    <BaselineGrid>
      <BodyText size="LG" as="h1">
        LG
      </BodyText>
      <BodyText size="2XS" as="h2">
        2XS
      </BodyText>

      <BodyText size="BASE" as="h2">
        {TEXT}
      </BodyText>
    </BaselineGrid>
  )
}

export const Sizes: StoryFn<BodyTextProps> = () => {
  return (
    <>
      <BodyText size="3XS">{TEXT}</BodyText>
      <PropertyDocumentation size="3XS" tokens={bodyTextTokens} />
      <BodyText size="2XS">{TEXT}</BodyText>
      <PropertyDocumentation size="2XS" tokens={bodyTextTokens} />
      <BodyText size="XS">{TEXT}</BodyText>
      <PropertyDocumentation size="XS" tokens={bodyTextTokens} />
      <BodyText size="SM">{TEXT}</BodyText>
      <PropertyDocumentation size="SM" tokens={bodyTextTokens} />
      <BodyText size="BASE" as="h2">
        {TEXT}
      </BodyText>
      <PropertyDocumentation size="BASE" tokens={bodyTextTokens} />
      <BodyText size="LG" as="h1">
        {TEXT}
      </BodyText>
      <PropertyDocumentation size="LG" tokens={uiTextTokens} />
    </>
  )
}

export const Elements: StoryFn<BodyTextProps> = () => {
  return (
    <>
      <BodyText as="h6">{TEXT}</BodyText>
      <BodyText as="h5">{TEXT}</BodyText>
      <BodyText as="h4">{TEXT}</BodyText>
      <BodyText as="h3">{TEXT}</BodyText>
      <BodyText as="h2">{TEXT}</BodyText>
      <BodyText as="h1">{TEXT}</BodyText>
    </>
  )
}
