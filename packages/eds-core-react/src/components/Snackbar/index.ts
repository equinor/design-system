import { SnackbarAction, SnackbarActionProps } from './SnackbarAction'
import { Snackbar as BaseComponent, SnackbarProps } from './Snackbar'

type SnackbarTypes = typeof BaseComponent & {
  Action: typeof SnackbarAction
}

const Snackbar = BaseComponent as SnackbarTypes
Snackbar.Action = SnackbarAction

export { Snackbar, SnackbarAction }
export type { SnackbarProps, SnackbarActionProps }
