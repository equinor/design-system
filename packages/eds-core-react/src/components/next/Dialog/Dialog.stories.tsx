import { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { Dialog } from '.'
import type { DialogProps } from './Dialog.types'
import { Button } from '../Button'
import page from './Dialog.docs.mdx'

const meta: Meta<typeof Dialog> = {
  title: 'EDS 2.0 (beta)/Feedback/Dialog',
  component: Dialog,
  tags: ['beta'],
  args: {
    scrim: true,
  },
  argTypes: {
    open: { control: false },
    onOpenChange: { control: false },
    scrim: { control: 'boolean' },
  },
  parameters: {
    docs: {
      page,
    },
  },
}

export default meta

export const Introduction: StoryFn<DialogProps> = (args) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog {...args} open={open} onOpenChange={setOpen}>
        <Dialog.Header>
          <Dialog.Title>Dialog title</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>
          This is a short description of the action the user is about to take.
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

export const Overview: StoryFn = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Sign out</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Header>
          <Dialog.Title>Sign out?</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>
          You will need to sign in again to continue.
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Sign out</Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

export const Passive: StoryFn = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Header>
          <Dialog.Title>You are now offline</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>
          A passive dialog has no action row. Dismiss it with the close icon,
          Escape, or a click on the backdrop.
        </Dialog.Content>
      </Dialog>
    </>
  )
}
Passive.parameters = {
  docs: {
    description: {
      story:
        'A dialog without `Dialog.Actions`. The user dismisses it with the close icon, Escape or a click on the backdrop.',
    },
  },
}

export const DangerAction: StoryFn = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button tone="danger" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Header>
          <Dialog.Title>Delete this project?</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>
          This permanently removes the project and all of its data. This action
          cannot be undone.
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button tone="danger" onClick={() => setOpen(false)}>
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
DangerAction.parameters = {
  docs: {
    description: {
      story:
        'For a destructive action, use `tone="danger"` on the button that confirms it, and say in the content what will be lost.',
    },
  },
}

export const SingleAction: StoryFn = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Show details</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Header>
          <Dialog.Title>You are now offline</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>
          Changes will sync automatically when your connection is restored.
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setOpen(false)}>Got it</Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
SingleAction.parameters = {
  docs: {
    description: {
      story:
        'A dialog with one action, for a message the user only needs to acknowledge.',
    },
  },
}

export const WithoutScrim: StoryFn = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen} scrim={false}>
        <Dialog.Header>
          <Dialog.Title>Dialog title</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>
          <p style={{ margin: 0 }}>
            With <code>scrim={'{false}'}</code> the backdrop is fully
            transparent. This is useful when the dialog is part of a flow that
            already dims the background, or when a standalone Scrim component is
            composed externally.
          </p>
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
WithoutScrim.parameters = {
  docs: {
    description: {
      story:
        'Set `scrim={false}` to make the backdrop fully transparent, for a flow that already dims the background.',
    },
  },
}

export const SpecificWidth: StoryFn = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        style={{ inlineSize: '32rem' }}
      >
        <Dialog.Header>
          <Dialog.Title>Dialog with a specific width</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>
          <p style={{ margin: 0 }}>
            By default the dialog is at least 300px wide and grows with its
            content (capped to the viewport by the browser). For dialogs holding
            forms, tables, or longer body copy, set a wider{' '}
            <code>inlineSize</code> via <code>style</code> or a custom{' '}
            <code>className</code>.
          </p>
          <pre style={{ margin: 0 }}>
            {`<Dialog style={{ inlineSize: '32rem' }}>...</Dialog>`}
          </pre>
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
SpecificWidth.parameters = {
  docs: {
    description: {
      story:
        'By default the dialog is at least 300px wide and grows with its content. Set `inlineSize` through `style` or a `className` for a wider dialog, such as one that holds a form or a table.',
    },
  },
}
