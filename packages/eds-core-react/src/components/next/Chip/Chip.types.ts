import type {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react'

/**
 * Color tone for theming
 * - `neutral`: Neutral gray tones (default)
 * - `accent`: Brand/action color
 * - `success`: Positive/confirmation
 * - `info`: Informational
 * - `warning`: Caution/alerts
 * - `danger`: Destructive/error
 */
export type ChipTone =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'

/**
 * Chip visual style variants
 * - `default`: Solid muted fill background
 * - `outlined`: Transparent background with border
 * - `high-contrast`: Dark emphasis fill with light text
 */
export type ChipVariant = 'default' | 'outlined' | 'high-contrast'

export type ChipProps = {
  /**
   * Color tone for theming
   * @default 'neutral'
   */
  tone?: ChipTone
  /**
   * Visual style variant
   * @default 'default'
   */
  variant?: ChipVariant
  /**
   * Selected state. For default chips this shows a leading check icon.
   * For dropdown chips this flips the trailing arrow up to indicate the menu is open.
   *
   * @default false
   *
   * @example
   * ```tsx
   * const [selected, setSelected] = useState(false)
   * <Chip selected={selected} onClick={() => setSelected(!selected)}>
   *   Filter
   * </Chip>
   * ```
   */
  selected?: boolean
  /**
   * Shows a trailing close icon and turns the entire chip into a delete
   * button — clicking anywhere on the chip fires this callback, and
   * Backspace/Delete while focused does the same. When provided, `onClick`
   * is ignored (a deletable chip has only one action).
   *
   * @example
   * ```tsx
   * <Chip onDelete={() => removeFilter(id)}>Active</Chip>
   * ```
   */
  onDelete?: (
    event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
  ) => void
  /**
   * Shows a trailing dropdown arrow icon. Combine with `selected` to flip
   * the arrow up while the menu is open. The actual dropdown/popover
   * behavior is the consumer's responsibility.
   * @default false
   */
  dropdown?: boolean
  /**
   * Chip content
   */
  children?: ReactNode
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>
