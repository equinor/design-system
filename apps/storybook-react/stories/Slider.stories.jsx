import React from 'react'
import { Slider, Button, Typography } from '@equinor/eds-core-react'

import styled from 'styled-components'

const Body = styled.div`
  height: calc(100vh - 64px);
  background: #ebebeb;
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  padding: 32px;
  grid-gap: 32px;
`

export default {
  title: 'Components|Slider',
  component: Slider,
}

export const Page = () => {
  return (
    <Body>
      <Slider />
    </Body>
  )
}
