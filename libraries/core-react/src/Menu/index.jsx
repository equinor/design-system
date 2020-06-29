import React from 'react'
import { Menu as BaseMenu } from './Menu'
import { MenuItem } from './MenuItem'
import { MenuLabel } from './MenuLabel'
import { MenuTitle } from './MenuTitle'
import { MenuProvider } from './Menu.context'

const Menu = ({ children, ...rest }) => (
  <MenuProvider>
    <BaseMenu {...rest}>{children}</BaseMenu>
  </MenuProvider>
)

Menu.MenuItem = MenuItem
Menu.MenuLabel = MenuLabel
Menu.MenuTitle = MenuTitle

export { Menu }
