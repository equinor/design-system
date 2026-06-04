import { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { Dialog } from '.'
import { Button } from '../Button'

const meta: Meta<typeof Dialog> = {
  title: 'EDS 2.0 (beta)/Feedback/Dialog',
  component: Dialog,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component: `
⚠️ **Beta Component** - This component is under active development.

Built on the native \`<dialog>\` element with \`showModal()\` for free focus
trapping, Escape-key handling and inert background. Backdrop clicks close
the dialog.

### Import

\`\`\`tsx
import { Dialog } from '@equinor/eds-core-react/next'
\`\`\`

See the stories below for usage patterns.
        `,
      },
    },
  },
}

export default meta

export const Introduction: StoryFn = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Header onClose={() => setOpen(false)}>
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

export const WithoutCloseButton: StoryFn = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Header>
          <Dialog.Title>Decision required</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>
          The user must pick one of the actions below — no close affordance in
          the header.
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Discard
          </Button>
          <Button onClick={() => setOpen(false)}>Keep</Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

export const DangerAction: StoryFn = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button tone="danger" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Header onClose={() => setOpen(false)}>
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

export const SingleAction: StoryFn = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Show details</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Header onClose={() => setOpen(false)}>
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

export const WithoutScrim: StoryFn = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen} scrim={false}>
        <Dialog.Header onClose={() => setOpen(false)}>
          <Dialog.Title>Dialog title</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>
          <p style={{ margin: 0 }}>
            With <code>scrim={'{false}'}</code> the backdrop is fully
            transparent — useful when the dialog is part of a flow that already
            dims the background, or when a standalone Scrim component is
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
        <Dialog.Header onClose={() => setOpen(false)}>
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
