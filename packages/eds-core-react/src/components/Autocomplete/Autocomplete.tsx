import {
  forwardRef,
  useState,
  HTMLAttributes,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  ReactNode,
  EventHandler,
  SyntheticEvent,
  DOMAttributes,
  FocusEvent,
} from 'react'
import {
  useCombobox,
  UseComboboxProps,
  useMultipleSelection,
  UseMultipleSelectionProps,
} from 'downshift'
import { pickBy, mergeWith } from 'ramda'
import { HelperText as _HelperText } from '../InputWrapper/HelperText' /* TODO: Use InputWrapper instead of HelperText once the new token system is in place */
import { useVirtualizer } from '@tanstack/react-virtual'
import styled, { ThemeProvider, css } from 'styled-components'
import { Button } from '../Button'
import { List } from '../List'
import { useEds } from '../EdsProvider'
import { Label } from '../Label'
import { Icon } from '../Icon'
import { Input } from '../Input'
import { Progress } from '../Progress'
import { arrow_drop_down, arrow_drop_up, close } from '@equinor/eds-icons'
import {
  AutocompleteToken,
  multiSelect as multiSelectTokens,
  selectTokens as selectTokens,
} from './Autocomplete.tokens'
import {
  useToken,
  bordersTemplate,
  useIsomorphicLayoutEffect,
} from '@equinor/eds-utils'
import { AutocompleteOption } from './Option'
import {
  offset,
  flip,
  size,
  autoUpdate,
  useFloating,
  useInteractions,
  MiddlewareState,
} from '@floating-ui/react'
import { Variants } from '../types'

const Container = styled.div`
  position: relative;
`

const AllSymbol = Symbol('Select all')
// MARK: styled components
const StyledList = styled(List)(
  ({ theme }) => css`
    background-color: ${theme.background};
    box-shadow: ${theme.boxShadow};
    ${bordersTemplate(theme.border)}
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0;
    display: grid;
    /* hack to fix clipping issue in firefox (#3170) */
    @supports (-moz-appearance: none) {
      scrollbar-width: thin;
    }
  `,
)

const StyledPopover = styled('div').withConfig({
  shouldForwardProp: () => true, //workaround to avoid warning until popover gets added to react types
})<{ popover: string }>`
  inset: unset;
  border: 0;
  padding: 0;
  margin: 0;
  overflow: visible;
  &::backdrop {
    background-color: transparent;
  }
`

const HelperText = styled(_HelperText)`
  margin-top: 8px;
  margin-left: 8px;
`

const AutocompleteNoOptions = styled(AutocompleteOption)(
  ({ theme }) => css`
    color: ${theme.entities.noOptions.typography.color};
  `,
)

const StyledButton = styled(Button)(
  ({
    theme: {
      entities: { button },
    },
  }) => css`
    height: ${button.height};
    width: ${button.height};
  `,
)
// MARK: outside functions
// Typescript can struggle with parsing generic arrow functions in a .tsx file (see https://github.com/microsoft/TypeScript/issues/15713)
// Workaround is to add a trailing , after T, which tricks the compiler, but also have to ignore prettier rule.
// prettier-ignore
type IndexFinderType = <T,>({
  calc,
  index,
  optionDisabled,
  availableItems,
  allDisabled,
}: {
  index: number
  optionDisabled: AutocompleteProps<T>['optionDisabled']
  availableItems: AutocompleteProps<T>['options']
  allDisabled?: boolean
  calc?: (n: number) => number
}) => number

const findIndex: IndexFinderType = ({
  calc,
  index,
  optionDisabled,
  availableItems,
}) => {
  const nextItem = availableItems[index]
  if (optionDisabled(nextItem) && index >= 0 && index < availableItems.length) {
    const nextIndex = calc(index)
    return findIndex({ calc, index: nextIndex, availableItems, optionDisabled })
  }
  return index
}

const isEvent = (val: unknown, key: string) =>
  /^on[A-Z](.*)/.test(key) && typeof val === 'function'

function mergeEventsFromRight(
  props1: DOMAttributes<unknown>,
  props2: DOMAttributes<unknown>,
) {
  const events1: Partial<DOMAttributes<unknown>> = pickBy(isEvent, props1)
  const events2: Partial<DOMAttributes<unknown>> = pickBy(isEvent, props2)

  return mergeWith(
    (
      event1: EventHandler<SyntheticEvent<unknown>>,
      event2: EventHandler<SyntheticEvent<unknown>>,
    ): EventHandler<SyntheticEvent<unknown>> => {
      return (...args) => {
        event1(...args)
        event2(...args)
      }
    },
    events1,
    events2,
  ) as Partial<DOMAttributes<unknown>>
}

const findNextIndex: IndexFinderType = ({
  index,
  optionDisabled,
  availableItems,
  allDisabled,
}) => {
  if (allDisabled) return 0
  const options = {
    index,
    optionDisabled,
    availableItems,
    calc: (num: number) => num + 1,
  }
  const nextIndex = findIndex(options)

  if (nextIndex > availableItems.length - 1) {
    // jump to start of list
    return findIndex({ ...options, index: 0 })
  }

  return nextIndex
}

const findPrevIndex: IndexFinderType = ({
  index,
  optionDisabled,
  availableItems,
  allDisabled,
}) => {
  if (allDisabled) return 0
  const options = {
    index,
    optionDisabled,
    availableItems,
    calc: (num: number) => num - 1,
  }

  const prevIndex = findIndex(options)

  if (prevIndex < 0) {
    // jump to end of list
    return findIndex({ ...options, index: availableItems.length - 1 })
  }

  return prevIndex
}

/*When a user clicks the StyledList scrollbar, the input looses focus which breaks downshift
 * keyboard navigation in the list. This code returns focus to the input on mouseUp
 */
const handleListFocus = (e: FocusEvent<HTMLElement>) => {
  e.preventDefault()
  e.stopPropagation()
  window?.addEventListener(
    'mouseup',
    () => {
      ;(e.relatedTarget as HTMLInputElement)?.focus()
    },
    { once: true },
  )
}

const defaultOptionDisabled = () => false
// MARK: types
export type AutocompleteChanges<T> = { selectedItems: T[] }

export type AutocompleteProps<T> = {
  /** List of options in dropdown */
  options: readonly T[]
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
  /** Callback for the selected item change
   * changes.selectedItems gives the selected items
   */
  onOptionsChange?: (changes: AutocompleteChanges<T>) => void
  /** Callback for input changes.
   * Returns input value
   */
  onInputChange?: (text: string) => void
  /** Enable multiselect */
  multiple?: boolean
  /** Add select-all option. Throws an error if true while multiple = false */
  allowSelectAll?: boolean
  /**  Custom option label. NOTE: This is required when option is an object */
  optionLabel?: (option: T) => string
  /**  Custom option template */
  optionComponent?: (option: T, isSelected: boolean) => ReactNode
  /** Disable use of react portal for dropdown
   * @deprecated  Autocomplete now uses the native popover api to render the dropdown. This prop will be removed in a future version
   */
  disablePortal?: boolean
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
   * Method that is used to compare objects by value. If omitted, objects are matched by reference.
   */
  itemCompare?: (value: T, compare: T) => boolean
} & HTMLAttributes<HTMLDivElement>

// MARK: component
function AutocompleteInner<T>(
  props: AutocompleteProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    options = [],
    label,
    meta,
    className,
    style,
    disabled = false,
    readOnly = false,
    loading = false,
    hideClearButton = false,
    onOptionsChange,
    onInputChange,
    selectedOptions: _selectedOptions,
    multiple,
    itemCompare,
    allowSelectAll,
    initialSelectedOptions: _initialSelectedOptions = [],
    disablePortal,
    optionDisabled = defaultOptionDisabled,
    optionsFilter,
    autoWidth,
    placeholder,
    optionLabel,
    clearSearchOnChange = true,
    multiline = false,
    dropdownHeight = 300,
    optionComponent,
    helperText,
    helperIcon,
    noOptionsText = 'No options',
    variant,
    ...other
  } = props

  // MARK: initializing data/setup
  const selectedOptions = _selectedOptions
    ? itemCompare
      ? options.filter((item) =>
          _selectedOptions.some((compare) => itemCompare(item, compare)),
        )
      : _selectedOptions
    : undefined
  const initialSelectedOptions = _initialSelectedOptions
    ? itemCompare
      ? options.filter((item) =>
          _initialSelectedOptions.some((compare) => itemCompare(item, compare)),
        )
      : _initialSelectedOptions
    : undefined

  if (disablePortal) {
    console.warn(
      'Autocomplete "disablePortal" prop has been deprecated. Autocomplete now uses the native popover api',
    )
  }

  const isControlled = Boolean(selectedOptions)
  const [inputOptions, setInputOptions] = useState(options)
  const [_availableItems, setAvailableItems] = useState(inputOptions)
  const [typedInputValue, setTypedInputValue] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const showSelectAll = useMemo(() => {
    if (!multiple && allowSelectAll) {
      throw new Error(`allowSelectAll can only be used with multiple`)
    }
    return allowSelectAll && !typedInputValue
  }, [allowSelectAll, multiple, typedInputValue])

  const availableItems = useMemo(() => {
    if (showSelectAll) return [AllSymbol as T, ..._availableItems]
    return _availableItems
  }, [_availableItems, showSelectAll])

  //issue 2304, update dataset when options are added dynamically
  useEffect(() => {
    const availableHash = JSON.stringify(inputOptions)
    const optionsHash = JSON.stringify(options)
    if (availableHash !== optionsHash) {
      setInputOptions(options)
    }
  }, [options, inputOptions])

  useEffect(() => {
    setAvailableItems(inputOptions)
  }, [inputOptions])

  const { density } = useEds()
  const token = useToken(
    { density },
    multiple ? multiSelectTokens : selectTokens,
  )
  const tokens = token() as AutocompleteToken

  let placeholderText = placeholder

  let multipleSelectionProps: UseMultipleSelectionProps<T> = {
    initialSelectedItems: multiple
      ? initialSelectedOptions
      : initialSelectedOptions[0]
        ? [initialSelectedOptions[0]]
        : [],
  }

  if (multiple) {
    multipleSelectionProps = {
      ...multipleSelectionProps,
      onSelectedItemsChange: (changes) => {
        if (onOptionsChange) {
          let selectedItems = changes.selectedItems.filter(
            (item) => item !== AllSymbol,
          )
          if (itemCompare) {
            selectedItems = inputOptions.filter((item) =>
              selectedItems.some((compare) => itemCompare(item, compare)),
            )
          }
          onOptionsChange({ selectedItems })
        }
      },
    }

    if (isControlled) {
      multipleSelectionProps = {
        ...multipleSelectionProps,
        selectedItems: selectedOptions,
      }
    }
  }

  const {
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
    setSelectedItems,
  } = useMultipleSelection(multipleSelectionProps)

  // MARK: select all logic
  const enabledItems = useMemo(() => {
    const disabledItemsSet = new Set(inputOptions.filter(optionDisabled))
    return inputOptions.filter((x) => !disabledItemsSet.has(x))
  }, [inputOptions, optionDisabled])

  const allDisabled = enabledItems.length === 0

  const selectedDisabledItemsSet = useMemo(
    () => new Set(selectedItems.filter(optionDisabled)),
    [selectedItems, optionDisabled],
  )

  const selectedEnabledItems = useMemo(
    () => selectedItems.filter((x) => !selectedDisabledItemsSet.has(x)),
    [selectedItems, selectedDisabledItemsSet],
  )

  const allSelectedState = useMemo(() => {
    if (!enabledItems || !selectedEnabledItems) return 'NONE'
    if (enabledItems.length === selectedEnabledItems.length) return 'ALL'
    if (
      enabledItems.length != selectedEnabledItems.length &&
      selectedEnabledItems.length > 0
    )
      return 'SOME'
    return 'NONE'
  }, [enabledItems, selectedEnabledItems])

  const toggleAllSelected = () => {
    if (selectedEnabledItems.length === enabledItems.length) {
      setSelectedItems([...selectedDisabledItemsSet])
    } else {
      setSelectedItems([...enabledItems, ...selectedDisabledItemsSet])
    }
  }

  // MARK: getLabel
  const getLabel = useCallback(
    (item: T) => {
      //note: non strict check for null or undefined to allow 0
      if (item == null) {
        return ''
      }

      if (typeof item === 'object') {
        if (optionLabel) {
          return optionLabel(item)
        } else {
          throw new Error(
            'Missing label. When using objects for options make sure to define the `optionLabel` property',
          )
        }
      }

      if (typeof item === 'string') {
        return item
      }
      try {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        return item?.toString()
      } catch {
        throw new Error(
          'Unable to find label, make sure your are using options as documented',
        )
      }
    },
    [optionLabel],
  )

  // MARK: setup virtualizer
  const scrollContainer = useRef<HTMLUListElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: availableItems.length,
    getScrollElement: () => scrollContainer.current,
    estimateSize: useCallback(() => {
      return parseInt(token().entities.label.minHeight)
    }, [token]),
    overscan: 25,
  })

  //https://github.com/TanStack/virtual/discussions/379#discussioncomment-3501037
  useIsomorphicLayoutEffect(() => {
    rowVirtualizer?.measure?.()
  }, [rowVirtualizer, density])

  // MARK: downshift state
  let comboBoxProps: UseComboboxProps<T> = {
    items: availableItems as T[], //can not pass readonly type to downshift so we cast it to regular T[]
    initialSelectedItem: initialSelectedOptions[0],
    isItemDisabled(item) {
      return optionDisabled(item)
    },
    itemToString: getLabel,
    onInputValueChange: ({ inputValue }) => {
      onInputChange && onInputChange(inputValue)
      setAvailableItems(
        options.filter((item) => {
          if (optionsFilter) {
            return optionsFilter(item, inputValue)
          }

          return getLabel(item).toLowerCase().includes(inputValue.toLowerCase())
        }),
      )
    },
    onHighlightedIndexChange({ highlightedIndex, type }) {
      if (
        type == useCombobox.stateChangeTypes.InputClick ||
        (type == useCombobox.stateChangeTypes.InputKeyDownArrowDown &&
          !isOpen) ||
        (type == useCombobox.stateChangeTypes.InputKeyDownArrowUp && !isOpen)
      ) {
        //needs delay for dropdown to render before calling scroll
        setTimeout(() => {
          rowVirtualizer.scrollToIndex(highlightedIndex, {
            align: allowSelectAll ? 'center' : 'auto',
          })
        }, 1)
      } else if (
        type !== useCombobox.stateChangeTypes.ItemMouseMove &&
        type !== useCombobox.stateChangeTypes.MenuMouseLeave &&
        highlightedIndex >= 0
      ) {
        rowVirtualizer.scrollToIndex(highlightedIndex, {
          align: allowSelectAll ? 'center' : 'auto',
        })
      }
    },
    onIsOpenChange: ({ selectedItem }) => {
      if (!multiple && selectedItem !== null) {
        setAvailableItems(options)
      }
    },
    onStateChange: ({ type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
        case useCombobox.stateChangeTypes.InputBlur:
          break
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          //note: non strict check for null or undefined to allow 0
          if (selectedItem != null && !optionDisabled(selectedItem)) {
            if (selectedItem === AllSymbol) {
              toggleAllSelected()
            } else if (multiple) {
              selectedItems.includes(selectedItem)
                ? removeSelectedItem(selectedItem)
                : addSelectedItem(selectedItem)
            } else {
              setSelectedItems([selectedItem])
            }
          }

          break
        default:
          break
      }
    },
  }
  // MARK: singleselect specific
  if (!multiple) {
    comboBoxProps = {
      ...comboBoxProps,
      onSelectedItemChange: (changes) => {
        if (onOptionsChange) {
          let { selectedItem } = changes
          if (itemCompare) {
            selectedItem = inputOptions.find((item) =>
              itemCompare(item, selectedItem),
            )
          }
          onOptionsChange({
            selectedItems: selectedItem ? [selectedItem] : [],
          })
        }
      },
      stateReducer: (_, actionAndChanges) => {
        const { changes, type } = actionAndChanges
        switch (type) {
          case useCombobox.stateChangeTypes.InputClick:
            return {
              ...changes,
              isOpen: !(disabled || readOnly),
            }
          case useCombobox.stateChangeTypes.InputBlur:
            return {
              ...changes,
              inputValue: changes.selectedItem
                ? getLabel(changes.selectedItem)
                : '',
            }
          case useCombobox.stateChangeTypes.InputKeyDownArrowDown:
          case useCombobox.stateChangeTypes.InputKeyDownHome:
            if (readOnly) {
              return {
                ...changes,
                isOpen: false,
              }
            }
            return {
              ...changes,
              highlightedIndex: findNextIndex<T>({
                index: changes.highlightedIndex,
                availableItems,
                optionDisabled,
                allDisabled,
              }),
            }
          case useCombobox.stateChangeTypes.InputKeyDownArrowUp:
          case useCombobox.stateChangeTypes.InputKeyDownEnd:
            if (readOnly) {
              return {
                ...changes,
                isOpen: false,
              }
            }
            return {
              ...changes,
              highlightedIndex: findPrevIndex<T>({
                index: changes.highlightedIndex,
                availableItems,
                optionDisabled,
                allDisabled,
              }),
            }
          default:
            return changes
        }
      },
    }

    if (isControlled) {
      comboBoxProps = {
        ...comboBoxProps,
        selectedItem: selectedOptions[0] || null,
      }
    }
  }
  // MARK: multiselect specific
  if (multiple) {
    placeholderText =
      typeof placeholderText !== 'undefined'
        ? placeholderText
        : `${selectedItems.length}/${inputOptions.length} selected`
    comboBoxProps = {
      ...comboBoxProps,
      selectedItem: null,
      stateReducer: (state, actionAndChanges) => {
        const { changes, type } = actionAndChanges

        switch (type) {
          case useCombobox.stateChangeTypes.InputClick:
            return {
              ...changes,
              isOpen: !(disabled || readOnly),
            }
          case useCombobox.stateChangeTypes.InputKeyDownArrowDown:
          case useCombobox.stateChangeTypes.InputKeyDownHome:
            if (readOnly) {
              return {
                ...changes,
                isOpen: false,
              }
            }
            return {
              ...changes,
              highlightedIndex: findNextIndex<T>({
                index: changes.highlightedIndex,
                availableItems,
                optionDisabled,
                allDisabled,
              }),
            }
          case useCombobox.stateChangeTypes.InputKeyDownArrowUp:
          case useCombobox.stateChangeTypes.InputKeyDownEnd:
            if (readOnly) {
              return {
                ...changes,
                isOpen: false,
              }
            }
            return {
              ...changes,
              highlightedIndex: findPrevIndex<T>({
                index: changes.highlightedIndex,
                availableItems,
                optionDisabled,
                allDisabled,
              }),
            }
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
            if (clearSearchOnChange) {
              setTypedInputValue('')
            }
            return {
              ...changes,
              isOpen: true, // keep menu open after selection.
              highlightedIndex: state.highlightedIndex,
              inputValue: !clearSearchOnChange ? typedInputValue : '',
            }
          case useCombobox.stateChangeTypes.InputChange:
            setTypedInputValue(changes.inputValue)
            return {
              ...changes,
            }
          case useCombobox.stateChangeTypes.InputBlur:
            setTypedInputValue('')
            return {
              ...changes,
              inputValue: '',
            }
          case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem:
            return {
              ...changes,
              inputValue: !clearSearchOnChange
                ? typedInputValue
                : changes.inputValue,
            }
          default:
            return changes
        }
      },
    }
  }

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    inputValue,
    reset: resetCombobox,
  } = useCombobox(comboBoxProps)

  // MARK: floating-ui setup
  const { x, y, refs, update, strategy } = useFloating<HTMLInputElement>({
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

  const { getFloatingProps } = useInteractions([])

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && isOpen) {
      return autoUpdate(refs.reference.current, refs.floating.current, update)
    }
  }, [refs.reference, refs.floating, update, isOpen])

  // MARK: popover toggle
  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      refs.floating.current.showPopover()
    } else {
      refs.floating.current.hidePopover()
    }
  }, [isOpen, refs.floating])

  const clear = () => {
    resetCombobox()
    //dont clear items if they are selected and disabled
    setSelectedItems([...selectedDisabledItemsSet])
    setTypedInputValue('')
    inputRef.current?.focus()
  }
  const showClearButton =
    (selectedItems.length > 0 || inputValue) && !readOnly && !hideClearButton

  const showNoOptions =
    isOpen && !availableItems.length && noOptionsText.length > 0

  const selectedItemsLabels = useMemo(
    () => selectedItems.map(getLabel),
    [selectedItems, getLabel],
  )

  // MARK: optionsList
  const optionsList = (
    <StyledPopover
      popover="manual"
      {...getFloatingProps({
        ref: refs.setFloating,
        onFocus: handleListFocus,
        style: {
          position: strategy,
          top: y || 0,
          left: x || 0,
        },
      })}
    >
      <StyledList
        {...getMenuProps(
          {
            'aria-multiselectable': multiple ? 'true' : null,
            ref: scrollContainer,
            style: {
              maxHeight: `${dropdownHeight}px`,
            },
          },
          { suppressRefError: true },
        )}
      >
        {showNoOptions && (
          <AutocompleteNoOptions
            value={noOptionsText}
            multiple={false}
            multiline={false}
            highlighted={'false'}
            isSelected={false}
            isDisabled
          />
        )}
        {isOpen && (
          <li
            key="total-size"
            role="presentation"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              margin: '0',
              gridArea: '1 / -1',
            }}
          />
        )}
        {!isOpen
          ? null
          : rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const index = virtualItem.index
              const item = availableItems[index]
              const label = getLabel(item)
              const isDisabled = optionDisabled(item)
              const isSelected = selectedItemsLabels.includes(label)
              if (item === AllSymbol) {
                return (
                  <AutocompleteOption
                    key={'select-all'}
                    data-index={0}
                    data-testid={'select-all'}
                    value={'Select all'}
                    aria-setsize={availableItems.length}
                    multiple={true}
                    isSelected={allSelectedState === 'ALL'}
                    indeterminate={allSelectedState === 'SOME'}
                    highlighted={
                      highlightedIndex === index && !isDisabled
                        ? 'true'
                        : 'false'
                    }
                    isDisabled={false}
                    multiline={multiline}
                    onClick={toggleAllSelected}
                    style={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 99,
                    }}
                    {...getItemProps({
                      ...(multiline && {
                        ref: rowVirtualizer.measureElement,
                      }),
                      item,
                      index: index,
                    })}
                  />
                )
              }
              return (
                <AutocompleteOption
                  key={virtualItem.key}
                  data-index={index}
                  aria-setsize={availableItems.length}
                  aria-posinset={index + 1}
                  value={label}
                  multiple={multiple}
                  highlighted={
                    highlightedIndex === index && !isDisabled ? 'true' : 'false'
                  }
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  multiline={multiline}
                  optionComponent={optionComponent?.(item, isSelected)}
                  {...getItemProps({
                    ...(multiline && {
                      ref: rowVirtualizer.measureElement,
                    }),
                    item,
                    index,
                    style: {
                      transform: `translateY(${virtualItem.start}px)`,
                      ...(!multiline && {
                        height: `${virtualItem.size}px`,
                      }),
                    },
                  })}
                />
              )
            })}
      </StyledList>
    </StyledPopover>
  )

  const inputProps = getInputProps(
    getDropdownProps({
      preventKeyAction: multiple ? isOpen : undefined,
      disabled,
      ref: inputRef,
    }),
  )
  const consolidatedEvents = mergeEventsFromRight(other, inputProps)

  // MARK: input
  return (
    <ThemeProvider theme={token}>
      <Container className={className} style={style} ref={ref}>
        <Label
          {...getLabelProps()}
          label={label}
          meta={meta}
          disabled={disabled}
        />
        <Container ref={refs.setReference}>
          <Input
            {...inputProps}
            variant={variant}
            placeholder={placeholderText}
            readOnly={readOnly}
            rightAdornmentsWidth={hideClearButton ? 24 + 8 : 24 * 2 + 8}
            rightAdornments={
              <>
                {loading && <Progress.Circular size={16} />}
                {showClearButton && (
                  <StyledButton
                    variant="ghost_icon"
                    disabled={disabled || readOnly}
                    aria-label={'clear options'}
                    title="clear"
                    onClick={clear}
                  >
                    <Icon data={close} size={16} />
                  </StyledButton>
                )}
                {!readOnly && (
                  <StyledButton
                    variant="ghost_icon"
                    {...getToggleButtonProps({
                      disabled: disabled || readOnly,
                    })}
                    aria-label={'toggle options'}
                    title="open"
                  >
                    <Icon
                      data={isOpen ? arrow_drop_up : arrow_drop_down}
                    ></Icon>
                  </StyledButton>
                )}
              </>
            }
            {...other}
            {...consolidatedEvents}
          />
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
        {optionsList}
      </Container>
    </ThemeProvider>
  )
}
// MARK: exported component
export const Autocomplete = forwardRef(AutocompleteInner) as <T>(
  props: AutocompleteProps<T> & {
    ref?: React.ForwardedRef<HTMLDivElement>
    /** @ignore */
    displayName?: string | undefined
  },
) => ReturnType<typeof AutocompleteInner>
