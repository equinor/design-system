import { useState } from 'react'
import { Snackbar, SnackbarProps, Button } from '../..'
import { StoryFn, Meta } from '@storybook/react'
import { Stack } from './../../../.storybook/components'
import page from './Snackbar.docs.mdx'

const meta: Meta<typeof Snackbar> = {
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
}

export default meta

export const Introduction: StoryFn<SnackbarProps> = (args) => {
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

export const Simple: StoryFn<SnackbarProps> = () => {
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

export const WithAction: StoryFn<SnackbarProps> = () => {
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

export const TimerRegressionTest: StoryFn<SnackbarProps> = () => {
  const [message, setMessage] = useState({ open: false, text: '' })
  const [data, setData] = useState(0)

  const handleClick = () => {
    setMessage({ open: !message.open, text: 'Hello, World!' })
  }

  const handleDataClick = () => {
    setData(data + 1)
  }

  return (
    <>
      <div>
        <Button onClick={() => handleClick()}>Show Snackbar</Button>
        <Button
          style={{ marginLeft: '10px' }}
          onClick={() => handleDataClick()}
        >
          Data + {data}
        </Button>
      </div>

      <Snackbar
        open={message.open}
        onClose={() => setMessage({ open: false, text: '' })}
        autoHideDuration={2000}
      >
        {message.text}
      </Snackbar>
    </>
  )
}
TimerRegressionTest.storyName =
  'Test to ensure timer stays consistent across rerenders'
//hide this story from sidebar
TimerRegressionTest.tags = ['!dev']
