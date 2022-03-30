import { useState, useEffect } from 'react'
import { useArgs } from '@storybook/client-api'
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
import { Stack } from './../../../.storybook/components'
import page from './Dialog.docs.mdx'

export default {
  title: 'Feedback/Dialog',
  component: Dialog,
  args: {
    open: false,
    isDismissable: false,
  },
  subcomponents: {
    Header: Dialog.Header,
    Title: Dialog.Title,
    CustomContent: Dialog.CustomContent,
    Actions: Dialog.Actions,
  },
  parameters: {
    docs: {
      page,
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

export const Introduction: Story<DialogProps> = (args) => {
  const { open, isDismissable } = args
  const [, updateArgs] = useArgs()
  const handleClose = () => {
    updateArgs({ open: false })
  }
  const handleOpen = () => {
    updateArgs({ open: true })
  }
  return (
    <Stack>
      <Button aria-haspopup="dialog" onClick={handleOpen}>
        Trigger Dialog
      </Button>
      <Dialog open={open} onClose={handleClose} isDismissable={isDismissable}>
        <Dialog.Header>
          <Dialog.Title>Title</Dialog.Title>
        </Dialog.Header>
        <Dialog.CustomContent>
          <Typography variant="body_short">Small description here.</Typography>
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Wrapper>
            <Button onClick={handleClose}>OK</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </Wrapper>
        </Dialog.Actions>
      </Dialog>
    </Stack>
  )
}

export const Dismissable: Story<DialogProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }
  return (
    <>
      <Button aria-haspopup="dialog" onClick={handleOpen}>
        Trigger Dialog
      </Button>
      <Dialog open={isOpen} isDismissable onClose={handleClose}>
        <Dialog.Header>
          <Dialog.Title>Dismissable dialog</Dialog.Title>
        </Dialog.Header>
        <Dialog.CustomContent>
          <Typography variant="body_short">
            closes dialog on click outside and escape key.
          </Typography>
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Wrapper>
            <Button onClick={handleClose}>OK</Button>
            <Button variant="ghost" onClick={handleClose}>
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

export const TextPlusAction: Story<DialogProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }
  return (
    <>
      <Button aria-haspopup="dialog" onClick={handleOpen}>
        Trigger Dialog
      </Button>
      <Dialog open={isOpen}>
        <Dialog.Header>
          <Dialog.Title>Text + actions</Dialog.Title>
        </Dialog.Header>
        <Dialog.CustomContent>
          <Typography variant="body_short">Small description here.</Typography>
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Wrapper>
            <Button onClick={handleClose}>OK</Button>
            <Button variant="ghost" onClick={handleClose}>
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
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }
  return (
    <>
      <Button aria-haspopup="dialog" onClick={handleOpen}>
        Trigger Dialog
      </Button>
      <Dialog open={isOpen}>
        <Dialog.Header>
          <Dialog.Title>Placeholder + actions</Dialog.Title>
        </Dialog.Header>
        <Dialog.CustomContent>
          <Placeholder>Custom content</Placeholder>
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Wrapper>
            <Button onClick={handleClose}>OK</Button>
            <Button onClick={handleClose} variant="ghost">
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
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }
  return (
    <>
      <Button aria-haspopup="dialog" onClick={handleOpen}>
        Trigger Dialog
      </Button>
      <Dialog open={isOpen} isDismissable onClose={handleClose}>
        <Dialog.Header>
          <Dialog.Title>Placeholder</Dialog.Title>
        </Dialog.Header>
        <Dialog.CustomContent>
          <Placeholder>
            Custom content in a larger placeholder. No actions, only ESC or
            timedelay
          </Placeholder>
        </Dialog.CustomContent>
      </Dialog>
    </>
  )
}

export const ScrollablePlusActions: Story<DialogProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }
  return (
    <>
      <Button aria-haspopup="dialog" onClick={handleOpen}>
        Trigger Dialog
      </Button>
      <Dialog open={isOpen}>
        <Dialog.Header>
          <Dialog.Title>Scrollable + actions</Dialog.Title>
        </Dialog.Header>
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
            <Button onClick={handleClose}>OK</Button>
            <Button onClick={handleClose} variant="ghost">
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
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }
  return (
    <>
      <Button aria-haspopup="dialog" onClick={handleOpen}>
        Trigger Dialog
      </Button>
      <Dialog open={isOpen}>
        <Dialog.CustomContent>
          <Typography variant="body_short">Small description here.</Typography>
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Wrapper>
            <Button onClick={handleClose}>OK</Button>
            <Button onClick={handleClose} variant="ghost">
              Cancel
            </Button>
          </Wrapper>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

export const Compact: Story<DialogProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [density, setDensity] = useState<Density>('comfortable')
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Button aria-haspopup="dialog" onClick={handleOpen}>
        Trigger Dialog
      </Button>
      <Dialog open={isOpen}>
        <Dialog.Header>
          <Dialog.Title>Compact</Dialog.Title>
        </Dialog.Header>
        <Dialog.CustomContent>
          <Typography variant="body_short">Small description here.</Typography>
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Wrapper>
            <Button onClick={handleClose}>OK</Button>
            <Button onClick={handleClose} variant="ghost">
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
