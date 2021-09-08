import { forwardRef, SelectHTMLAttributes, useState } from 'react'
import {
  useCombobox,
  useMultipleSelection,
  UseMultipleSelectionStateChange,
  UseMultipleSelectionProps,
} from 'downshift'
import styled, { ThemeProvider, css } from 'styled-components'
import { Label } from '../Label'
import { Icon } from '../Icon'
import { Input } from '../Input'
import { CheckboxInput } from '../Checkbox/Input'
import { arrow_drop_down, arrow_drop_up, close } from '@equinor/eds-icons'
import { multiSelect as tokens } from './Combobox.tokens'
import { useEds } from '../EdsProvider'
import { useToken } from '../../hooks'
import { List } from '../List'
import { Button } from '../Button'
import {
  typographyTemplate,
  bordersTemplate,
  spacingsTemplate,
} from '../../utils'

const {
  entities: { button: buttonToken },
} = tokens

type StyledListItemType = {
  highlighted: string
  active?: string
}

export const Container = styled.div`
  position: relative;
`

const PaddedInput = styled(Input)`
  /* Hack: Had to add + 0px to satisfy the style lint plugin */
  padding-right: calc(
    ${buttonToken.height} + ${buttonToken.spacings.left} +
      ${buttonToken.spacings.right} + 0px
  );
`

export const StyledList = styled(List)`
  background-color: ${tokens.background};
  box-shadow: ${tokens.boxShadow};
  overflow-y: scroll;
  max-height: 300px;
  padding: 0;
  ${bordersTemplate(tokens.border)}
  margin-top: 4px;
  position: absolute;
  right: 0;
  left: 0;
  z-index: 50;
`

export const StyledListItem = styled(List.Item)<StyledListItemType>(
  ({ theme, highlighted, active }) => {
    const backgroundColor =
      highlighted === 'true'
        ? theme.states.hover.background
        : active === 'true'
        ? theme.states.active.background
        : theme.background

    return css`
      margin: 0;
      list-style: none;
      background-color: ${backgroundColor};
      ${typographyTemplate(theme.typography)};
      cursor: ${highlighted === 'true' ? 'pointer' : 'default'};
    `
  },
)

const AbsoluteButton = styled(Button)(
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
    const token = useToken({ density }, tokens)()

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
            <PaddedInput
              {...getInputProps(
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
              <AbsoluteButton
                variant="ghost_icon"
                disabled={disabled || readOnly}
                aria-label={'clear options'}
                title="clear"
                onClick={reset}
                style={{ right: 32 }}
              >
                <Icon data={close} size={16} />
              </AbsoluteButton>
            )}
            <AbsoluteButton
              variant="ghost_icon"
              {...getToggleButtonProps({ disabled: disabled || readOnly })}
              aria-label={'toggle options'}
              title="open"
            >
              <Icon data={isOpen ? arrow_drop_up : arrow_drop_down}></Icon>
            </AbsoluteButton>
          </Container>
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
