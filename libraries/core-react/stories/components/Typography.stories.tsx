import React from 'react'
import { Typography, TypographyProps } from '@components'
import styled from 'styled-components'
import { Story, Meta } from '@storybook/react'

const Wrapper = styled.div`
  margin: 32px;
`

const Grid = styled(Wrapper)`
  display: grid;
  grid-gap: 32px;
`

export default {
  title: 'Components/Typography',
  component: Typography,
} as Meta

export const headings: Story<TypographyProps> = () => (
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

export const paragraphs = (): JSX.Element => (
  <Grid>
    <Typography variant="body_short" link>
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
    <Typography variant="body_long" link>
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

export const colors = (): JSX.Element => (
  <Grid>
    <Typography color="primary"> Primary</Typography>
    <Typography color="secondary">Secondary</Typography>
    <Typography color="danger">Danger</Typography>
    <Typography color="warning">Warning</Typography>
    <Typography color="success">Success</Typography>
    <Typography color="disabled">Disabled</Typography>
    <Typography color="currentColor">CSS currentColor</Typography>
    <Typography color="pink">CSS pink</Typography>
  </Grid>
)

export const custom = (): JSX.Element => (
  <Grid>
    <Typography group="navigation" variant="label">
      Navigation / Label
    </Typography>
    <Typography group="navigation" variant="menu_title">
      Navigation / Menu / Title
    </Typography>
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
    <Typography group="table" variant="cell_text" link>
      Table / Cell / Text / Bold / Link
    </Typography>

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
  </Grid>
)

export const Lines = (): JSX.Element => (
  <Wrapper>
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
  </Wrapper>
)
