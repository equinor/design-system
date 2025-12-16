import {
  flip,
  MiddlewareState,
  offset,
  size,
  useFloating,
} from '@floating-ui/react'
import { HTMLAttributes, ReactNode } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { Button } from '../Button'
import { HelperText as _HelperText } from '../InputWrapper/HelperText' /* TODO: Use InputWrapper instead of HelperText once the new token system is in place */
import { Label } from '../Label'
import { Variants } from '../types'
import { AutocompleteContext } from './AutocompleteContext'
import { MultipleInput } from './MultipleInput'
import { OptionList } from './OptionList'
import { SingleInput } from './SingleInput'
import { useAutocomplete } from './useAutocomplete'

const Container = styled.div`
  position: relative;
`

export const AllSymbol = Symbol('Select all')
export const AddSymbol = Symbol('Add new')

const HelperText = styled(_HelperText)`
  margin-top: 8px;
  margin-left: 8px;
`

export const StyledButton = styled(Button)(
  ({
    theme: {
      entities: { button },
    },
  }) => css`
    height: ${button.height};
    width: ${button.height};
  `,
)

export const defaultOptionDisabled = () => false
// MARK: types
export type AutocompleteChanges<T> = { selectedItems: T[] }

export type AutocompleteProps<T = string> = {
  /** List of options in dropdown */
  options: readonly T[]
  /** Total number of options */
  totalOptions?: number
  /** Label for the select element */
  label: ReactNode
  /** Array of initial selected items
   * @default []
   */
  initialSelectedOptions?: T[]
  /** Text that will be displayed under the text field */
  helperText?: string
  /** Icon that will be displayed before the helper text */
  helperIcon?: ReactNode
  /** Set text for the "no options" item. Set to an empty string to force off
   * @default 'No options'
   */
  noOptionsText?: string
  /** Variants */
  variant?: Variants
  /** Meta text, for instance unit */
  meta?: ReactNode
  /** Disabled state
   * @default false
   */
  disabled?: boolean
  /** Set loading state (shows a spinner in the right side of the input field)
   * @default false
   */
  loading?: boolean
  /** Read Only
   * @default false
   */
  readOnly?: boolean
  /** Hide clear button even when items are selected
   * @default false
   */
  hideClearButton?: boolean
  /** If this prop is used, the select will become a controlled component. Use an empty
   * array [] if there will be no initial selected items.
   * Note that this prop replaces the need for ```initialSelectedOptions```
   * The items that should be selected. */
  selectedOptions?: T[]
  /** How selected items are displayed in the input field
   * @default 'summary'
   */
  selectionDisplay?: 'chips' | 'summary'
  /** Callback for the selected item change
   * changes.selectedItems gives the selected items
   */
  onOptionsChange?: (changes: AutocompleteChanges<T>) => void
  /** Callback for input changes.
   * Returns input value
   */
  onInputChange?: (text: string) => void
  /** Callback for clicking the add new option button */
  onAddNewOption?: (text: string) => void
  /** Enable multiselect */
  multiple?: boolean
  /** Add select-all option. Throws an error if true while multiple = false */
  allowSelectAll?: boolean
  /**  Custom option template */
  optionComponent?: (option: T, isSelected: boolean) => ReactNode
  /** Disable option
   * @default () => false
   */
  optionDisabled?: (option: T) => boolean
  /** Custom filter function for options */
  optionsFilter?: (option: T, inputValue: string) => boolean
  /** If `true` the width of the dropdown will adjust to the width of the input */
  autoWidth?: boolean
  /** Descriptive text for whats selected or about to be selected */
  placeholder?: string
  /** Toggle if input is cleared when an option is selected when `multiple` is `true`
   * @default true
   */
  clearSearchOnChange?: boolean
  /** Will wrap overflowing text at the expence of some performance overhead to calculate item heigths. Mostly relevant in combination with autoWidth
   * @default false
   */
  multiline?: boolean
  /** Override default max height on dropdown (in px)
   *  @default 300
   */
  dropdownHeight?: number

  /**
   * Method that is used to select a key that can be used for comparing items. If omitted, objects are matched by reference.
   */
  itemToKey?: (value: T | null) => unknown
  /**
   * @deprecated since version 0.45.0 - use itemToKey instead
   * Method that is used to compare objects by value. If omitted, objects are matched by reference.
   */
  itemCompare?: (value: T, compare: T) => boolean
  /**
   * Callback for clear all button
   */
  onClear?: () => void
  ref?: React.Ref<HTMLInputElement>
} & HTMLAttributes<HTMLDivElement> &
  (T extends string | number
    ? {
        /**  Custom option label. NOTE: This is required when option is an object */
        optionLabel?: (option: T) => string
      }
    : T extends object
      ? {
          /**  Custom option label. NOTE: This is required when option is an object */
          optionLabel: (option: T) => string
        }
      : {
          /**  Custom option label. NOTE: This is required when option is an object */
          optionLabel?: (option: T) => string
        })

// MARK: component
export function Autocomplete<T>({ ...props }: AutocompleteProps<T>) {
  const autocompleteProps = useAutocomplete({ ...props, ref: props.ref })
  const {
    getLabelProps,
    token,
    tokens,
    autoWidth,
    className,
    style,
    label,
    meta,
    multiple,
    disabled,
    variant,
    helperIcon,
    helperText,
  } = autocompleteProps

  // MARK: floating-ui setup
  const floatingProps = useFloating<HTMLInputElement>({
    placement: 'bottom-start',
    middleware: [
      offset(4),
      flip({
        boundary: typeof document === 'undefined' ? undefined : document?.body,
      }),
      size({
        apply({ rects, elements }: MiddlewareState) {
          const anchorWidth = `${rects.reference.width}px`
          Object.assign(elements.floating.style, {
            width: `${autoWidth ? anchorWidth : 'auto'}`,
          })
        },
        padding: 10,
      }),
    ],
  })

  // MARK: input
  return (
    <AutocompleteContext.Provider value={{ ...autocompleteProps }}>
      <ThemeProvider theme={token}>
        <Container className={className} style={style}>
          <Label
            {...getLabelProps()}
            label={label}
            meta={meta}
            disabled={disabled}
          />
          <Container ref={floatingProps.refs.setReference}>
            {multiple ? <MultipleInput /> : <SingleInput />}
          </Container>
          {helperText && (
            <HelperText
              color={
                variant ? tokens.variants[variant].typography.color : undefined
              }
              text={helperText}
              icon={helperIcon}
            />
          )}
          <OptionList {...floatingProps} />
        </Container>
      </ThemeProvider>
    </AutocompleteContext.Provider>
  )
}
