/* eslint-disable @typescript-eslint/unbound-method */
import styled from 'styled-components'
import { getMonth, getYear } from 'date-fns'
import { datePicker as tokens } from './DatePicker.tokens'
import { arrow_back, arrow_forward } from '@equinor/eds-icons'
import { typographyTemplate } from '@equinor/eds-utils'
import { Typography, Icon, Button } from '@equinor/eds-core-react'
import { ReactDatePickerCustomHeaderProps } from 'react-datepicker'

type PopupHeaderProps = ReactDatePickerCustomHeaderProps & {
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
        <HeaderTitle variant="body_short">
          {months[getMonth(date)]} {getYear(date)}
        </HeaderTitle>
        <TodayLabel variant="ghost" onClick={() => changeDate?.(new Date())}>
          Today
        </TodayLabel>
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

const Header = styled.div`
  padding: ${tokens.spacings.top} ${tokens.spacings.right};
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
  place-items: center;
  grid-auto-flow: column;
`

const IconButton = styled(Button)`
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

const HeaderTitle = styled(Typography)`
  ${typographyTemplate(tokens.entities.title.typography)}
`

const TodayLabel = styled(Button)`
  width: 100%;

  span {
    padding-left: 0 !important;
  }
`

export { PopupHeader }
