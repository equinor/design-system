/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import * as React from 'react'
import { forwardRef, SelectHTMLAttributes, useState } from 'react'
import {
  useCombobox,
  useMultipleSelection,
  UseMultipleSelectionStateChange,
  UseMultipleSelectionProps,
} from 'downshift'
import { Label } from '../../Label'
import { Icon } from '../../Icon'
import { CheckboxInput } from '../../SelectionControls/Checkbox/Input'
import { arrow_drop_down, arrow_drop_up } from '@equinor/eds-icons'
import styled from 'styled-components'
import { select as tokens } from '../Select.tokens'
import {
  Container,
  PaddedInput,
  StyledButton,
  StyledList,
  StyledListItem,
  StyledInputWrapper,
} from '../commonStyles'

const PaddedStyledListItem = styled(StyledListItem)`
  padding: 0 ${tokens.spacings.multi.right} 0 ${tokens.spacings.multi.left};
  display: flex;
  align-items: center;
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
      getSelectedItemProps,
      getDropdownProps,
      addSelectedItem,
      removeSelectedItem,
      selectedItems,
    } = useMultipleSelection(multipleSelectionProps)
    const getFilteredItems = (items: string[]) =>
      items.filter((item) =>
        // Remove selected items from the list
        /* selectedItems.indexOf(item) < 0 && */

        // Can be used if we need filter the list on first letters aka starts with search
        // item.toLowerCase().startsWith(inputValue.toLowerCase()),
        // Filter the list using contains search
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
            if (selectedItem) {
              setInputValue('')

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

    return (
      <Container className={className} ref={ref}>
        <Label
          {...getLabelProps()}
          label={label}
          meta={meta}
          disabled={disabled}
        />

        <StyledInputWrapper {...getComboboxProps()}>
          <PaddedInput
            {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            placeholder={placeholderText}
            disabled={disabled}
            readOnly={readOnly}
            {...other}
          />
          <StyledButton
            variant="ghost_icon"
            disabled={disabled || readOnly}
            {...getToggleButtonProps()}
            aria-label={'toggle options'}
          >
            <Icon
              data={isOpen ? arrow_drop_up : arrow_drop_down}
              title="open"
            ></Icon>
          </StyledButton>
        </StyledInputWrapper>
        <StyledList {...getMenuProps()}>
          {isOpen &&
            getFilteredItems(items).map((item, index) => (
              <PaddedStyledListItem
                key={`${item}`}
                highlighted={highlightedIndex === index ? 'true' : 'false'}
                {...getItemProps({ item, index })}
              >
                <CheckboxInput
                  checked={selectedItems.includes(item)}
                  value={item}
                  onChange={(e) => {
                    return null
                  }}
                />
                <span>{item}</span>
              </PaddedStyledListItem>
            ))}
        </StyledList>
      </Container>
    )
  },
)
