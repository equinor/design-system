import { Dialog as BaseComponent, DialogProps } from './Dialog'
import { Actions } from './Actions'
import { Title } from './Title'
import { CustomContent } from './CustomContent'

type CompoundDialogProps = typeof BaseComponent & {
  Actions: typeof Actions
  Title: typeof Title
  CustomContent: typeof CustomContent
}

const Dialog = BaseComponent as CompoundDialogProps

Dialog.Actions = Actions
Dialog.Title = Title
Dialog.CustomContent = CustomContent

export { Dialog }
export type { DialogProps }
