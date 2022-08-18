import { useState, useEffect } from 'react'
import { Radio, RadioProps, Table, EdsProvider, Density, Label } from '../..'
import styled from 'styled-components'
import { ComponentMeta, Story } from '@storybook/react'
import { data } from '../../stories/data'
import { Stack } from './../../../.storybook/components'
import page from './Radio.docs.mdx'

export default {
  title: 'Inputs/Selection Controls/Radio',
  component: Radio,
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
} as ComponentMeta<typeof Radio>

const UnstyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

export const Introduction: Story<RadioProps> = (args) => {
  return <Radio label="Play with me" {...args} />
}

export const SingleRadio: Story<RadioProps> = () => {
  return (
    <UnstyledList>
      <li>
        <Radio label="Check me" name="first" />
      </li>
      <li>
        <Radio label="You can't check me!" disabled name="second" />
      </li>
      <li>
        <Radio label="I'm preselected" defaultChecked name="third" />
      </li>
      <li>
        <Radio
          label="You can't uncheck me!"
          disabled
          defaultChecked
          name="fourth"
        />
      </li>
    </UnstyledList>
  )
}
SingleRadio.storyName = 'Single radio buttons'

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

export const AlternativeToLabel: Story<RadioProps> = () => (
  <Radio aria-label="This label is invisible, but read by screen-readers" />
)
AlternativeToLabel.storyName = 'Alternative to label'

export const CustomLabel: Story<RadioProps> = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Label htmlFor="custom_label" label="Custom Label" />
      <Radio id="custom_label" name="radio" />
    </div>
  )
}
CustomLabel.storyName = 'Custom label'

export const Compact: Story<RadioProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Radio label="I am compact" />
    </EdsProvider>
  )
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
TableRadio.storyName = 'Table radio'
