import { TopBar as TopBarComponent } from './TopBar'
import { Actions } from './Actions'
import { Header } from './Header'
import { CustomContent } from './CustomContent'

/**
 * @type {typeof import('./types').TopBar}
 */
// @ts-ignore
const TopBar = TopBarComponent

TopBar.Actions = Actions
TopBar.Header = Header
TopBar.CustomContent = CustomContent

export { TopBar }
