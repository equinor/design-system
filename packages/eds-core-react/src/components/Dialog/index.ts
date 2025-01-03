'use client'
import { Dialog as BaseComponent, DialogProps } from './Dialog'
import { DialogActions, DialogActionsProps } from './DialogActions'
import { DialogTitle, DialogTitleProps } from './DialogTitle'
import { DialogContent, DialogContentProps } from './DialogContent'
import { DialogHeader, DialogHeaderProps } from './DialogHeader'

type CompoundDialogProps = typeof BaseComponent & {
  Actions: typeof DialogActions
  Title: typeof DialogTitle
  CustomContent: typeof DialogContent
  Content: typeof DialogContent
  Header: typeof DialogHeader
}

const Dialog = BaseComponent as CompoundDialogProps

Dialog.Actions = DialogActions
Dialog.Title = DialogTitle
Dialog.CustomContent = DialogContent
Dialog.Content = DialogContent
Dialog.Header = DialogHeader

Dialog.Actions.displayName = 'Dialog.Actions'
Dialog.Title.displayName = 'Dialog.Title'
Dialog.Content.displayName = 'Dialog.Content'
Dialog.Header.displayName = 'Dialog.Header'

export { Dialog }
export type {
  DialogProps,
  DialogActionsProps,
  DialogTitleProps,
  DialogContentProps,
  DialogHeaderProps,
}
