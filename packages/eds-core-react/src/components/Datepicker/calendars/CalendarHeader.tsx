import styled from 'styled-components'
import { CalendarState, RangeCalendarState } from '@react-stately/calendar'
import { Button } from '../../Button'
import { Icon } from '../../Icon'
import {
  chevron_down,
  chevron_left,
  chevron_right,
  chevron_up,
} from '@equinor/eds-icons'
import { CalendarDate, today } from '@internationalized/date'
import { tokens } from '@equinor/eds-tokens'
import { Dispatch, SetStateAction } from 'react'
import { getPageYears } from '../utils/getPageYears'
import { useTimezone } from '../utils/context'

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
  onClick: () => void
  disabled: boolean
}) {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant={'ghost'}
      style={{ marginLeft: 4 }}
    >
      Today
    </Button>
  )
}

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

const TitleButton = styled(Button)`
  min-width: 13.1rem;
  white-space: nowrap;
  font-size: ${tokens.typography.heading.h5.fontSize};
  text-transform: capitalize;
  & > span {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
`

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
  setYearPickerPage,
  yearPickerPage,
  onSelectToday,
}: {
  state: CalendarState | RangeCalendarState
  title: string
  previousMonthDisabled?: boolean
  nextMonthDisabled?: boolean
  showYearPicker: boolean
  setShowYearPicker: (showYearPicker: boolean) => void
  setYearPickerPage?: Dispatch<SetStateAction<number>>
  yearPickerPage: number
  /** Called when the Today button is clicked. Only provided by DatePicker, not DateRangePicker. */
  onSelectToday?: (date: CalendarDate) => void
}) {
  const timezone = useTimezone()
  const todayDate = today(timezone)

  const years = getPageYears(state.focusedDate.year, yearPickerPage)
  const backButtonDisabled =
    showYearPicker && state.minValue
      ? years[0] < state.minValue.year
      : previousMonthDisabled

  const nextButtonDisabled =
    showYearPicker && state.maxValue
      ? years[years.length - 1] > state.maxValue.year
      : nextMonthDisabled

  const isTodayDisabled = showYearPicker

  return (
    <HeaderWrapper>
      <HeaderActions>
        <Button
          variant={'ghost_icon'}
          aria-label={'Previous month'}
          disabled={backButtonDisabled}
          onClick={() =>
            showYearPicker
              ? setYearPickerPage((page) => page - 1)
              : state.focusPreviousPage()
          }
        >
          <Icon data={chevron_left} />
        </Button>
        <span style={{ flex: '1 1 auto' }}></span>
        <TitleButton
          onClick={() => setShowYearPicker(!showYearPicker)}
          data-testid={'heading'}
          aria-live={'polite'}
          variant={'ghost'}
        >
          {title}
          <Icon data={showYearPicker ? chevron_up : chevron_down} />
        </TitleButton>
        <TodayPicker
          disabled={isTodayDisabled}
          onClick={() => {
            if (onSelectToday) {
              onSelectToday(todayDate)
            }
            state.setFocusedDate(todayDate)
          }}
        />
        <span style={{ flex: '1 1 auto' }}></span>
        <Button
          variant={'ghost_icon'}
          onClick={() =>
            showYearPicker
              ? setYearPickerPage((page) => page + 1)
              : state.focusNextPage()
          }
          disabled={nextButtonDisabled}
          aria-label={'Next month'}
        >
          <Icon data={chevron_right} />
        </Button>
      </HeaderActions>
    </HeaderWrapper>
  )
}
