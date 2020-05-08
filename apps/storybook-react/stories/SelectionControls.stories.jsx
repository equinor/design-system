import React, { useState } from 'react'
import { Radio, Checkbox, Switch } from '@equinor/eds-core-react'

import styled from 'styled-components'

const Wrapper = styled.div`
  /* height: calc(100vh - 64px); */
  /* background: #ebebeb; */
  display: grid;
  grid-template-rows: min-width;
  padding: 32px;
  grid-gap: 4rem;
  position: relative;
`

export default {
  title: 'Components|Selection controls',
  component: Radio,
}

export const RadioControl = () => {
  return (
    <Wrapper>
      <Radio />
    </Wrapper>
  )
}
export const CheckboxControl = () => {
  return (
    <Wrapper>
      <Checkbox />
    </Wrapper>
  )
}
export const SwitchControl = () => {
  return (
    <Wrapper>
      <Switch />
    </Wrapper>
  )
}

RadioControl.story = {
  name: 'Radio',
}
CheckboxControl.story = {
  name: 'Checkbox',
}
SwitchControl.story = {
  name: 'Switch',
}
