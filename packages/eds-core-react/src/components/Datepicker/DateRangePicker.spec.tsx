import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { DateRangePicker } from './DateRangePicker'
import { I18nProvider } from 'react-aria'
import { ReactNode } from 'react'
import userEvent from '@testing-library/user-event'
import { DatePicker } from './DatePicker'

const RangeContainer = ({ children }: { children: ReactNode }) => {
  return <I18nProvider locale={'en-US'}>{children}</I18nProvider>
}

describe('DateRangePicker', () => {
  it('Can render', () => {
    render(
      <RangeContainer>
        <DateRangePicker label={'DateRangePicker'} />
      </RangeContainer>,
    )
    expect(screen.getByText('DateRangePicker')).toBeDefined()
  })

  it('Should pass a11y test', async () => {
    const { container } = render(
      <RangeContainer>
        <DateRangePicker label={'DateRangePicker'} />
      </RangeContainer>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Should pass a11y test when disabled', async () => {
    const { container } = render(
      <DateRangePicker label={'DateRangePicker'} disabled={true} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Should be disabled', () => {
    render(<DateRangePicker label={'DateRangePicker'} disabled={true} />)
    expect(screen.getAllByText('dd').at(0)).toHaveAttribute(
      'aria-disabled',
      'true',
    )
  })

  it('Should be possible to pick a date-range from the calendar', async () => {
    const onChange = jest.fn()
    const date = {
      from: new Date(2024, 4, 4),
      to: new Date(2024, 4, 6),
    }
    render(
      <I18nProvider locale={'en-US'}>
        <DateRangePicker
          label={'Datepicker'}
          value={date}
          onChange={onChange}
        />
      </I18nProvider>,
    )

    const picker = screen.getByLabelText('Toggle calendar')
    expect(picker).toBeDefined()
    await userEvent.click(picker)
    expect(screen.getByText('May 2024')).toBeDefined()
    const highlighted = screen.getAllByRole('gridcell', { selected: true })
    highlighted.forEach((cell, i) => {
      expect(cell).toHaveTextContent(`${i + 4}`)
    })
    const fromDay = screen.getByLabelText('Wednesday, May 1, 2024')
    await userEvent.click(fromDay)
    const toDay = screen.getByLabelText('Thursday, May 2, 2024')
    await userEvent.click(toDay)
    expect(onChange).toHaveBeenCalledWith({
      from: new Date(2024, 4, 1),
      to: new Date(2024, 4, 2),
    })
  })

  it('Should be possible to change month', async () => {
    const date = {
      from: new Date(2024, 4, 4),
      to: new Date(2024, 4, 6),
    }
    render(
      <I18nProvider locale={'en-US'}>
        <DateRangePicker label={'Datepicker'} value={date} />
      </I18nProvider>,
    )

    const picker = screen.getByLabelText('Toggle calendar')
    await userEvent.click(picker)
    const header = screen.getByTestId('heading')
    expect(header).toHaveTextContent('May 2024')
    const nextMonth = screen.getByLabelText('Next month')
    await userEvent.click(nextMonth)
    expect(header).toHaveTextContent('June 2024')
    const previousMonth = screen.getByLabelText('Previous month')
    await userEvent.click(previousMonth)
    await userEvent.click(previousMonth)
    expect(header).toHaveTextContent('April 2024')
  })

  it('Should be possible to change year', async () => {
    const date = {
      from: new Date(2024, 4, 4),
      to: new Date(2024, 4, 6),
    }
    render(
      <I18nProvider locale={'en-US'}>
        <DateRangePicker label={'Datepicker'} value={date} />
      </I18nProvider>,
    )

    const picker = screen.getByLabelText('Toggle calendar')
    await userEvent.click(picker)
    const header = screen.getByTestId('heading')
    expect(header).toHaveTextContent('May 2024')
    const nextYear = screen.getByLabelText('Next year')
    await userEvent.click(nextYear)
    expect(header).toHaveTextContent('May 2025')
    const previousYear = screen.getByLabelText('Previous year')
    await userEvent.click(previousYear)
    await userEvent.click(previousYear)
    expect(header).toHaveTextContent('May 2023')
  })

  it('should be possible to limit the min/max dates', async () => {
    const date = {
      from: new Date(2024, 4, 4),
      to: new Date(2024, 4, 6),
    }
    const min = new Date(2024, 4, 2)
    const max = new Date(2024, 4, 30)
    render(
      <I18nProvider locale={'en-US'}>
        <DateRangePicker
          label={'Datepicker'}
          value={date}
          minValue={min}
          maxValue={max}
        />
      </I18nProvider>,
    )

    const picker = screen.getByLabelText('Toggle calendar')
    await userEvent.click(picker)
    const header = screen.getByTestId('heading')
    expect(header).toHaveTextContent('May 2024')
    const disabledMinElement = screen.getByLabelText('Wednesday, May 1, 2024')
    const disabledMaxElement = screen.getByLabelText('Friday, May 31, 2024')
    expect(disabledMinElement).toHaveAttribute('aria-disabled', 'true')
    expect(disabledMaxElement).toHaveAttribute('aria-disabled', 'true')
  })

  it('should be possible to limit specific days', async () => {
    const date = {
      from: new Date(2024, 4, 4),
      to: new Date(2024, 4, 6),
    }

    render(
      <I18nProvider locale={'en-US'}>
        <DateRangePicker
          label={'Datepicker'}
          value={date}
          isDateUnavailable={(d) => d.getDate() === 31}
        />
      </I18nProvider>,
    )

    const picker = screen.getByLabelText('Toggle calendar')
    await userEvent.click(picker)
    const header = screen.getByTestId('heading')
    expect(header).toHaveTextContent('May 2024')
    const disabledDate = screen.getByLabelText('Friday, May 31, 2024')
    expect(disabledDate).toHaveAttribute('aria-disabled', 'true')
  })
})
