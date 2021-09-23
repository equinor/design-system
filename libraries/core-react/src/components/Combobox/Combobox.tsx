import { forwardRef, SelectHTMLAttributes, useEffect, useState } from 'react'
import { useCombobox, UseComboboxProps } from 'downshift'
import styled, { ThemeProvider, css } from 'styled-components'
import { Label } from '../Label'
import { Icon } from '../Icon'
import { Input } from '../Input'
import { CheckboxInput } from '../Checkbox/Input'
import { arrow_drop_down, arrow_drop_up, close } from '@equinor/eds-icons'
import {
  multiSelect as multiSelectTokens,
  selectTokens as selectTokens,
} from './Combobox.tokens'
import { useEds } from '../EdsProvider'
import { useToken } from '../../hooks'
import { List } from '../List'
import { Button } from '../Button'
import {
  typographyTemplate,
  bordersTemplate,
  spacingsTemplate,
} from '../../utils'
import {
  ComboboxProvideProps,
  ComboboxProvider,
  useComboboxContext,
} from './Combobox.context'

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

type StyledListItemType = {
  highlighted: string
  active?: string
}

const StyledListItem = styled(List.Item)<StyledListItemType>(
  ({ theme, highlighted, active }) => {
    const backgroundColor =
      highlighted === 'true'
        ? theme.states.hover.background
        : active === 'true'
        ? theme.states.active.background
        : theme.background

    return css`
      display: flex;
      align-items: center;
      margin: 0;
      list-style: none;
      background-color: ${backgroundColor};
      cursor: ${highlighted === 'true' ? 'pointer' : 'default'};
      ${typographyTemplate(theme.typography)}
      ${spacingsTemplate(theme.spacings)}
    `
  },
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

const ComboboxContainer = forwardRef<HTMLDivElement, ComboboxProps>(
  function ComboboxContainer(
    {
      items = [],
      label,
      meta,
      className,
      disabled = false,
      readOnly = false,
      initialSelectedItems = [],
      handleSelectedItemsChange,
      multiple,
      ...other
    },
    ref,
  ) {
    const { inputItems, setInputItems, selectedItems, setSelectedItems } =
      // eslint-disable-next-line prettier/prettier
      useComboboxContext()

    let placeholderText: string = undefined

    useEffect(() => {
      if (initialSelectedItems.length) {
        setSelectedItems(initialSelectedItems)
      }
    }, [])

    let comboBoxProps: UseComboboxProps<string> = {
      items: inputItems || [],
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
      onStateChange: (changes) => {
        const { type, selectedItem, inputValue } = changes
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
      placeholderText = `${selectedItems?.length}/${items?.length} selected`
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
          {Boolean(selectedItems?.length || inputValue) && (
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
            inputItems?.map((item, index) => (
              <StyledListItem
                key={`${item}`}
                highlighted={highlightedIndex === index ? 'true' : 'false'}
                active={!multiple && selectedItem === item ? 'true' : 'false'}
                {...getItemProps({ item, index, disabled })}
              >
                {multiple && (
                  <CheckboxInput
                    checked={selectedItems?.includes(item)}
                    value={item}
                    onChange={() => {
                      return null
                    }}
                  />
                )}
                <span>{item}</span>
              </StyledListItem>
            ))}
        </StyledList>
      </Container>
    )
  },
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
  function Combobox({ multiple, items, selectedOptions, ...other }, ref) {
    const { density } = useEds()
    const token = useToken(
      { density },
      multiple ? multiSelectTokens : selectTokens,
    )()

    const isControlled = typeof selectedOptions !== 'undefined'

    const provideProps: ComboboxProvideProps = {
      multiple,
      inputItems: items,
      selectedItems: isControlled ? selectedOptions : [],
    }

    const props = {
      items,
      selectedOptions,
      multiple,
      ref,
      ...other,
    }

    return (
      <ThemeProvider theme={token}>
        <ComboboxProvider {...provideProps}>
          <ComboboxContainer {...props} />
        </ComboboxProvider>
      </ThemeProvider>
    )
  },
)
