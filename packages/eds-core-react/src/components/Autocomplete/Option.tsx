import { spacingsTemplate, typographyTemplate } from '@equinor/eds-utils'
import { VirtualItem } from '@tanstack/react-virtual'
import styled, { css } from 'styled-components'
import { Checkbox } from '../Checkbox'
import { useAutocompleteContext } from './AutocompleteContext'

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
  index: number
  virtualItem: VirtualItem
  item: unknown
  indeterminate?: boolean
}

export function Option({
  indeterminate,
  index,
  item,
  virtualItem,
}: AutocompleteOptionProps) {
  const {
    multiple,
    availableItems,
    highlightedIndex,
    multiline,
    optionDisabled,
    selectedItemsLabels,
    getLabel,
    getItemProps,
    optionComponent: _optionComponent,
    rowVirtualizer,
  } = useAutocompleteContext()

  const isDisabled = optionDisabled(item)
  const label = getLabel(item)
  const isSelected = selectedItemsLabels.includes(label)
  const optionComponent = _optionComponent?.(item, isSelected)
  const highlighted =
    highlightedIndex === index && !isDisabled ? 'true' : 'false'

  const itemProps = item !== undefined
    ? getItemProps({
        ...(multiline && {
          ref: rowVirtualizer.measureElement,
        }),
        item,
        index,
        style: {
          transform: `translateY(${virtualItem.start}px)`,
          ...(!multiline && {
            height: `${virtualItem.size}px`,
          }),
        },
      })
    : {
        style: {
          transform: `translateY(${virtualItem.start}px)`,
          ...(!multiline && {
            height: `${virtualItem.size}px`,
          }),
        },
      }
  return (
    <StyledListItem
      $isdisabled={isDisabled ? 'true' : 'false'}
      $highlighted={highlighted}
      aria-hidden={isDisabled}
      $active={!multiple && isSelected ? 'true' : 'false'}
      aria-setsize={availableItems.length}
      data-index={index}
      aria-posinset={index + 1}
      {...itemProps}
    >
      {multiple && (
        <Checkbox
          disabled={isDisabled}
          checked={isSelected}
          indeterminate={indeterminate}
          value={label}
          onChange={() => {
            return null
          }}
        />
      )}
      {optionComponent ? (
        <>{optionComponent}</>
      ) : (
        <AutocompleteOptionLabel $multiline={multiline}>
          {label}
        </AutocompleteOptionLabel>
      )}
    </StyledListItem>
  )
}
