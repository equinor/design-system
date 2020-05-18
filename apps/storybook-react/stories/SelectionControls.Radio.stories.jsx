import React, { useState, useRef } from 'react'
import {
  Radio,
  Checkbox,
  Switch,
  Icon,
  Typography,
  Button,
} from '@equinor/eds-core-react'
import styled from 'styled-components'
import { checkbox } from '@equinor/eds-icons'
import { useForm } from 'react-hook-form'
Icon.add({ checkbox })
const Wrapper = styled.div`
  padding: 32px;
  padding-bottom: 8rem;
`

const BlockRadio = styled(Radio)`
  display: flex;
`

const UnstyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

export default {
  title: 'Components|Selection controls/Radio',
  component: Radio,
}

export const RadioControl = () => {
  const [checked, updateChecked] = useState('one')
  const onChange = (event, value) => {
    updateChecked(value)
  }
  return (
    <Wrapper>
      <Typography variant="h2" style={{ margin: '1rem 0' }}>
        Single radiobox examples
      </Typography>
      <div>
        <Radio label="Check me" name="first" />
      </div>
      <div>
        <Radio label="You can't check me!" disabled name="second" />
      </div>
      <div>
        <Radio label="I'm preselected" defaultChecked name="third" />
      </div>
      <div>
        <Radio
          label="You can't uncheck me!"
          disabled
          defaultChecked
          name="fourth"
        />
      </div>
    </Wrapper>
  )
}
export const RadioGroupControl = () => {
  const [checked, updateChecked] = useState('one')
  const onChange = (event, value) => {
    updateChecked(value)
  }
  return (
    <Wrapper>
      <Typography variant="h2" style={{ margin: '1rem 0' }}>
        Group example as controlled components and onChange
      </Typography>
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
    </Wrapper>
  )
}

RadioControl.story = {
  name: 'Single',
}
RadioGroupControl.story = {
  name: 'Group',
}
