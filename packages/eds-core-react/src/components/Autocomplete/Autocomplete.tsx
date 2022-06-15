import {
  forwardRef,
  useState,
  HTMLAttributes,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react'
import { createPortal } from 'react-dom'
import {
  useCombobox,
  UseComboboxProps,
  useMultipleSelection,
  UseMultipleSelectionProps,
  UseComboboxGetMenuPropsOptions,
} from 'downshift'
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
  usePopper,
  useIsMounted,
  bordersTemplate,
} from '@equinor/eds-utils'
import { AutocompleteOption } from './Option'

const Container = styled.div`
  position: relative;
`

const StyledInput = styled(Input)(
  ({
    theme: {
      entities: { button },
    },
  }) => {
    return css`
      padding-right: calc(
        ${button.spacings.left} + ${button.spacings.right} +
          (${button.height} * 2)
      );
    `
  },
)

const StyledList = styled(List)(
  ({ theme }) => css`
    background-color: ${theme.background};
    box-shadow: ${theme.boxShadow};
    ${bordersTemplate(theme.border)}
    overflow-y: auto;
    max-height: 300px;
    padding: 0;
    position: absolute;
    right: 0;
    left: 0;
    z-index: 1400;
  `,
)

const StyledButton = styled(Button)(
  ({
    theme: {
      entities: { button },
    },
  }) => css`
    position: absolute;
    height: ${button.height};
    width: ${button.height};
    right: ${button.spacings.right};
    top: ${button.spacings.top};
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
  /** List of options to choose from */
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
  /** If this prop is used, the select will become a controlled component. Use an empty
   * array [] if there will be no initial selected items
   * Note that this prop replaces the need for ```initialSelectedItems```
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
  /** Filter function for options */
  optionsFilter?: (option: T, inputValue: string) => boolean
  /** If `true` the width of the dropdown will adjust accordingly to width of the input */
  autoWidth?: boolean
  /** Descriptive text for whats selected or about to be selected */
  placeholder?: string
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
    disabled = false,
    readOnly = false,
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
    ...other
  } = props
  const anchorRef = useRef()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>()
  const [containerEl, setContainerEl] = useState<HTMLElement>()
  const isMounted = useIsMounted()

  const isControlled = Boolean(selectedOptions)
  const [availableItems, setAvailableItems] = useState(options)
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
    onIsOpenChange: ({ selectedItem }) => {
      // Show all options when single select is reopened with a selected item
      if (availableItems.length === 1 && selectedItem === availableItems[0]) {
        setAvailableItems(options)
      }
    },
    onStateChange: ({ type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          break
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
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

  if (isControlled && !multiple) {
    comboBoxProps = {
      ...comboBoxProps,
      selectedItem: selectedOptions[0] || null,
      onSelectedItemChange: (changes) => {
        if (onOptionsChange) {
          const { selectedItem } = changes
          onOptionsChange({ selectedItems: [selectedItem] })
        }
      },
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
              inputValue: '', // don't add the item string as input value at selection.
            }
          case useCombobox.stateChangeTypes.InputBlur:
            return {
              ...changes,
              inputValue: '', // don't add the item string as input value at selection.
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
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    openMenu,
    inputValue,
    reset: resetCombobox,
  } = useCombobox(comboBoxProps)

  useEffect(() => {
    if (anchorRef.current && isOpen) {
      setAnchorEl(anchorRef.current)
    } else {
      setAnchorEl(null)
    }
    if (isControlled) {
      setSelectedItems(selectedOptions)
    }
    return () => {
      setAnchorEl(null)
      setContainerEl(null)
    }
  }, [anchorRef, isControlled, isOpen, selectedOptions, setSelectedItems])

  //"Turn on" popper on load to position menu correctly and then turn it off
  useEffect(() => {
    if (anchorRef.current) {
      setAnchorEl(anchorRef.current)
      setTimeout(() => {
        setAnchorEl(null)
      }, 1)
    }
  }, [])

  const { styles, attributes } = usePopper({
    anchorEl,
    popperEl: containerEl,
    placement: 'bottom-start',
    offset: 4,
    autoWidth,
  })

  const openSelect = () => {
    if (!isOpen && !(disabled || readOnly)) {
      openMenu()
    }
  }

  const clear = () => {
    resetCombobox()
    resetSelection()
  }
  const showClearButton = (selectedItems.length > 0 || inputValue) && !readOnly

  const selectedItemsLabels = useMemo(
    () => selectedItems.map(getLabel),
    [selectedItems, getLabel],
  )

  const optionsList = (
    <StyledList
      {...getMenuProps(
        {
          ref: setContainerEl,
          style: styles.popper as UseComboboxGetMenuPropsOptions['style'],
          'aria-multiselectable': multiple ? 'true' : null,
          ...attributes.popper,
        },
        { suppressRefError: true },
      )}
    >
      {!isOpen
        ? null
        : availableItems.map((item, index) => {
            const label = getLabel(item)
            const isDisabled = optionDisabled(item)
            const isSelected = selectedItemsLabels.includes(label)
            return (
              <AutocompleteOption
                key={label}
                value={label}
                multiple={multiple}
                highlighted={
                  highlightedIndex === index && !isDisabled ? 'true' : 'false'
                }
                isSelected={isSelected}
                isDisabled={isDisabled}
                {...getItemProps({ item, index, disabled })}
              />
            )
          })}
    </StyledList>
  )

  return (
    <ThemeProvider theme={token}>
      <Container className={className} ref={ref}>
        <Label
          {...getLabelProps()}
          label={label}
          meta={meta}
          disabled={disabled}
        />

        <Container {...getComboboxProps()}>
          <StyledInput
            {...getInputProps(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              getDropdownProps({
                preventKeyAction: multiple ? isOpen : undefined,
                disabled,
                ref: anchorRef,
              }),
            )}
            placeholder={placeholderText}
            readOnly={readOnly}
            onFocus={openSelect}
            onClick={openSelect}
            {...other}
          />
          {showClearButton && (
            <StyledButton
              variant="ghost_icon"
              disabled={disabled || readOnly}
              aria-label={'clear options'}
              title="clear"
              onClick={clear}
              style={{ right: 32 }}
            >
              <Icon data={close} size={16} />
            </StyledButton>
          )}
          <StyledButton
            variant="ghost_icon"
            {...getToggleButtonProps({ disabled: disabled || readOnly })}
            aria-label={'toggle options'}
            title="open"
          >
            {!readOnly && (
              <Icon data={isOpen ? arrow_drop_up : arrow_drop_down}></Icon>
            )}
          </StyledButton>
        </Container>
        {disablePortal
          ? optionsList
          : !isMounted
          ? null
          : createPortal(optionsList, document.body)}
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
