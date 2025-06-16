import { add_box } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'
import { forwardRef, LiHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Icon } from '../Icon'
import { AutocompleteOptionLabel, StyledListItem } from './Option'

const StyledAddItemIcon = styled(Icon)<{ multiple: boolean }>(({
  multiple,
}) => {
  return css`
    padding: ${multiple ? '0.75rem' : '0 0.75rem 0 0'};
    color: ${tokens.colors.interactive.primary__resting.hex};
  `
})

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
      aria-label={`Add new option: ${value}`}
      onClick={(e) => {
        onClick(e)
      }}
      {...other}
    >
      <StyledAddItemIcon multiple={multiple} data={add_box} />
      <AutocompleteOptionLabel $multiline={multiline}>
        {value}
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
