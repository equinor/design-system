import type { ReactNode } from 'react'

/**
 * Shared option-list props reused by Autocomplete, NativeSelect, and Combobox.
 * Components extend this type and omit props they don't support.
 */
export type SelectOptionProps<T> = {
  /** List of options to display */
  options: T[]
  /**
   * Returns the display label for an option.
   * Required when T is not string — omit for string options.
   * @default (option) => String(option)
   */
  getOptionLabel?: (option: T) => string
  /**
   * Returns a stable unique string key for an option, used for identity comparison.
   * Provide this when T is an object and reference equality across renders is unreliable.
   */
  getOptionValue?: (option: T) => string
  /** Disable specific options from being selected */
  optionDisabled?: (option: T) => boolean
  /**
   * Custom rendering for each option row in the dropdown.
   * Receives the option and its selection state.
   * `getOptionLabel` is still required for filtering and input display.
   */
  renderOption?: (option: T, state: { isSelected: boolean }) => ReactNode
}
