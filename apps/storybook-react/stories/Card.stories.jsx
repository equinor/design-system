import React, { Fragment } from 'react'
import { withKnobs, select } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Card, Typography } from '@equinor/eds-core-react'
// import {
//   Card,
//   // CardActions,
//   // CardHeader,
//   // CardMedia,
//   // CardContent,
// } from '@equinor/eds-core-react'

const Grid = styled.div`
  height: 100%;
  margin: 32px;
  display: grid;
  grid-template-columns: 180px 180px 180px 180px;
  grid-template-rows: 200px 200px 200px 200px;
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
      <Card></Card>
      <Card variant="info"></Card>
      <Card variant="danger"></Card>
      <Card variant="warning"></Card>
    </Grid>
  )
}
