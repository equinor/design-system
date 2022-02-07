import { forwardRef, useState, HTMLAttributes, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  useCombobox,
  UseComboboxProps,
  useMultipleSelection,
  UseMultipleSelectionProps,
  UseComboboxGetMenuPropsOptions,
} from 'downshift'
import styled, { ThemeProvider, css } from 'styled-components'
import {
  Label,
  Icon,
  Input,
  useEds,
  List,
  Button,
} from '@equinor/eds-core-react'
import { arrow_drop_down, arrow_drop_up, close } from '@equinor/eds-icons'
import {
  multiSelect as multiSelectTokens,
  selectTokens as selectTokens,
} from './Combobox.tokens'
import {
  useToken,
  usePopper,
  useIsMounted,
  bordersTemplate,
} from '@equinor/eds-utils'
import { ComboboxOption } from './Option'

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
    overflow-y: scroll;
    max-height: 300px;
    padding: 0;
    position: absolute;
    right: 0;
    left: 0;
    z-index: 50;
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

type ComboboxOption<T> = T & {
  label: string
  disabled?: boolean
}

type IndexFinderType = ({
  calc,
  index,
  disabledItems,
  availableItems,
}: {
  index: number
  disabledItems: string[]
  availableItems: string[]
  calc?: (n: number) => number
}) => number

const findIndex: IndexFinderType = ({
  calc,
  index,
  disabledItems,
  availableItems,
}) => {
  const nextItem = availableItems[index]
  if (disabledItems.includes(nextItem)) {
    const nextIndex = calc(index)
    return findIndex({ calc, index: nextIndex, availableItems, disabledItems })
  }
  return index
}

const findNextIndex: IndexFinderType = ({
  index,
  disabledItems,
  availableItems,
}) => {
  const options = {
    index,
    disabledItems,
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
  disabledItems,
  availableItems,
}) => {
  const options = {
    index,
    disabledItems,
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

export type ComboboxChanges<T> = {
  selectedItems: T[]
}

export type ComboboxProps<T> = {
  /** List of options to choose from */
  options: ComboboxOption<T>[]
  /** Label for the select element */
  label: string
  /** Array of initial selected items */
  initialSelectedOptions?: ComboboxOption<T>[]
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
  onOptionsChange?: (changes: ComboboxChanges<T>) => void
  /** Enable multiselect */
  multiple?: boolean
  /**  Custom option label */
  optionLabel?: (option: ComboboxOption<T>) => string
  /** Disable use of react portal for dropdown */
  disablePortal?: boolean
} & HTMLAttributes<HTMLDivElement>

function ComboboxInner<T>(
  props: ComboboxProps<T>,
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
    optionLabel = (item) => item.label,
    disablePortal,
    ...other
  } = props
  const anchorRef = useRef()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>()
  const [containerEl, setContainerEl] = useState<HTMLElement>()
  const isMounted = useIsMounted()

  const isControlled = Boolean(selectedOptions)
  const labelItems = options.map(optionLabel)
  const [disabledItems] = useState<string[]>(
    options.filter((x) => x.disabled).map(optionLabel),
  )
  const [availableItems, setAvailableItems] = useState<string[]>(labelItems)
  const initialSelectedItems = initialSelectedOptions.map(optionLabel)
  const controlledSelectedItems = (selectedOptions || []).map(optionLabel)

  const { density } = useEds()
  const token = useToken(
    { density },
    multiple ? multiSelectTokens : selectTokens,
  )
  let placeholderText: string = undefined

  let multipleSelectionProps: UseMultipleSelectionProps<string> = {
    initialSelectedItems: multiple
      ? initialSelectedItems
      : initialSelectedItems[0]
      ? [initialSelectedItems[0]]
      : [],
    onSelectedItemsChange: (changes) => {
      if (onOptionsChange) {
        const items = options.filter((x) =>
          changes.selectedItems.includes(optionLabel(x)),
        )
        onOptionsChange({
          selectedItems: items,
        })
      }
    },
  }

  if (isControlled) {
    multipleSelectionProps = {
      ...multipleSelectionProps,
      selectedItems: controlledSelectedItems,
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

  let comboBoxProps: UseComboboxProps<string> = {
    items: availableItems,
    initialSelectedItem: initialSelectedItems[0],
    onInputValueChange: ({ inputValue }) => {
      setAvailableItems(
        labelItems.filter((item) =>
          item.toLowerCase().includes(inputValue.toLowerCase()),
        ),
      )
    },
    onIsOpenChange: ({ selectedItem }) => {
      // Show all options when single select is reopened with a selected item
      if (availableItems.length === 1 && selectedItem === availableItems[0]) {
        setAvailableItems(labelItems)
      }
    },
    onStateChange: ({ type, selectedItem }) => {
      const isDisabled = disabledItems.includes(selectedItem)

      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          break
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem && !isDisabled) {
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
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownArrowDown:
        case useCombobox.stateChangeTypes.InputKeyDownHome:
          return {
            ...changes,
            highlightedIndex: findNextIndex({
              index: changes.highlightedIndex,
              availableItems,
              disabledItems,
            }),
          }
        case useCombobox.stateChangeTypes.InputKeyDownArrowUp:
        case useCombobox.stateChangeTypes.InputKeyDownEnd:
          return {
            ...changes,
            highlightedIndex: findPrevIndex({
              index: changes.highlightedIndex,
              availableItems,
              disabledItems,
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
      selectedItem: controlledSelectedItems[0],
    }
  }

  if (multiple) {
    placeholderText = `${selectedItems.length}/${
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
              highlightedIndex: findNextIndex({
                index: changes.highlightedIndex,
                availableItems,
                disabledItems,
              }),
            }
          case useCombobox.stateChangeTypes.InputKeyDownArrowUp:
          case useCombobox.stateChangeTypes.InputKeyDownEnd:
            return {
              ...changes,
              highlightedIndex: findPrevIndex({
                index: changes.highlightedIndex,
                availableItems,
                disabledItems,
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
    if (anchorRef.current) {
      setAnchorEl(anchorRef.current)
    }
    return () => {
      setAnchorEl(null)
      setContainerEl(null)
    }
  }, [anchorRef, isOpen])

  const { styles, attributes } = usePopper(
    anchorEl,
    containerEl,
    null,
    'bottom-start',
    4,
  )

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

  const optionsList = (
    <StyledList
      {...getMenuProps(
        {
          ref: setContainerEl,
          style: styles.popper as UseComboboxGetMenuPropsOptions['style'],
          ...attributes.popper,
        },
        { suppressRefError: true },
      )}
    >
      {!isOpen
        ? null
        : availableItems.map((item, index) => {
            const isDisabled = disabledItems.includes(item)
            return (
              <ComboboxOption
                key={item}
                value={item}
                multiple={multiple}
                highlighted={
                  highlightedIndex === index && !isDisabled ? 'true' : 'false'
                }
                isSelected={selectedItems.includes(item)}
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

export const Combobox = forwardRef(ComboboxInner) as <T>(
  props: ComboboxProps<T> & {
    ref?: React.ForwardedRef<HTMLDivElement>
    displayName?: string | undefined
  },
) => ReturnType<typeof ComboboxInner>
