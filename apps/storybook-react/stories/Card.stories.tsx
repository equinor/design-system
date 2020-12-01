import React from 'react'
import styled from 'styled-components'
import {
  Card,
  Avatar,
  Typography,
  Button,
  Icon,
  CardProps,
} from '@equinor/eds-core-react'
import { more_vertical, share, person_add, settings } from '@equinor/eds-icons'
import { Meta, Story } from '@storybook/react'

const icons = {
  more_vertical,
  share,
  person_add,
  settings,
}

Icon.add(icons)

const { CardHeader, CardHeaderTitle, CardMedia, CardActions } = Card

const Grid = styled.div`
  height: auto;
  width: 100%;
  padding: 32px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(2, 320px);
  grid-gap: 32px 32px;
  background: #ebebeb;
`

export default {
  title: 'Components/Card',
  component: Card,
  subcomponents: { CardHeader, CardHeaderTitle, CardMedia, CardActions },
} as Meta

export const Default: Story<CardProps> = (args) => {
  return (
    <Grid>
      <Card {...args}>
        <CardHeader>
          <CardHeaderTitle>
            <Typography variant="h5">An interactive example</Typography>
            <Typography variant="body_short">
              With some short content.
            </Typography>
          </CardHeaderTitle>
          <Button variant="ghost_icon">
            <Icon name="more_vertical" title="more action" size={48}></Icon>
          </Button>
        </CardHeader>
      </Card>
      <Card {...args}>
        <CardMedia fullWidth>
          <img src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
        </CardMedia>
        <CardHeader>
          <CardHeaderTitle>
            <Typography variant="h5">Another interactive example</Typography>
            <Typography variant="body_short">
              Unfortunately you cannot control children in storybook yet
            </Typography>
          </CardHeaderTitle>
        </CardHeader>
        <Typography variant="body_short">
          Leading images are full width, and go straight to the top - ignoring
          spacings
        </Typography>
      </Card>
    </Grid>
  )
}

export const Variants: Story<CardProps> = () => (
  <Grid>
    <Card>
      <CardHeader>
        <CardHeader>
          <Typography variant="h5">Default</Typography>
        </CardHeader>
      </CardHeader>
    </Card>
    <Card variant="info">
      <CardHeader>
        <Typography variant="h5">Info</Typography>
      </CardHeader>
    </Card>
    <Card variant="warning">
      <CardHeader>
        <Typography variant="h5">Warning</Typography>
      </CardHeader>
    </Card>
    <Card variant="danger">
      <CardHeader>
        <Typography variant="h5">Danger</Typography>
      </CardHeader>
    </Card>
  </Grid>
)

export const CardHeaderVariants: Story<CardProps> = () => (
  <Grid>
    <Card variant="info">
      <CardHeader>
        <CardHeaderTitle>
          <Typography variant="h4">Title goes here</Typography>
          <Typography variant="body_short">Body short</Typography>
        </CardHeaderTitle>
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <CardHeaderTitle>
          <Typography variant="h4">Title goes here</Typography>
          <Typography variant="body_short">Body short</Typography>
        </CardHeaderTitle>
        <Button variant="ghost_icon">
          <Icon name="more_vertical" title="more action" size={48}></Icon>
        </Button>
      </CardHeader>
    </Card>
    <Card variant="danger">
      <CardHeader>
        <CardHeaderTitle>
          <Typography variant="h4">Title goes here</Typography>
          <Typography variant="body_short">Body short</Typography>
        </CardHeaderTitle>
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
      </CardHeader>
    </Card>
    <Card variant="info">
      <CardHeader>
        <CardHeaderTitle>
          <Typography variant="h5">Title goes here</Typography>
          <Typography variant="body_short">Body short</Typography>
        </CardHeaderTitle>
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <CardHeaderTitle>
          <Typography variant="h5">Title goes here</Typography>
          <Typography variant="body_short">Body short</Typography>
        </CardHeaderTitle>
        <Button variant="ghost_icon">
          <Icon name="more_vertical" title="more action" size={48}></Icon>
        </Button>
      </CardHeader>
    </Card>
    <Card variant="danger">
      <CardHeader>
        <CardHeaderTitle>
          <Typography variant="h5">Title goes here</Typography>
          <Typography variant="body_short">Body short</Typography>
        </CardHeaderTitle>
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
        <CardHeaderTitle>
          <Typography variant="h6">Title goes here</Typography>
          <Typography variant="body_short">Caption</Typography>
        </CardHeaderTitle>
      </CardHeader>
    </Card>
    <Card variant="danger">
      <CardHeader>
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
        <CardHeaderTitle>
          <Typography variant="h6">Title goes here</Typography>
          <Typography variant="body_short">Caption</Typography>
        </CardHeaderTitle>
        <Button variant="ghost_icon">
          <Icon name="more_vertical" title="more action" size={48}></Icon>
        </Button>
      </CardHeader>
    </Card>

    <Card>
      <CardHeader>
        <CardHeaderTitle>
          <Typography variant="overline">Overline</Typography>
          <Typography variant="h6">Title goes here</Typography>
        </CardHeaderTitle>
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <CardHeaderTitle>
          <Typography variant="overline">Overline</Typography>
          <Typography variant="h6">Title goes here</Typography>
        </CardHeaderTitle>
        <Button variant="ghost_icon">
          <Icon name="more_vertical" title="more action" size={48}></Icon>
        </Button>
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <CardHeaderTitle>
          <Typography variant="overline">Overline</Typography>
          <Typography variant="h6">Title goes here</Typography>
        </CardHeaderTitle>
      </CardHeader>
    </Card>
  </Grid>
)

const CardMediaDefault = () => (
  <CardMedia>
    <img src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
  </CardMedia>
)
const CardMediafullWidth = () => (
  <CardMedia fullWidth>
    <img src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
  </CardMedia>
)

export const Media: Story<CardProps> = () => (
  <Grid>
    <Card>
      <CardMediafullWidth />
      <CardHeader>
        <CardHeaderTitle>
          <Typography variant="h5">Full width</Typography>
          <Typography variant="body_short">
            Full width as leading block
          </Typography>
        </CardHeaderTitle>
      </CardHeader>
      <Typography variant="body_short">
        Leading images are full width, and go straight to the top - ignoring
        spacings
      </Typography>
    </Card>
    <Card>
      <CardHeader>
        <CardHeaderTitle>
          <Typography variant="h5">Full width</Typography>
          <Typography variant="body_short">Full width as last block</Typography>
        </CardHeaderTitle>
      </CardHeader>
      <Typography variant="body_short">
        Last blocks with fullWidth ignores left and right spacings but keep 24px
        bottom spacing
      </Typography>
      <CardMediafullWidth />
    </Card>
    <Card>
      <CardHeader>
        <CardHeaderTitle>
          <Typography variant="h5">Middle</Typography>
          <Typography variant="body_short">
            To be used between blocks
          </Typography>
        </CardHeaderTitle>
      </CardHeader>
      <CardMediaDefault />
      <Typography variant="body_short">
        Default spacing is 16px between middle blocks
      </Typography>
    </Card>
  </Grid>
)

const CardActionsDefault = () => (
  <CardActions>
    <Button>Cancel</Button>
    <Button>OK</Button>
  </CardActions>
)

const CardActionsAlignedRight = () => (
  <CardActions alignRight>
    <Button variant="ghost_icon">
      <Icon name="person_add" title="add person action" size={48}></Icon>
    </Button>
    <Button variant="ghost_icon">
      <Icon name="settings" title="settings action" size={48}></Icon>
    </Button>
    <Button variant="ghost_icon">
      <Icon name="save" title="save action" size={48}></Icon>
    </Button>
  </CardActions>
)

const CardActionsMeta = () => (
  <CardActions meta="Share">
    <Button variant="ghost_icon">
      <Icon name="share" title="share action" size={48}></Icon>
    </Button>
  </CardActions>
)

export const Actions: Story<CardProps> = () => (
  <Grid>
    <Card>
      <CardHeader>
        <CardHeaderTitle>
          <Typography variant="h5">Default</Typography>
          <Typography variant="body_short">Left aligned buttons</Typography>
        </CardHeaderTitle>
      </CardHeader>
      <Typography variant="body_short">
        Action elements are aligned left in this example
      </Typography>

      <CardActionsDefault />
    </Card>
    <Card>
      <CardHeader>
        <CardHeaderTitle>
          <Typography variant="h5">Right</Typography>
          <Typography variant="body_short">Right aligned buttons</Typography>
        </CardHeaderTitle>
      </CardHeader>
      <Typography variant="body_short">
        Action elements are aligned right in this example
      </Typography>
      <CardActionsAlignedRight />
    </Card>
    <Card>
      <CardHeader>
        <CardHeaderTitle>
          <Typography variant="h5">Meta</Typography>
          <Typography variant="body_short">
            Use as supporting text for icons
          </Typography>
        </CardHeaderTitle>
      </CardHeader>
      <Typography variant="body_short">
        Action elements with metadata
      </Typography>
      <CardActionsMeta />
    </Card>
  </Grid>
)
