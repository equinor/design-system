import { add_box } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'
import styled, { css } from 'styled-components'
import { Icon } from '../Icon'
import { input } from '../Input/Input.tokens'
import { useAutocompleteContext } from './AutocompleteContext'
import { AutocompleteOptionLabel, StyledListItem } from './Option'

const StyledAddItemIcon = styled(Icon)<{ multiple: boolean }>(({
  multiple,
}) => {
  return css`
    padding: ${multiple ? '0.75rem' : '0 0.75rem 0 0'};
    color: ${tokens.colors.interactive.primary__resting.hex};
  `
})

const StyledPlaceholder = styled.span`
  color: ${input.entities.placeholder.typography.color};
`

export type AutocompleteOptionProps = {
  index: number
  item: unknown
}

export function AddNewOption({ index, item }: AutocompleteOptionProps) {
  const {
    availableItems,
    multiple,
    typedInputValue,
    highlightedIndex,
    multiline,
    rowVirtualizer,
    getItemProps,
  } = useAutocompleteContext()
  const value = typedInputValue.trim()
  const isDisabled = !typedInputValue.trim()
  const highlighted =
    highlightedIndex === index && !isDisabled ? 'true' : 'false'

  const itemProps = getItemProps({
    ...(multiline && {
      ref: rowVirtualizer.measureElement,
    }),
    item,
    index: index,
  })
  return (
    <StyledListItem
      $highlighted={highlighted}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 99,
      }}
      {...itemProps}
      aria-label={`Add new option: ${value}`}
      data-index={0}
      data-testid={'add-item'}
      aria-live="polite"
      aria-selected={false}
      aria-setsize={availableItems.length}
    >
      <StyledAddItemIcon multiple={multiple} data={add_box} />
      <AutocompleteOptionLabel $multiline={multiline}>
        {value ? (
          value
        ) : (
          <StyledPlaceholder>Type to add new options</StyledPlaceholder>
        )}
      </AutocompleteOptionLabel>
    </StyledListItem>
  )
}
