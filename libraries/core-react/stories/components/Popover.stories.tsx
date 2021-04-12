import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Typography, Button, Popover, PopoverProps, Card } from '@components'
import { Meta, Story } from '@storybook/react'
import { PlacementValues } from '@hooks'

const { Title, Content } = Popover

const StoryCenter = styled.div({
  display: 'flex',
  justifyContent: 'center',
  margin: '10rem',
})

export default {
  title: 'Components/Popover',
  component: Popover,
  subcomponents: {
    Title,
    Content,
  },
  argTypes: {
    placement: {
      control: {
        type: 'select',
        options: PlacementValues,
        defaultValue: 'auto',
      },
    },
  },
} as Meta

export const Default: Story<PopoverProps> = (args) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const referenceElement = useRef(null)

  useEffect(() => {
    setIsOpen(args.open)
    // eslint-disable-next-line react/destructuring-assignment
  }, [args.open])

  return (
    <StoryCenter>
      <Button
        id="default-popover-anchor"
        aria-controls="default-popover"
        aria-expanded={isOpen}
        ref={referenceElement}
        onClick={handleOpen}
      >
        Click me!
      </Button>

      <Popover
        open={isOpen}
        {...args}
        id="default-popover"
        anchorEl={referenceElement.current}
        onClose={handleClose}
      >
        <Popover.Title>Title</Popover.Title>
        <Popover.Content>
          <Typography variant="body_short">Content</Typography>
        </Popover.Content>
        <Card.Actions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>OK</Button>
        </Card.Actions>
      </Popover>
    </StoryCenter>
  )
}

export const ActivateOnClick: Story<PopoverProps> = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  const openPopover = () => setIsOpen(true)
  const closePopover = () => setIsOpen(false)

  return (
    <StoryCenter>
      <Button
        id="click-popover-anchor"
        aria-controls="click-popover"
        ref={anchorRef}
        onClick={openPopover}
      >
        Click to activate
      </Button>

      <Popover
        id="click-popover"
        aria-expanded={isOpen}
        anchorEl={anchorRef.current}
        onClose={closePopover}
        open={isOpen}
      >
        <Popover.Title>Title</Popover.Title>
        <Popover.Content>
          <Typography variant="body_short">Content</Typography>
        </Popover.Content>
        <Button onClick={closePopover}>OK</Button>
      </Popover>
    </StoryCenter>
  )
}

ActivateOnClick.parameters = {
  docs: {
    storyDescription:
      'Popovers can be activated by hover or click. To dismiss a popover, use the close icon, press the ESC key, open another popover or click outside the popover. If there are no actions in the popover, then the close icon should be the first focusable element.',
  },
}

export const ActivateOnHover: Story<PopoverProps> = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  let timer: number = null

  const openPopover = () => setIsOpen(true)
  const closePopover = () => setIsOpen(false)

  const handleHover = () => {
    timer = setTimeout(() => {
      openPopover()
    }, 300)
  }

  const handleClose = () => {
    clearTimeout(timer)
    closePopover()
  }

  return (
    <StoryCenter>
      <Button
        id="hover-popover-anchor"
        aria-controls="hover-popover"
        aria-expanded={isOpen}
        ref={anchorRef}
        onMouseOver={handleHover}
        onFocus={openPopover}
        onBlur={handleClose}
      >
        Hover to activate
      </Button>

      <Popover
        id="hover-popover"
        anchorEl={anchorRef.current}
        onClose={handleClose}
        open={isOpen}
        placement="top"
      >
        <Popover.Title>Title</Popover.Title>
        <Popover.Content>
          <Typography variant="body_short">Content</Typography>
        </Popover.Content>
        <Button onClick={handleClose}>OK</Button>
      </Popover>
    </StoryCenter>
  )
}

ActivateOnHover.parameters = {
  docs: {
    storyDescription:
      'Remember to use both `onMouseEnter` and `onFocus` attributes to your trigger element to be able to open the popover. A timeout delay (300ms) on `onMouseEnter` is recommended to avoid unwanted trigger while browsing.',
  },
}
