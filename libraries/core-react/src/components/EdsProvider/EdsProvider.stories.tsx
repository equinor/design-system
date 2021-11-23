import { useRef, useState } from 'react'
import styled from 'styled-components'
import { Story } from '@storybook/react'
import { menu, accessible } from '@equinor/eds-icons'
import { useArgs } from '@storybook/client-api'
import {
  TopBar,
  Menu,
  Button,
  Icon,
  EdsProvider,
  EdsProviderProps,
} from '../..'

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(4, fit-content(100%));
`

export const Default: Story<EdsProviderProps['density']> = (args) => {
  const [_, setState] = useArgs()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const setDensity = (density: 'comfortable' | 'compact') =>
    setState({ density })

  const openMenu = () => setIsOpen(true)

  const closeMenu = () => setIsOpen(false)

  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e
    switch (key) {
      case 'ArrowDown':
        isOpen ? closeMenu() : openMenu()
        break
      case 'ArrowUp':
        isOpen ? closeMenu() : openMenu()
        break
      case 'Escape':
        closeMenu()
        break
      default:
        break
    }
  }

  const referenceElement = useRef<HTMLButtonElement>(null)

  return (
    <div>
      <EdsProvider {...args}>
        <TopBar>
          <TopBar.Header>My Application</TopBar.Header>
          <TopBar.Actions>
            <Button
              ref={referenceElement}
              variant="ghost_icon"
              id="menuButton"
              aria-controls="menu-on-button"
              aria-haspopup="true"
              aria-expanded={isOpen}
              onClick={() => (isOpen ? closeMenu() : openMenu())}
              onKeyDown={onKeyPress}
            >
              <Icon data={accessible} title="accessible"></Icon>
            </Button>
            <Menu
              id="menu-on-button"
              open={isOpen}
              aria-labelledby="menuButton"
              anchorEl={referenceElement.current}
              onClose={closeMenu}
            >
              <Menu.Section title="Density">
                <Menu.Item onClick={() => setDensity('comfortable')}>
                  Comfortable
                </Menu.Item>
                <Menu.Item onClick={() => setDensity('compact')}>
                  Compact
                </Menu.Item>
              </Menu.Section>
            </Menu>
          </TopBar.Actions>
        </TopBar>
        <Wrapper>
          <Button>Contained</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="ghost_icon">
            <Icon data={menu} title="Ghost icon menu"></Icon>
          </Button>
        </Wrapper>
      </EdsProvider>
    </div>
  )
}

const sourceCode = `const [state, setState] = useState<{
  isOpen: boolean
  density: EdsProviderProps['density']
}>({
  isOpen: false,
  density: 'comfortable',
})

const { density, isOpen } = state

const setDensity = (density: 'comfortable' | 'compact') =>
  setState((prevState) => ({ ...prevState, density }))

const openMenu = () => {
  setState((prevState) => ({ ...prevState, isOpen: true }))
}

const closeMenu = () =>
  setState((prevState) => ({ ...prevState, isOpen: false }))

const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
  const { key } = e
  switch (key) {
    case 'ArrowDown':
      isOpen ? closeMenu() : openMenu()
      break
    case 'ArrowUp':
      isOpen ? closeMenu() : openMenu()
      break
    case 'Escape':
      closeMenu()
      break
    default:
      break
  }
}

const referenceElement = useRef<HTMLButtonElement>(null)

return (
  <div>
    <TopBar>
      <TopBar.Header>Some header</TopBar.Header>
      <TopBar.Actions>
        <Button
          ref={referenceElement}
          variant="ghost_icon"
          id="menuButton"
          aria-controls="menu-on-button"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => (isOpen ? closeMenu() : openMenu())}
          onKeyDown={onKeyPress}
        >
          <Icon data={accessible} title="accessible"></Icon>
        </Button>
        <Menu
          id="menu-on-button"
          open={isOpen}
          aria-labelledby="menuButton"
          anchorEl={referenceElement.current}
          onClose={closeMenu}
        >
          <Menu.Section title="Density">
            <Menu.Item onClick={() => setDensity('comfortable')}>
              Comfortable
            </Menu.Item>
            <Menu.Item onClick={() => setDensity('compact')}>
              Compact
            </Menu.Item>
          </Menu.Section>
        </Menu>
      </TopBar.Actions>
    </TopBar>
    <div>
      Here be dragons…
    </div>
  </div>
)`

Default.parameters = {
  docs: {
    source: {
      code: sourceCode,
    },
  },
}
