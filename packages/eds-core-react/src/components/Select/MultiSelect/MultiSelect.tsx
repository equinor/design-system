import { forwardRef, SelectHTMLAttributes, useState } from 'react'
import {
  useCombobox,
  useMultipleSelection,
  UseMultipleSelectionStateChange,
  UseMultipleSelectionProps,
} from 'downshift'
import { Label } from '../../Label'
import { Icon } from '../../Icon'
import { CheckboxInput } from '../../Checkbox/Input'
import { arrow_drop_down, arrow_drop_up, close } from '@equinor/eds-icons'
import styled, { ThemeProvider } from 'styled-components'
import { multiSelect as tokens } from '../Select.tokens'
import {
  Container,
  PaddedInput,
  StyledButton,
  StyledList,
  StyledListItem,
  StyledInputWrapper,
} from '../commonStyles'
import { spacingsTemplate, useToken } from '@equinor/eds-utils'
import { useEds } from '../../EdsProvider'

const PaddedStyledListItem = styled(StyledListItem)`
  display: flex;
  align-items: center;
  ${({ theme }) => spacingsTemplate(theme.spacings)}
`

export type MultiSelectProps = {
  /** List of options to choose from */
  items: string[]
  /** Label for the select element */
  label: string
  /** Array of initial selected items */
  initialSelectedItems?: string[]
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
  selectedOptions?: string[]
  /** Callback for the selected item change
   * changes.selectedItem gives the selected item
   */
  handleSelectedItemsChange?: (
    changes: UseMultipleSelectionStateChange<string>,
  ) => void
} & SelectHTMLAttributes<HTMLSelectElement>

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  function MultiSelect(
    {
      items = [],
      initialSelectedItems = [],
      label,
      meta,
      className,
      disabled = false,
      readOnly = false,
      selectedOptions,
      handleSelectedItemsChange,
      ...other
    },
    ref,
  ) {
    const isControlled = selectedOptions ? true : false
    const [inputValue, setInputValue] = useState('')
    const { density } = useEds()
    const token = useToken({ density }, tokens)

    let multipleSelectionProps: UseMultipleSelectionProps<string> = {
      initialSelectedItems: initialSelectedItems,
      onSelectedItemsChange: (changes) => {
        if (handleSelectedItemsChange) {
          handleSelectedItemsChange(changes)
        }
      },
    }

    if (isControlled) {
      multipleSelectionProps = {
        ...multipleSelectionProps,
        selectedItems: selectedOptions,
      }
    }

    const {
      getDropdownProps,
      addSelectedItem,
      removeSelectedItem,
      selectedItems,
      reset,
    } = useMultipleSelection(multipleSelectionProps)

    const getFilteredItems = (items: string[]) =>
      items.filter((item) =>
        item.toLowerCase().includes(inputValue.toLowerCase()),
      )

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
    } = useCombobox({
      inputValue,
      selectedItem: null,
      items: getFilteredItems(items),
      stateReducer: (state, actionAndChanges) => {
        const { changes, type } = actionAndChanges
        switch (type) {
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
            return {
              ...changes,
              isOpen: true, // keep menu open after selection.
              highlightedIndex: state.highlightedIndex,
              inputValue: '', // don't add the item string as input value at selection. */
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

      onStateChange: ({ inputValue, type, selectedItem }) => {
        switch (type) {
          case useCombobox.stateChangeTypes.InputChange:
            setInputValue(inputValue)
            break
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
          case useCombobox.stateChangeTypes.InputBlur:
            setInputValue('')
            if (selectedItem) {
              selectedItems.includes(selectedItem)
                ? removeSelectedItem(selectedItem)
                : addSelectedItem(selectedItem)
            }

            break
          default:
            break
        }
      },
    })

    const placeholderText =
      items.length > 0 ? `${selectedItems.length}/${items.length} selected` : ''

    const openSelect = () => {
      if (!isOpen && !(disabled || readOnly)) {
        openMenu()
      }
    }

    const handleClear = () => {
      reset()
      setInputValue('')
    }

    return (
      <ThemeProvider theme={token}>
        <Container className={className} ref={ref}>
          <Label
            {...getLabelProps()}
            label={label}
            meta={meta}
            disabled={disabled}
          />

          <StyledInputWrapper {...getComboboxProps()}>
            <PaddedInput
              {...getInputProps(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                getDropdownProps({
                  preventKeyAction: isOpen,
                  disabled: disabled,
                }),
              )}
              placeholder={placeholderText}
              readOnly={readOnly}
              onFocus={openSelect}
              {...other}
            />
            {Boolean(selectedItems.length || inputValue) && (
              <StyledButton
                variant="ghost_icon"
                disabled={disabled || readOnly}
                aria-label={'clear options'}
                title="clear"
                onClick={handleClear}
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
              <Icon data={isOpen ? arrow_drop_up : arrow_drop_down}></Icon>
            </StyledButton>
          </StyledInputWrapper>
          <StyledList {...getMenuProps()}>
            {isOpen &&
              getFilteredItems(items).map((item, index) => (
                <PaddedStyledListItem
                  key={`${item}`}
                  highlighted={highlightedIndex === index ? 'true' : 'false'}
                  {...getItemProps({ item, index, disabled: disabled })}
                >
                  <CheckboxInput
                    checked={selectedItems.includes(item)}
                    value={item}
                    onChange={() => {
                      return null
                    }}
                  />
                  <span>{item}</span>
                </PaddedStyledListItem>
              ))}
          </StyledList>
        </Container>
      </ThemeProvider>
    )
  },
)
