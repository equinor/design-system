import { useState, useEffect } from 'react'
import { Button, EdsProvider, TopBar, Icon, Menu, Checkbox } from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import { Stack } from './../../../.storybook/components'
import page from './EdsProvider.docs.mdx'
import { EdsProviderProps } from './eds.context'
import { accessible } from '@equinor/eds-icons'

export default {
  title: 'EdsProvider',
  component: EdsProvider,
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof EdsProvider>

export const Introduction: Story<EdsProviderProps> = (args) => {
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
    setDensity(args.density)
    // eslint-disable-next-line react/destructuring-assignment
  }, [args.density])

  return (
    <Stack direction="column" align="inherit">
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
    </Stack>
  )
}
Introduction.args = {
  density: 'comfortable',
}
