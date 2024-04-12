import {
  DateFieldState,
  DateSegment as IDateSegment,
} from '@react-stately/datepicker'
import { KeyboardEvent, useRef } from 'react'
import { useDateSegment } from 'react-aria'
import styled from 'styled-components'
import { tokens } from '@equinor/eds-tokens'

const Segment = styled.div<{
  $placeholder: boolean
  $invalid: boolean
  $disabled: boolean
}>`
  font-family: ${tokens.typography.input.text.fontFamily};
  &:focus-visible {
    outline: 2px solid ${tokens.colors.interactive.primary__resting.rgba};
    background-color: ${tokens.colors.ui.background__medium.rgba};
  }
  ${({ $disabled }) =>
    $disabled && `color: ${tokens.colors.interactive.disabled__text.rgba};`}
`

/**
 * DateSegment is used to represent a single segment of a date in the DateField (i.e. day, month, year)
 * @param segment
 * @param state
 */
export function DateSegment({
  segment,
  state,
}: {
  state: DateFieldState
  segment: IDateSegment
}) {
  const ref = useRef(null)
  const { segmentProps } = useDateSegment(segment, state, ref)

  return (
    <Segment
      {...segmentProps}
      $invalid={state.isInvalid}
      $disabled={state.isDisabled}
      $placeholder={segment.isPlaceholder}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.stopPropagation()
          e.preventDefault()
        } else if (segmentProps.onKeyDown) {
          segmentProps.onKeyDown(e)
        }
      }}
      ref={ref}
      className={`segment ${segment.isPlaceholder ? 'placeholder' : ''}`}
    >
      {segment.isPlaceholder || segment.type === 'literal'
        ? segment.text
        : segment.text.padStart(segment.type === 'year' ? 4 : 2, '0')}
    </Segment>
  )
}
