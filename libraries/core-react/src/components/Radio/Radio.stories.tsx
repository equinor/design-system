import { useState } from 'react'
import { Radio, RadioProps, Table, EdsProvider, Tooltip } from '../..'
import styled from 'styled-components'
import { Meta, Story } from '@storybook/react'
import { data } from '../../stories/data'

const Wrapper = styled(Radio)`
  display: flex;
`

export default {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    docs: {
      description: {
        component:
          'Selection controls allow users to select options, make decisions and set preferences. Parent must have `position: relative`',
      },
    },
  },
} as Meta

export const Default: Story<RadioProps> = (args) => (
  <Tooltip title="Hi!">
    <Radio label="Play with me" {...args} />
  </Tooltip>
)

export const SingleRadio: Story<RadioProps> = () => {
  return (
    <div>
      <Wrapper label="Check me" name="first" />
      <Wrapper label="You can't check me!" disabled name="second" />
      <Wrapper label="I'm preselected" defaultChecked name="third" />
      <Wrapper
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
  const UnstyledList = styled.ul`
    margin: 0;
    padding: 0;
    list-style-type: none;
  `
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

export const Compact: Story<RadioProps> = () => (
  <EdsProvider density="compact">
    <Radio label="I am compact" />
  </EdsProvider>
)

Compact.parameters = {
  docs: {
    description: {
      story: 'Compact `Radio` using `EdsProvder` ',
    },
  },
}

export const TableRadio: Story<RadioProps> = () => (
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
            <Radio aria-label={`Select ${data.description}`} />
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
)

TableRadio.parameters = {
  docs: {
    description: {
      story:
        'Example of usage with `Radio` and `aria-label` in tables for accessibility',
    },
  },
}
