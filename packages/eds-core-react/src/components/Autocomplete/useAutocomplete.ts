import { useToken, useIsomorphicLayoutEffect } from '@equinor/eds-utils'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  UseMultipleSelectionProps,
  useMultipleSelection,
  UseComboboxProps,
  useCombobox,
} from 'downshift'
import {
  useState,
  useMemo,
  useCallback,
  useRef,
  useImperativeHandle,
  useEffect,
} from 'react'
import type { DOMAttributes } from 'react'
import { useEds } from '../EdsProvider'
import {
  defaultOptionDisabled,
  AutocompleteProps,
  AddSymbol,
  AllSymbol,
} from './Autocomplete'
import {
  selectTokens,
  AutocompleteToken,
  multiSelect as multiSelectTokens,
} from './Autocomplete.tokens'
import { findNextIndex, findPrevIndex, mergeEventsFromRight } from './utils'

export const useAutocomplete = <T>({
  options = [],
  totalOptions,
  label,
  meta,
  className,
  style,
  disabled = false,
  readOnly = false,
  loading = false,
  hideClearButton = false,
  onOptionsChange,
  onAddNewOption,
  onInputChange,
  selectedOptions: _selectedOptions,
  selectionDisplay = 'summary',
  multiple,
  itemToKey: _itemToKey,
  itemCompare: _itemCompare,
  allowSelectAll,
  initialSelectedOptions: _initialSelectedOptions = [],
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
  onClear,
  ref,
  ...other
}: AutocompleteProps<T> & { ref?: React.Ref<HTMLInputElement> }) => {
  const [lastScrollOffset, setLastScrollOffset] = useState<number>(0)
  const [controlledHighlightedIndex, setControlledHighlightedIndex] =
    useState<number>(0)

  const itemCompare = useMemo(() => {
    if (_itemCompare && _itemToKey) {
      console.error(
        'Error: Specifying both itemCompare and itemToKey. itemCompare is deprecated, while itemToKey should be used instead of it. Please only use one.',
      )
      return _itemCompare
    }
    if (_itemToKey) {
      return (o1: T, o2: T) => _itemToKey(o1) === _itemToKey(o2)
    }
    return _itemCompare
  }, [_itemCompare, _itemToKey])

  const itemToKey = useCallback(
    (item: T) => {
      return _itemToKey ? _itemToKey(item) : item
    },
    [_itemToKey],
  )

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

  const isControlled = Boolean(selectedOptions)
  const [inputOptions, setInputOptions] = useState(options)
  const [_availableItems, setAvailableItems] = useState(inputOptions)
  const [typedInputValue, setTypedInputValue] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => inputRef.current)

  const showSelectAll = useMemo(() => {
    if (!multiple && allowSelectAll) {
      throw new Error(`allowSelectAll can only be used with multiple`)
    }
    return allowSelectAll && !typedInputValue
  }, [allowSelectAll, multiple, typedInputValue])

  const availableItems = useMemo(() => {
    if (showSelectAll && onAddNewOption)
      return [AddSymbol as T, AllSymbol as T, ..._availableItems]
    if (showSelectAll) return [AllSymbol as T, ..._availableItems]
    if (onAddNewOption) return [AddSymbol as T, ..._availableItems]
    return _availableItems
  }, [_availableItems, showSelectAll, onAddNewOption])

  const getSelectedIndex = useCallback(
    (selectedItem: (typeof availableItems)[0] | null) =>
      availableItems.findIndex((item) =>
        itemCompare ? itemCompare(item, selectedItem) : item === selectedItem,
      ),
    [availableItems, itemCompare],
  )

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
    itemToKey,
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
            (item) => item !== AllSymbol || item !== AddSymbol,
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
    () => new Set(selectedItems.filter((x) => x !== null && optionDisabled(x))),
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

      if (optionLabel) {
        return optionLabel(item)
      } else if (typeof item === 'object') {
        throw new Error(
          'Missing label. When using objects for options make sure to define the `optionLabel` property',
        )
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
      if (item === AddSymbol) return !typedInputValue.trim()
      return optionDisabled(item)
    },
    itemToKey,
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
    onHighlightedIndexChange({ highlightedIndex }) {
      if (highlightedIndex >= 0 && rowVirtualizer.getVirtualItems) {
        const visibleIndexes = rowVirtualizer
          .getVirtualItems()
          .map((v) => v.index)
        if (!visibleIndexes.includes(highlightedIndex)) {
          rowVirtualizer.scrollToIndex(highlightedIndex, {
            align: allowSelectAll ? 'center' : 'auto',
          })
        }
      }
      if (typeof rowVirtualizer.scrollOffset === 'number') {
        setLastScrollOffset(rowVirtualizer.scrollOffset)
      }
    },
    onIsOpenChange: ({ selectedItem }) => {
      if (!multiple && selectedItem !== null) {
        setAvailableItems(options)
        setTimeout(() => {
          if (controlledHighlightedIndex === 0) {
            rowVirtualizer.scrollToOffset?.(0)
          } else if (rowVirtualizer.scrollToOffset && lastScrollOffset > 0) {
            rowVirtualizer.scrollToOffset(lastScrollOffset)
          }
          const visibleIndexes =
            rowVirtualizer.getVirtualItems?.().map((v) => v.index) || []
          if (!visibleIndexes.includes(controlledHighlightedIndex)) {
            rowVirtualizer.scrollToIndex(controlledHighlightedIndex, {
              align: allowSelectAll ? 'center' : 'auto',
            })
          }
        }, 10)
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
            } else if (selectedItem === AddSymbol && typedInputValue.trim()) {
              onAddNewOption?.(typedInputValue)
            } else if (multiple) {
              const shouldRemove = itemCompare
                ? selectedItems.some((i) => itemCompare(selectedItem, i))
                : selectedItems.includes(selectedItem)
              if (shouldRemove) {
                removeSelectedItem(selectedItem)
              } else {
                addSelectedItem(selectedItem)
              }
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
        if (changes.selectedItem === AddSymbol) return
        const idx = getSelectedIndex(changes.selectedItem)
        setControlledHighlightedIndex(idx >= 0 ? idx : 0)
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
      stateReducer: (state, actionAndChanges) => {
        const { changes, type } = actionAndChanges
        switch (type) {
          case useCombobox.stateChangeTypes.InputClick:
            return {
              ...changes,
              isOpen: !(disabled || readOnly),
              highlightedIndex: controlledHighlightedIndex,
            }
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick: {
            if (changes.selectedItem === AddSymbol) {
              return {
                ...changes,
                inputValue: '',
              }
            }
            const idx = getSelectedIndex(changes.selectedItem)
            setControlledHighlightedIndex(idx >= 0 ? idx : 0)
            return {
              ...changes,
              highlightedIndex: idx >= 0 ? idx : 0,
            }
          }
          case useCombobox.stateChangeTypes.InputBlur:
            return {
              ...changes,
              inputValue: changes.selectedItem
                ? getLabel(changes.selectedItem)
                : '',
            }
          case useCombobox.stateChangeTypes.InputChange:
            setTypedInputValue(changes.inputValue)
            return {
              ...changes,
            }
          case useCombobox.stateChangeTypes.InputKeyDownArrowDown:
            if (readOnly) {
              return {
                ...changes,
                isOpen: false,
              }
            }
            if (state.isOpen === false) {
              return {
                ...changes,
                isOpen: true,
                highlightedIndex: controlledHighlightedIndex,
              }
            }
            return {
              ...changes,
              highlightedIndex: findNextIndex({
                index: changes.highlightedIndex,
                availableItems,
                optionDisabled,
                allDisabled,
              }),
            }
          case useCombobox.stateChangeTypes.InputKeyDownHome:
            if (readOnly) {
              return {
                ...changes,
                isOpen: false,
              }
            }
            return {
              ...changes,
              highlightedIndex: findNextIndex({
                index: 0,
                availableItems,
                optionDisabled,
                allDisabled,
              }),
            }
          case useCombobox.stateChangeTypes.InputKeyDownArrowUp:
            if (readOnly) {
              return {
                ...changes,
                isOpen: false,
              }
            }
            if (state.isOpen === false) {
              return {
                ...changes,
                isOpen: true,
                highlightedIndex: controlledHighlightedIndex,
              }
            }
            return {
              ...changes,
              highlightedIndex: findPrevIndex({
                index: changes.highlightedIndex,
                availableItems,
                optionDisabled,
                allDisabled,
              }),
            }
          case useCombobox.stateChangeTypes.InputKeyDownEnd:
            if (readOnly) {
              return {
                ...changes,
                isOpen: false,
              }
            }
            return {
              ...changes,
              highlightedIndex: findPrevIndex({
                index: availableItems.length - 1,
                availableItems,
                optionDisabled,
                allDisabled,
              }),
            }
          case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem:
            setSelectedItems([changes.selectedItem])
            return {
              ...changes,
              highlightedIndex: controlledHighlightedIndex,
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
    const showPlaceholder = placeholderText && selectedItems.length === 0
    const optionCount = totalOptions || inputOptions.length
    placeholderText = showPlaceholder
      ? placeholderText
      : `${selectedItems.length}/${optionCount} selected`

    if (selectionDisplay === 'chips') placeholderText = placeholder

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

  const _comboBoxProps = useCombobox(comboBoxProps)
  const clear = () => {
    if (onClear) onClear()
    _comboBoxProps.reset()
    //dont clear items if they are selected and disabled
    setSelectedItems([...selectedDisabledItemsSet])
    setTypedInputValue('')
    inputRef.current?.focus()
  }

  const inputProps = _comboBoxProps.getInputProps(
    getDropdownProps({
      preventKeyAction: multiple ? _comboBoxProps.isOpen : undefined,
      disabled,
      ref: inputRef,
    }),
  )

  const consolidatedEvents = mergeEventsFromRight(
    other,
    inputProps as unknown as DOMAttributes<unknown>,
  )

  const selectedItemsLabels = useMemo(
    () => selectedItems.map(getLabel),
    [selectedItems, getLabel],
  )

  return {
    ..._comboBoxProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
    setSelectedItems,
    clear,
    availableItems,
    getLabel,
    scrollContainer,
    rowVirtualizer,
    allSelectedState,
    toggleAllSelected,
    typedInputValue,
    inputRef,
    token,
    tokens,
    placeholderText,
    readOnly,
    inputProps,
    consolidatedEvents,
    multiple,
    disabled,
    optionDisabled,
    onAddNewOption,
    options,
    totalOptions,
    label,
    meta,
    className,
    style,
    loading,
    hideClearButton,
    onOptionsChange,
    onInputChange,
    selectedOptions,
    selectionDisplay,
    itemToKey,
    itemCompare,
    allowSelectAll,
    initialSelectedOptions,
    optionsFilter,
    autoWidth,
    placeholder,
    optionLabel,
    clearSearchOnChange,
    multiline,
    dropdownHeight,
    optionComponent,
    helperText,
    helperIcon,
    noOptionsText,
    variant,
    onClear,
    selectedItemsLabels,
    restHtmlProps: other,
  }
}
