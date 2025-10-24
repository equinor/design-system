import { useState, useEffect, ChangeEvent } from 'react'
import { Switch, SwitchProps, EdsProvider, Table, Density } from '../..'
import styled from 'styled-components'
import { StoryFn, Meta } from '@storybook/react-vite'
import { data } from '../../stories/data'
import { Stack } from './../../../.storybook/components'
import page from './Switch.docs.mdx'

const UnstyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

const meta: Meta<typeof Switch> = {
  title: 'Inputs/Selection Controls/Switch',
  component: Switch,
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Stack>
          <Story />
        </Stack>
      )
    },
  ],
}

export default meta

export const Introduction: StoryFn<SwitchProps> = (args) => {
  return <Switch label="Play with me" {...args} />
}

export const DefaultStates: StoryFn<SwitchProps> = () => {
  const [check, setCheck] = useState(false)

  return (
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
      <li>
        <Switch
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setCheck(e.target.checked)
          }}
          checked={check}
          label={`Slider is ${check ? 'checked' : 'unchecked'}`}
        />
      </li>
    </UnstyledList>
  )
}
DefaultStates.storyName = 'Default states'

export const AlternativeToLabel: StoryFn<SwitchProps> = () => (
  <Switch aria-label="This label is invisible, but read by screen-readers" />
)
AlternativeToLabel.storyName = 'Alternative to label'

export const Compact: StoryFn<SwitchProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
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
    </EdsProvider>
  )
}

export const TableSwitch: StoryFn<SwitchProps> = () => {
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
TableSwitch.storyName = 'Table switch'
