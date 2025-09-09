import { useState, useEffect, ChangeEvent } from 'react'
import {
  Radio,
  RadioProps,
  Table,
  EdsProvider,
  Density,
  Label,
  Typography,
} from '../..'
import styled from 'styled-components'
import { tokens } from '@equinor/eds-tokens'
import { StoryFn, Meta } from '@storybook/react-vite'
import { data } from '../../stories/data'
import { Stack } from './../../../.storybook/components'
import page from './Radio.docs.mdx'

const meta: Meta<typeof Radio> = {
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
}

export default meta

const {
  colors: {
    interactive: {
      table__cell__fill_hover: { rgba: hoverColor },
    },
  },
} = tokens

const UnstyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`
const Control = styled.div`
  display: flex;
  &:hover {
    background: ${hoverColor};
  }
`
const FilledLabel = styled(Label)`
  cursor: pointer;
  align-items: center;
  width: 100%;
`

export const Introduction: StoryFn<RadioProps> = (args) => {
  return <Radio label="Play with me" {...args} />
}

export const SingleRadio: StoryFn<RadioProps> = () => {
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

export const GroupedRadio: StoryFn<RadioProps> = () => {
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

export const AlternativeToLabel: StoryFn<RadioProps> = () => (
  <Radio aria-label="This label is invisible, but read by screen-readers" />
)
AlternativeToLabel.storyName = 'Alternative to label'

export const CustomLabel: StoryFn<RadioProps> = () => {
  const [selectedValue, setSelectedValue] = useState('')
  const onChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSelectedValue(event.target.value)

  return (
    <>
      <Typography variant="h3" id="radiogroup-label">
        Select one
      </Typography>
      <div role="radiogroup" aria-labelledby="radiogroup-label">
        <Control>
          <FilledLabel htmlFor="radio-1" label="Label 1" />
          <Radio
            id="radio-1"
            value="1"
            checked={selectedValue === '1'}
            onChange={onChange}
          />
        </Control>
        <Control>
          <FilledLabel htmlFor="radio-2" label="Label 2" />
          <Radio
            id="radio-2"
            value="2"
            checked={selectedValue === '2'}
            onChange={onChange}
          />
        </Control>
        <Control>
          <FilledLabel htmlFor="radio-3" label="Label 3" />
          <Radio
            id="radio-3"
            value="3"
            checked={selectedValue === '3'}
            onChange={onChange}
          />
        </Control>
      </div>
    </>
  )
}
CustomLabel.storyName = 'Custom label'
CustomLabel.decorators = [
  (Story) => {
    return (
      <Stack direction="column">
        <Story />
      </Stack>
    )
  },
]

export const Compact: StoryFn<RadioProps> = () => {
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

export const TableRadio: StoryFn<RadioProps> = () => (
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
