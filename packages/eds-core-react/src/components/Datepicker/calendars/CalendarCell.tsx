import styled from 'styled-components'
import { Typography } from '../../Typography'
import { useEds } from '../../EdsProvider'
import { tokens } from '@equinor/eds-tokens'
import { CalendarState, RangeCalendarState } from '@react-stately/calendar'
import { CalendarDate } from '@internationalized/date'
import { useMemo, useRef } from 'react'
import { useCalendarCell } from 'react-aria'

type Selections = 'START' | 'END' | 'RANGE' | 'SINGLE' | 'NONE' | 'BOTH'
const StyledCell = styled(Typography)<{
  $selected: boolean
  $hidden: boolean
  $highlight: Selections
  $disabled: boolean
  $density: 'compact' | 'comfortable'
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: ${tokens.colors.interactive.table__cell__fill_hover.rgba};
  }
  &:focus {
    outline: 2px dashed rgba(0, 112, 121, 1);
  }

  ${({ $selected }) =>
    $selected &&
    `background-color: ${tokens.colors.interactive.primary__selected_highlight.rgba};`}
  ${({ $hidden }) => $hidden && `visibility: hidden;`}
  ${({ $highlight }) => {
    switch ($highlight) {
      case 'SINGLE':
      case 'NONE':
      case 'BOTH':
        return 'border-radius: 50%;'
      case 'END':
        return 'border-radius: 0% 50% 50% 0;'
      case 'START':
        return 'border-radius: 50% 0% 0% 50%;'
      case 'RANGE':
        return ''
    }
  }}
  ${({ $disabled }) =>
    $disabled &&
    `

    color: ${tokens.colors.interactive.disabled__text.rgba};
    &:hover {
      background-color: transparent;
    cursor: not-allowed;
    }
    `}
  ${({ $selected, $disabled }) => {
    if ($selected && $disabled) {
      return `background-color: ${tokens.colors.interactive.warning__highlight.rgba};
      &:hover {
        background-color: ${tokens.colors.interactive.warning__highlight.rgba};
      }`
    }
  }}
  ${({ $density }) => {
    switch ($density) {
      case 'compact':
        return `
        height: 32px;
        width: 32px;
        padding: 2px;
        `
      case 'comfortable':
        return `
          height: 40px;
          width: 40px;
          padding: 4px;
          `
    }
  }}
`

const StyledTd = styled.td`
  border: 0;
  border-spacing: 0;
`

/**
 * CalendarCell is used to represent a single cell in {@link Calendar} and {@link RangeCalendar}
 */
export function CalendarCell({
  state,
  date,
}: {
  state: CalendarState | RangeCalendarState
  date: CalendarDate
}) {
  const ref = useRef(null)
  const { density } = useEds()
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate,
  } = useCalendarCell({ date }, state, ref)

  /**
   * Determines how the selection should be highlighted
   * If range is selected, it will highlight start - end, with differing border-radius
   */
  const isHighlight = useMemo<Selections>(() => {
    if (isSelected && 'highlightedRange' in state) {
      const start = state.highlightedRange.start
      const end = state.highlightedRange.end
      const startSame =
        start.day === date.day &&
        start.month === date.month &&
        start.year === date.year
      const endSame =
        end.day === date.day &&
        end.month === date.month &&
        end.year === date.year
      if (startSame && endSame) {
        return 'BOTH'
      }
      if (startSame) {
        return 'START'
      } else if (endSame) {
        return 'END'
      } else {
        return 'RANGE'
      }
    } else if (isSelected) {
      return 'SINGLE'
    }
    return 'NONE'
  }, [date.day, date.month, date.year, isSelected, state])

  return (
    <StyledTd
      {...cellProps}
      style={{ border: 0, borderSpacing: 0, padding: 0 }}
    >
      <StyledCell
        {...buttonProps}
        as={'div'}
        ref={ref}
        tabIndex={0}
        $hidden={isOutsideVisibleRange}
        className={`cell ${isSelected ? 'selected' : ''} ${
          isUnavailable ? 'unavailable' : ''
        }${isDisabled ? 'disabled' : ''}`}
        $selected={isSelected}
        $highlight={isHighlight}
        $disabled={isDisabled || isUnavailable}
        $density={density}
      >
        {formattedDate}
      </StyledCell>
    </StyledTd>
  )
}
