import { useSideBar, SideBar as BaseSideBar } from './SideBar'
import { SidebarItem, SidebarItemType as ItemType } from './SidebarItem'

type SidebarType = typeof BaseSideBar & {
  Item: typeof SidebarItem
}

const SideBar = BaseSideBar as SidebarType
SideBar.Item = SidebarItem
SideBar.Item.displayName = 'SideBar.Item'

export { SideBar, useSideBar }
export type { SidebarType, ItemType }
