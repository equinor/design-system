import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  Autocomplete,
  Label,
  Typography,
  Button,
  Popover,
  PopoverProps,
  Icon,
  Tooltip,
  EdsProvider,
  Density,
} from '../..'
import {
  apps,
  calendar,
  close,
  contacts,
  email,
  home,
  instrument,
  more_vertical,
  pipe_support,
  platform,
  settings,
  sun,
  support,
  turbine,
  waves,
} from '@equinor/eds-icons'
import { ComponentMeta, Story } from '@storybook/react'
import { Stack } from './../../../.storybook/components'
import page from './Popover.docs.mdx'

const { Title, Content, Header, Actions } = Popover

export default {
  title: 'Data Display/Popover',
  component: Popover,
  subcomponents: {
    Header,
    Title,
    Content,
    Actions,
  },
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
} as ComponentMeta<typeof Popover>

export const Introduction: Story<PopoverProps> = (args) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const referenceElement = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // eslint-disable-next-line react/destructuring-assignment
    setIsOpen(args.open)
    // eslint-disable-next-line react/destructuring-assignment
  }, [args.open])

  return (
    <>
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
        <Popover.Header>
          <Popover.Title>Title</Popover.Title>
          <Button
            style={{ height: '32px', width: '32px' }}
            variant="ghost_icon"
            aria-label="Close popover"
            onClick={handleClose}
          >
            <Icon name="close" data={close} size={24} />
          </Button>
        </Popover.Header>
        <Popover.Content>
          <Typography variant="body_short">Content</Typography>
        </Popover.Content>
      </Popover>
    </>
  )
}

export const ActivateOnClick: Story<PopoverProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const openPopover = () => setIsOpen(true)
  const closePopover = () => setIsOpen(false)

  return (
    <>
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
        trapFocus
      >
        <Popover.Header>
          <Popover.Title>Title</Popover.Title>
        </Popover.Header>
        <Popover.Content>
          <Typography variant="body_short">Content</Typography>
        </Popover.Content>
      </Popover>
    </>
  )
}
ActivateOnClick.storyName = 'Activate onClick'

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
    <>
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
        <Popover.Header>
          <Popover.Title>Title</Popover.Title>
        </Popover.Header>
        <Popover.Content>
          <Typography variant="body_short">Content</Typography>
        </Popover.Content>
      </Popover>
    </>
  )
}
ActivateOnHover.storyName = 'Activate onHover'

export const WithTooltip: Story<PopoverProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const openPopover = () => setIsOpen(true)
  const closePopover = () => setIsOpen(false)

  return (
    <>
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
        trapFocus
      >
        <Popover.Header>
          <Popover.Title>Title</Popover.Title>
        </Popover.Header>
        <Popover.Content>
          <Typography variant="body_short">Content</Typography>
        </Popover.Content>
      </Popover>
    </>
  )
}

export const WithCloseButton: Story<PopoverProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const openPopover = () => setIsOpen(true)
  const closePopover = () => setIsOpen(false)

  return (
    <>
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
        trapFocus
      >
        <Popover.Header>
          <Popover.Title>Title</Popover.Title>
          <Button
            style={{ height: '32px', width: '32px' }}
            variant="ghost_icon"
            aria-label="Close popover"
            onClick={closePopover}
          >
            <Icon name="close" data={close} size={24} />
          </Button>
        </Popover.Header>
        <Popover.Content>
          <Typography variant="body_short">Content</Typography>
        </Popover.Content>
      </Popover>
    </>
  )
}
WithCloseButton.storyName = 'With close button'

export const PersistentPopover: Story<PopoverProps> = () => {
  const counties = [
    'Oslo',
    'Rogaland',
    'Møre og Romsdal',
    'Nordland',
    'Viken',
    'Innlandet',
    'Vestfold og Telemark',
    'Agder',
    'Vestland',
    'Trøndelag',
    'Troms og Finnmark',
  ]

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const openPopover = () => setIsOpen(true)
  const closePopover = () => setIsOpen(false)

  return (
    <>
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
        open={isOpen}
        trapFocus
      >
        <Popover.Header>
          <Popover.Title>With Autocomplete</Popover.Title>
        </Popover.Header>
        <Popover.Content>
          <Autocomplete label="Select a county" options={counties} />
        </Popover.Content>
        <Popover.Actions>
          <Button onClick={closePopover}>OK</Button>
        </Popover.Actions>
      </Popover>
    </>
  )
}
PersistentPopover.storyName = 'Persistent popover'

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
        trapFocus
      >
        <Popover.Header>
          <Popover.Title>Title</Popover.Title>
        </Popover.Header>
        <Popover.Content>
          <Typography variant="body_short">Content</Typography>
        </Popover.Content>
      </Popover>
    </EdsProvider>
  )
}

export const AppLauncher: Story<PopoverProps> = () => {
  const Wrapper = styled.div`
    display: grid;
    grid-gap: 8px;
    grid-template-columns: repeat(3, auto);
    padding: 32px;
  `

  const IconWrapper = styled.div`
    display: block;
  `

  const StyledButton = styled(Button)`
    &:hover {
      border-radius: 4px;
    }
    &:focus {
      border-radius: 4px;
    }
    width: 96px;
    height: 96px;
  `

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const openPopover = () => setIsOpen(true)
  const closePopover = () => setIsOpen(false)

  return (
    <>
      <Tooltip title="App Launcher">
        <Button ref={anchorRef} variant="ghost_icon" onClick={openPopover}>
          <Icon data={apps} />
        </Button>
      </Tooltip>
      <Popover
        anchorEl={anchorRef.current}
        open={isOpen}
        onClose={closePopover}
        placement="top"
        trapFocus
      >
        <Popover.Content>
          <Wrapper>
            <StyledButton onClick={closePopover} variant="ghost_icon">
              <IconWrapper>
                <Icon data={home} />
                <Label label="Home" />
              </IconWrapper>
            </StyledButton>
            <StyledButton onClick={closePopover} variant="ghost_icon">
              <IconWrapper>
                <Icon data={calendar} />
                <Label label="Calendar" />
              </IconWrapper>
            </StyledButton>
            <StyledButton onClick={closePopover} variant="ghost_icon">
              <IconWrapper>
                <Icon data={settings} />
                <Label label="Settings" />
              </IconWrapper>
            </StyledButton>
            <StyledButton onClick={closePopover} variant="ghost_icon">
              <IconWrapper>
                <Icon data={platform} />
                <Label label="Platforms" />
              </IconWrapper>
            </StyledButton>
            <StyledButton onClick={closePopover} variant="ghost_icon">
              <IconWrapper>
                <Icon data={instrument} />
                <Label label="Instruments" />
              </IconWrapper>
            </StyledButton>
            <StyledButton onClick={closePopover} variant="ghost_icon">
              <IconWrapper>
                <Icon data={pipe_support} />
                <Label label="Pipes" />
              </IconWrapper>
            </StyledButton>
            <StyledButton onClick={closePopover} variant="ghost_icon">
              <IconWrapper>
                <Icon data={sun} />
                <Label label="Solar" />
              </IconWrapper>
            </StyledButton>
            <StyledButton onClick={closePopover} variant="ghost_icon">
              <IconWrapper>
                <Icon data={waves} />
                <Label label="Wave" />
              </IconWrapper>
            </StyledButton>
            <StyledButton onClick={closePopover} variant="ghost_icon">
              <IconWrapper>
                <Icon data={turbine} />
                <Label label="Wind" />
              </IconWrapper>
            </StyledButton>
            <StyledButton onClick={closePopover} variant="ghost_icon">
              <IconWrapper>
                <Icon data={email} />
                <Label label="Email" />
              </IconWrapper>
            </StyledButton>
            <StyledButton onClick={closePopover} variant="ghost_icon">
              <IconWrapper>
                <Icon data={contacts} />
                <Label label="Contacts" />
              </IconWrapper>
            </StyledButton>
            <StyledButton onClick={closePopover} variant="ghost_icon">
              <IconWrapper>
                <Icon data={support} />
                <Label label="Support" />
              </IconWrapper>
            </StyledButton>
          </Wrapper>
        </Popover.Content>
      </Popover>
    </>
  )
}
AppLauncher.storyName = 'App launcher'
