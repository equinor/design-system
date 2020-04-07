import React, { Fragment, useState } from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import styled from 'styled-components'
import {
  Card,
  Avatar,
  Typography,
  Button,
  Icon,
  Divider,
} from '@equinor/eds-core-react'
import { more_verticle, share, person_add, settings } from '@equinor/eds-icons'

const icons = {
  more_verticle,
  share,
  person_add,
  settings,
}

Icon.add(icons)

const { CardHeader, CardHeaderTitle, CardMedia, CardText, CardActions } = Card

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

const StyledImage = styled.img`
  width: 400px;
`

const StyledDivider = styled(Divider)`
  width: 100%;
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
        <Typography variant="h4">Card variants</Typography>
        <Grid>
          <Card>
            <CardHeader>
              <Typography variant="h6">Default</Typography>
            </CardHeader>
          </Card>
          <Card variant="info">
            <CardHeader>
              <Typography variant="h6">Info</Typography>
            </CardHeader>
          </Card>
          <Card variant="warning">
            <CardHeader>
              <Typography variant="h6">Warning</Typography>
            </CardHeader>
          </Card>
          <Card variant="danger">
            <CardHeader>
              <Typography variant="h6">Danger</Typography>
            </CardHeader>
          </Card>
        </Grid>
      </Body>
    </Wrapper>
  )
}

export const CardHeaderVariants = () => {
  return (
    <Wrapper tabIndex="0">
      <Body>
        <Typography variant="h4">CardHeader variants</Typography>
        <Typography variant="h6">Variant h4</Typography>
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
                <Icon name="more_verticle" title="more action" size={48}></Icon>
              </Button>
            </CardHeader>
          </Card>
          <Card variant="danger">
            <CardHeader>
              <CardHeaderTitle>
                <Typography variant="h4">Title goes here</Typography>
                <Typography variant="body_short">Body short</Typography>
              </CardHeaderTitle>
              <Avatar
                alt="Kitten"
                src="https://i.imgur.com/UM3mrju.jpg"
                size={40}
              />
            </CardHeader>
          </Card>
        </Grid>
        <Typography variant="h6">Variant h5</Typography>
        <Grid>
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
                <Icon name="more_verticle" title="more action" size={48}></Icon>
              </Button>
            </CardHeader>
          </Card>
          <Card variant="danger">
            <CardHeader>
              <CardHeaderTitle>
                <Typography variant="h5">Title goes here</Typography>
                <Typography variant="body_short">Body short</Typography>
              </CardHeaderTitle>
              <Avatar
                alt="Kitten"
                src="https://i.imgur.com/UM3mrju.jpg"
                size={40}
              />
            </CardHeader>
          </Card>
        </Grid>
        <Typography variant="h6">Variant h6</Typography>
        <Grid>
          <Card>
            <CardHeader>
              <Avatar
                alt="Kitten"
                src="https://i.imgur.com/UM3mrju.jpg"
                size={40}
              />
              <CardHeaderTitle marginLeft>
                <Typography variant="h6">Title goes here</Typography>
                <Typography variant="caption">Caption</Typography>
              </CardHeaderTitle>
            </CardHeader>
          </Card>
          <Card variant="danger">
            <CardHeader>
              <Avatar
                alt="Kitten"
                src="https://i.imgur.com/UM3mrju.jpg"
                size={40}
              />
              <CardHeaderTitle marginLeft>
                <Typography variant="h6">Title goes here</Typography>
                <Typography variant="caption">Caption</Typography>
              </CardHeaderTitle>
              <Button variant="ghost_icon">
                <Icon name="more_verticle" title="more action" size={48}></Icon>
              </Button>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardHeaderTitle>
                <Typography variant="overline">Overline</Typography>
                <Typography variant="h6">Title goes here</Typography>
              </CardHeaderTitle>
              <Avatar
                alt="Kitten"
                src="https://i.imgur.com/UM3mrju.jpg"
                size={40}
              />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardHeaderTitle>
                <Typography variant="overline">Overline</Typography>
                <Typography variant="h6">Title goes here</Typography>
              </CardHeaderTitle>
              <Button variant="ghost_icon">
                <Icon name="more_verticle" title="more action" size={48}></Icon>
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
      </Body>
    </Wrapper>
  )
}

export const CardTextVariants = () => {
  return (
    <Wrapper tabIndex="0">
      <Body>
        <Typography variant="h4">CardText variants</Typography>
        <Typography variant="body_short">Supporting text</Typography>
        <Grid>
          <Card>
            <CardHeader
              variant="h5"
              title="Middle"
              subtitle="Between other blocks"
            />

            <CardText>Margin bottom for middle placed text is 16px</CardText>
            <StyledDivider variant="medium" />
          </Card>
          <Card>
            <CardHeader variant="h5" title="Last" subtitle="Last block" />

            <StyledDivider variant="medium" />

            <CardText>
              Margin bottom is automatically set to 24px for the last child in
              Card
            </CardText>
          </Card>
        </Grid>
      </Body>
    </Wrapper>
  )
}

const CardMediaLeadingImage = () => (
  <CardMedia isLeading>
    <StyledImage
      src="https://i.imgur.com/UM3mrju.jpg"
      alt="Image for representation"
    />
  </CardMedia>
)

const CardMediaDefault = () => (
  <CardMedia>
    <StyledImage
      src="https://i.imgur.com/UM3mrju.jpg"
      alt="Image for representation"
    />
  </CardMedia>
)

export const CardMediaVariants = () => {
  return (
    <Wrapper tabIndex="0">
      <Body>
        <Typography variant="h4">CardMedia variants</Typography>
        <Typography variant="body_short">
          Media content as leading, middle or last block
        </Typography>
        <Grid>
          <Card>
            <CardMediaLeadingImage />
            <CardHeader
              variant="h5"
              title="Leading image"
              subtitle="To be used as leading block (image)"
            />
            <CardText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </CardText>
          </Card>
          <Card>
            <CardHeader
              variant="h5"
              title="Middle"
              subtitle="To be used between blocks"
            />
            <CardMediaDefault />
            <CardText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </CardText>
          </Card>
          <Card>
            <CardHeader
              variant="h5"
              title="Last"
              subtitle="To be used as last block"
            />

            <CardText>
              Padding is set to 24px for the last child in Card
            </CardText>
            <CardMediaDefault />
          </Card>
        </Grid>
      </Body>
    </Wrapper>
  )
}

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

export const CardActionsVariants = () => {
  return (
    <Wrapper tabIndex="0">
      <Body>
        <Grid>
          <Card>
            <CardHeader variant="h5" title="Aligned left" subtitle="Default" />
            <CardText>
              Action elements are aligned left in this example
            </CardText>
            <CardActionsDefault />
          </Card>
          <Card>
            <CardHeader
              variant="h5"
              title="Aligned right"
              subtitle="To be used for icons"
            />
            <CardText>
              Action elements are aligned right in this example
            </CardText>
            <CardActionsAlignedRight />
          </Card>
          <Card>
            <CardHeader
              variant="h5"
              title="Meta"
              subtitle="To be used as supporting text for actions"
            />
            <CardText>Action element with metadata</CardText>
            <CardActionsMeta />
          </Card>
        </Grid>
      </Body>
    </Wrapper>
  )
}

const TEXT_CHOICES = {
  none: null,
  default: <CardText />,
}

const MEDIA_CHOICES = {
  none: null,
  isLeading: <CardMediaLeadingImage />,
  default: <CardMediaDefault />,
}

const ACTIONS_CHOICES = {
  none: null,
  default: <CardActionsDefault />,
  alignedRight: <CardActionsAlignedRight />,
  meta: <CardActionsMeta />,
}

const AVATAR_CHOICES = {
  none: null,
  avatar: 'https://i.imgur.com/UM3mrju.jpg',
}

export const WithKnobs = () => {
  //const avatarChoices = select('Title', Object.keys(AVATAR_CHOICES), 'avatar')

  const title = boolean('Title', true)
  const titleVariant = title
    ? select('Title variant', ['h4', 'h5', 'h6'])
    : null
  const avatar =
    (title && titleVariant === 'h6') || (title && !titleAction)
      ? boolean('Avatar', true)
      : null
  const titleAction =
    (title && titleVariant === 'h6') || (title && !avatar)
      ? boolean('Title Action', false)
      : null
  const clickable = boolean('Clickable card', false)

  return (
    <Wrapper tabIndex="0">
      <Body>
        <Grid>
          <Card
            onClick={clickable ? () => location.reload() : null}
            variant={select('Card Variant', [
              'default',
              'info',
              'warning',
              'danger',
            ])}
          >
            {title && (
              <CardHeader
                variant={title && titleVariant}
                title="Title"
                avatar={avatar && 'https://i.imgur.com/UM3mrju.jpg'}
                subtitle="Subtitle"
                overline={
                  titleVariant === 'h6' && boolean('Overline subtitle', false)
                }
                action={
                  titleAction && (
                    <Button variant="ghost_icon">
                      <Icon
                        name="more_verticle"
                        title="more action"
                        size={48}
                      ></Icon>
                    </Button>
                  )
                }
              />
            )}
            {
              TEXT_CHOICES[
                select('Supporting text', Object.keys(TEXT_CHOICES), 'middle')
              ]
            }
            {
              MEDIA_CHOICES[
                select('Rich Media', Object.keys(MEDIA_CHOICES), 'middle')
              ]
            }
            {
              ACTIONS_CHOICES[
                select('Actions', Object.keys(ACTIONS_CHOICES), 'default')
              ]
            }
          </Card>
        </Grid>
      </Body>
    </Wrapper>
  )
}
