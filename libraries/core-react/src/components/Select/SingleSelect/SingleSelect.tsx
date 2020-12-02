import * as React from 'react'
import { forwardRef, SelectHTMLAttributes, useState } from 'react'
import {
  useCombobox,
  UseComboboxProps,
  UseComboboxStateChange,
} from 'downshift'
import styled from 'styled-components'
import { Label } from '../../Label'
import { Icon } from '../../Icon'
import { arrow_drop_down, arrow_drop_up } from '@equinor/eds-icons'
import { spacingsTemplate } from '@utils'
import { select as tokens } from '../Select.tokens'
import {
  Container,
  PaddedInput,
  StyledList,
  StyledButton,
  StyledListItem,
  StyledInputWrapper,
} from '../commonStyles'

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
  ${spacingsTemplate(tokens.spacings.single)};
`

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

    let comboboxProps: UseComboboxProps<string> = {
      items: inputItems,
      onSelectedItemChange: handleSelectedItemChange,
      onInputValueChange: ({ inputValue }) => {
        setInputItems(
          items.filter((item) =>
            item.toLowerCase().startsWith(inputValue.toLowerCase()),
          ),
        )
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
    } = useCombobox(comboboxProps)

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
            {...getInputProps()}
            disabled={disabled}
            readOnly={readOnly}
            {...other}
          />
          <StyledButton
            type="button"
            variant="ghost_icon"
            disabled={disabled || readOnly}
            {...getToggleButtonProps()}
          >
            <Icon
              data={isOpen ? arrow_drop_up : arrow_drop_down}
              title="open"
            ></Icon>
          </StyledButton>
        </StyledInputWrapper>
        <StyledList {...getMenuProps()}>
          {isOpen &&
            inputItems.map((item, index) => (
              <PaddedStyledListItem
                highlighted={highlightedIndex === index ? 'true' : 'false'}
                key={`${item}`}
                {...getItemProps({ item, index })}
              >
                {item}
              </PaddedStyledListItem>
            ))}
        </StyledList>
      </Container>
    )
  },
)
