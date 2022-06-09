import { forwardRef, SelectHTMLAttributes, useEffect, useState } from 'react'
import {
  useCombobox,
  UseComboboxProps,
  UseComboboxStateChange,
} from 'downshift'
import styled, { ThemeProvider } from 'styled-components'
import { Label } from '../../Label'
import { Icon } from '../../Icon'
import { arrow_drop_down, arrow_drop_up, close } from '@equinor/eds-icons'
import { spacingsTemplate, useToken } from '@equinor/eds-utils'
import { select as tokens } from '../Select.tokens'
import {
  Container,
  PaddedInput,
  StyledList,
  StyledButton,
  StyledListItem,
  StyledInputWrapper,
} from '../commonStyles'
import { useEds } from '../../EdsProvider'

export type SingleSelectProps = {
  /** List of options to choose from */
  items: string[]
  /** Label for the select element */
  label: string
  /** Meta text, for instance unit */
  meta?: string
  /** Disabled state */
  disabled?: boolean
  /** Read Only */
  readOnly?: boolean
  /** Pass an item that should be selected when the Select is initialized. */
  initialSelectedItem?: string
  /** If this prop is used, the select will become a controlled component.
   * Note that this prop replaces the need for ```initialSelectedItem```
   *
   * The item that should be selected. */
  selectedOption?: string
  /** Callback for the selected item change
   * changes.selectedItem gives the selected item
   */
  handleSelectedItemChange?: (changes: UseComboboxStateChange<string>) => void
} & SelectHTMLAttributes<HTMLSelectElement>

const PaddedStyledListItem = styled(StyledListItem)`
  ${({ theme }) => spacingsTemplate(theme.spacings)}
`
/** @deprecated Use `<Autocomplete />` instead */

export const SingleSelect = forwardRef<HTMLDivElement, SingleSelectProps>(
  function SingleSelect(
    {
      items = [],
      label,
      meta,
      className,
      disabled = false,
      readOnly = false,
      initialSelectedItem,
      selectedOption,
      handleSelectedItemChange,
      ...other
    },
    ref,
  ) {
    const [inputItems, setInputItems] = useState(items)
    const isControlled = selectedOption !== undefined ? true : false
    const { density } = useEds()
    const token = useToken({ density }, tokens)

    useEffect(() => {
      setInputItems(items)
    }, [items])

    let comboboxProps: UseComboboxProps<string> = {
      items: inputItems,
      onSelectedItemChange: handleSelectedItemChange,
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
      initialSelectedItem,
    }

    if (isControlled) {
      comboboxProps = { ...comboboxProps, selectedItem: selectedOption }
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
    } = useCombobox(comboboxProps)

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
          <StyledInputWrapper {...getComboboxProps()}>
            <PaddedInput
              {...getInputProps({ disabled: disabled })}
              readOnly={readOnly}
              onFocus={openSelect}
              onClick={openSelect}
              {...other}
            />
            {Boolean(inputValue) && (
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
              <Icon data={isOpen ? arrow_drop_up : arrow_drop_down} />
            </StyledButton>
          </StyledInputWrapper>
          <StyledList {...getMenuProps()}>
            {isOpen &&
              inputItems.map((item, index) => (
                <PaddedStyledListItem
                  highlighted={highlightedIndex === index ? 'true' : 'false'}
                  active={selectedItem === item ? 'true' : 'false'}
                  key={`${item}`}
                  {...getItemProps({ item, index, disabled: disabled })}
                >
                  {item}
                </PaddedStyledListItem>
              ))}
          </StyledList>
        </Container>
      </ThemeProvider>
    )
  },
)
