import { TopBar as BaseComponent, TopbarProps } from './TopBar'
import { Actions as TopbarActions, TopbarActionsProps } from './Actions'
import { Header as TopbarHeader, TopbarHeaderProps } from './Header'
import {
  CustomContent as TopbarCustomContent,
  TopbarCustomContentProps,
} from './CustomContent'

type TopbarCompoundProps = typeof BaseComponent & {
  Actions: typeof TopbarActions
  Header: typeof TopbarHeader
  CustomContent: typeof TopbarCustomContent
}

const TopBar = BaseComponent as TopbarCompoundProps

TopBar.Actions = TopbarActions
TopBar.Header = TopbarHeader
TopBar.CustomContent = TopbarCustomContent

TopBar.Actions.displayName = 'Topbar.Actions'
TopBar.Header.displayName = 'Topbar.Header'
TopBar.CustomContent.displayName = 'Topbar.CustomContent'

export { TopBar, TopbarActions, TopbarHeader, TopbarCustomContent }
export type {
  TopbarProps,
  TopbarActionsProps,
  TopbarCustomContentProps,
  TopbarHeaderProps,
}
