/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components'
import { datePicker as tokens } from './DatePicker.tokens'
import { arrow_back, arrow_forward } from '@equinor/eds-icons'
import { Icon, Button, NativeSelect } from '@equinor/eds-core-react'
import { ReactDatePickerCustomHeaderProps } from 'react-datepicker'

const DatePickerSelectHeader: React.FC<ReactDatePickerCustomHeaderProps> = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const years: number[] = []
  for (let i = 1970; i < 2060; i++) {
    years.push(i)
  }

  return (
    <Header>
      <IconButton
        variant="ghost_icon"
        onClick={(event: React.MouseEvent) => {
          event.preventDefault()
          event.stopPropagation()
          decreaseMonth()
        }}
        disabled={prevMonthButtonDisabled}
      >
        <Icon data={arrow_back} />
      </IconButton>
      <HeaderControls>
        <YearSelect
          id="SelectHeaderYear"
          label=""
          name="year"
          onChange={({ target: { value } }) => changeYear(Number(value))}
          value={date.getFullYear()}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </YearSelect>
        <MonthSelect
          id="SelectHeaderMonth"
          label=""
          name="month"
          onChange={({ target: { value } }) => changeMonth(Number(value))}
          value={date.getMonth()}
        >
          {months.map((month, i) => (
            <option key={month} value={i}>
              {month}
            </option>
          ))}
        </MonthSelect>
      </HeaderControls>
      <IconButton
        variant="ghost_icon"
        onClick={(event: React.MouseEvent) => {
          event.preventDefault()
          event.stopPropagation()
          increaseMonth()
        }}
        disabled={nextMonthButtonDisabled}
      >
        <Icon data={arrow_forward} onClick={increaseMonth} />
      </IconButton>
    </Header>
  )
}

const MonthSelect = styled(NativeSelect as any)`
  select {
    max-width: 110px;
  }
`

const YearSelect = styled(NativeSelect as any)`
  select {
    max-width: 95px;
  }
`

const Header = styled.div`
  padding: ${tokens.spacings.top} calc(${tokens.spacings.right} / 2);
  width: 100%;
  max-width: ${tokens.width};
  display: grid;
  grid-template-columns: auto max-content auto;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`

const HeaderControls = styled.div`
  display: grid;
  gap: 2px;
  place-items: center;
  grid-auto-flow: column;
`

const IconButton = styled(Button as any)`
  padding: 0;
  margin: 0;
  line-height: 0;
  text-align: center;
  color: ${tokens.colors.green100};
  background-color: ${tokens.background};
  border: none;

  span {
    padding-left: 0 !important;
  }
`

export { DatePickerSelectHeader }
