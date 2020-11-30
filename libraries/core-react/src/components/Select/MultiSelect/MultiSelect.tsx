/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import * as React from 'react'
import {
  forwardRef,
  SelectHTMLAttributes,
  useState,
  HTMLAttributes,
} from 'react'
import {
  useCombobox,
  useMultipleSelection,
  UseMultipleSelectionStateChange,
} from 'downshift'
import { Label } from '../../Label'
import { Input } from '../../TextField/Input'
import { Button } from '../../Button'
import { Icon } from '../../Icon'
import { CheckboxInput } from '../../SelectionControls/Checkbox/Input'
import { arrow_drop_down, arrow_drop_up } from '@equinor/eds-icons'
import { List } from '../../List'
import styled from 'styled-components'
import { typographyTemplate } from '@utils'
import { select as tokens } from '../Select.tokens'

const { ListItem } = List

const StyledInputWrapper = styled.div`
  position: relative;
`

type ContainerProps = HTMLAttributes<HTMLDivElement>

const Container = styled.div<ContainerProps>`
  position: relative;
`

const PaddedInput = styled(Input)`
  /* Hack: Had to add + 0px to satisfy the style lint plugin */
  padding-right: calc(
    ${tokens.button.size} + ${tokens.button.spacings.left} +
      ${tokens.button.spacings.right} + 0px
  );
`

const StyledButton = styled(Button)`
  position: absolute;
  right: ${tokens.button.spacings.right};
  top: ${tokens.button.spacings.top};
  height: ${tokens.button.size};
  width: ${tokens.button.size};
`

const StyledList = styled(List)`
  background-color: ${tokens.background};
  box-shadow: ${tokens.boxShadow};
  overflow-y: scroll;
  max-height: 300px;
  padding: 0;
  border-radius: ${tokens.borderRadius};
  margin-top: 4px;
  position: absolute;
  right: 0;
  left: 0;
  z-index: 200;
`

type StyledListItemType = {
  highlighted: string
}

const StyledListItem = styled(ListItem)<StyledListItemType>`
  list-style: none;
  ${typographyTemplate(tokens.typography)};
  display: flex;
  align-items: center;
  margin: 0;
  background-color: ${({ highlighted }) =>
    highlighted === 'true' ? tokens.hover.background : tokens.background};
  cursor: ${({ highlighted }) =>
    highlighted === 'true' ? 'pointer' : 'default'};
`

export type MultiSelectProps = {
  /** List of options to choose from */
  items?: string[]
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
  /** If this prop is used, the select will become a controlled component.
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
      selectedOptions = null,
      handleSelectedItemsChange,
      ...other
    },
    ref,
  ) {
    const isControlled = selectedOptions

    const [options, setOptions] = useState(
      isControlled ? selectedOptions : initialSelectedItems,
    )

    const [inputValue, setInputValue] = useState('')

    const {
      getSelectedItemProps,
      getDropdownProps,
      addSelectedItem,
      removeSelectedItem,
      selectedItems,
    } = useMultipleSelection({
      selectedItems: options,
      initialSelectedItems: initialSelectedItems,
      onSelectedItemsChange: (changes) => {
        setOptions(changes.selectedItems)
        if (handleSelectedItemsChange) {
          handleSelectedItemsChange(changes)
        }
      },
      //onSelectedItemsChange: handleSelectedItemsChange,
    })
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
      // defaultHighlightedIndex: 0, // after selection, highlight the first item.
      selectedItem: null,
      //items: items,
      items: getFilteredItems(items),
      /* onSelectedItemChange: ({ selectedItem }) => {
        if (!selectedItem) {
          return
        }
        const index = selectedItems.indexOf(selectedItem)
        if (index > 0) {
          setSelectedItems([
            ...selectedItems.slice(0, index),
            ...selectedItems.slice(index + 1),
          ])
        } else if (index === 0) {
          setSelectedItems([...selectedItems.slice(1)])
        } else {
          setSelectedItems([...selectedItems, selectedItem])
        }
      }, */
      /*       stateReducer: (state, actionAndChanges) => {
        const { changes, type } = actionAndChanges
        switch (type) {
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
            return {
              ...changes,
              isOpen: true, // keep the menu open after selection.
            }
        }
        return changes
      }, */
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

    const placeholderText = selectedItems.length
      ? `${selectedItems.length} elements selected`
      : ''

    return (
      <Container className={className} ref={ref}>
        <Label
          {...getLabelProps()}
          label={label}
          meta={meta}
          disabled={disabled}
        />
        {/* <div style={comboboxWrapperStyles}> */}
        {/* {selectedItems.map((selectedItem, index) => (
            <span
              style={selectedItemStyles}
              // eslint-disable-next-line react/no-array-index-key
              key={`selected-item-${index}`}
              {...getSelectedItemProps({ selectedItem, index })}
            >
              {selectedItem}
              <span
                style={selectedItemIconStyles}
                onClick={(e) => {
                  e.stopPropagation()
                  removeSelectedItem(selectedItem)
                }}
              >
                &#10005;
              </span>
            </span>
          ))} */}
        <StyledInputWrapper {...getComboboxProps()}>
          <PaddedInput
            {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            placeholder={placeholderText}
            disabled={disabled}
            readOnly={readOnly}
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
              //items.map((item, index) => (

              <StyledListItem
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
              </StyledListItem>
            ))}
        </StyledList>
      </Container>
    )
  },
)
