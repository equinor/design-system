import { Menu as BaseMenu, MenuProps } from './Menu'
import { MenuItem } from './MenuItem'
import { MenuSection } from './MenuSection'

type MenuType = typeof BaseMenu & {
  // Deprecated
  MenuItem: typeof MenuItem
  MenuSection: typeof MenuSection
  // New
  Item: typeof MenuItem
  Section: typeof MenuSection
}

const Menu = BaseMenu as MenuType
// Deprecated
Menu.MenuItem = MenuItem
Menu.MenuSection = MenuSection
// New
Menu.Item = MenuItem
Menu.Section = MenuSection

Menu.Item.displayName = 'Menu.Item'
Menu.Section.displayName = 'Menu.Section'

export { Menu }
export type { MenuProps }
