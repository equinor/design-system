import { Dialog as BaseComponent, DialogProps } from './Dialog'
import { Actions, DialogActionsProps } from './Actions'
import { Title, DialogTitleProps } from './Title'
import { CustomContent, DialogCustomContentProps } from './CustomContent'
import { DialogHeader, DialogHeaderProps } from './DialogHeader'

type CompoundDialogProps = typeof BaseComponent & {
  Actions: typeof Actions
  Title: typeof Title
  CustomContent: typeof CustomContent
  Header: typeof DialogHeader
}

const Dialog = BaseComponent as CompoundDialogProps

Dialog.Actions = Actions
Dialog.Title = Title
Dialog.CustomContent = CustomContent
Dialog.Header = DialogHeader

Dialog.Actions.displayName = 'Dialog.Actions'
Dialog.Title.displayName = 'Dialog.Title'
Dialog.CustomContent.displayName = 'Dialog.CustomContent'
Dialog.Header.displayName = 'Dialog.Header'

export { Dialog }
export type {
  DialogProps,
  DialogActionsProps,
  DialogTitleProps,
  DialogCustomContentProps,
  DialogHeaderProps,
}
