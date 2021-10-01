import { forwardRef, LiHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { CheckboxInput } from '../Checkbox/Input'
import { List } from '../List'
import { typographyTemplate, spacingsTemplate } from '../../utils'

type StyledListItemType = {
  highlighted?: string
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
  index: number
  multiple: boolean
  highlighted: string
  isSelected: boolean
} & LiHTMLAttributes<HTMLLIElement>

export const ComboboxOption = forwardRef<HTMLLIElement, ComboboxOptionProps>(
  function ComboboxOption({ value, multiple, isSelected, ...other }, ref) {
    return (
      <StyledListItem
        ref={ref}
        active={!multiple && isSelected ? 'true' : 'false'}
        {...other}
      >
        {multiple && (
          <CheckboxInput
            checked={isSelected}
            value={value}
            onChange={() => {
              return null
            }}
          />
        )}
        <span>{value}</span>
      </StyledListItem>
    )
  },
)
