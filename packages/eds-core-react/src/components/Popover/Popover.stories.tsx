import { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import {
  Typography,
  Button,
  Popover,
  PopoverProps,
  Icon,
  Tooltip,
  EdsProvider,
  Density,
} from '../..'
import { more_vertical, close } from '@equinor/eds-icons'
import { Meta, Story } from '@storybook/react'

const { Title, Content, Header } = Popover

const StoryCenter = styled.div({
  display: 'flex',
  justifyContent: 'center',
  margin: '10rem',
})

const StyledCloseButton = styled(Button)(({ theme }) => {
  return css`
    position: absolute;
    top: ${theme.entities.closeButton.spacings.top};
    right: ${theme.spacings.right};
    height: ${theme.entities.closeButton.height};
    width: ${theme.entities.closeButton.width};
    &:after {
      height: ${theme.entities.closeButton.height};
    }
  `
})

export default {
  title: 'Components/Popover',
  component: Popover,
  subcomponents: {
    Title,
    Content,
    Header,
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

  const referenceElement = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsOpen(args.open)
    // eslint-disable-next-line react/destructuring-assignment
  }, [args.open])

  return (
    <StoryCenter>
      <Button
        aria-haspopup
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
        <Button onClick={handleClose}>OK</Button>
      </Popover>
    </StoryCenter>
  )
}

export const ActivateOnClick: Story<PopoverProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

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
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  let timer: ReturnType<typeof setTimeout> = null

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

export const WithTooltip: Story<PopoverProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const openPopover = () => setIsOpen(true)
  const closePopover = () => setIsOpen(false)

  return (
    <StoryCenter>
      <Tooltip title="Menu">
        <Button ref={anchorRef} variant="ghost_icon" onClick={openPopover}>
          <Icon data={more_vertical} />
        </Button>
      </Tooltip>
      <Popover
        anchorEl={anchorRef.current}
        open={isOpen}
        onClose={closePopover}
        placement="top"
      >
        <Popover.Title>Title</Popover.Title>
        <Popover.Content>Content</Popover.Content>
      </Popover>
    </StoryCenter>
  )
}

export const Compact: Story<PopoverProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const openPopover = () => setIsOpen(true)
  const closePopover = () => setIsOpen(false)

  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
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
    </EdsProvider>
  )
}

Compact.parameters = {
  docs: {
    description: {
      story: 'Compact `Popover` using `EdsProvider` ',
    },
  },
}

export const WithCloseButton: Story<PopoverProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const openPopover = () => setIsOpen(true)
  const closePopover = () => setIsOpen(false)

  return (
    <EdsProvider>
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
          <Popover.Header>
            <StyledCloseButton
              variant="ghost_icon"
              data-testid="popover-close"
              aria-label="Close popover"
              onClick={closePopover}
            >
              <Icon name="close" data={close} size={24} />
            </StyledCloseButton>
            <Popover.Title>Title</Popover.Title>
          </Popover.Header>

          <Popover.Content>
            <Typography variant="body_short">Content</Typography>
          </Popover.Content>
        </Popover>
      </StoryCenter>
    </EdsProvider>
  )
}

WithCloseButton.parameters = {
  docs: {
    description: {
      story: 'Description comes here ',
    },
  },
}
