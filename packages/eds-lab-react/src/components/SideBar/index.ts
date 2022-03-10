import { SideBar as BaseSideBar } from './SideBar'
import { MenuItem, MenuItemType as ItemType } from './MenuItem'

type SidebarType = typeof BaseSideBar & {
  Item: typeof MenuItem
}

const SideBar = BaseSideBar as SidebarType
SideBar.Item = MenuItem
SideBar.Item.displayName = 'SideBar.Item'

export { SideBar }
export type { SidebarType, ItemType }
