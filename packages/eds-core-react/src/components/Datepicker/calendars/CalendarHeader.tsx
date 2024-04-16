import styled from 'styled-components'
import { CalendarState, RangeCalendarState } from '@react-stately/calendar'
import { Button, Icon, Typography } from '../../../index'
import {
  chevron_down,
  chevron_left,
  chevron_right,
  chevron_up,
} from '@equinor/eds-icons'
import { CalendarDate } from '@internationalized/date'
import { tokens } from '@equinor/eds-tokens'

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: capitalize;
  width: 100%;
`

function TodayPicker({
  onClick,
  disabled,
}: {
  onClick: (v: CalendarDate) => void
  disabled: boolean
}) {
  const today = new Date()
  return (
    <Button
      disabled={disabled}
      onClick={() =>
        onClick(
          new CalendarDate(
            today.getFullYear(),
            today.getMonth() + 1,
            today.getDate(),
          ),
        )
      }
      variant={'ghost'}
      style={{ marginLeft: 16 }}
    >
      Today
    </Button>
  )
}

/**
 * The default header for the calendar components if no custom header is provided
 */
export function CalendarHeader({
  state,
  title,
  previousMonthDisabled,
  nextMonthDisabled,
  showYearPicker,
  setShowYearPicker,
}: {
  state: CalendarState | RangeCalendarState
  title: string
  previousMonthDisabled?: boolean
  nextMonthDisabled?: boolean
  showYearPicker: boolean
  setShowYearPicker: (showYearPicker: boolean) => void
}) {
  return (
    <HeaderWrapper>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Button
          variant={'ghost_icon'}
          aria-label={'Previous month'}
          disabled={previousMonthDisabled || showYearPicker}
          onClick={() => state.focusPreviousPage()}
        >
          <Icon data={chevron_left} />
        </Button>
        <span style={{ flex: '1 1 auto' }}></span>
        <Button
          onClick={() => setShowYearPicker(!showYearPicker)}
          data-testid={'heading'}
          aria-live={'polite'}
          variant={'ghost'}
          style={{
            fontSize: tokens.typography.heading.h5.fontSize,
            textTransform: 'capitalize',
          }}
        >
          {title}
          <Icon data={showYearPicker ? chevron_up : chevron_down} />
        </Button>
        <TodayPicker
          disabled={showYearPicker}
          onClick={(v: CalendarDate) => state.setFocusedDate(v)}
        />
        <span style={{ flex: '1 1 auto' }}></span>
        <Button
          variant={'ghost_icon'}
          onClick={() => state.focusNextPage()}
          disabled={nextMonthDisabled || showYearPicker}
          aria-label={'Next month'}
        >
          <Icon data={chevron_right} />
        </Button>
      </div>
    </HeaderWrapper>
  )
}
