import { add_box } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'
import { forwardRef, LiHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Icon } from '../Icon'
import { AutocompleteOptionLabel, StyledListItem } from './Option'
import { input } from '../Input/Input.tokens'

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
  value: string
  multiple: boolean
  highlighted: string
  multiline: boolean
} & LiHTMLAttributes<HTMLLIElement>

function AddNewOptionInner(
  props: AutocompleteOptionProps,
  ref: React.ForwardedRef<HTMLLIElement>,
) {
  const { value, multiline, multiple, highlighted, onClick, ...other } = props
  return (
    <StyledListItem
      ref={ref}
      $highlighted={highlighted}
      onClick={(e) => {
        onClick(e)
      }}
      {...other}
      aria-label={`Add new option: ${value}`}
      aria-live="polite"
      aria-selected={false}
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

export const AddNewOption = forwardRef(AddNewOptionInner) as (
  props: AutocompleteOptionProps & {
    ref?: React.ForwardedRef<HTMLLIElement>
    displayName?: string | undefined
  },
) => ReturnType<typeof AddNewOptionInner>
