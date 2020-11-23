import * as React from 'react'
import { useState } from 'react'
import { forwardRef, SelectHTMLAttributes } from 'react'
import { useCombobox } from 'downshift'
import styled from 'styled-components'
import { Label } from '../../Label'

type OptionType = {
  id: string
  name: string
}

export type SingleSelectProps = {
  /** Option */
  items: string[]
} & SelectHTMLAttributes<HTMLSelectElement>

const comboboxStyles = { display: 'inline-block', marginLeft: '5px' }

const menuStyles = {
  maxHeight: 80,
  maxWidth: 300,
  overflowY: 'scroll',
  backgroundColor: '#eee',
  padding: 0,
  listStyle: 'none',
  position: 'relative',
}

export const SingleSelect = forwardRef<HTMLDivElement, SingleSelectProps>(
  function SingleSelect({ items = [], ...other }, ref) {
    const [inputItems, setInputItems] = useState(items)
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
      items: inputItems,
      onInputValueChange: ({ inputValue }) => {
        setInputItems(
          items.filter((item) =>
            item.toLowerCase().startsWith(inputValue.toLowerCase()),
          ),
        )
      },
    })

    return (
      <div>
        <label {...getLabelProps()}>Choose an element:</label>
        <div style={comboboxStyles} {...getComboboxProps()}>
          <input {...getInputProps()} />
          <button
            type="button"
            {...getToggleButtonProps()}
            aria-label="toggle menu"
          >
            &#8595;
          </button>
        </div>
        <ul {...getMenuProps()} style={menuStyles}>
          {isOpen &&
            inputItems.map((item, index) => (
              <li
                style={
                  highlightedIndex === index
                    ? { backgroundColor: '#bde4ff' }
                    : {}
                }
                key={`${item}`}
                {...getItemProps({ item, index })}
              >
                {item}
              </li>
            ))}
        </ul>
      </div>
    )
  },
)
