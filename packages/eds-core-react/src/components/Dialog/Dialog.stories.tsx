import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogProps,
  Button,
  Typography,
  EdsProvider,
  Density,
} from '../..'
import styled from 'styled-components'
import { Story, Meta } from '@storybook/react/types-6-0'

export default {
  title: 'Feedback/Dialog',
  component: Dialog,
  args: {
    open: false,
    isDismissable: false,
  },
  subcomponents: {
    Actions: Dialog.Actions,
    Title: Dialog.Title,
    CustomContent: Dialog.CustomContent,
  },
  parameters: {
    docs: {
      description: {
        component: `A basic dialog component.`,
      },
    },
  },
} as Meta

const Wrapper = styled.div`
  display: grid;
  column-gap: 16px;
  grid-template-columns: repeat(2, fit-content(100%));
  justify-content: end;
  justify-self: end;
`

const Placeholder = styled.div`
  background: rgba(255, 146, 0, 0.15);
  border: 1px dashed #ff9200;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 8px;
  width: 100%;
  display: inline-block;
`

export const Default: Story<DialogProps> = (args) => {
  //  Note: This example is not interactive, as Storybook
  // doesn't yet support to manipulate subcomponents via Storybook Args
  const { open, isDismissable } = args
  const [isOpen, setIsOpen] = useState(open)
  const handleClose = () => {
    setIsOpen(false)
  }
  return (
    <>
      <Button aria-haspopup="dialog" onClick={() => setIsOpen(true)}>
        Trigger Dialog
      </Button>
      <Dialog open={isOpen} onClose={handleClose} isDismissable={isDismissable}>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.CustomContent>
          <Typography variant="body_short">Small description here.</Typography>
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Wrapper>
            <Button onClick={() => setIsOpen(false)}>OK</Button>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          </Wrapper>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

export const TextPlusAction: Story<DialogProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button aria-haspopup="dialog" onClick={() => setIsOpen(true)}>
        Trigger Dialog
      </Button>
      <Dialog open={isOpen}>
        <Dialog.Title>Text + actions</Dialog.Title>
        <Dialog.CustomContent>
          <Typography variant="body_short">Small description here.</Typography>
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Wrapper>
            <Button onClick={() => setIsOpen(false)}>OK</Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </Wrapper>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

export const PlaceholderPlusAction: Story<DialogProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button aria-haspopup="dialog" onClick={() => setIsOpen(true)}>
        Trigger Dialog
      </Button>
      <Dialog open={isOpen}>
        <Dialog.Title>Placeholder + actions</Dialog.Title>
        <Dialog.CustomContent>
          <Placeholder>Custom content</Placeholder>
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Wrapper>
            <Button onClick={() => setIsOpen(false)}>OK</Button>
            <Button onClick={() => setIsOpen(false)} variant="ghost">
              Cancel
            </Button>
          </Wrapper>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

export const PlaceholderOnly: Story<DialogProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button aria-haspopup="dialog" onClick={() => setIsOpen(true)}>
        Trigger Dialog
      </Button>
      <Dialog open={isOpen}>
        <Dialog.Title>Placeholder</Dialog.Title>
        <Dialog.CustomContent>
          <Placeholder>
            Custom content in a larger placeholder. No actions, only ESC or
            timedelay
          </Placeholder>
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Wrapper>
            <Button onClick={() => setIsOpen(false)}>OK</Button>
            <Button onClick={() => setIsOpen(false)} variant="ghost">
              Cancel
            </Button>
          </Wrapper>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

export const ScrollablePlusActions: Story<DialogProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button aria-haspopup="dialog" onClick={() => setIsOpen(true)}>
        Trigger Dialog
      </Button>
      <Dialog open={isOpen}>
        <Dialog.Title>Scrollable + actions</Dialog.Title>
        <Dialog.CustomContent scrollable>
          <Typography variant="body_short">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
          <Typography variant="body_short">
            Lorem ipsum dolor sit amet consecteur dit lot. Lorem ipsum dolor sit
            amet consecteur dit lot. Lorem ipsum dolor sit amet consecteur dit
            lot.
          </Typography>
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Wrapper>
            <Button onClick={() => setIsOpen(false)}>OK</Button>
            <Button onClick={() => setIsOpen(false)} variant="ghost">
              Cancel
            </Button>
          </Wrapper>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

export const NoTitle: Story<DialogProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button aria-haspopup="dialog" onClick={() => setIsOpen(true)}>
        Trigger Dialog
      </Button>
      <Dialog open={isOpen}>
        <Dialog.CustomContent>
          <Typography variant="body_short">Small description here.</Typography>
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Wrapper>
            <Button onClick={() => setIsOpen(false)}>OK</Button>
            <Button onClick={() => setIsOpen(false)} variant="ghost">
              Cancel
            </Button>
          </Wrapper>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

export const Dismissable: Story<DialogProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => {
    setIsOpen(false)
  }
  return (
    <>
      <Button aria-haspopup="dialog" onClick={() => setIsOpen(true)}>
        Trigger Dialog
      </Button>
      <Dialog open={isOpen} isDismissable onClose={handleClose}>
        <Dialog.Title>Dismissable dialog</Dialog.Title>
        <Dialog.CustomContent>
          <Typography variant="body_short">
            closes dialog on click outside and escape key.
          </Typography>
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Wrapper>
            <Button onClick={() => setIsOpen(false)}>OK</Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </Wrapper>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
Dismissable.parameters = {
  docs: {
    description: {
      story:
        '`isDismissable={true}` closes dialog on click outside and escape key. Defaults to `false`',
    },
  },
}

export const Compact: Story<DialogProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Button aria-haspopup="dialog" onClick={() => setIsOpen(true)}>
        Trigger Dialog
      </Button>
      <Dialog open={isOpen}>
        <Dialog.Title>Compact</Dialog.Title>
        <Dialog.CustomContent>
          <Typography variant="body_short">Small description here.</Typography>
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Wrapper>
            <Button onClick={() => setIsOpen(false)}>OK</Button>
            <Button onClick={() => setIsOpen(false)} variant="ghost">
              Cancel
            </Button>
          </Wrapper>
        </Dialog.Actions>
      </Dialog>
    </EdsProvider>
  )
}

Compact.parameters = {
  docs: {
    description: {
      story: 'Compact `Dialog` using `EdsProvider` ',
    },
  },
}
