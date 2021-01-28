import * as React from 'react'
import { FC } from 'react'
import { Menu as BaseMenu, MenuProps } from './Menu'
import { MenuItem } from './MenuItem'
import { MenuSection } from './MenuSection'
import { MenuProvider } from './Menu.context'

type MenuType = typeof BaseMenu & {
  // Deprecated
  MenuItem: typeof MenuItem
  MenuSection: typeof MenuSection
  // New
  Item: typeof MenuItem
  Section: typeof MenuSection
}

const MenuWrapper: FC<MenuProps> = ({ children, ...rest }) => (
  <MenuProvider>
    <BaseMenu {...rest}>{children}</BaseMenu>
  </MenuProvider>
)

const Menu = MenuWrapper as MenuType
// Deprecated
Menu.MenuItem = MenuItem
Menu.MenuSection = MenuSection
// New
Menu.Item = MenuItem
Menu.Section = MenuSection

export { Menu }
export type { MenuProps }
