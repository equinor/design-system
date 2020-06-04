import React, { useState, useRef } from 'react'
import { Checkbox, DotProgress } from '@equinor/eds-core-react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: min-width;
  padding: 32px;
  padding-bottom: 8rem;
  grid-gap: 2rem;
  position: relative;
  transition: all 0.36s;
`

const Background = styled.div`
  background-color: grey;
`

export default {
  title: 'Components|Progress Indicators/Dots',
  component: DotProgress,
}

export const Variants = () => {
  return (
    <Wrapper>
      <Background>
        <DotProgress variant="white" />
      </Background>
      <DotProgress variant="green" />
    </Wrapper>
  )
}

export const WithKnobs = () => {
  return <Wrapper></Wrapper>
}

Variants.story = {
  name: 'Variants',
}

WithKnobs.story = {
  name: 'With Knobs',
}
