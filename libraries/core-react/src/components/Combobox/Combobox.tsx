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
import { HTMLAttributes } from '.pnpm/@types+react@17.0.33/node_modules/@types/react'

declare module 'react' {
  function forwardRef<T, P = Record<string, unknown>>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null
}

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

type ComboboxOption = {
  label: string
}

export type ComboboxChanges<T> = {
  selectedItems: T[]
  inputValue: string
}

export type ComboboxProps<T> = {
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
  onChange?: (changes: ComboboxChanges<T>) => void
  /** Enable multiselect */
  multiple?: boolean
  /**  Custom option label */
  optionLabel?: (option: T & ComboboxOption) => string
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
    onChange,
    selectedOptions,
    multiple,
    initialSelectedOptions = [],
    optionLabel = (item) => item.label,
    ...other
  } = props

  const isControlled = Boolean(selectedOptions)
  const labelItems = options.map(optionLabel)
  const [availableItems, setAvailableItems] = useState<string[]>(labelItems)
  const [selectedItems, setSelectedItems] = useState<string[]>(
    isControlled ? options.map(optionLabel) : [],
  )

  const { density } = useEds()
  const token = useToken(
    { density },
    multiple ? multiSelectTokens : selectTokens,
  )
  let placeholderText: string = undefined

  useEffect(() => {
    if (isControlled) {
      setSelectedItems(selectedOptions.map(optionLabel))
    }
    if (initialSelectedOptions.length) {
      setSelectedItems(initialSelectedOptions.map(optionLabel))
    }
  }, [selectedOptions, isControlled, initialSelectedOptions, optionLabel])

  let comboBoxProps: UseComboboxProps<string> = {
    items: availableItems,
    selectedItem: multiple ? null : undefined,
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

            if (onChange) {
              onChange({
                // This feels slow....
                selectedItems: options.filter((x) =>
                  selectedItems.includes(optionLabel(x)),
                ),
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
    placeholderText = `${selectedItems.length}/${options.length} selected`
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

  const resetSelection = () => {
    reset()
    setSelectedItems([])
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
              onClick={resetSelection}
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
            availableItems.map((item, index) => (
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
}

export const Combobox = forwardRef(ComboboxInner)
