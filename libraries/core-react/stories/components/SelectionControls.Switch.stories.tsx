import React, { useState } from 'react'
import { Switch, SwitchProps } from '@components'
import styled from 'styled-components'
import { Meta, Story } from '@storybook/react'

type WrapperStyleProps = {
  darkMode?: boolean
}
const Wrapper = styled.div<WrapperStyleProps>`
  display: grid;
  grid-template-rows: min-width;
  padding: 32px;
  padding-bottom: 8rem;
  grid-gap: 2rem;
  position: relative;
  background-color: ${({ darkMode }) => (darkMode ? '#0A0310' : 'white')};
  color: ${({ darkMode }) => (darkMode ? 'white' : 'black')};
  transition: all 0.36s;
`

const UnstyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

const Examples = styled.div`
  display: grid;
  grid-gap: 3rem;
  align-items: top;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
`

export default {
  title: 'Components/Selection controls/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component: `Selection controls allow users to select options, make decisions and set preferences.
        `,
      },
    },
  },
} as Meta

export const Default: Story<SwitchProps> = (args) => (
  <Switch label="Play with me" {...args} />
)

export const Variants: Story<SwitchProps> = () => {
  return (
    <Wrapper>
      <Examples>
        <div>
          <span>Default</span>
          <UnstyledList>
            <li>
              <Switch label="I'm default off" />
            </li>
            <li>
              <Switch label="I'm default on" defaultChecked />
            </li>
            <li>
              <Switch disabled label="You can't turn me on!" />
            </li>
            <li>
              <Switch disabled defaultChecked label="You can't turn me off!" />
            </li>
          </UnstyledList>
        </div>
        <div>
          <span>Small</span>
          <UnstyledList>
            <li>
              <Switch label="I'm default off" size="small" />
            </li>
            <li>
              <Switch label="I'm default on" defaultChecked size="small" />
            </li>
            <li>
              <Switch disabled label="You can't turn me on!" size="small" />
            </li>
            <li>
              <Switch
                disabled
                defaultChecked
                label="You can't turn me off!"
                size="small"
              />
            </li>
          </UnstyledList>
        </div>
      </Examples>
    </Wrapper>
  )
}

export const ControlledSwitchControl: Story<SwitchProps> = () => {
  const [darkMode, setDarkMode] = useState(false)
  return (
    <Wrapper darkMode={darkMode}>
      <Switch
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
        label="Dark mode"
      />
    </Wrapper>
  )
}

ControlledSwitchControl.storyName = 'Use case with controlled component'
