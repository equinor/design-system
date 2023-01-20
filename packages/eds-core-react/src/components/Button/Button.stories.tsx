import { useState, ChangeEvent } from 'react'
import {
  Button,
  ButtonProps,
  Icon,
  EdsProvider,
  Progress,
  Checkbox,
  Snackbar,
  Tooltip,
} from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import { menu, add, save, send, refresh } from '@equinor/eds-icons'
import { Stack } from './../../../.storybook/components'
import page from './Button.docs.mdx'

export default {
  title: 'Inputs/Button/Button',
  component: Button,
  args: {
    as: 'button',
  },
  argTypes: {
    as: {
      options: ['span', 'a', 'button'],
      control: {
        type: 'select',
      },
    },
  },
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
} as ComponentMeta<typeof Button>

export const Introduction: Story<ButtonProps> = (args) => {
  return <Button {...args}>You can control me</Button>
}
Introduction.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const Accessibility: Story<ButtonProps> = () => {
  const [canSubmit, setCanSubmit] = useState(false)
  const [open, setOpen] = useState(false)
  return (
    <>
      <Checkbox
        label="I agree to the Terms & Conditions (required)"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setCanSubmit(e.target.checked)
        }}
        checked={canSubmit}
      />
      <Tooltip title={canSubmit ? '' : 'Terms & Conditions must be checked'}>
        <Button
          aria-disabled={!canSubmit}
          onClick={() => {
            canSubmit && setOpen(true)
          }}
        >
          Submit
        </Button>
      </Tooltip>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={3000}
      >
        Submitted
      </Snackbar>
    </>
  )
}
Accessibility.decorators = [
  (Story) => (
    <Stack direction="column">
      <Story />
    </Stack>
  ),
]

export const Basic: Story<ButtonProps> = () => (
  <>
    <Button>Contained</Button>
    <Button variant="contained_icon" aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="ghost_icon" aria-label="save action">
      <Icon data={save}></Icon>
    </Button>
  </>
)
Basic.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const IconButton: Story<ButtonProps> = () => (
  <>
    <Button variant="ghost_icon" aria-label="save action">
      <Icon data={save}></Icon>
    </Button>
    <Button variant="ghost_icon" color="secondary" aria-label="save action">
      <Icon data={save}></Icon>
    </Button>
    <Button variant="ghost_icon" color="danger" aria-label="save action">
      <Icon data={save}></Icon>
    </Button>
    <Button variant="ghost_icon" disabled aria-label="save action">
      <Icon data={save}></Icon>
    </Button>
    <Button variant="contained_icon" aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
    <Button variant="contained_icon" color="secondary" aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
    <Button variant="contained_icon" color="danger" aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
    <Button variant="contained_icon" disabled aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
  </>
)

IconButton.storyName = 'Icon button'
IconButton.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const Color: Story<ButtonProps> = () => (
  <>
    <Button color="primary">Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="danger">Danger</Button>
  </>
)
Color.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const Hierarchy: Story<ButtonProps> = () => (
  <>
    <Button>Contained</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="ghost">Ghost</Button>
  </>
)
Hierarchy.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const Compact: Story<ButtonProps> = () => {
  const [compact, setComfortable] = useState<boolean>(true)

  return (
    <EdsProvider density={compact ? 'compact' : 'comfortable'}>
      <Checkbox
        label="Compact"
        onChange={() => {
          setComfortable(!compact)
        }}
        checked={compact}
      />
      <Stack direction="row">
        <Button>Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="ghost_icon" aria-label="menu action">
          <Icon data={menu} title="Ghost icon menu"></Icon>
        </Button>
      </Stack>
    </EdsProvider>
  )
}
Compact.decorators = [
  (Story) => (
    <Stack direction="column">
      <Story />
    </Stack>
  ),
]

export const ProgressButton: Story<ButtonProps> = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const onSubmit = () => {
    setIsSubmitting(true)
  }

  return (
    <>
      <Button
        aria-disabled={isSubmitting ? true : false}
        onClick={!isSubmitting ? onSubmit : undefined}
      >
        {isSubmitting ? <Progress.Dots /> : 'Fetch data'}
      </Button>
      <Button
        aria-disabled={isSubmitting ? true : false}
        color="secondary"
        onClick={!isSubmitting ? onSubmit : undefined}
      >
        {isSubmitting ? (
          <Progress.Circular size={16} color="neutral" />
        ) : (
          <>
            Send
            <Icon data={send} size={16}></Icon>
          </>
        )}
      </Button>
      <Button onClick={() => setIsSubmitting(false)}>
        <>
          <Icon data={refresh} size={16}></Icon>
          Reset
        </>
      </Button>
    </>
  )
}

ProgressButton.storyName = 'Progress button'
ProgressButton.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const WithTooltip: Story<ButtonProps> = () => (
  <>
    <Tooltip title="This is what a tooltip looks like">
      <Button>Hover me</Button>
    </Tooltip>
    <Tooltip title="Tooltip doesn't show in Chrome">
      <Button disabled>Disabled button</Button>
    </Tooltip>
    <Tooltip title="Tooltip shows in Chrome with aria-disabled">
      <Button aria-disabled>Aria-disabled button</Button>
    </Tooltip>
    <Tooltip title="Tooltip shows in Chrome because Button is wrapped in span">
      <span>
        <Button disabled>Disabled, but wrapped in span</Button>
      </span>
    </Tooltip>
  </>
)

WithTooltip.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const FullWidth: Story<ButtonProps> = () => (
  <>
    <Button fullWidth>Primary</Button>
  </>
)
FullWidth.storyName = 'Full width'
FullWidth.decorators = [
  (Story) => (
    <div style={{ margin: '32px', display: 'grid', gridGap: '16px' }}>
      <Story />
    </div>
  ),
]

export const All: Story<ButtonProps> = () => (
  <>
    <Button>Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="danger">Danger</Button>
    <Button disabled>Disabled</Button>
    <Button variant="outlined">Primary</Button>
    <Button variant="outlined" color="secondary">
      Secondary
    </Button>
    <Button variant="outlined" color="danger">
      Danger
    </Button>
    <Button variant="outlined" disabled>
      Disabled
    </Button>
    <Button variant="ghost">Primary</Button>
    <Button variant="ghost" color="secondary">
      Secondary
    </Button>
    <Button variant="ghost" color="danger">
      Danger
    </Button>
    <Button variant="ghost" disabled>
      Disabled
    </Button>
    <Button variant="ghost_icon" aria-label="save action">
      <Icon name="save" title="save action"></Icon>
    </Button>
    <Button variant="ghost_icon" color="secondary" aria-label="save action">
      <Icon data={save}></Icon>
    </Button>
    <Button variant="ghost_icon" color="danger" aria-label="save action">
      <Icon data={save}></Icon>
    </Button>
    <Button variant="ghost_icon" disabled aria-label="save action">
      <Icon data={save}></Icon>
    </Button>
    <Button variant="contained_icon" aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
    <Button variant="contained_icon" color="secondary" aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
    <Button variant="contained_icon" color="danger" aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
    <Button variant="contained_icon" disabled aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
  </>
)
All.decorators = [
  (Story) => (
    <Stack
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, auto)',
      }}
    >
      <Story />
    </Stack>
  ),
]
