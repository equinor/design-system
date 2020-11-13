import { TopBar as BaseComponent, TopbarProps } from './TopBar'
import { Actions } from './Actions'
import { Header } from './Header'
import { CustomContent } from './CustomContent'

type TopbarCompoundProps = typeof BaseComponent & {
  Actions: typeof Actions
  Header: typeof Header
  CustomContent: typeof CustomContent
}

const TopBar = BaseComponent as TopbarCompoundProps

TopBar.Actions = Actions
TopBar.Header = Header
TopBar.CustomContent = CustomContent

export { TopBar }
export type { TopbarProps }
