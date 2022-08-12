import { Typography, TypographyProps, List } from '../..'
import styled from 'styled-components'
import { Story, ComponentMeta } from '@storybook/react'
import { Stack } from './../../../.storybook/components'
import page from './Typography.docs.mdx'

const Wrapper = styled.div`
  margin: 32px;
`

const Grid = styled(Wrapper)`
  display: grid;
  grid-gap: 32px;
  justify-items: start;
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

export const Introduction: Story<TypographyProps> = (args) => {
  return <Typography {...args}>Sample text</Typography>
}

export const Headings: Story<TypographyProps> = () => (
  <Grid>
    <Typography variant="h1" bold>
      Heading 1 bold
    </Typography>
    <Typography variant="h1">Heading 1</Typography>
    <Typography variant="h2">Heading 2</Typography>
    <Typography variant="h3">Heading 3</Typography>
    <Typography variant="h4">Heading 4</Typography>
    <Typography variant="h5">Heading 5</Typography>
    <Typography variant="h6">Heading 6</Typography>
  </Grid>
)

export const Paragraphs = (): JSX.Element => (
  <Grid>
    <Typography variant="body_short" link href="#">
      Body short link
    </Typography>
    <Typography variant="body_short">Body short</Typography>
    <Typography variant="body_short" italic>
      Body short italic
    </Typography>
    <Typography variant="body_short" bold>
      Body short bold
    </Typography>
    <Typography variant="body_short" bold italic>
      Body short bold italic
    </Typography>
    <Typography variant="body_long" link href="#">
      Body long link
    </Typography>
    <Typography variant="body_long">Body long</Typography>
    <Typography variant="body_long" italic>
      Body long italic
    </Typography>
    <Typography variant="body_long" bold>
      Body long bold
    </Typography>

    <Typography variant="body_long" bold italic>
      Body long bold italic
    </Typography>
    <Typography variant="overline">Overline</Typography>
    <Typography variant="ingress">Ingress</Typography>
    <Typography variant="caption">Caption</Typography>
    <Typography variant="meta">Meta</Typography>
  </Grid>
)

export const GroupsOverview = (): JSX.Element => (
  <List>
    <List.Item>
      input
      <List>
        <List.Item>
          <Typography group="input" variant="label">
            label
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="input" variant="text">
            text
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="input" variant="text_monospaced">
            text_monospaced
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="input" variant="helper">
            helper
          </Typography>
        </List.Item>
      </List>
    </List.Item>
    <List.Item>
      navigation
      <List>
        <List.Item>
          <Typography group="navigation" variant="menu_title">
            menu_title
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="navigation" variant="menu_title_hover">
            menu_title_hover
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="navigation" variant="menu_tabs">
            menu_tabs
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="navigation" variant="label">
            label
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="navigation" variant="drawer_active">
            drawer_active
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="navigation" variant="drawer_inactive">
            drawer_inactive
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="navigation" variant="button">
            button
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="navigation" variant="breadcrumb">
            breadcrumb
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="navigation" variant="breadcrumb_hover">
            breadcrumb_hover
          </Typography>
        </List.Item>
      </List>
    </List.Item>
    <List.Item>
      table
      <List>
        <List.Item>
          <Typography group="table" variant="cell_header">
            cell_header
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="table" variant="cell_text">
            cell_text
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="table" variant="cell_text_bold">
            cell_text_bold
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="table" variant="cell_text_link">
            cell_text_link
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="table" variant="cell_numeric_monospaced">
            cell_numeric_monospaced
          </Typography>
        </List.Item>
      </List>
    </List.Item>
    <List.Item>
      ui
      <List>
        <List.Item>
          <Typography group="ui" variant="tooltip">
            tooltip
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="ui" variant="snackbar">
            snackbar
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="ui" variant="accordion_header">
            accordion_header
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="ui" variant="chip__badge">
            chip__badge
          </Typography>
        </List.Item>
        <List.Item>
          <Typography group="ui" variant="chart">
            chart
          </Typography>
        </List.Item>
      </List>
    </List.Item>
  </List>
)
GroupsOverview.parameters = {
  docs: {
    storyDescription:
      'Variants ordered by their required group parameter. Example `<Typography group="input" variant="label"></Typography>`. Variants under `heading` and `paragraph` don’t require the group parameter and are therefore not included here.',
  },
}

export const Colors = (): JSX.Element => (
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

export const Custom = (): JSX.Element => (
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

export const Lines = (): JSX.Element => (
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
