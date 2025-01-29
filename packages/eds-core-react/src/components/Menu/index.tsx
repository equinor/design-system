import { Menu as BaseMenu, MenuProps } from './Menu'
import { MenuItem, MenuItemProps } from './MenuItem'
import { MenuSection, MenuSectionProps } from './MenuSection'

type MenuType = typeof BaseMenu & {
  Item: typeof MenuItem
  Section: typeof MenuSection
}

const Menu = BaseMenu as MenuType
Menu.Item = MenuItem
Menu.Section = MenuSection

Menu.Item.displayName = 'Menu.Item'
Menu.Section.displayName = 'Menu.Section'

export { Menu, MenuItem, MenuSection }
export type { MenuProps, MenuItemProps, MenuSectionProps }
