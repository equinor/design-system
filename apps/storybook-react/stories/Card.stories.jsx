import React, { Fragment } from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Typography } from '@equinor/eds-core-react'
import { Card, Chips } from '@equinor/eds-core-react'
import { text_field } from '@equinor/eds-icons'

const { CardTitle } = Card

const Wrapper = styled.div`
  height: 100vh;
  overflow: auto;
`

const Body = styled.div`
  height: 1500px;
  background: #ebebeb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

const Grid = styled.div`
  height: 150px;
  width: 100%;
  padding: 32px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-gap: 32px 32px;
`

export default {
  title: 'Components|Card',
  component: Card,
  decorators: [withKnobs],
}

export const h4Variations = () => {
  return (
    <Wrapper tabIndex="0">
      <Body>
        <Grid>
          <Card variant="info">
            <CardTitle variant="h4" title="Title" subtitle="Body short" />
          </Card>
          <Card>
            <CardTitle variant="h4" title="Title" subtitle="Body short" a />
          </Card>
          <Card variant="danger">
            <CardTitle variant="h4" title="Title" subtitle="Body short" />
          </Card>
        </Grid>
      </Body>
    </Wrapper>
  )
}

export const H5Variations = () => {
  return (
    <Wrapper tabIndex="0">
      <Body>
        <Grid>
          <Card variant="warning">
            <CardTitle variant="h5" title="Title" subtitle="Body short" />
          </Card>
          <Card variant="info">
            <CardTitle variant="h5" title="Title" subtitle="Body short" />
          </Card>
          <Card>
            <CardTitle variant="h5" title="Title" subtitle="Body short" />
          </Card>
        </Grid>
      </Body>
    </Wrapper>
  )
}

export const H6Variations = () => {
  return (
    <Wrapper tabIndex="0">
      <Body>
        <Grid>
          <Card>
            <CardTitle variant="h6" title="Title" caption="Caption" />
          </Card>
          <Card variant="warning">
            <CardTitle variant="h6" title="Title" caption="Caption" />
          </Card>

          <Card variant="danger">
            <CardTitle variant="h6" title="Title" overline="Overline" />
          </Card>
          <Card variant="info">
            <CardTitle variant="h6" title="Title" overline="Overline" />
          </Card>
          <Card>
            <CardTitle variant="h6" title="Title" overline="Overline" />
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
