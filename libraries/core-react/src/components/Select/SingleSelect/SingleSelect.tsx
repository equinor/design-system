import * as React from 'react'
import { forwardRef, SelectHTMLAttributes, useState } from 'react'
import { useCombobox } from 'downshift'
import styled from 'styled-components'
import { Label } from '../../Label'
import { Button } from '../../Button'
import { Icon } from '../../Icon'
import { Input } from '../../TextField/Input'
import { arrow_drop_down } from '@equinor/eds-icons'
import { List } from '../../List'
import { typographyTemplate, spacingsTemplate } from '@utils'
import { select as tokens } from '../Select.tokens'

const { ListItem } = List

type OptionType = {
  id: string
  name: string
}

export type SingleSelectProps = {
  /** Option */
  items?: string[]
  /** Label for the select element */
  label: string
} & SelectHTMLAttributes<HTMLSelectElement>

const StyledInputWrapper = styled.div`
  position: relative;
`

const StyledButton = styled(Button)`
  position: absolute;
  right: 0;
  top: 0;
`

const StyledList = styled(List)`
  background-color: ${tokens.background};
  box-shadow: ${tokens.boxShadow};
  overflow-y: scroll;
  max-height: 160px;
  padding: 0;
  border-radius: ${tokens.borderRadius};
  margin-top: 4px;
  position: absolute;
  right: 0;
  left: 0;
  z-index: 200;
`

const StyledListItem = styled(ListItem)`
  list-style: none;
  ${typographyTemplate(tokens.typography)};
  ${spacingsTemplate(tokens.spacings)};
  margin: 0;
`

const Container = styled.div`
  position: relative;
`

export const SingleSelect = forwardRef<HTMLDivElement, SingleSelectProps>(
  function SingleSelect({ items = [], label, ...other }, ref) {
    const [inputItems, setInputItems] = useState(items)
    const isOpen = true
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
      <Container>
        <Label {...getLabelProps()} label={label} />
        <StyledInputWrapper {...getComboboxProps()}>
          <Input {...getInputProps({ refKey: 'ref' })} />
          <StyledButton variant="ghost_icon" {...getToggleButtonProps()}>
            <Icon data={arrow_drop_down} title="open"></Icon>
          </StyledButton>
        </StyledInputWrapper>
        <StyledList {...getMenuProps()}>
          {isOpen &&
            inputItems.map((item, index) => (
              <StyledListItem
                style={
                  highlightedIndex === index
                    ? {
                        backgroundColor: tokens.hover.background,
                        cursor: 'pointer',
                      }
                    : {}
                }
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
