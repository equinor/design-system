import React, { useState } from 'react'
import { Radio, RadioProps, Icon } from '@components'
import styled from 'styled-components'
import { checkbox } from '@equinor/eds-icons'
import { Meta, Story } from '@storybook/react'

Icon.add({ checkbox })

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
} as Meta

export const Default: Story<RadioProps> = (args) => (
  <Radio label="Play with me" {...args} />
)

export const SingleRadio: Story<RadioProps> = () => {
  return (
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
  )
}
export const GroupedRadio: Story<RadioProps> = () => {
  const [checked, updateChecked] = useState('one')
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateChecked(event.target.value)
  }
  return (
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
  )
}

GroupedRadio.storyName = 'Multiple radio buttons in a group'
SingleRadio.storyName = 'Single radio buttons'
