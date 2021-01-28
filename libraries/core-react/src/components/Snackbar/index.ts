import { SnackbarAction } from './SnackbarAction'
import { Snackbar as BaseComponent, SnackbarProps } from './Snackbar'

type SnackbarTypes = typeof BaseComponent & {
  // Deprecated
  SnackbarAction: typeof SnackbarAction
  // New
  Action: typeof SnackbarAction
}

const Snackbar = BaseComponent as SnackbarTypes
// Deprecated
Snackbar.SnackbarAction = SnackbarAction
// New
Snackbar.Action = SnackbarAction

export { Snackbar }
export type { SnackbarProps }
