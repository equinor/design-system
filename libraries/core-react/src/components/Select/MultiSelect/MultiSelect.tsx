/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import * as React from 'react'
import { forwardRef, SelectHTMLAttributes, useState } from 'react'
import { useCombobox, useMultipleSelection } from 'downshift'
import { Label } from '../../Label'
import { Input } from '../../TextField/Input'
import { Button } from '../../Button'
import { Icon } from '../../Icon'
import { CheckboxInput } from '../../SelectionControls/Checkbox/Input'
import { arrow_drop_down } from '@equinor/eds-icons'
import { List } from '../../List'
import styled from 'styled-components'
import { typographyTemplate, spacingsTemplate } from '@utils'
import { select as tokens } from '../Select.tokens'

const { ListItem } = List

const StyledInputWrapper = styled.div`
  position: relative;
`

const Container = styled.div`
  position: relative;
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
  /** Option */
  items?: string[]
  /** Label for the select element */
  label: string
  /** Array of initial selected items */
  initialSelectedItems?: string[]
} & SelectHTMLAttributes<HTMLSelectElement>

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  function MultiSelect(
    { items = [], initialSelectedItems = [], label, ...other },
    ref,
  ) {
    /*     const [inputItems, setInputItems] = useState(items)
     */ /* const [selectedItems, setSelectedItems] = useState([]) */
    /* const [inputItems, setInputItems] = useState(items) */
    /* const isOpen = true */
    const [inputValue, setInputValue] = useState('')
    const {
      getSelectedItemProps,
      getDropdownProps,
      addSelectedItem,
      removeSelectedItem,
      selectedItems,
    } = useMultipleSelection({ initialSelectedItems: initialSelectedItems })
    const getFilteredItems = (items: string[]) =>
      items.filter((item) =>
        /* selectedItems.indexOf(item) < 0 && */
        // item.toLowerCase().startsWith(inputValue.toLowerCase()),
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
        /*         console.debug(
          'selected items',
          selectedItems,
          selectedItems.length,
          type,
          selectedItems.includes(selectedItem),
        ) */
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
      <Container>
        <Label {...getLabelProps()} label={label} />
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
          <Input
            {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            placeholder={placeholderText}
          />
          <StyledButton
            variant="ghost_icon"
            {...getToggleButtonProps()}
            aria-label={'toggle menu'}
          >
            <Icon data={arrow_drop_down} title="open"></Icon>
          </StyledButton>
        </StyledInputWrapper>
        {/*      </div> */}
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
