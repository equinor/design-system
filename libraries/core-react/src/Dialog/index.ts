import {
  Dialog as BaseComponent,
  DialogProps as BaseComponentProps,
} from './Dialog'
import { Actions } from './Actions'
import { Title } from './Title'
import { CustomContent } from './CustomContent'

type DialogProps = typeof BaseComponent & {
  Actions: typeof Actions
  Title: typeof Title
  CustomContent: typeof CustomContent
}

const Dialog = BaseComponent as DialogProps

Dialog.Actions = Actions
Dialog.Title = Title
Dialog.CustomContent = CustomContent

export { Dialog, BaseComponentProps as DialogProps }
