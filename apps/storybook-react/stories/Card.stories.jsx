import React, { Fragment, useState } from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Typography } from '@equinor/eds-core-react'
import { Card, Chips, Button, Icon, Divider } from '@equinor/eds-core-react'
import { more_verticle, share, person_add, settings } from '@equinor/eds-icons'

const icons = {
  more_verticle,
  share,
  person_add,
  settings,
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
          <Card>
            <CardTitle title="Default" />
          </Card>
          <Card variant="info">
            <CardTitle title="Info" />
          </Card>
          <Card variant="warning">
            <CardTitle title="Warning" />
          </Card>
          <Card variant="danger">
            <CardTitle title="Danger" />
          </Card>
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

const CardTextMiddleBlock = () => (
  <CardText>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat.
  </CardText>
)

const CardTextLastBlock = () => (
  <CardText isLastBlock>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat.
  </CardText>
)

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

            <CardTextMiddleBlock />
            <StyledDivider variant="small" />
          </Card>
          <Card>
            <CardTitle
              variant="h5"
              title="Last"
              subtitle="To be used as the last block"
            />
            <StyledDivider variant="small" />
            <CardTextLastBlock />
          </Card>
        </Grid>
      </Body>
    </Wrapper>
  )
}

const CardMediaLeadingImage = () => (
  <CardMedia order="leading">
    <StyledImage src="https://i.imgur.com/UM3mrju.jpg" />
  </CardMedia>
)

const CardMediaMiddle = () => (
  <CardMedia order="middle">
    <StyledImage src="https://i.imgur.com/UM3mrju.jpg" />
  </CardMedia>
)

const CardMediaLast = () => (
  <CardMedia order="last">
    <Divider />
  </CardMedia>
)

export const CardMediaVariants = () => {
  return (
    <Wrapper tabIndex="0">
      <Body>
        <Grid>
          <Card>
            <CardMediaLeadingImage />
            <CardTitle
              variant="h5"
              title="Leading image"
              subtitle="To be used as leading block (image)"
            />
            <CardTextLastBlock />
          </Card>
          <Card>
            <CardTitle
              variant="h5"
              title="Middle"
              subtitle="To be used between blocks"
            />
            <CardMediaMiddle />
            <CardTextLastBlock />
          </Card>
          <Card>
            <CardTitle
              variant="h5"
              title="Last"
              subtitle="To be used as last block"
            />

            <CardTextMiddleBlock />
            <CardMediaLast />
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
            <CardTitle variant="h5" title="Aligned left" subtitle="Default" />
            <CardText>
              Action elements are aligned left in this example
            </CardText>
            <CardActionsDefault />
          </Card>
          <Card>
            <CardTitle
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
            <CardTitle
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
  middle: <CardTextMiddleBlock />,
  last: <CardTextLastBlock />,
}

const MEDIA_CHOICES = {
  none: null,
  leadingImage: <CardMediaLeadingImage />,
  middle: <CardMediaMiddle />,
  last: <CardMediaLast />,
}

const ACTIONS_CHOICES = {
  none: null,
  default: <CardActionsDefault />,
  alignedRight: <CardActionsAlignedRight />,
  meta: <CardActionsMeta />,
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
            <CardTitle
              variant={select('Title Variant', ['h4', 'h5', 'h6'])}
              title="Title"
              avatar={text('Avatar', 'https://i.imgur.com/UM3mrju.jpg')}
              subtitle="Subtitle"
              overline={select('Overline (only for H6)', [false, true])}
            />
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
