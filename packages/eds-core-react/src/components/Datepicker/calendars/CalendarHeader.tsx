import styled from 'styled-components'
import { CalendarState, RangeCalendarState } from '@react-stately/calendar'
import { Button, Icon, Typography } from '../../../index'
import { chevron_left, chevron_right } from '@equinor/eds-icons'
import { CalendarDate } from '@internationalized/date'

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: capitalize;
  width: 100%;
`

function TodayPicker({ onClick }: { onClick: (v: CalendarDate) => void }) {
  const today = new Date()
  return (
    <Button
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
}: {
  state: CalendarState | RangeCalendarState
  title: string
  previousMonthDisabled?: boolean
  nextMonthDisabled?: boolean
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
          disabled={previousMonthDisabled}
          onClick={() => state.focusPreviousPage()}
        >
          <Icon data={chevron_left} />
        </Button>
        <span style={{ flex: '1 1 auto' }}></span>
        <Typography
          variant={'h5'}
          group={'heading'}
          data-testid={'heading'}
          aria-live={'polite'}
        >
          {title}
        </Typography>
        <TodayPicker onClick={(v: CalendarDate) => state.setFocusedDate(v)} />
        <span style={{ flex: '1 1 auto' }}></span>
        <Button
          variant={'ghost_icon'}
          onClick={() => state.focusNextPage()}
          disabled={nextMonthDisabled}
          aria-label={'Next month'}
        >
          <Icon data={chevron_right} />
        </Button>
      </div>
    </HeaderWrapper>
  )
}
