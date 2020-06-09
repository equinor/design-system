import React, { useState, useRef } from 'react'
import { Checkbox, DotProgress, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'

const Body = styled.div`
  display: grid;
  grid-template-rows: min-width;
  padding: 32px;
  padding-bottom: 8rem;
  grid-gap: 2rem;
`

const Wrapper = styled.div`
  margin-left: 16px;
`

const Background = styled.div`
  background-color: grey;
  width: 36px;
  padding: 8px;
`

export default {
  title: 'Components|Progress Indicators/Dots',
  component: DotProgress,
}

export const Variants = () => {
  return (
    <Body>
      <Typography variant="h4">White</Typography>
      <Wrapper>
        <Background>
          <DotProgress variant="white" />
        </Background>
      </Wrapper>
      <Typography variant="h4">Green</Typography>
      <Wrapper>
        <DotProgress variant="green" />
      </Wrapper>
    </Body>
  )
}

Variants.story = {
  name: 'Variants',
}
