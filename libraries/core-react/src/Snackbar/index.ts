import { SnackbarAction } from './SnackbarAction'
import { Snackbar as BaseComponent } from './Snackbar'

type SnackbarTypes = typeof BaseComponent & {
  SnackbarAction: typeof SnackbarAction
}

const Snackbar = BaseComponent as SnackbarTypes

Snackbar.SnackbarAction = SnackbarAction

export { Snackbar }
