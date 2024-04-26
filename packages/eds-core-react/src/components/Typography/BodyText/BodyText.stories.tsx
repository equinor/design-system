import { BodyText, BodyTextProps } from './BodyText'
import { StoryFn, Meta } from '@storybook/react'
import { BaselineGrid } from '../_components/BaselineGrid'
import { PropertyDocumentation } from '../_components/PropertyDocumentation'
import {
  bodyTextTokens,
  headingTokens,
  uiTextTokens,
} from '../_typography.tokens'
import { Heading } from '../Heading/Heading'

const TEXT = 'This is some text, hi ho! This is line two'

const meta: Meta<typeof BodyText> = {
  title: 'Typography/BodyText',
  component: BodyText,
  args: {
    size: 'BASE',
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
      options: ['3XS', '2XS', 'XS', 'SM', 'BASE', 'LG'],
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
    <BodyText {...args} contentEditable>
      This text is editable
    </BodyText>
  )
}

export const Demo: StoryFn<BodyTextProps> = () => {
  return (
    <>
      <Heading size="LG" as="h2">
        Lorem Ipsum
      </Heading>
      <BodyText size="BASE" contentEditable>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </BodyText>
      <BodyText size="BASE" as="a" href="#q">
        As a link
      </BodyText>
      <BodyText size="BASE">
        Duis aute irure dolor in <a href="#t">an inline link</a> reprehenderit
        in voluptate velit esse cillum dolore eu fugiat. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
        id est laborum.
      </BodyText>
      <Heading as="h2" size="BASE">
        Lorem Ipsum
      </Heading>
      <BodyText size="BASE">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </BodyText>
      <section>
        <PropertyDocumentation tokens={headingTokens} size="LG" />
      </section>
    </>
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
