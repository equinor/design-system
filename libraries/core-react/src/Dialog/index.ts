import { Dialog as BaseComponent } from './Dialog'
import { Actions } from './Actions'
import { Title } from './Title'
import { CustomContent } from './CustomContent'

type DialogTypes = typeof BaseComponent & {
  Actions: typeof Actions
  Title: typeof Title
  CustomContent: typeof CustomContent
}

const Dialog = BaseComponent as DialogTypes

Dialog.Actions = Actions
Dialog.Title = Title
Dialog.CustomContent = CustomContent

export { Dialog }
