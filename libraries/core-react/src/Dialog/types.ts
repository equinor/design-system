import { Dialog as DialogComponent } from './Dialog'
import { Actions } from './Actions'
import { Title } from './Title'
import { CustomContent } from './CustomContent'

export declare const Dialog: typeof DialogComponent & {
  Actions: typeof Actions
  Title: typeof Title
  CustomContent: typeof CustomContent
}
