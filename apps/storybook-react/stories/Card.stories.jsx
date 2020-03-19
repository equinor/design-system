import React, { Fragment } from 'react'
import { withKnobs, select } from '@storybook/addon-knobs'
import styled from 'styled-components'
import {
  Card,
  // CardActions,
  // CardHeader,
  // CardMedia,
  // CardContent,
} from '@equinor/eds-core-react'

const Wrapper = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 100px 100px 100px 100px;
  grid-template-rows: 200px 200px 200px 200px;
`

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
    <Wrapper>
      <Card></Card>
    </Wrapper>
  )
}
