import type { ReactNode } from 'react'
import type { InputProps } from '../Input/Input.types'

/**
 * A single autocomplete option.
 * Pass an array of strings or objects with a custom `optionLabel`.
 */
export type AutocompleteOption = string

export type AutocompleteProps = {
  /** Label for the field */
  label?: ReactNode
  /** Descriptive text providing additional context */
  description?: ReactNode
  /** Helper or validation message shown below the input */
  helperMessage?: ReactNode
  /** Unique identifier for the field */
  id?: string
  /** List of options to display in the dropdown */
  options: string[]
  /** Currently selected option value */
  selectedOption?: string
  /** Callback fired when an option is selected */
  onOptionSelect?: (option: string) => void
  /** Text shown when no options match the search value */
  noOptionsText?: string
  /** Allow the user to confirm a value not in the options list. Shows an "Add: {value}" option while typing. */
  allowCustomValue?: boolean
  /** Callback fired when the clear button is clicked */
  onClear?: () => void
  /** Accessible label for the clear button. Defaults to "Clear". Override for localisation. */
  clearLabel?: string
  /** Shows a loading spinner and disables option selection while data is being fetched */
  loading?: boolean
  /** Text shown in the dropdown while loading. Defaults to "Loading…" */
  loadingText?: string
  /** Current value of the search input */
  value?: string
  /** Default value of the search input */
  defaultValue?: string
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
