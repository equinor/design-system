import { useState, useEffect } from 'react'
import {
  Button,
  EdsProvider,
  TopBar,
  Icon,
  Menu,
  Checkbox,
  Typography,
} from '../..'
import { StoryFn, Meta } from '@storybook/react-vite'
import { Stack } from './../../../.storybook/components'
import page from './EdsProvider.docs.mdx'
import { EdsProviderProps, useEds } from './eds.context'
import { accessible } from '@equinor/eds-icons'

const meta: Meta<typeof EdsProvider> = {
  title: 'EdsProvider',
  component: EdsProvider,
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
}

export default meta

export const Introduction: StoryFn<EdsProviderProps> = ({ density }) => {
  return (
    <EdsProvider density={density}>
      <Typography>Current density is {density}</Typography>
      <Button>Button</Button>
    </EdsProvider>
  )
}
Introduction.args = {
  density: 'comfortable',
}

Introduction.decorators = [
  (Story) => (
    <Stack direction="column">
      <Story></Story>
    </Stack>
  ),
]

export const CustomState: StoryFn<EdsProviderProps> = (args) => {
  const [isOpenMenu, setOpenMenu] = useState<boolean>(false)
  const [density, setDensity] =
    useState<EdsProviderProps['density']>('comfortable')
  const [menuAnchorRef, setMenuAnchorRef] = useState<HTMLButtonElement>(null)

  const openMenu = () => {
    setOpenMenu(true)
  }
  const closeMenu = () => {
    setOpenMenu(false)
  }

  // This is just for storybook and changes done via controls addon
  useEffect(() => {
    // eslint-disable-next-line react/destructuring-assignment
    setDensity(args.density)
    // eslint-disable-next-line react/destructuring-assignment
  }, [args.density])

  return (
    <EdsProvider density={density}>
      <TopBar>
        <TopBar.Header>Topbar with density switcher</TopBar.Header>

        <TopBar.Actions>
          <Button
            variant="ghost_icon"
            ref={setMenuAnchorRef}
            id="anchor-menu"
            aria-haspopup="true"
            aria-expanded={isOpenMenu}
            aria-controls="menu"
            onClick={() => (isOpenMenu ? closeMenu() : openMenu())}
          >
            <Icon data={accessible} title="Choose density" />
          </Button>
          <Menu
            open={isOpenMenu}
            {...args}
            id="menu"
            aria-labelledby="anchor-menu"
            onClose={closeMenu}
            anchorEl={menuAnchorRef}
          >
            <Menu.Section title="Density">
              <Menu.Item onClick={() => setDensity('comfortable')}>
                <Checkbox
                  label="Comfortable"
                  name="Select comfortable"
                  checked={density === 'comfortable'}
                  onChange={() => setDensity('comfortable')}
                />
              </Menu.Item>
              <Menu.Item onClick={() => setDensity('compact')}>
                <Checkbox
                  label="Compact"
                  name="Select compact"
                  checked={density === 'compact'}
                  onChange={() => setDensity('compact')}
                />
              </Menu.Item>
            </Menu.Section>
          </Menu>
        </TopBar.Actions>
      </TopBar>
      <Stack>Current density is {density}</Stack>
    </EdsProvider>
  )
}
CustomState.args = {
  density: 'comfortable',
}

const MyApp = () => {
  const [isOpenMenu, setOpenMenu] = useState<boolean>(false)
  const [menuAnchorRef, setMenuAnchorRef] = useState<HTMLButtonElement>(null)
  const openMenu = () => {
    setOpenMenu(true)
  }
  const closeMenu = () => {
    setOpenMenu(false)
  }

  const { density, setDensity } = useEds()

  return (
    <>
      <TopBar>
        <TopBar.Header>Topbar with density switcher</TopBar.Header>
        <TopBar.Actions>
          <Button
            variant="ghost_icon"
            ref={setMenuAnchorRef}
            id="anchor-menu"
            aria-haspopup="true"
            aria-expanded={isOpenMenu}
            aria-controls="menu"
            onClick={() => (isOpenMenu ? closeMenu() : openMenu())}
          >
            <Icon data={accessible} title="Choose density" />
          </Button>
          <Menu
            open={isOpenMenu}
            id="menu"
            aria-labelledby="anchor-menu"
            onClose={closeMenu}
            anchorEl={menuAnchorRef}
          >
            <Menu.Section title="Density">
              <Menu.Item onClick={() => setDensity('comfortable')}>
                <Checkbox
                  label="Comfortable"
                  name="Select comfortable"
                  checked={density === 'comfortable'}
                  onChange={() => setDensity('comfortable')}
                />
              </Menu.Item>
              <Menu.Item onClick={() => setDensity('compact')}>
                <Checkbox
                  label="Compact"
                  name="Select compact"
                  checked={density === 'compact'}
                  onChange={() => setDensity('compact')}
                />
              </Menu.Item>
            </Menu.Section>
          </Menu>
        </TopBar.Actions>
      </TopBar>
      <Stack>Current density is {density}</Stack>
    </>
  )
}

export const NestedComponentsDensity: StoryFn<EdsProviderProps> = () => {
  return (
    <EdsProvider>
      <MyApp />
    </EdsProvider>
  )
}
NestedComponentsDensity.args = {
  density: 'comfortable',
}
