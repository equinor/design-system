import { forwardRef, LiHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { List, Checkbox } from '@equinor/eds-core-react'
import { typographyTemplate, spacingsTemplate } from '../../utils'

type StyledListItemType = {
  highlighted?: string
  active?: string
  isDisabled?: boolean
}

const StyledListItem = styled(List.Item)<StyledListItemType>(
  ({ theme, highlighted, active, isDisabled }) => {
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
      ${isDisabled
        ? css`
            color: ${theme.states.disabled.typography.color};
            cursor: not-allowed;
          `
        : ''}
    `
  },
)

export type ComboboxOptionProps = {
  value: string
  multiple: boolean
  highlighted: string
  isSelected: boolean
  isDisabled?: boolean
} & LiHTMLAttributes<HTMLLIElement>

export const ComboboxOption = forwardRef<HTMLLIElement, ComboboxOptionProps>(
  function ComboboxOption(
    { value, multiple, isSelected, isDisabled, ...other },
    ref,
  ) {
    if (isDisabled) {
      console.log('isDisabled', value)
    }
    return (
      <StyledListItem
        ref={ref}
        isDisabled={isDisabled}
        aria-hidden={isDisabled}
        active={!multiple && isSelected ? 'true' : 'false'}
        {...other}
      >
        {multiple && (
          <Checkbox
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
