import React, { Fragment } from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Typography } from '@equinor/eds-core-react'
import { Card, Chips, Button, Icon } from '@equinor/eds-core-react'
import { more_verticle } from '@equinor/eds-icons'

const icons = {
  more_verticle,
}

Icon.add(icons)

const { CardTitle, CardMedia, CardContent, CardActions } = Card

const Wrapper = styled.div`
  height: 100vh;
  overflow: auto;
`

const Body = styled.div`
  height: 1500px;
  background: #ebebeb;
  padding: 32px;
`

const Grid = styled.div`
  height: auto;
  width: 100%;
  padding: 32px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(2, 250px);
  grid-gap: 32px 32px;
`

export default {
  title: 'Components|Card',
  component: Card,
  decorators: [withKnobs],
}

export const ColorVariants = () => {
  return (
    <Wrapper tabIndex="0">
      <Body>
        <Grid>
          <Card>Default</Card>
          <Card variant="info">Info</Card>
          <Card variant="warning">Warning</Card>
          <Card variant="danger">Danger</Card>
        </Grid>
      </Body>
    </Wrapper>
  )
}

export const TitleVariants = () => {
  return (
    <Wrapper tabIndex="0">
      <Body>
        <Typography variant="h4">Variant h4:</Typography>
        <Grid>
          <Card variant="info">
            <CardTitle variant="h4" title="Title" subtitle="Body short" />
          </Card>
          <Card>
            <CardTitle
              variant="h4"
              title="Title"
              subtitle="Body short"
              action={
                <Button variant="ghost_icon">
                  <Icon
                    name="more_verticle"
                    title="more action"
                    size={48}
                  ></Icon>
                </Button>
              }
            />
          </Card>
          <Card variant="danger">
            <CardTitle
              variant="h4"
              title="Title"
              subtitle="Body short"
              avatar="https://i.imgur.com/UM3mrju.jpg"
            />
          </Card>
        </Grid>
        <Typography variant="h4">Variant h5:</Typography>
        <Grid>
          <Card variant="warning">
            <CardTitle variant="h5" title="Title" subtitle="Body short" />
          </Card>
          <Card variant="info">
            <CardTitle
              variant="h5"
              title="Title"
              subtitle="Body short"
              action={
                <Button variant="ghost_icon">
                  <Icon
                    name="more_verticle"
                    title="more action"
                    size={48}
                  ></Icon>
                </Button>
              }
            />
          </Card>
          <Card>
            <CardTitle
              variant="h5"
              title="Title"
              subtitle="Body short"
              avatar="https://i.imgur.com/UM3mrju.jpg"
            />
            <CardContent />
          </Card>
        </Grid>
        <Typography variant="h4">Variant h6:</Typography>
        <Grid>
          <Card>
            <CardTitle
              variant="h6"
              title="Title"
              subtitle="Caption"
              avatar="https://i.imgur.com/UM3mrju.jpg"
            />
          </Card>
          <Card variant="warning">
            <CardTitle
              variant="h6"
              title="Title"
              subtitle="Caption"
              avatar="https://i.imgur.com/UM3mrju.jpg"
              action={
                <Button variant="ghost_icon">
                  <Icon
                    name="more_verticle"
                    title="more action"
                    size={48}
                  ></Icon>
                </Button>
              }
            />
          </Card>

          <Card variant="danger">
            <CardTitle
              variant="h6"
              title="Title"
              overline
              subtitle="Overline"
            />
          </Card>
          <Card variant="info">
            <CardTitle
              variant="h6"
              title="Title"
              overline
              subtitle="Overline"
              action={
                <Button variant="ghost_icon">
                  <Icon
                    name="more_verticle"
                    title="more action"
                    size={48}
                  ></Icon>
                </Button>
              }
            />
          </Card>
          <Card>
            <CardTitle
              variant="h6"
              title="Title"
              overline
              subtitle="Overline"
              avatar="https://i.imgur.com/UM3mrju.jpg"
            />
          </Card>
        </Grid>
      </Body>
    </Wrapper>
  )
}

const AVATAR_CHOICES = {
  none: '',
  avatar: text('Avatar', 'https://i.imgur.com/UM3mrju.jpg'),
}

export const WithKnobs = () => {
  const avatarChoices = select('Avatar', Object.keys(AVATAR_CHOICES), 'avatar')

  return (
    <Wrapper tabIndex="0">
      <Body>
        <Grid>
          <Card
            variant={select('Card Variant', [
              'default',
              'info',
              'warning',
              'danger',
            ])}
          >
            <CardTitle
              variant={select('Title Variant', ['h4', 'h5', 'h6'])}
              title={text('Title', 'Title')}
              avatar={AVATAR_CHOICES[avatarChoices]}
              subtitle={text('Subtitle', 'Subtitle')}
              overline={select('Overline H6 Subtitle', [false, true])}
            />
          </Card>
        </Grid>
      </Body>
    </Wrapper>
  )
}
