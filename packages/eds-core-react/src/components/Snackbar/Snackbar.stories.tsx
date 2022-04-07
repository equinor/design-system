import { useState, useEffect } from 'react'
import { Snackbar, SnackbarProps, Button, EdsProvider, Density } from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import { Stack } from './../../../.storybook/components'
import page from './Snackbar.docs.mdx'

export default {
  title: 'Feedback/Snackbar',
  component: Snackbar,
  subcomponents: { Action: Snackbar.Action },
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Snackbar>

export const Introduction: Story<SnackbarProps> = (args) => {
  const { open } = args
  const [visible, setVisible] = useState(open)
  return (
    <Stack>
      <Button type="button" onClick={() => setVisible(true)}>
        Show a simple snackbar with default options
      </Button>
      <Snackbar {...args} open={visible} onClose={() => setVisible(false)}>
        Play with me
      </Snackbar>
    </Stack>
  )
}

export const Simple: Story<SnackbarProps> = () => {
  const [open, setOpen] = useState(false)

  return (
    <Stack>
      <Button type="button" onClick={() => setOpen(true)}>
        Show a simple snackbar for 5 seconds
      </Button>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={5000}
      >
        Message goes here
      </Snackbar>
    </Stack>
  )
}
Simple.parameters = {
  docs: {
    description: {
      story:
        'Snackbars appear without warning, and don not require user interaction. When multiple snackbar updates are necessary, they should appear one at a time.',
    },
  },
}

export const WithAction: Story<SnackbarProps> = () => {
  const [withActionOpen, setWithActionOpen] = useState(false)
  return (
    <Stack>
      <Button type="button" onClick={() => setWithActionOpen(true)}>
        Show a snackbar with action for the default 7 seconds
      </Button>
      <Snackbar open={withActionOpen} onClose={() => setWithActionOpen(false)}>
        Your changes was saved
        <Snackbar.Action>
          <Button variant="ghost">Undo</Button>
        </Snackbar.Action>
      </Snackbar>
    </Stack>
  )
}
WithAction.storyName = 'With action'
WithAction.parameters = {
  docs: {
    description: {
      story:
        'A snackbar can contain a single action, a single text button that lets users take action on a process performed by the app.',
    },
  },
}

export const Compact: Story<SnackbarProps> = () => {
  const [open, setOpen] = useState(false)
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Button type="button" onClick={() => setOpen(true)}>
        Show a simple compact snackbar
      </Button>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={5000}
      >
        Message goes here
      </Snackbar>
    </EdsProvider>
  )
}

Compact.parameters = {
  docs: {
    description: {
      story: 'Compact `Snackbar` using `EdsProvider` ',
    },
  },
}
