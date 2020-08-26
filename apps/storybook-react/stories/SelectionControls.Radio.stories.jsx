import React, { useState } from 'react'
import { Radio, Icon, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { checkbox } from '@equinor/eds-icons'

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
  title: 'Components/Selection controls/Radio',
  component: Radio,
}

export const RadioControl = () => {
  return (
    <Wrapper>
      <Typography variant="h2" style={{ margin: '1rem 0' }}>
        Single radiobox examples
      </Typography>
      <div>
        <BlockRadio label="Check me" name="first" />
        <BlockRadio label="You can't check me!" disabled name="second" />
        <BlockRadio label="I'm preselected" defaultChecked name="third" />
        <BlockRadio
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
  const onChange = (event) => {
    updateChecked(event.target.value)
  }
  return (
    <Wrapper>
      <Typography variant="h2" style={{ margin: '1rem 0' }}>
        Group example as controlled components and onChange
      </Typography>
      <fieldset>
        <legend>
          We are in this together!
          <span role="img" aria-label="raising hands emoji">
            🙌
          </span>
        </legend>
        <UnstyledList>
          <li>
            <Radio
              label="I'm number one and preselected"
              name="group"
              value="one"
              checked={checked === 'one'}
              onChange={onChange}
            />
          </li>
          <li>
            <Radio
              label="I'm number two"
              name="group"
              value="two"
              checked={checked === 'two'}
              onChange={onChange}
            />
          </li>
          <li>
            <Radio
              label="I'm number three"
              name="group"
              value="three"
              checked={checked === 'three'}
              onChange={onChange}
            />
          </li>
        </UnstyledList>
      </fieldset>
    </Wrapper>
  )
}

RadioControl.storyName = 'Single'
RadioGroupControl.storyName = 'Group'
