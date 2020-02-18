import React from 'react'
import styled from 'styled-components'
// import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Chips, Typography } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'

export default {
  title: 'Components|Chips',
  component: Chips,
}

const Wrapper = styled.div`
  margin: 32px;
`

export const allChips = () => (
  <Wrapper>
    <Typography>All the Chips</Typography>
    <Chips />
  </Wrapper>
)
