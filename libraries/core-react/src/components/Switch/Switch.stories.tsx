import { useState } from 'react'
import { Switch, SwitchProps, EdsProvider, Table } from '../..'
import styled from 'styled-components'
import { Meta, Story } from '@storybook/react'
import { data } from '../../stories/data'

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
    <EdsProvider density="compact">
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
    </EdsProvider>
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

export const alternativeToLabel: Story<SwitchProps> = () => (
  <Switch aria-label="This label is invisible, but read by screen-readers" />
)

alternativeToLabel.parameters = {
  docs: {
    description: {
      story:
        'To comply with accessibility, a `label` is always required on inputs. In some cases though, a visual label is not desirable. In such cases `aria-label` or `aria-labelledby` should be used',
    },
  },
}

export const TableSwitch: Story<SwitchProps> = () => {
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell>Selected</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {data.map((data) => (
          <Table.Row key={data.number}>
            <Table.Cell>
              <Switch aria-label={`Select ${data.description}`} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
TableSwitch.parameters = {
  docs: {
    description: {
      story:
        'Example of usage with `Switch` and `aria-label` in tables for accessibility',
    },
  },
}
