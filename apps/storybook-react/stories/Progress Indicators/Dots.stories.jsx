import React, { useState, useRef } from 'react'
import { Checkbox, DotProgress, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'

const Body = styled.div`
  margin: 42px;
  display: grid;
  grid-auto-columns: auto;
`

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 64px;
  grid-template-columns: repeat(3, fit-content(100%));
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
