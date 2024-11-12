import { Text, TextProps } from './Text'
import { StoryFn, Meta } from '@storybook/react'
import { BaselineGrid } from './../../../../.storybook/components'

const TEXT = 'The quick brown fox jumps over the lazy dog'

const meta: Meta<typeof Text> = {
  title: 'Typography/Text (beta)',
  component: Text,
  args: {
    size: 'lg',
    children: TEXT,
  },
  argTypes: {
    variant: {
      options: ['body', 'ui', 'header'],
      control: {
        type: 'select',
      },
    },
    lineHeight: {
      options: ['default', 'squished'],
      control: {
        type: 'select',
      },
    },
    fontWeight: {
      options: ['normal', 'bolder', 'lighter'],
      control: {
        type: 'select',
      },
    },
    letterSpacing: {
      options: ['normal', 'loose', 'tight'],
      control: {
        type: 'select',
      },
    },
    as: {
      options: ['p', 'h2', 'div'],
      control: {
        type: 'select',
      },
    },
    onGrid: {
      control: {
        type: 'boolean',
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

export const Introduction: StoryFn<TextProps> = (args) => {
  return <Text {...args} />
}

export const Demo: StoryFn<TextProps> = () => {
  return (
    <>
      <Text variant="header" size="4xl" as="h3">
        A heading
      </Text>
      <Text>
        <b>Lorem ipsum dolor sit amet</b>, 0123456789 consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.
      </Text>
      <Text as="a" href="#q">
        As a link
      </Text>
      <Text>
        Duis aute irure dolor in <a href="#t">an inline link</a> reprehenderit
        in voluptate velit esse cillum dolore eu fugiat. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
        id est laborum.
      </Text>
      <Text variant="header" as="h4" size="3xl">
        A smaller heading
      </Text>
      <Text>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Text>
      <Text>
        <b>Normal numbers</b>
      </Text>
      <Text size="3xl">0123456789</Text>
      <Text>
        <b>Monospaced numbers</b>
      </Text>
      <Text size="3xl" monoSpacedNumbers>
        0123456789
      </Text>
    </>
  )
}

export const Sizes: StoryFn<TextProps> = () => {
  return (
    <>
      <Text size="xs">xs: {TEXT}</Text>
      <Text size="sm">sm: {TEXT}</Text>
      <Text size="md">md: {TEXT}</Text>
      <Text size="lg">lg: {TEXT}</Text>
      <Text size="xl">xl: {TEXT}</Text>
      <Text size="2xl">2xl: {TEXT}</Text>
      <Text size="3xl">3xl: {TEXT}</Text>
      <Text size="4xl">4xl: {TEXT}</Text>
      <Text size="5xl">5xl: {TEXT}</Text>
      <Text size="6xl">6xl: {TEXT}</Text>
    </>
  )
}
export const SizesHeader: StoryFn<TextProps> = () => {
  return (
    <>
      <Text variant="header" size="xs" as="h4">
        xs: {TEXT}
      </Text>
      <Text variant="header" size="sm" as="h4">
        sm: {TEXT}
      </Text>
      <Text variant="header" size="md" as="h4">
        md: {TEXT}
      </Text>
      <Text variant="header" size="lg" as="h4">
        lg: {TEXT}
      </Text>
      <Text variant="header" size="xl" as="h4">
        xl: {TEXT}
      </Text>
      <Text variant="header" size="2xl" as="h4">
        2xl: {TEXT}
      </Text>
      <Text variant="header" size="3xl" as="h4">
        3xl: {TEXT}
      </Text>
      <Text variant="header" size="4xl" as="h4">
        4xl: {TEXT}
      </Text>
      <Text variant="header" size="5xl" as="h4">
        5xl: {TEXT}
      </Text>
      <Text variant="header" size="6xl" as="h4">
        6xl: {TEXT}
      </Text>
    </>
  )
}
export const Trunkated: StoryFn<TextProps> = () => {
  return (
    <Text lines={2}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, sit, non
      velit corrupti ad sint excepturi expedita odit recusandae rerum cumque
      repudiandae tempora a fuga nulla. Tempore minima eligendi officiis. Lorem
      ipsum dolor sit amet consectetur adipisicing elit. Iure, sit, non velit
      corrupti ad sint excepturi expedita odit recusandae rerum cumque
      repudiandae tempora a fuga nulla. Tempore minima eligendi officiis.
    </Text>
  )
}
