import { forwardRef, LiHTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { Checkbox } from '../Checkbox'
import { typographyTemplate, spacingsTemplate } from '@equinor/eds-utils'

type StyledListItemType = {
  $highlighted?: string
  $active?: string
  $isdisabled?: string
}

export const StyledListItem = styled.li<StyledListItemType>(
  ({ theme, $highlighted, $active, $isdisabled }) => {
    const backgroundColor =
      $highlighted === 'true'
        ? theme.states.hover.background
        : $active === 'true'
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
      touch-action: manipulation;
      z-index: 3;
      cursor: ${$highlighted === 'true' ? 'pointer' : 'default'};
      ${typographyTemplate(theme.typography)}
      ${spacingsTemplate(theme.spacings)}
      ${$isdisabled === 'true'
        ? css`
            color: ${theme.states.disabled.typography.color};
          `
        : ''}
    `
  },
)

export const AutocompleteOptionLabel = styled.span<{ $multiline: boolean }>(
  ({ theme, $multiline }) => {
    return css`
      ${spacingsTemplate(theme.entities.label.spacings)}
      text-overflow: ellipsis;
      white-space: ${$multiline ? 'normal' : 'nowrap'};
      overflow: ${$multiline ? 'initial' : 'hidden'};
      overflow-wrap: anywhere;
      /* hack to fix clipping issue in firefox (#3170) */
      @supports (-moz-appearance: none) {
        overflow: ${$multiline ? 'initial' : 'clip'};
      }
    `
  },
)

export type AutocompleteOptionProps = {
  value: string
  multiple: boolean
  highlighted: string
  isSelected: boolean
  isDisabled?: boolean
  multiline: boolean
  optionComponent?: ReactNode
  indeterminate?: boolean
} & LiHTMLAttributes<HTMLLIElement>

function AutocompleteOptionInner(
  props: AutocompleteOptionProps,
  ref: React.ForwardedRef<HTMLLIElement>,
) {
  const {
    value,
    optionComponent,
    multiple,
    isSelected,
    indeterminate,
    isDisabled,
    multiline,
    highlighted,
    onClick,
    'aria-selected': ariaSelected,
    ...other
  } = props
  return (
    <StyledListItem
      ref={ref}
      $isdisabled={isDisabled ? 'true' : 'false'}
      $highlighted={highlighted}
      aria-hidden={isDisabled}
      $active={!multiple && isSelected ? 'true' : 'false'}
      onClick={(e) => {
        !isDisabled && onClick(e)
      }}
      aria-selected={multiple ? isSelected : ariaSelected}
      {...other}
    >
      {multiple && (
        <Checkbox
          disabled={isDisabled}
          checked={isSelected}
          indeterminate={indeterminate}
          value={value}
          onChange={() => {
            return null
          }}
        />
      )}
      {optionComponent ? (
        <>{optionComponent}</>
      ) : (
        <AutocompleteOptionLabel $multiline={multiline}>
          {value}
        </AutocompleteOptionLabel>
      )}
    </StyledListItem>
  )
}

export const AutocompleteOption = forwardRef(AutocompleteOptionInner) as (
  props: AutocompleteOptionProps & {
    ref?: React.ForwardedRef<HTMLLIElement>
    displayName?: string | undefined
  },
) => ReturnType<typeof AutocompleteOptionInner>
