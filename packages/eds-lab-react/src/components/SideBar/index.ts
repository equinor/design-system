import { SideBar as BaseSideBar } from './SideBar'
import { useSideBar } from './SideBar.context'
import { SidebarItem, SidebarItemType as ItemType } from './SidebarItem'
import { SideBarContent, SideBarContentProps } from './SideBarContent'
import { SideBarFooter, SideBarFooterProps } from './SideBarFooter'
import { SideBarToggle } from './SideBarToggle'

type SidebarType = typeof BaseSideBar & {
  Item: typeof SidebarItem
  Content: typeof SideBarContent
  Footer: typeof SideBarFooter
  Toggle: typeof SideBarToggle
}

const SideBar = BaseSideBar as SidebarType
SideBar.Item = SidebarItem
SideBar.Content = SideBarContent
SideBar.Footer = SideBarFooter
SideBar.Toggle = SideBarToggle

SideBar.Item.displayName = 'SideBar.Item'
SideBar.Content.displayName = 'SideBar.Content'
SideBar.Footer.displayName = 'SideBar.Footer'
SideBar.Toggle.displayName = 'SideBar.Toggle'

export { SideBar, useSideBar }
export type { SidebarType, ItemType, SideBarContentProps, SideBarFooterProps }
