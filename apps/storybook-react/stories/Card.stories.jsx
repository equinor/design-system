import React, { Fragment } from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Typography } from '@equinor/eds-core-react'
import { Card, Chips, Avatar } from '@equinor/eds-core-react'
import { text_field } from '@equinor/eds-icons'

const { CardTitle } = Card

const Grid = styled.div`
  height: 100%;
  width: 100%;
  padding: 32px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(4, 140px);
  grid-gap: 32px 32px;
`

const Wrapper = styled.div``

const Body = styled.div`
  height: 1500px;
  background: #ebebeb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

const META_CHOICES = {
  none: null,
  chips: <Chips>Meta</Chips>,
}

export default {
  title: 'Components|Card',
  component: Card,
  decorators: [withKnobs],
}

export const Cards = () => {
  return (
    <Grid>
      <Card
        variant={select('Variant', ['default', 'info', 'warning', 'danger'])}
      >
        <CardTitle
          title={text('Title', 'Title')}
          subtitle={text('Subtitle', 'Subtitle')}
          avatar={text('Avatar', 'https://i.imgur.com/UM3mrju.jpg')}
          metadata={select('Metadata', Object.keys(META_CHOICES), 'none')}
        />
      </Card>
      <Card variant="info"></Card>
      <Card variant="danger"></Card>
      <Card variant="warning"></Card>
    </Grid>
  )
}
