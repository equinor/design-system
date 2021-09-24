import { forwardRef, LiHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { CheckboxInput } from '../Checkbox/Input'
import { List } from '../List'
import { typographyTemplate, spacingsTemplate } from '../../utils'
import { useComboboxContext } from './Combobox.context'

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

export type ComboboxOptionProps = {
  value: string
  index?: number
} & LiHTMLAttributes<HTMLLIElement>

export const ComboboxOption = forwardRef<HTMLLIElement, ComboboxOptionProps>(
  function ComboboxOption({ value, children, index, ...other }, ref) {
    const { selectedItems, multiple, highlightedIndex } = useComboboxContext()
    const isSelected = selectedItems.includes(value)

    return (
      <StyledListItem
        ref={ref}
        key={value}
        highlighted={highlightedIndex === index ? 'true' : 'false'}
        active={!multiple && isSelected ? 'true' : 'false'}
        {...other}
      >
        {multiple && (
          <CheckboxInput
            checked={selectedItems.includes(value)}
            value={value}
            onChange={() => {
              return null
            }}
          />
        )}
        {children}
      </StyledListItem>
    )
  },
)
