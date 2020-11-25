/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import * as React from 'react'
import { forwardRef, SelectHTMLAttributes, useState } from 'react'
import { useCombobox, useMultipleSelection } from 'downshift'
import styled from 'styled-components'

const menuStyles = {
  maxHeight: 80,
  maxWidth: 300,
  overflowY: 'scroll',
  backgroundColor: '#eee',
  padding: 0,
  listStyle: 'none',
  position: 'relative',
}

const comboboxStyles = { display: 'inline-block', marginLeft: '5px' }

const comboboxWrapperStyles = {
  display: 'inline-flex',
  flexWrap: 'wrap',
} as React.CSSProperties

const selectedItemStyles = {
  marginLeft: '5px',
  backgroundColor: 'aliceblue',
  borderRadius: '10px',
}

const menuMultipleStyles = {
  maxHeight: '180px',
  overflowY: 'auto',
  width: '135px',
  margin: 0,
  borderTop: 0,
  background: 'white',
  position: 'absolute',
  zIndex: 1000,
  listStyle: 'none',
  padding: 0,
  left: '340px',
}

const selectedItemIconStyles = { cursor: 'pointer' }

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
    const isOpen = true
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
      /*  isOpen, */
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
              /*   highlightedIndex: state.highlightedIndex,
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
              console.log('************ selected item', selectedItem)
              setInputValue('')

              selectedItems.includes(selectedItem)
                ? removeSelectedItem(selectedItem)
                : addSelectedItem(selectedItem)
            }
            console.log('selected items', selectedItems)
            break
          default:
            break
        }
      },
    })

    const placeholderText = selectedItems.length
      ? `${selectedItems.length} elements selected`
      : 'elements'

    return (
      <div>
        <label {...getLabelProps()} label={label}>
          Choose an element:
        </label>
        <div style={comboboxWrapperStyles}>
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
          <div style={comboboxStyles} {...getComboboxProps()}>
            <input
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
              placeholder={placeholderText}
            />
            <button {...getToggleButtonProps()} aria-label={'toggle menu'}>
              &#8595;
            </button>
          </div>
        </div>
        <ul {...getMenuProps()} style={menuMultipleStyles}>
          {isOpen &&
            getFilteredItems(items).map((item, index) => (
              //items.map((item, index) => (
              <li
                style={
                  highlightedIndex === index
                    ? { backgroundColor: '#bde4ff' }
                    : {}
                }
                key={`${item}`}
                {...getItemProps({ item, index })}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  value={item}
                  onChange={() => null}
                />
                {item}
              </li>
            ))}
        </ul>
      </div>
    )
  },
)
