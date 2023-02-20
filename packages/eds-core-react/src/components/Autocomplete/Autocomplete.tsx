import {
  forwardRef,
  useState,
  HTMLAttributes,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  ChangeEvent,
} from 'react'
import {
  useCombobox,
  UseComboboxProps,
  useMultipleSelection,
  UseMultipleSelectionProps,
} from 'downshift'
import { useVirtualizer } from '@tanstack/react-virtual'
import styled, { ThemeProvider, css } from 'styled-components'
import { Button } from '../Button'
import { List } from '../List'
import { useEds } from '../EdsProvider'
import { Label } from '../Label'
import { Icon } from '../Icon'
import { Input } from '../Input'
import { arrow_drop_down, arrow_drop_up, close } from '@equinor/eds-icons'
import {
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
  shift,
  size,
  autoUpdate,
  useFloating,
  useInteractions,
  FloatingPortal,
} from '@floating-ui/react'

const Container = styled.div`
  position: relative;
`

const StyledList = styled(List)(
  ({ theme }) => css`
    background-color: ${theme.background};
    box-shadow: ${theme.boxShadow};
    ${bordersTemplate(theme.border)}
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 300px;
    padding: 0;
    display: grid;
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

type IndexFinderType = <T>({
  calc,
  index,
  optionDisabled,
  availableItems,
}: {
  index: number
  optionDisabled: AutocompleteProps<T>['optionDisabled']
  availableItems: AutocompleteProps<T>['options']
  calc?: (n: number) => number
}) => number

const findIndex: IndexFinderType = ({
  calc,
  index,
  optionDisabled,
  availableItems,
}) => {
  const nextItem = availableItems[index]
  if (optionDisabled(nextItem)) {
    const nextIndex = calc(index)
    return findIndex({ calc, index: nextIndex, availableItems, optionDisabled })
  }
  return index
}

const findNextIndex: IndexFinderType = ({
  index,
  optionDisabled,
  availableItems,
}) => {
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
}) => {
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

export type AutocompleteChanges<T> = { selectedItems: T[] }

export type AutocompleteProps<T> = {
  /** List of options in dropdown */
  options: T[]
  /** Label for the select element */
  label: string
  /** Array of initial selected items */
  initialSelectedOptions?: T[]
  /** Meta text, for instance unit */
  meta?: string
  /** Disabled state */
  disabled?: boolean
  /** Read Only */
  readOnly?: boolean
  /** Hide clear button even when items are selected */
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
  /** Enable multiselect */
  multiple?: boolean
  /**  Custom option label */
  optionLabel?: (option: T) => string
  /** Disable use of react portal for dropdown */
  disablePortal?: boolean
  /** Disable option */
  optionDisabled?: (option: T) => boolean
  /** Custom filter function for options */
  optionsFilter?: (option: T, inputValue: string) => boolean
  /** If `true` the width of the dropdown will adjust to the width of the input */
  autoWidth?: boolean
  /** Descriptive text for whats selected or about to be selected */
  placeholder?: string
  /** Toggle if input is cleared when an option is selected when `multiple` is `true`*/
  clearSearchOnChange?: boolean
  /** Will wrap overflowing text at the expence of some performance overhead to calculate item heigths. Mostly relevant in combination with autoWidth */
  multiline?: boolean
} & HTMLAttributes<HTMLDivElement>

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
    hideClearButton = false,
    onOptionsChange,
    selectedOptions,
    multiple,
    initialSelectedOptions = [],
    disablePortal,
    optionDisabled = () => false,
    optionsFilter,
    autoWidth,
    placeholder,
    optionLabel,
    clearSearchOnChange = true,
    multiline = false,
    ...other
  } = props

  const isControlled = Boolean(selectedOptions)
  const [inputOptions, setInputOptions] = useState(options)
  const [availableItems, setAvailableItems] = useState(inputOptions)
  const [typedInputValue, setTypedInputValue] = useState<string>('')

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

  const disabledItems = useMemo(
    () => options.filter(optionDisabled),
    [options, optionDisabled],
  )
  const { density } = useEds()
  const token = useToken(
    { density },
    multiple ? multiSelectTokens : selectTokens,
  )
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
          const { selectedItems } = changes
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
    reset: resetSelection,
    setSelectedItems,
  } = useMultipleSelection(multipleSelectionProps)

  const getLabel = useCallback(
    (item: T) => {
      if (!item) {
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
        return item?.toString()
      } catch (error) {
        throw new Error(
          'Unable to find label, make sure your are using options as documented',
        )
      }
    },
    [optionLabel],
  )

  const scrollContainer = useRef<HTMLElement>(null)
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

  let comboBoxProps: UseComboboxProps<T> = {
    items: availableItems,
    initialSelectedItem: initialSelectedOptions[0],
    itemToString: getLabel,
    onInputValueChange: ({ inputValue }) => {
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
        type !== useCombobox.stateChangeTypes.ItemMouseMove &&
        type !== useCombobox.stateChangeTypes.MenuMouseLeave &&
        highlightedIndex >= 0
      ) {
        rowVirtualizer.scrollToIndex(highlightedIndex)
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
          if (selectedItem && !optionDisabled(selectedItem)) {
            if (multiple) {
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
    stateReducer: (_, actionAndChanges) => {
      const { changes, type } = actionAndChanges

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownArrowDown:
        case useCombobox.stateChangeTypes.InputKeyDownHome:
          return {
            ...changes,
            highlightedIndex: findNextIndex<T>({
              index: changes.highlightedIndex,
              availableItems,
              optionDisabled,
            }),
          }
        case useCombobox.stateChangeTypes.InputKeyDownArrowUp:
        case useCombobox.stateChangeTypes.InputKeyDownEnd:
          return {
            ...changes,
            highlightedIndex: findPrevIndex<T>({
              index: changes.highlightedIndex,
              availableItems,
              optionDisabled,
            }),
          }
        default:
          return changes
      }
    },
  }

  if (!multiple) {
    comboBoxProps = {
      ...comboBoxProps,
      onSelectedItemChange: (changes) => {
        if (onOptionsChange) {
          const { selectedItem } = changes
          onOptionsChange({
            selectedItems: selectedItem ? [selectedItem] : [],
          })
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

  if (multiple) {
    placeholderText =
      typeof placeholderText !== 'undefined'
        ? placeholderText
        : `${selectedItems.length}/${
            options.length - disabledItems.length
          } selected`
    comboBoxProps = {
      ...comboBoxProps,
      selectedItem: null,
      stateReducer: (state, actionAndChanges) => {
        const { changes, type } = actionAndChanges

        switch (type) {
          case useCombobox.stateChangeTypes.InputKeyDownArrowDown:
          case useCombobox.stateChangeTypes.InputKeyDownHome:
            return {
              ...changes,
              highlightedIndex: findNextIndex<T>({
                index: changes.highlightedIndex,
                availableItems,
                optionDisabled,
              }),
            }
          case useCombobox.stateChangeTypes.InputKeyDownArrowUp:
          case useCombobox.stateChangeTypes.InputKeyDownEnd:
            return {
              ...changes,
              highlightedIndex: findPrevIndex<T>({
                index: changes.highlightedIndex,
                availableItems,
                optionDisabled,
              }),
            }
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
            return {
              ...changes,
              isOpen: true, // keep menu open after selection.
              highlightedIndex: state.highlightedIndex,
              inputValue: !clearSearchOnChange ? typedInputValue : '',
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
    openMenu,
    inputValue,
    reset: resetCombobox,
  } = useCombobox(comboBoxProps)

  useEffect(() => {
    if (isControlled) {
      setSelectedItems(selectedOptions)
    }
  }, [isControlled, selectedOptions, setSelectedItems])

  const openSelect = () => {
    if (!isOpen && !(disabled || readOnly)) {
      openMenu()
    }
  }

  const { x, y, refs, update, strategy } = useFloating<HTMLInputElement>({
    placement: 'bottom-start',
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ rects, availableHeight, elements }) {
          const anchorWidth = `${rects.reference.width}px`
          Object.assign(elements.floating.style, {
            width: `${autoWidth ? anchorWidth : 'auto'}`,
            maxHeight: `${availableHeight}px`,
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

  const clear = () => {
    resetCombobox()
    resetSelection()
    setTypedInputValue('')
  }
  const showClearButton =
    (selectedItems.length > 0 || inputValue) && !readOnly && !hideClearButton

  const selectedItemsLabels = useMemo(
    () => selectedItems.map(getLabel),
    [selectedItems, getLabel],
  )

  const optionsList = (
    <div
      {...getFloatingProps({
        ref: refs.setFloating,
        style: {
          position: strategy,
          top: y || 0,
          left: x || 0,
          zIndex: 1500,
        },
      })}
    >
      <StyledList
        {...getMenuProps(
          {
            'aria-multiselectable': multiple ? 'true' : null,
            ref: scrollContainer,
          },
          { suppressRefError: true },
        )}
      >
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
              return (
                <AutocompleteOption
                  key={virtualItem.key}
                  data-index={virtualItem.index}
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
                  {...getItemProps({
                    ...(multiline && {
                      ref: rowVirtualizer.measureElement,
                    }),
                    item,
                    index,
                    disabled,
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
    </div>
  )

  return (
    <ThemeProvider theme={token}>
      <Container className={className} style={style} ref={ref}>
        <Label
          {...getLabelProps()}
          label={label}
          meta={meta}
          disabled={disabled}
        />

        <Container>
          <Input
            {...getInputProps(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              getDropdownProps({
                preventKeyAction: multiple ? isOpen : undefined,
                disabled,
                ref: refs.setReference,
                onChange: (e: ChangeEvent<HTMLInputElement>) =>
                  setTypedInputValue(e?.currentTarget?.value),
              }),
            )}
            placeholder={placeholderText}
            readOnly={readOnly}
            onFocus={openSelect}
            onClick={openSelect}
            rightAdornmentsWidth={24 * 2 + 8 + 8}
            rightAdornments={
              <>
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
          />
        </Container>
        {disablePortal ? (
          optionsList
        ) : (
          <FloatingPortal id="eds-autocomplete-container">
            {optionsList}
          </FloatingPortal>
        )}
      </Container>
    </ThemeProvider>
  )
}

export const Autocomplete = forwardRef(AutocompleteInner) as <T>(
  props: AutocompleteProps<T> & {
    ref?: React.ForwardedRef<HTMLDivElement>
    displayName?: string | undefined
  },
) => ReturnType<typeof AutocompleteInner>
