import type { HTMLAttributes } from 'react'
import type { IconData } from '../Icon'

export type ChipProps = {
  /** Whether the chip is disabled */
  disabled?: boolean
  /**
   * Whether the chip is selected (controlled).
   * When true, the chip uses accent styling and shows a checkmark icon.
   */
  selected?: boolean
  /**
   * Icon data from @equinor/eds-icons to display as a leading icon.
   * When `selected` is true, this icon is replaced by a checkmark.
   */
  icon?: IconData
  /**
   * Callback fired when the delete icon is clicked.
   * When provided, a close button is rendered inside the chip.
   */
  onDelete?: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLDivElement>,
  ) => void
} & HTMLAttributes<HTMLDivElement>
