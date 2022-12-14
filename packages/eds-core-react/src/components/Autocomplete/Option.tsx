import { forwardRef, LiHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Checkbox } from '../Checkbox'
import { typographyTemplate, spacingsTemplate } from '@equinor/eds-utils'

type StyledListItemType = {
  highlighted?: string
  active?: string
  isdisabled?: string
}

const StyledListItem = styled.li<StyledListItemType>(
  ({ theme, highlighted, active, isdisabled }) => {
    const backgroundColor =
      highlighted === 'true'
        ? theme.states.hover.background
        : active === 'true'
        ? theme.states.active.background
        : theme.background
    return css`
      display: flex;
      grid-area: 1 / -1;
      align-items: center;
      align-self: start;
      margin: 0;
      list-style: none;
      background-color: ${backgroundColor};
      user-select: none;
      overflow: hidden;
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

const Label = styled.span<{ multiline: boolean }>(({ theme, multiline }) => {
  return css`
    ${spacingsTemplate(theme.entities.label.spacings)}
    text-overflow: ellipsis;
    white-space: ${multiline ? 'normal' : 'nowrap'};
    overflow: ${multiline ? 'initial' : 'hidden'};
    overflow-wrap: anywhere;
  `
})

export type AutocompleteOptionProps = {
  value: string
  multiple: boolean
  highlighted: string
  isSelected: boolean
  isDisabled?: boolean
  multiline: boolean
} & LiHTMLAttributes<HTMLLIElement>

export const AutocompleteOption = forwardRef<
  HTMLLIElement,
  AutocompleteOptionProps
>(function AutocompleteOption(
  {
    value,
    multiple,
    isSelected,
    isDisabled,
    multiline,
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
      <Label multiline={multiline}>{value}</Label>
    </StyledListItem>
  )
})
