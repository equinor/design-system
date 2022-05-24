import { SideBar as BaseSideBar } from './SideBar'
import { SidebarItem, SidebarItemType as ItemType } from './SidebarItem'
import { SideBarContent, SideBarContentProps } from './SideBarContent'
import { SideBarFooter, SideBarFooterProps } from './SideBarFooter'

type SidebarType = typeof BaseSideBar & {
  Item: typeof SidebarItem
  Content: typeof SideBarContent
  Footer: typeof SideBarFooter
}

const SideBar = BaseSideBar as SidebarType
SideBar.Item = SidebarItem
SideBar.Content = SideBarContent
SideBar.Footer = SideBarFooter

SideBar.Item.displayName = 'SideBar.Item'
SideBar.Content.displayName = 'SideBar.Content'
SideBar.Footer.displayName = 'SideBar.Footer'

export { SideBar }
export type { SidebarType, ItemType, SideBarContentProps, SideBarFooterProps }
