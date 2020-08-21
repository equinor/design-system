import React, { useState } from 'react'
import { Switch, Icon, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { checkbox } from '@equinor/eds-icons'

Icon.add({ checkbox })
const Wrapper = styled.div`
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

const DarkModeTypography = styled(Typography)`
  margin: '1rem 0';
  ${({ darkMode }) =>
    darkMode && {
      color: 'white',
    }};
  transition: all 0.36s;
`

const Examples = styled.div`
  display: grid;
  grid-gap: 3rem;
  align-items: top;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
`

export default {
  title: 'Components|Selection controls/Switch',
  component: Switch,
}

export const SwitchControl = () => {
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

export const ControlledSwitchControl = () => {
  const [darkMode, setDarkMode] = useState(false)
  return (
    <Wrapper darkMode={darkMode}>
      <DarkModeTypography variant="h2" darkMode={darkMode}>
        Use case with controlled component
      </DarkModeTypography>
      <Switch
        checked={darkMode}
        ariaLabelledby="label-darkMode"
        onChange={() => setDarkMode(!darkMode)}
        label="Dark mode"
      />
    </Wrapper>
  )
}

SwitchControl.story = {
  name: 'Examples',
}
ControlledSwitchControl.story = {
  name: 'Controlled',
}
