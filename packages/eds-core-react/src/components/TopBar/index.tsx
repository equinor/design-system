'use client'
import { TopBar as BaseComponent, TopbarProps } from './TopBar'
import { Actions, TopbarActionsProps } from './Actions'
import { Header, TopbarHeaderProps } from './Header'
import { CustomContent, TopbarCustomContentProps } from './CustomContent'

type TopbarCompoundProps = typeof BaseComponent & {
  Actions: typeof Actions
  Header: typeof Header
  CustomContent: typeof CustomContent
}

const TopBar = BaseComponent as TopbarCompoundProps

TopBar.Actions = Actions
TopBar.Header = Header
TopBar.CustomContent = CustomContent

TopBar.Actions.displayName = 'Topbar.Actions'
TopBar.Header.displayName = 'Topbar.Header'
TopBar.CustomContent.displayName = 'Topbar.CustomContent'

export { TopBar }
export type {
  TopbarProps,
  TopbarActionsProps,
  TopbarCustomContentProps,
  TopbarHeaderProps,
}
