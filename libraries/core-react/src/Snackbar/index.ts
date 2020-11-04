import { SnackbarAction } from './SnackbarAction'
import { Snackbar as BaseComponent, SnackbarProps } from './Snackbar'

type SnackbarTypes = typeof BaseComponent & {
  SnackbarAction: typeof SnackbarAction
}

const Snackbar = BaseComponent as SnackbarTypes

Snackbar.SnackbarAction = SnackbarAction

export { Snackbar }
export type { SnackbarProps }
