import { Typography, TypographyProps } from './Typography'
import { Card, Divider } from '../../..'
import styled from 'styled-components'
import { StoryFn, Meta } from '@storybook/react'
import { Stack } from './../../../../.storybook/components'
import page from './Typography.docs.mdx'
import { tokens, Typography as TypographyType } from '@equinor/eds-tokens'

const { typography } = tokens

const SBCard = styled(Card)`
  max-width: 290px;
  display: block;
`

const meta: Meta<typeof Typography> = {
  title: 'Typography/⚠️ Typography',
  component: Typography,
  argTypes: {
    variant: { control: { type: null } },
    group: { control: { type: null } },
    as: {
      description: 'Change the HTML element',
      table: {
        type: {
          summary: 'ElementType<any>',
        },
      },
      control: {
        type: null,
      },
    },
  },
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Stack align="baseline">
          <Story />
        </Stack>
      )
    },
  ],
}

export default meta

export const Introduction: StoryFn<TypographyProps> = (args) => {
  return <Typography {...args}>Sample text</Typography>
}

export const GroupsOverview = () => {
  return Object.entries(typography)
    .filter(([key]) => key !== '_modes')
    .map(([key, group]) => (
      <SBCard key={key} elevation="raised">
        <Card.Header>
          <Card.HeaderTitle>
            <Typography variant="h5">{key}</Typography>
          </Card.HeaderTitle>
        </Card.Header>
        <Divider />
        {Object.entries(group).map(([key, token]) => (
          <Card.Content key={key}>
            <Typography token={token as TypographyType}>{key}</Typography>
          </Card.Content>
        ))}
      </SBCard>
    ))
}
GroupsOverview.storyName = 'Groups overview'
GroupsOverview.decorators = [
  (Story) => {
    return (
      <Stack align="start" style={{ justifyContent: 'flex-start' }}>
        <Story />
      </Stack>
    )
  },
]

export const Colors: StoryFn<TypographyProps> = () => (
  <>
    <Typography color="primary"> Primary</Typography>
    <Typography color="secondary">Secondary</Typography>
    <Typography color="danger">Danger</Typography>
    <Typography color="warning">Warning</Typography>
    <Typography color="success">Success</Typography>
    <Typography color="disabled">Disabled</Typography>
    <Typography color="currentColor">CSS currentColor</Typography>
    <Typography color="pink">CSS pink</Typography>
  </>
)

export const TokenProperty: StoryFn<TypographyProps> = () => (
  <>
    <div>
      <Typography
        group="navigation"
        variant="label"
        token={{ textAlign: 'center', lineHeight: '2em' }}
      >
        Navigation / Label / Text Align
      </Typography>
      <Typography
        group="navigation"
        variant="menu_title"
        token={{ textDecoration: 'line-through', lineHeight: '2em' }}
      >
        Navigation / Menu Title / Text Decoration
      </Typography>
      <Typography
        group="navigation"
        variant="label"
        token={{ textTransform: 'uppercase', lineHeight: '2em' }}
      >
        Navigation / Label / Text Transform
      </Typography>
    </div>
    <div>
      <Typography
        group="table"
        variant="cell_header"
        token={{ fontFamily: 'Arial' }}
      >
        Table / Cell Hearder / Font Family
      </Typography>
      <Typography
        group="table"
        variant="cell_text"
        token={{ fontSize: '1.5rem' }}
      >
        Table / Cell Text / Font Size
      </Typography>
      <Typography
        group="table"
        variant="cell_text_bold"
        token={{ fontStyle: 'italic' }}
      >
        Table / Cell Text Bold / Font Style
      </Typography>
      <Typography
        group="table"
        variant="cell_numeric_monospaced"
        token={{ fontWeight: 300 }}
      >
        Table / Cell Numeric / Font Weight
      </Typography>
    </div>
    <div>
      <Typography token={{ color: 'purple' }}>Color</Typography>
      <Typography token={{ lineHeight: '400%' }}>Line Hight</Typography>
      <Typography token={{ letterSpacing: '4px' }}>Letter Spacing</Typography>
      <Typography
        token={{
          color: 'purple',
          fontFamily: 'Arial',
          fontSize: '1.875rem',
          fontWeight: 300,
          lineHeight: '1.714em',
          textTransform: 'uppercase',
        }}
      >
        Custom token
      </Typography>
    </div>
  </>
)
TokenProperty.storyName = 'Token property'

export const Lines: StoryFn<TypographyProps> = () => (
  <>
    <Typography variant="body_long" lines={2}>
      Cupcake ipsum dolor sit amet caramels powder. Chocolate powder donut
      bonbon candy canes brownie donut wafer. Cake topping oat cake cheesecake.
      Candy canes tiramisu apple pie cookie. Pastry marshmallow candy canes.
      Cookie jelly-o fruitcake caramels sweet. Brownie pastry sweet roll.
      Caramels tiramisu cotton candy carrot cake jujubes cheesecake bear claw.
      Candy caramels dessert caramels. Lollipop marshmallow wafer marzipan.
      Sesame snaps wafer apple pie sweet roll chocolate bar fruitcake. Bear claw
      lollipop cake. Jelly-o bonbon marshmallow powder carrot cake icing carrot
      cake. Cheesecake brownie jelly beans soufflé icing.
    </Typography>
  </>
)

export const Link: StoryFn<TypographyProps> = () => (
  <>
    <Typography link href="#">
      Link
    </Typography>
    <Typography variant="body_long">
      Cupcake ipsum dolor sit amet caramels powder. Chocolate powder donut
      bonbon candy canes brownie donut wafer.{' '}
      <Typography link href="#">
        Cake
      </Typography>{' '}
      topping oat{' '}
      <Typography link href="#">
        cake
      </Typography>{' '}
      cheesecake. Candy canes tiramisu apple pie cookie. Pastry marshmallow
      candy canes. Cookie jelly-o fruitcake caramels sweet. Brownie pastry sweet
      roll. Caramels tiramisu cotton candy carrot{' '}
      <Typography link href="#">
        cake
      </Typography>{' '}
      jujubes cheesecake bear claw. Candy caramels dessert caramels. Lollipop
      marshmallow wafer marzipan. Sesame snaps wafer apple pie sweet roll
      chocolate bar fruitcake.
    </Typography>
  </>
)
Link.decorators = [
  (Story) => {
    return (
      <Stack style={{ justifyContent: 'start' }}>
        <Story />
      </Stack>
    )
  },
]

export const As: StoryFn<TypographyProps> = () => (
  <Typography variant="h2" as="h4">
    I am a &lt;h4&gt; styled as a &lt;h2&gt;
  </Typography>
)
As.decorators = [
  (Story) => {
    return (
      <Stack style={{ justifyContent: 'start' }}>
        <Story />
      </Stack>
    )
  },
]
