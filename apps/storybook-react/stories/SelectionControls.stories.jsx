import React, { useState } from 'react'
import { Radio, Checkbox, Switch } from '@equinor/eds-core-react'

import styled from 'styled-components'

const Wrapper = styled.div`
  /* height: calc(100vh - 64px); */
  /* background: #ebebeb; */
  display: grid;
  grid-template-rows: min-width;
  padding: 32px;
  grid-gap: 2rem;
  position: relative;
`

const BlockRadio = styled(Radio)`
  display: flex;
`

export default {
  title: 'Components|Selection controls',
  component: Radio,
}

export const RadioControl = () => {
  const [checked, updateChecked] = useState('one')
  const onChange = (event, value) => {
    console.log(event)
    updateChecked(value)
  }
  return (
    <Wrapper>
      <div>
        <Radio label="Check me" />
      </div>
      <div>
        <Radio label="You can't check me!" disabled />
      </div>
      <div>
        <Radio label="I'm preselected" defaultChecked />
      </div>
      <div>
        <Radio label="You can't check me!" disabled defaultChecked />
      </div>
      <div>
        <fieldset>
          <legend>We are in this together! 🙌</legend>
          <BlockRadio
            label="I'm number one and preselected"
            name="group"
            value="one"
            checked={checked === 'one'}
            onChange={onChange}
          />

          <BlockRadio
            label="I'm number two"
            name="group"
            value="two"
            checked={checked === 'two'}
            onChange={onChange}
          />
          <BlockRadio
            label="I'm number three"
            name="group"
            value="three"
            checked={checked === 'three'}
            onChange={onChange}
          />
        </fieldset>
      </div>
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
