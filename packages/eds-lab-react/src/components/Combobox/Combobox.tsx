import { forwardRef, useState, HTMLAttributes } from 'react'
import {
  useCombobox,
  UseComboboxProps,
  useMultipleSelection,
  UseMultipleSelectionProps,
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
import { useToken } from '../../hooks'
import { bordersTemplate } from '../../utils'
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
    margin-top: 4px;
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
    ...other
  } = props

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
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          break
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem) {
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
  }

  if (isControlled && !multiple) {
    comboBoxProps = {
      ...comboBoxProps,
      selectedItem: controlledSelectedItems[0],
    }
  }

  if (multiple) {
    placeholderText = `${selectedItems.length}/${options.length} selected`
    comboBoxProps = {
      ...comboBoxProps,
      selectedItem: null,
      stateReducer: (state, actionAndChanges) => {
        const { changes, type } = actionAndChanges
        switch (type) {
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
        <StyledList {...getMenuProps()}>
          {isOpen &&
            availableItems.map((item, index) => (
              <ComboboxOption
                key={item}
                value={item}
                multiple={multiple}
                highlighted={highlightedIndex === index ? 'true' : 'false'}
                isSelected={selectedItems.includes(item)}
                isDisabled={disabledItems.includes(item)}
                {...getItemProps({ item, index, disabled })}
              />
            ))}
        </StyledList>
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
