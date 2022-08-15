import { Card, Divider, Typography, TypographyProps } from '../..'
import styled from 'styled-components'
import { Story, ComponentMeta } from '@storybook/react'
import { Stack } from './../../../.storybook/components'
import page from './Typography.docs.mdx'
import { tokens, Typography as TypographyType } from '@equinor/eds-tokens'

const {
  colors: {
    infographic: {
      primary__moss_green_100: { rgba: mossgreen100 },
    },
  },
  typography,
} = tokens

const SBCard = styled(Card)`
  border: 1px solid ${mossgreen100};
  max-width: 290px;
  display: table-cell;
`

export default {
  title: 'Typography/Typography',
  component: Typography,
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
} as ComponentMeta<typeof Typography>

export const GroupsOverview = () => {
  return Object.entries(typography).map(([key, group]) => (
    <SBCard key={key}>
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
GroupsOverview.decorators = [
  (Story) => {
    return (
      <Stack align="start" style={{ justifyContent: 'flex-start' }}>
        <Story />
      </Stack>
    )
  },
]

export const Introduction: Story<TypographyProps> = (args) => {
  return <Typography {...args}>Sample text</Typography>
}

export const Colors: Story<TypographyProps> = () => (
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

export const Custom: Story<TypographyProps> = () => (
  <>
    <div>
      <Typography group="navigation" variant="label">
        Navigation / Label
      </Typography>
      <Typography group="navigation" variant="menu_title">
        Navigation / Menu / Title
      </Typography>
    </div>
    <div>
      <Typography group="table" variant="cell_text">
        Table / Cell / Text
      </Typography>
      <Typography
        group="table"
        variant="cell_text"
        token={{ fontWeight: 'medium' }}
      >
        Table / Cell / Text / Medium
      </Typography>
      <Typography group="table" variant="cell_text" bold>
        Table / Cell / Text / Bold
      </Typography>
      <Typography group="table" variant="cell_text" link href="#">
        Table / Cell / Text / Bold / Link
      </Typography>
    </div>
    <div>
      <Typography variant="h3" token={{ fontWeight: 700 }}>
        Heading 3 Bold
      </Typography>
      <Typography variant="ingress" token={{ fontWeight: 'bold' }}>
        Ingress Bold
      </Typography>
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

export const Lines: Story<TypographyProps> = () => (
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

export const Link: Story<TypographyProps> = () => (
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
