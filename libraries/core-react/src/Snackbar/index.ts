import { SnackbarAction } from './SnackbarAction'
import { Snackbar as BaseComponent, SnackbarProps } from './Snackbar'

type SnackbarType = typeof BaseComponent & {
  SnackbarAction: typeof SnackbarAction
}

const Snackbar = BaseComponent as SnackbarType

Snackbar.SnackbarAction = SnackbarAction

export { Snackbar }
export type { SnackbarProps }
