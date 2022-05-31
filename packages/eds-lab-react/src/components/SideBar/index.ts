import { SideBar as BaseSideBar } from './SideBar'
import { useSideBar } from './SideBar.context'
import { SidebarItem, SidebarItemType as ItemType } from './SidebarItem'
import { SideBarContent, SideBarContentProps } from './SideBarContent'
import { SideBarFooter, SideBarFooterProps } from './SideBarFooter'
import { SideBarToggle } from './SideBarToggle'
import { SideBarButton } from '../SideBar/SideBarButton'

type SidebarType = typeof BaseSideBar & {
  Item: typeof SidebarItem
  Content: typeof SideBarContent
  Footer: typeof SideBarFooter
  Toggle: typeof SideBarToggle
  Button: typeof SideBarButton
}

const SideBar = BaseSideBar as SidebarType
SideBar.Item = SidebarItem
SideBar.Content = SideBarContent
SideBar.Footer = SideBarFooter
SideBar.Toggle = SideBarToggle
SideBar.Button = SideBarButton

SideBar.Item.displayName = 'SideBar.Item'
SideBar.Content.displayName = 'SideBar.Content'
SideBar.Footer.displayName = 'SideBar.Footer'
SideBar.Toggle.displayName = 'SideBar.Toggle'
SideBar.Button.displayName = 'SideBar.Button'

export { SideBar, useSideBar }
export type { SidebarType, ItemType, SideBarContentProps, SideBarFooterProps }
