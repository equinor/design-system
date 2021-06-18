import { useState } from 'react'
import { Switch, SwitchProps } from '../..'
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

export default {
  title: 'Components/Switch',
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

export const DefaultStates: Story<SwitchProps> = () => {
  const UnstyledList = styled.ul`
    list-style-type: none;
    li {
      margin-bottom: 8px;
    }
  `
  return (
    <Wrapper>
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
    </Wrapper>
  )
}

export const Compact: Story<SwitchProps> = () => {
  const UnstyledList = styled.ul`
    list-style-type: none;
    li {
      margin-bottom: 4px;
    }
  `
  return (
    <Wrapper>
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
