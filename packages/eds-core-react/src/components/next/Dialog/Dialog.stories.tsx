import { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { Dialog } from '.'
import { Button } from '../Button'

const meta: Meta<typeof Dialog> = {
  title: 'EDS 2.0 (beta)/Surface/Dialog',
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

\`\`\`tsx
import { Dialog, Button } from '@equinor/eds-core-react/next'

const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen} aria-labelledby="dialog-title">
  <Dialog.Header onClose={() => setOpen(false)}>
    <Dialog.Title id="dialog-title">Confirm action</Dialog.Title>
  </Dialog.Header>
  <Dialog.Content>Are you sure you want to continue?</Dialog.Content>
  <Dialog.Actions>
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
    <Button onClick={() => setOpen(false)}>Confirm</Button>
  </Dialog.Actions>
</Dialog>
\`\`\`
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
      <Dialog open={open} onOpenChange={setOpen} aria-labelledby="dialog-title">
        <Dialog.Header onClose={() => setOpen(false)}>
          <Dialog.Title id="dialog-title">Dialog title</Dialog.Title>
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
      <Dialog
        open={open}
        onOpenChange={setOpen}
        aria-labelledby="dialog-title-no-close"
      >
        <Dialog.Header>
          <Dialog.Title id="dialog-title-no-close">
            Decision required
          </Dialog.Title>
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

export const WithoutScrim: StoryFn = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        scrim={false}
        aria-labelledby="dialog-title-no-scrim"
      >
        <Dialog.Header onClose={() => setOpen(false)}>
          <Dialog.Title id="dialog-title-no-scrim">Dialog title</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>
          With <code>scrim={'{false}'}</code> the backdrop stays transparent —
          useful when the dialog is part of a flow that already dims the
          background, or when a standalone Scrim component is composed
          externally.
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
        aria-labelledby="dialog-title-specific-width"
        style={{ inlineSize: '32rem' }}
      >
        <Dialog.Header onClose={() => setOpen(false)}>
          <Dialog.Title id="dialog-title-specific-width">
            Dialog with a specific width
          </Dialog.Title>
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
