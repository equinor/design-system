import type { ReactNode } from 'react'

/**
 * Accessor props that are optional for string options but required for object options.
 * Enforced at compile-time via a conditional type so `<Select options={objs} />` without
 * `getOptionLabel` is a type error rather than a silent `"[object Object]"` at runtime.
 */
export type SelectOptionAccessors<T> = T extends string
  ? {
      /** Returns the display label for an option. */
      getOptionLabel?: (option: T) => string
      /** Returns the form/submission value for an option. Defaults to the label. */
      getOptionValue?: (option: T) => string
    }
  : {
      /** Required when T is not string — returns the display label for an option. */
      getOptionLabel: (option: T) => string
      /** Returns the form/submission value for an option. Defaults to the label. */
      getOptionValue?: (option: T) => string
    }

/**
 * Shared option-list props reused by Autocomplete, Select, and Combobox.
 * Components extend this type and omit props they don't support.
 */
export type SelectOptionProps<T> = {
  /** List of options to display */
  options: T[]
  /** Disable specific options from being selected */
  optionDisabled?: (option: T) => boolean
  /**
   * Custom rendering for each option row in the dropdown.
   * Receives the option and its selection state.
   * `getOptionLabel` is still required for filtering and input display.
   */
  renderOption?: (option: T, state: { isSelected: boolean }) => ReactNode
} & SelectOptionAccessors<T>
