import React, { Fragment } from 'react'
import { withKnobs, select } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Typography } from '@equinor/eds-core-react'
import { Card } from '@equinor/eds-core-react'

const { CardHeader } = Card

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

export default {
  title: 'Components|Card',
  component: Card,
  decorators: [withKnobs],
}

export const Cards = () => {
  return (
    <Grid>
      <Card>
        <CardHeader title="Default" />
      </Card>
      <Card variant="info"></Card>
      <Card variant="danger"></Card>
      <Card variant="warning"></Card>
    </Grid>
  )
}
