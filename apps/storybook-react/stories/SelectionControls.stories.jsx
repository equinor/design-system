import React, { useState, useRef } from 'react'
import { Radio, Checkbox, Switch, Icon } from '@equinor/eds-core-react'

import styled from 'styled-components'
import { checkbox } from '@equinor/eds-icons'
Icon.add({ checkbox })
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
  // Use this to set the input to indeterminate = true as this must be done via JavaScript
  // (cannot use an HTML attribute for this)
  const indeterminateRef = useRef()
  const submitHandler = (e) => {
    console.log('target', e.target.name)
    e.preventDefault()
  }
  return (
    <Wrapper>
      <div>
        <Checkbox label="Check me" />
      </div>
      <div>
        <Checkbox label="You can't check me!" disabled />
      </div>
      <div>
        <Checkbox label="I'm preselected" defaultChecked />
      </div>
      <div>
        <Checkbox label="You can't check me!" disabled defaultChecked />
      </div>
      <div>
        <Checkbox
          label="I'm in indeterminate state"
          indeterminate
          ref={indeterminateRef}
        />
      </div>
      <form onSubmit={(e) => submitHandler(e)}>
        <fieldset>
          <legend>We are multiple checkboxes</legend>
          <Checkbox label="Check me first" name="multiple" value="first" />
          <Checkbox label="Check me second" name="multiple" value="second" />
          <Checkbox label="Check me third" name="multiple" value="third" />
        </fieldset>
        <input type="submit" value="Yes, done!" />
      </form>
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
