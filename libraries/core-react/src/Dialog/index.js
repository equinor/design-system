import { Dialog as DialogComponent } from './Dialog'
import { Actions } from './Actions'
import { Title } from './Title'
import { CustomContent } from './CustomContent'

/**
 * @type {typeof import('./types').Dialog}
 */
// @ts-ignore
const Dialog = DialogComponent

Dialog.Actions = Actions
Dialog.Title = Title
Dialog.CustomContent = CustomContent

export { Dialog }
