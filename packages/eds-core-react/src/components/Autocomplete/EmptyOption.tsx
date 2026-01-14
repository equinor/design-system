import { useAutocompleteContext } from './AutocompleteContext'
import { StyledListItem, AutocompleteOptionLabel } from './Option'

export function EmptyOption() {
  const { noOptionsText } = useAutocompleteContext()
  return (
    <StyledListItem
      $isdisabled="true"
      $highlighted="false"
      aria-hidden
      $active="false"
    >
      <AutocompleteOptionLabel $multiline={false}>
        {noOptionsText}
      </AutocompleteOptionLabel>
    </StyledListItem>
  )
}
