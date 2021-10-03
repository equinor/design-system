import React from 'react'
import styled from 'styled-components'
import { getMonth, getYear } from 'date-fns'
import { datePicker as tokens } from './DatePicker.tokens'
import { Icon, Typography } from '../../'
import { arrow_back, arrow_forward } from '@equinor/eds-icons'
import { typographyTemplate } from '../../utils'

interface PopupHeaderProps {
  monthDate: Date
  date: Date
  changeYear: (year: number) => void
  changeMonth: (month: number) => void
  customHeaderCount: number
  decreaseMonth: VoidFunction
  increaseMonth: VoidFunction
  prevMonthButtonDisabled: boolean
  nextMonthButtonDisabled: boolean
  decreaseYear: VoidFunction
  increaseYear: VoidFunction
  prevYearButtonDisabled: boolean
  nextYearButtonDisabled: boolean
  changeDate?: (date: Date) => void
}

const PopupHeader: React.FC<PopupHeaderProps> = ({
  date,
  changeDate,
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

  return (
    <Header>
      <IconButton
        onClick={(event: React.MouseEvent) => {
          event.preventDefault()
          event.stopPropagation()
          decreaseMonth()
        }}
        disabled={prevMonthButtonDisabled}
      >
        <Icon size={16} data={arrow_back} />
      </IconButton>
      <HeaderTitle variant="body_short">
        {months[getMonth(date)]} {getYear(date)}
      </HeaderTitle>
      <TodayLabel variant="body_short" onClick={() => changeDate?.(new Date())}>
        Today
      </TodayLabel>
      <IconButton
        onClick={(event: React.MouseEvent) => {
          event.preventDefault()
          event.stopPropagation()
          increaseMonth()
        }}
        disabled={nextMonthButtonDisabled}
      >
        <Icon size={16} data={arrow_forward} onClick={increaseMonth} />
      </IconButton>
    </Header>
  )
}

const Header = styled.div`
  padding: 24px 20px;
  width: 100%;
  max-width: ${tokens.width};
  display: grid;
  grid-template-columns: 20px auto auto 20px;
  align-items: center;
  column-gap: 16px;
  box-sizing: border-box;
`

const IconButton = styled.button`
  padding: 0;
  margin: 0;
  width: 20px;
  height: 20px;
  line-height: 0;
  text-align: center;
  color: ${tokens.colors.green100};
  background-color: ${tokens.background};
  border: none;
`

const HeaderTitle = styled(Typography)`
  ${typographyTemplate(tokens.entities.title.typography)}
`

const TodayLabel = styled(Typography)`
  ${typographyTemplate(tokens.entities.button.typography)}
  text-align: right;
  cursor: pointer;
  color: ${tokens.colors.green100};
`

export { PopupHeader }
