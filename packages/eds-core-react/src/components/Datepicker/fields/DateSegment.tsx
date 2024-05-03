import {
  DateFieldState,
  DateSegment as IDateSegment,
} from '@react-stately/datepicker'
import { KeyboardEvent, useRef, useState } from 'react'
import { useDateFormatter, useDateSegment } from 'react-aria'
import styled from 'styled-components'
import { tokens } from '@equinor/eds-tokens'
import { useDatePickerContext } from '../utils/context'

const Segment = styled.div<{
  $placeholder: boolean
  $invalid: boolean
  $disabled: boolean
}>`
  color: ${tokens.typography.input.text.color};
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
 */
export function DateSegment({
  segment,
  state,
}: {
  state: DateFieldState
  segment: IDateSegment
}) {
  const { formatOptions, timezone } = useDatePickerContext()
  const formatter = useDateFormatter(formatOptions)
  const parts = state.value
    ? formatter.formatToParts(state.value.toDate(timezone))
    : []
  const part = parts.find((p) => p.type === segment.type)
  const value = part?.value ?? segment.text

  const [focus, setFocus] = useState(false)
  const ref = useRef(null)
  const { segmentProps } = useDateSegment(segment, state, ref)

  return (
    <Segment
      {...segmentProps}
      onFocus={(e) => {
        setFocus(true)
        segmentProps.onFocus(e)
      }}
      onBlur={(e) => {
        setFocus(false)
        segmentProps.onBlur(e)
      }}
      $invalid={state.isInvalid}
      $disabled={state.isDisabled}
      $placeholder={segment.isPlaceholder}
      style={{ padding: segment.type === 'literal' ? '0 2px' : '0' }}
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
      {focus
        ? segment.isPlaceholder || segment.type === 'literal'
          ? segment.text
          : segment.text.padStart(segment.type === 'year' ? 4 : 2, '0')
        : value}
    </Segment>
  )
}
