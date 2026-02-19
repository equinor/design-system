import type { HTMLAttributes } from 'react'
import type { IconData } from '../Icon'

export type ChipProps = {
  /** Whether the chip is disabled */
  disabled?: boolean
  /**
   * Whether the chip is selected (controlled).
   * When true, the chip uses accent styling and shows a checkmark icon
   * (unless `showCheckIcon` is false).
   */
  selected?: boolean
  /**
   * Whether to show the checkmark icon when selected.
   * Set to false to keep accent styling without the leading checkmark.
   * @default true
   */
  showCheckIcon?: boolean
  /**
   * Icon data from @equinor/eds-icons to display as a leading icon.
   * When `selected` is true, this icon is replaced by a checkmark.
   */
  icon?: IconData
  /**
   * Callback fired when the delete icon is clicked.
   * When provided, a close button is rendered inside the chip.
   * Cannot be used together with `dropdown`.
   */
  onDelete?: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLDivElement>,
  ) => void
  /**
   * Whether the chip acts as a dropdown trigger.
   * Renders a trailing dropdown arrow and sets `aria-haspopup="menu"`.
   * The menu popover is not built in — consumers compose their own menu.
   * Cannot be used together with `onDelete`.
   */
  dropdown?: boolean
} & HTMLAttributes<HTMLDivElement>
