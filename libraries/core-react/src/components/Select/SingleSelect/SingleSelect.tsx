import * as React from 'react'
import {
  forwardRef,
  SelectHTMLAttributes,
  useState,
  HTMLAttributes,
} from 'react'
import {
  useCombobox,
  UseComboboxProps,
  UseComboboxStateChange,
} from 'downshift'
import styled from 'styled-components'
import { Label } from '../../Label'
import { Button } from '../../Button'
import { Icon } from '../../Icon'
import { Input } from '../../TextField/Input'
import { arrow_drop_down, arrow_drop_up } from '@equinor/eds-icons'
import { List } from '../../List'
import { typographyTemplate, spacingsTemplate } from '@utils'
import { select as tokens } from '../Select.tokens'

const { ListItem } = List

type OptionType = {
  id: string
  name: string
}

export type SingleSelectProps = {
  /** List of options to choose from */
  items: string[]
  /** If your items are stored as, say, objects instead of strings, downshift still needs a string 
   * representation for each one. This is required for accessibility aria-live messages (e.g., after 
   * making a selection).
  Note: This callback must include a null check: it is invoked with null whenever the user abandons 
  input via <Esc>. */
  itemToString: (item: any) => string
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
  selectedItem?: string
  /** Callback for the selected item change
   * changes.selectedItem gives the selected item
   */
  handleSelectedItemChange?: (changes: UseComboboxStateChange<string>) => void
} & SelectHTMLAttributes<HTMLSelectElement>

const StyledInputWrapper = styled.div`
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
  ${spacingsTemplate(tokens.spacings)};
  margin: 0;
  background-color: ${({ highlighted }) =>
    highlighted === 'true' ? tokens.hover.background : tokens.background};
  cursor: ${({ highlighted }) =>
    highlighted === 'true' ? 'pointer' : 'default'};
`

type ContainerProps = HTMLAttributes<HTMLDivElement>

const Container = styled.div<ContainerProps>`
  position: relative;
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
      selectedItem = undefined,
      handleSelectedItemChange,

      ...other
    },
    ref,
  ) {
    const [inputItems, setInputItems] = useState(items)
    const isControlled = selectedItem ? true : false
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
      initialSelectedItem: initialSelectedItem,
    }

    if (isControlled) {
      comboboxProps = { ...comboboxProps, selectedItem }
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
            {...getInputProps({ refKey: 'ref' })}
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
              <StyledListItem
                highlighted={highlightedIndex === index ? 'true' : 'false'}
                key={`${item}`}
                {...getItemProps({ item, index })}
              >
                {item}
              </StyledListItem>
            ))}
        </StyledList>
      </Container>
    )
  },
)
