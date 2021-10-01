import { forwardRef, SelectHTMLAttributes, useEffect, useState } from 'react'
import { useCombobox, UseComboboxProps } from 'downshift'
import styled, { ThemeProvider, css } from 'styled-components'
import { Label } from '../Label'
import { Icon } from '../Icon'
import { Input } from '../Input'
import { arrow_drop_down, arrow_drop_up, close } from '@equinor/eds-icons'
import {
  multiSelect as multiSelectTokens,
  selectTokens as selectTokens,
} from './Combobox.tokens'
import { useEds } from '../EdsProvider'
import { useToken } from '../../hooks'
import { List } from '../List'
import { Button } from '../Button'
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

export type ComboboxChanges = {
  selectedItems: string[]
  inputValue: string
}

export type ComboboxProps = {
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
  handleSelectedItemsChange?: (changes: ComboboxChanges) => void
  /** Enable multiselect */
  multiple?: boolean
} & SelectHTMLAttributes<HTMLSelectElement>

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  function Combobox(
    {
      items = [],
      label,
      meta,
      className,
      disabled = false,
      readOnly = false,
      initialSelectedItems = [],
      selectedOptions,
      handleSelectedItemsChange,
      multiple,
      ...other
    },
    ref,
  ) {
    const [inputItems, setInputItems] = useState(items)
    const isControlled = Boolean(selectedOptions)
    const [selectedItems, setSelectedItems] = useState<string[]>(
      isControlled ? selectedOptions : [],
    )
    const { density } = useEds()
    const token = useToken(
      { density },
      multiple ? multiSelectTokens : selectTokens,
    )
    let placeholderText: string = undefined

    useEffect(() => {
      if (isControlled) {
        setSelectedItems(selectedOptions)
      }
      if (initialSelectedItems.length) {
        setSelectedItems(initialSelectedItems)
      }
    }, [selectedOptions, isControlled, initialSelectedItems])

    let comboBoxProps: UseComboboxProps<string> = {
      items: inputItems,
      selectedItem: multiple ? null : undefined,
      onInputValueChange: ({ inputValue }) => {
        setInputItems(
          items.filter((item) =>
            item.toLowerCase().includes(inputValue.toLowerCase()),
          ),
        )
      },
      onIsOpenChange: ({ selectedItem }) => {
        if (inputItems.length === 1 && selectedItem === inputItems[0]) {
          setInputItems(items)
        }
      },
      onStateChange: ({ type, selectedItem, inputValue }) => {
        switch (type) {
          case useCombobox.stateChangeTypes.InputChange:
            break
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
          case useCombobox.stateChangeTypes.InputBlur:
            if (selectedItem) {
              const index = selectedItems.indexOf(selectedItem)
              let updatedSelectItems: string[] = []
              if (index > 0) {
                updatedSelectItems = [
                  ...selectedItems.slice(0, index),
                  ...selectedItems.slice(index + 1),
                ]
              } else if (index === 0) {
                updatedSelectItems = [...selectedItems.slice(1)]
              } else {
                updatedSelectItems = [...selectedItems, selectedItem]
              }

              setSelectedItems(updatedSelectItems)
              if (handleSelectedItemsChange) {
                handleSelectedItemsChange({
                  selectedItems: updatedSelectItems,
                  inputValue,
                })
              }
            }

            break
          default:
            break
        }
      },
    }

    if (multiple) {
      placeholderText = `${selectedItems.length}/${items.length} selected`
      comboBoxProps = {
        ...comboBoxProps,
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
      selectedItem,
      reset,
      inputValue,
    } = useCombobox(comboBoxProps)

    const openSelect = () => {
      if (!isOpen && !(disabled || readOnly)) {
        openMenu()
      }
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

          <Container {...getComboboxProps()}>
            <StyledInput
              {...getInputProps({
                disabled,
              })}
              placeholder={placeholderText}
              readOnly={readOnly}
              onFocus={openSelect}
              onClick={openSelect}
              {...other}
            />
            {Boolean(selectedItems.length || inputValue) && (
              <StyledButton
                variant="ghost_icon"
                disabled={disabled || readOnly}
                aria-label={'clear options'}
                title="clear"
                onClick={reset}
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
          </Container>
          <StyledList {...getMenuProps()}>
            {isOpen &&
              inputItems.map((item, index) => (
                <ComboboxOption
                  key={item}
                  value={item}
                  index={index}
                  multiple={multiple}
                  highlighted={highlightedIndex === index ? 'true' : 'false'}
                  isSelected={
                    multiple
                      ? selectedItems.includes(item)
                      : selectedItem === item
                  }
                  {...getItemProps({ item, index, disabled })}
                />
              ))}
          </StyledList>
        </Container>
      </ThemeProvider>
    )
  },
)
