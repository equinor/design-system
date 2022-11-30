import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Checkbox } from '../Checkbox'
import { typographyTemplate, spacingsTemplate } from '@equinor/eds-utils'

type StyledListItemType = {
  highlighted?: string
  active?: string
  isdisabled?: string
}

const StyledListItem = styled.div<StyledListItemType>(
  ({ theme, highlighted, active, isdisabled }) => {
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
      //list-style: none;
      background-color: ${backgroundColor};
      user-select: none;
      word-break: break-word;
      cursor: ${highlighted === 'true' ? 'pointer' : 'default'};
      ${typographyTemplate(theme.typography)}
      ${spacingsTemplate(theme.spacings)}
      ${isdisabled === 'true'
        ? css`
            color: ${theme.states.disabled.typography.color};
          `
        : ''}
    `
  },
)

export type AutocompleteOptionProps = {
  value: string
  multiple: boolean
  highlighted: string
  isSelected: boolean
  isDisabled?: boolean
} & HTMLAttributes<HTMLDivElement>

export const AutocompleteOption = forwardRef<
  HTMLDivElement,
  AutocompleteOptionProps
>(function AutocompleteOption(
  {
    value,
    multiple,
    isSelected,
    isDisabled,
    onClick,
    'aria-selected': ariaSelected,
    ...other
  },
  ref,
) {
  return (
    <StyledListItem
      ref={ref}
      isdisabled={isDisabled ? 'true' : 'false'}
      aria-hidden={isDisabled}
      active={!multiple && isSelected ? 'true' : 'false'}
      onClick={(e) => !isDisabled && onClick(e)}
      aria-selected={multiple ? isSelected : ariaSelected}
      {...other}
    >
      {multiple && (
        <Checkbox
          disabled={isDisabled}
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
})
