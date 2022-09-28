import { useState } from 'react'
import { Button, ToggleButtonProps, Icon } from '../../..'
import {
  save,
  edit,
  copy,
  calendar,
  time,
  alarm,
  timer,
} from '@equinor/eds-icons'
import { ComponentMeta, Story } from '@storybook/react'
import { Stack } from './../../../../.storybook/components'
import page from './ToggleButton.docs.mdx'

export default {
  title: 'Inputs/Button/Toggle',
  component: Button.Toggle,
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
} as ComponentMeta<typeof Button.Toggle>

export const Introduction: Story<ToggleButtonProps> = (args) => {
  return (
    <Button.Toggle {...args} aria-label="file actions">
      <Button aria-label="save action">
        <Icon data={save} title="Ghost icon save"></Icon>
      </Button>
      <Button aria-label="edit action">
        <Icon data={edit} title="Ghost icon edit"></Icon>
      </Button>
      <Button aria-label="copy action">
        <Icon data={copy} title="Ghost icon copy"></Icon>
      </Button>
    </Button.Toggle>
  )
}

export const SingleSelection: Story<ToggleButtonProps> = () => {
  return (
    <Button.Toggle aria-label="file actions">
      <Button aria-label="save action">
        <Icon data={save} title="Ghost icon save"></Icon>
      </Button>
      <Button aria-label="edit action">
        <Icon data={edit} title="Ghost icon edit"></Icon>
      </Button>
      <Button aria-label="copy action">
        <Icon data={copy} title="Ghost icon copy"></Icon>
      </Button>
    </Button.Toggle>
  )
}
SingleSelection.storyName = 'Single selection'

export const MultipleSelection: Story<ToggleButtonProps> = () => {
  return (
    <Button.Toggle multiple aria-label="date and time actions">
      <Button aria-label="calendar">
        <Icon data={calendar} title="Ghost icon calendar"></Icon>
      </Button>
      <Button aria-label="time">
        <Icon data={time} title="Ghost icon time"></Icon>
      </Button>
      <Button aria-label="alarm">
        <Icon data={alarm} title="Ghost icon alarm"></Icon>
      </Button>
      <Button aria-label="timer">
        <Icon data={timer} title="Ghost icon timer"></Icon>
      </Button>
    </Button.Toggle>
  )
}
MultipleSelection.storyName = 'Multiple selection'

export const Controlled: Story<ToggleButtonProps> = () => {
  const [selectedButtons, setSelectedButtons] = useState([0, 1])
  const handleChange = (indexes: number[]) => {
    setSelectedButtons(indexes)
  }

  return (
    <Button.Toggle
      multiple
      selectedIndexes={selectedButtons}
      onChange={handleChange}
      aria-label="date and time actions"
    >
      <Button aria-label="calendar">
        <Icon data={calendar} title="Ghost icon calendar"></Icon>
      </Button>
      <Button aria-label="time">
        <Icon data={time} title="Ghost icon time"></Icon>
      </Button>
      <Button aria-label="alarm">
        <Icon data={alarm} title="Ghost icon alarm"></Icon>
      </Button>
    </Button.Toggle>
  )
}
