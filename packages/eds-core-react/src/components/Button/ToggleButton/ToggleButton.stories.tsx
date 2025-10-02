import { useState, ComponentProps, type JSX } from 'react'
import { Button, ToggleButtonProps, Icon, Tooltip } from '../../..'
import {
  save,
  edit,
  copy,
  calendar,
  time,
  alarm,
  timer,
} from '@equinor/eds-icons'
import { StoryFn, Meta } from '@storybook/react-vite'
import { Stack } from './../../../../.storybook/components'

const meta: Meta<typeof Button.Toggle> = {
  title: 'Inputs/Button/Toggle',
  component: Button.Toggle,
  argTypes: {
    selectedIndexes: { control: 'text' },
  },
  parameters: {
    docs: {
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
}
export default meta

export const Introduction: StoryFn<ToggleButtonProps> = (args) => {
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

export const SingleSelection: StoryFn<ToggleButtonProps> = () => {
  const tooltipDelay = 500
  return (
    <Button.Toggle aria-label="file actions">
      <Tooltip title="Save" enterDelay={tooltipDelay}>
        <Button>
          <Icon data={save} title="Ghost icon save"></Icon>
        </Button>
      </Tooltip>
      <Tooltip title="Edit" enterDelay={tooltipDelay}>
        <Button>
          <Icon data={edit} title="Ghost icon edit"></Icon>
        </Button>
      </Tooltip>
      <Tooltip title="Copy" enterDelay={tooltipDelay}>
        <Button>
          <Icon data={copy} title="Ghost icon copy"></Icon>
        </Button>
      </Tooltip>
    </Button.Toggle>
  )
}
SingleSelection.storyName = 'Single selection'

export const MultipleSelection: StoryFn<ToggleButtonProps> = () => {
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

export const Controlled: StoryFn<ToggleButtonProps> = () => {
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

export const Wrapped: StoryFn<ToggleButtonProps> = () => {
  type ButtonProps = ComponentProps<typeof Button> &
    JSX.IntrinsicAttributes & { title: string }

  const ButtonWrapper = ({ title, ...props }: ButtonProps) => {
    return <Button {...props}>{title}</Button>
  }
  return (
    <Button.Toggle aria-label="wrapper example">
      <ButtonWrapper title="Hello" />
      <ButtonWrapper title="world" />
      <ButtonWrapper title="foo" />
    </Button.Toggle>
  )
}
