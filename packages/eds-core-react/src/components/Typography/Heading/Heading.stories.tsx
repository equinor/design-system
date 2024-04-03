import { Heading } from './Heading'
import { StoryFn, Meta } from '@storybook/react'
import { BaselineGrid } from '../_components/BaselineGrid'
import { HeadingProps } from '../typography.types'
import { PropertyDocumentation } from '../_components/PropertyDocumentation'
import { headingTokens } from '../_typography.tokens'

const TEXT = 'This is some text, hi ho! This is line two'

const meta: Meta<typeof Heading> = {
  title: 'Typography/Heading',
  component: Heading,
  args: {
    children: TEXT,
    size: 'BASE',
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
      description: 'Size of the heading',
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

export const Introduction: StoryFn<HeadingProps> = (args) => {
  return <Heading {...args} />
}

export const Demo: StoryFn<HeadingProps> = () => {
  return (
    <BaselineGrid>
      <Heading size="LG" as="h1">
        Heading
      </Heading>
      <Heading size="2XS" as="h2">
        Subheading
      </Heading>

      <Heading size="BASE" as="h2">
        {TEXT}
      </Heading>
    </BaselineGrid>
  )
}

export const Sizes: StoryFn<HeadingProps> = () => {
  return (
    <>
      <Heading size="3XS">{TEXT}</Heading>
      <PropertyDocumentation size="3XS" tokens={headingTokens} />
      <Heading size="2XS">{TEXT}</Heading>
      <PropertyDocumentation size="2XS" tokens={headingTokens} />
      <Heading size="XS">{TEXT}</Heading>
      <PropertyDocumentation size="XS" tokens={headingTokens} />
      <Heading size="SM">{TEXT}</Heading>
      <PropertyDocumentation size="SM" tokens={headingTokens} />
      <Heading size="BASE" as="h2">
        {TEXT}
      </Heading>
      <PropertyDocumentation size="BASE" tokens={headingTokens} />
      <Heading size="LG" as="h1">
        {TEXT}
      </Heading>
      <PropertyDocumentation size="LG" tokens={headingTokens} />
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
