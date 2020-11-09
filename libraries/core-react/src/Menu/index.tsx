import { FC } from 'react'
import { Menu as BaseMenu, MenuProps } from './Menu'
import { MenuItem } from './MenuItem'
import { MenuSection } from './MenuSection'
import { MenuProvider } from './Menu.context'

type MenuType = typeof BaseMenu & {
  MenuItem: typeof MenuItem
  MenuSection: typeof MenuSection
}

const MenuWrapper: FC<MenuProps> = ({ children, ...rest }) => (
  <MenuProvider>
    <BaseMenu {...rest}>{children}</BaseMenu>
  </MenuProvider>
)

const Menu = MenuWrapper as MenuType

Menu.MenuItem = MenuItem
Menu.MenuSection = MenuSection

// Menu.displayName = BaseMenu.displayName

export { Menu }
export type { MenuProps }
