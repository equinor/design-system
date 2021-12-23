import { Dialog as BaseComponent, DialogProps } from './Dialog'
import { Actions, DialogActionsProps } from './Actions'
import { Title, DialogTitleProps } from './Title'
import { CustomContent, DialogCustomContentProps } from './CustomContent'

type CompoundDialogProps = typeof BaseComponent & {
  Actions: typeof Actions
  Title: typeof Title
  CustomContent: typeof CustomContent
}

const Dialog = BaseComponent as CompoundDialogProps

Dialog.Actions = Actions
Dialog.Title = Title
Dialog.CustomContent = CustomContent

Dialog.Actions.displayName = 'Dialog.Actions'
Dialog.Title.displayName = 'Dialog.Title'
Dialog.CustomContent.displayName = 'Dialog.CustomContent'

export { Dialog }
export type {
  DialogProps,
  DialogActionsProps,
  DialogTitleProps,
  DialogCustomContentProps,
}
