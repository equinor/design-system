import { TopBar as BaseComponent } from './TopBar'
import { Actions } from './Actions'
import { Header } from './Header'
import { CustomContent } from './CustomContent'

type TopbarTypes = typeof BaseComponent & {
  Actions: typeof Actions
  Header: typeof Header
  CustomContent: typeof CustomContent
}

const TopBar = BaseComponent as TopbarTypes

TopBar.Actions = Actions
TopBar.Header = Header
TopBar.CustomContent = CustomContent

export { TopBar }
