'use client'
import { SideBar as BaseSideBar } from './SideBar'
import { useSideBar } from './SideBar.context'
import { SidebarLink, SidebarLinkProps } from './SidebarLink'
import { SideBarContent } from './SideBarContent'
import { SideBarFooter } from './SideBarFooter'
import { SideBarToggle } from './SideBarToggle'
import { SideBarButton } from './SideBarButton'
import { SideBarAccordion } from './SideBarAccordion'
import { SideBarAccordionItem } from './SideBarAccordionItem'

type SidebarType = typeof BaseSideBar & {
  Link: typeof SidebarLink
  Content: typeof SideBarContent
  Footer: typeof SideBarFooter
  Toggle: typeof SideBarToggle
  Button: typeof SideBarButton
  Accordion: typeof SideBarAccordion
  AccordionItem: typeof SideBarAccordionItem
}

const SideBar = BaseSideBar as SidebarType
SideBar.Link = SidebarLink
SideBar.Content = SideBarContent
SideBar.Footer = SideBarFooter
SideBar.Toggle = SideBarToggle
SideBar.Button = SideBarButton
SideBar.Accordion = SideBarAccordion
SideBar.AccordionItem = SideBarAccordionItem

SideBar.Link.displayName = 'SideBar.Link'
SideBar.Content.displayName = 'SideBar.Content'
SideBar.Footer.displayName = 'SideBar.Footer'
SideBar.Toggle.displayName = 'SideBar.Toggle'
SideBar.Button.displayName = 'SideBar.Button'
SideBar.Accordion.displayName = 'SideBar.Accordion'
SideBar.AccordionItem.displayName = 'SideBar.AccordionItem'

export { SideBar, useSideBar }
export type { SidebarType, SidebarLinkProps }
