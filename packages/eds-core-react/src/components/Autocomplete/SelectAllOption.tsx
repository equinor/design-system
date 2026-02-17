import { Checkbox } from '../Checkbox'
import { useAutocompleteContext } from './AutocompleteContext'
import { AutocompleteOptionLabel, StyledListItem } from './Option'

export type AutocompleteOptionProps = {
  item: unknown
  index: number
  ref?: React.Ref<HTMLLIElement>
}

export function SelectAllOption({ item, index, ref }: AutocompleteOptionProps) {
  const {
    availableItems,
    allSelectedState,
    highlightedIndex,
    optionDisabled,
    multiline,
    getItemProps,
    rowVirtualizer,
  } = useAutocompleteContext()

  const value = 'Select all'
  const isSelected = allSelectedState === 'ALL'
  const isDisabled = optionDisabled(item)
  const indeterminate = allSelectedState === 'SOME'
  const highlighted =
    highlightedIndex === index && !isDisabled ? 'true' : 'false'

  const itemProps = getItemProps({
    ...(multiline && {
      ref: rowVirtualizer.measureElement,
    }),
    item,
    index,
  })

  return (
    <StyledListItem
      ref={ref}
      $isdisabled={isDisabled ? 'true' : 'false'}
      $highlighted={highlighted}
      aria-hidden={isDisabled}
      $active="false"
      aria-selected={isSelected}
      data-index={0}
      data-testid={'select-all'}
      aria-setsize={availableItems.length}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 99,
      }}
      {...itemProps}
    >
      <Checkbox
        disabled={isDisabled}
        checked={isSelected}
        indeterminate={indeterminate}
        value={value}
        onChange={() => {
          return null
        }}
      />
      <AutocompleteOptionLabel $multiline={multiline}>
        {value}
      </AutocompleteOptionLabel>
    </StyledListItem>
  )
}
