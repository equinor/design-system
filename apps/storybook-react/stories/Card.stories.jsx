import React, { Fragment, useState } from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Typography } from '@equinor/eds-core-react'
import { Card, Chips, Button, Icon, Divider } from '@equinor/eds-core-react'
import { more_verticle } from '@equinor/eds-icons'

const icons = {
  more_verticle,
}

Icon.add(icons)

const { CardTitle, CardMedia, CardText, CardActions } = Card

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

const StyledDivider = styled(Divider)`
  width: 100%;
`

const StyledImage = styled.img`
  width: 250px;
`

export default {
  title: 'Components|Card',
  component: Card,
  decorators: [withKnobs],
}

export const CardVariants = () => {
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

export const CardTitleVariants = () => {
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
            <CardText />
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

export const CardTextVariants = () => {
  return (
    <Wrapper tabIndex="0">
      <Body>
        <Grid>
          <Card>
            <CardTitle
              variant="h5"
              title="Middle"
              subtitle="To be used between other blocks (default)"
            />

            <CardText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </CardText>
            <StyledDivider variant="small" />
          </Card>
          <Card>
            <CardTitle
              variant="h5"
              title="Last"
              subtitle="To be used as the last block"
            />
            <StyledDivider variant="small" />
            <CardText isLastBlock>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </CardText>
          </Card>
        </Grid>
      </Body>
    </Wrapper>
  )
}

export const CardMediaVariants = () => {
  return (
    <Wrapper tabIndex="0">
      <Body>
        <Grid>
          <Card>
            <CardTitle
              variant="h5"
              title="Middle"
              subtitle="To be used between blocks"
            />
            <CardMedia order="middle">
              <Divider variant="small" />
            </CardMedia>
            <CardText isLastBlock>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </CardText>
          </Card>
          <Card>
            <CardTitle
              variant="h5"
              title="Last"
              subtitle="To be used as last block"
            />

            <CardText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </CardText>
            <CardMedia order="last">
              <Divider variant="small" />
            </CardMedia>
          </Card>
          <Card>
            <CardMedia order="leading">
              <StyledImage src="https://i.imgur.com/UM3mrju.jpg" />
            </CardMedia>
            <CardTitle
              variant="h5"
              title="Leading image"
              subtitle="To be used as leading block (image)"
            />
            <CardText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </CardText>
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

const TITLE_CHOICES = {
  off: null,
  on: (
    <CardTitle
      variant={select('Title Variant', ['h4', 'h5', 'h6'])}
      title="Title"
      avatar={text('Avatar', 'https://i.imgur.com/UM3mrju.jpg')}
      subtitle="Subtitle"
      overline={select('Overline H6 Subtitle', [false, true])}
    />
  ),
}

const TEXT_CHOICES = {
  off: null,
  on: (
    <CardText isLastBlock={boolean('is Last Block', false)}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </CardText>
  ),
}

export const WithKnobs = () => {
  //const avatarChoices = select('Avatar', Object.keys(AVATAR_CHOICES), 'avatar')
  // const titleChoices = select('Title', Object.keys(TITLE_CHOICES), title)

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
            {TITLE_CHOICES[select('Title', Object.keys(TITLE_CHOICES), 'on')]}
            {
              TEXT_CHOICES[
                select('Supporting text', Object.keys(TEXT_CHOICES), 'on')
              ]
            }
          </Card>
        </Grid>
      </Body>
    </Wrapper>
  )
}
