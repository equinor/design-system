import type { ReactNode } from 'react'
import type { InputProps } from '../Input/Input.types'

export type AutocompleteProps<T = string> = {
  /** Label for the field */
  label?: ReactNode
  /** Descriptive text providing additional context */
  description?: ReactNode
  /** Helper or validation message shown below the input */
  helperMessage?: ReactNode
  /** Unique identifier for the field */
  id?: string
  /** List of options to display in the dropdown */
  options: T[]
  /**
   * Returns the display label for an option.
   * Required when T is not string — omit for string options.
   * @default (option) => String(option)
   */
  getOptionLabel?: (option: T) => string
  /** The currently selected option value */
  value?: T
  /** Callback fired when the user selects an option from the list */
  onValueChange?: (value: T) => void
  /** Text shown when no options match the search value */
  noOptionsText?: string
  /**
   * Allow the user to confirm a typed value that is not in the options list.
   * Shows an "Add: {value}" option while typing.
   */
  allowCustomValue?: boolean
  /** Callback fired when the user confirms a custom value not in the options list */
  onCustomValueConfirm?: (value: string) => void
  /** Callback fired when the clear button is clicked */
  onClear?: () => void
  /** Accessible label for the clear button. Defaults to "Clear". Override for localisation. */
  clearLabel?: string
  /** Shows a loading spinner and disables option selection while data is being fetched */
  loading?: boolean
  /** Text shown in the dropdown while loading. Defaults to "Loading…" */
  loadingText?: string
  /** Controlled value of the search input text */
  inputValue?: string
  /** Default value of the search input text */
  defaultInputValue?: string
  /** Callback fired when the search input text changes */
  onInputChange?: (value: string) => void
  /**
   * Returns a stable unique string key for an option, used for identity comparison.
   * Provide this when T is an object and reference equality across renders is unreliable.
   */
  getOptionValue?: (option: T) => string
  /** Disable specific options from being selected */
  optionDisabled?: (option: T) => boolean
  /**
   * Custom filter function. Return true to include the option.
   * Use this to override the default case-insensitive substring match,
   * or return `true` for all options when filtering is server-side.
   */
  optionsFilter?: (option: T, inputValue: string) => boolean
  /**
   * Custom rendering for each option row in the dropdown.
   * Receives the option and its selection state.
   * `getOptionLabel` is still required for filtering and input display.
   */
  renderOption?: (option: T, state: { isSelected: boolean }) => ReactNode
} & Omit<
  InputProps,
  | 'startAdornment'
  | 'endAdornment'
  | 'startText'
  | 'endText'
  | 'as'
  | 'hideErrorIcon'
  | 'type'
  | 'value'
  | 'defaultValue'
>
