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
} as ComponentMeta<typeof Snackbar>

export const Introduction: Story<SnackbarProps> = (args) => {
  const { open } = args
  const [visible, setVisible] = useState(open)
  return (
    <>
      <Button type="button" onClick={() => setVisible(true)}>
        Show a simple snackbar with default options
      </Button>
      <Snackbar {...args} open={visible} onClose={() => setVisible(false)}>
        Play with me
      </Snackbar>
    </>
  )
}

export const Simple: Story<SnackbarProps> = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
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
    </>
  )
}

export const WithAction: Story<SnackbarProps> = () => {
  const [withActionOpen, setWithActionOpen] = useState(false)
  return (
    <>
      <Button type="button" onClick={() => setWithActionOpen(true)}>
        Show a snackbar with action for the default 7 seconds
      </Button>
      <Snackbar open={withActionOpen} onClose={() => setWithActionOpen(false)}>
        Your changes was saved
        <Snackbar.Action>
          <Button variant="ghost">Undo</Button>
        </Snackbar.Action>
      </Snackbar>
    </>
  )
}
WithAction.storyName = 'With action'

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
