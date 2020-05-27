import React, { useState, useRef } from 'react'
import { Checkbox, LinearProgress } from '@equinor/eds-core-react'
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

export default {
  title: 'Components|Progress Indicators/Linear',
  component: LinearProgress,
}

export const Determinate = () => {
  return <Wrapper></Wrapper>
}

export const Indeterminate = () => {
  return <Wrapper></Wrapper>
}

export const WithKnobs = () => {
  return <Wrapper></Wrapper>
}
Determinate.story = {
  name: 'Determinate',
}

Indeterminate.story = {
  name: 'Indeterminate',
}

WithKnobs.story = {
  name: 'With Knobs',
}
