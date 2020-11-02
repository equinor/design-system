import { SnackbarAction } from './SnackbarAction'
import { Snackbar as BaseComponent } from './Snackbar'

type SnackbarProps = typeof BaseComponent & {
  SnackbarAction: typeof SnackbarAction
}

const Snackbar = BaseComponent as SnackbarProps

Snackbar.SnackbarAction = SnackbarAction

export { Snackbar, SnackbarProps }
