import styled from 'styled-components'
import { CalendarState, RangeCalendarState } from '@react-stately/calendar'
import { Button, Icon, Typography } from '../../../index'
import {
  chevron_left,
  chevron_right,
  fast_forward,
  fast_rewind,
} from '@equinor/eds-icons'

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: capitalize;
`

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
        }}
      >
        <Button
          variant={'ghost_icon'}
          aria-label={'Previous year'}
          onClick={() => {
            const curr = state.focusedDate
            state.setFocusedDate(curr.subtract({ years: 1 }))
          }}
        >
          <Icon data={fast_rewind} />
        </Button>
        <Typography variant={'h5'} group={'heading'} data-testid={'heading'}>
          {title}
        </Typography>
        <Button
          variant={'ghost_icon'}
          aria-label={'Next year'}
          onClick={() => {
            const curr = state.focusedDate
            state.setFocusedDate(curr.add({ years: 1 }))
          }}
        >
          <Icon data={fast_forward} />
        </Button>
      </div>
      <div>
        <Button
          variant={'ghost_icon'}
          aria-label={'Previous month'}
          disabled={previousMonthDisabled}
          onClick={() => state.focusPreviousPage()}
        >
          <Icon data={chevron_left} />
        </Button>
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
