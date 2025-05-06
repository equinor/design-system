import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { DatePicker } from './DatePicker'
import userEvent from '@testing-library/user-event'
import { I18nProvider } from 'react-aria'
import { useState } from 'react'

describe('DatePicker', () => {
  it('Can render', () => {
    render(<DatePicker label={'Datepicker'} />)
    expect(screen.getByText('Datepicker')).toBeDefined()
  })

  it('Should pass a11y test', async () => {
    const { container } = render(<DatePicker label={'Datepicker'} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Should pass a11y test when disabled', async () => {
    const { container } = render(
      <DatePicker label={'Datepicker'} disabled={true} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Should be disabled', () => {
    render(<DatePicker label={'Datepicker'} disabled={true} />)
    expect(screen.getByText('dd')).toHaveAttribute('aria-disabled', 'true')
  })

  it('should be nullable from outside', async () => {
    const Comp = () => {
      const [date, setDate] = useState<Date | null>(new Date(2024, 4, 1))
      return (
        <I18nProvider locale="en-US">
          <button type={'button'} onClick={() => setDate(null)}>
            Reset
          </button>
          <DatePicker label={'Datepicker'} value={date} />
        </I18nProvider>
      )
    }
    render(<Comp />)
    expect(screen.getByRole('presentation')).toHaveTextContent('05/01/2024')
    await userEvent.click(screen.getByText('Reset'))
    expect(screen.getByRole('presentation')).toHaveTextContent('mm/dd/yyyy')
  })

  it('Should be possible to type', async () => {
    const onChange = jest.fn()

    render(
      <I18nProvider locale={'en-US'}>
        <DatePicker label={'Datepicker'} value={null} onChange={onChange} />
      </I18nProvider>,
    )
    const monthEl = screen.getByText('mm')
    const dayEl = screen.getByText('dd')
    const yearEl = screen.getByText('yyyy')
    await userEvent.type(monthEl, '12')
    expect(monthEl).toHaveTextContent('12')
    expect(monthEl).toHaveAttribute('aria-valuetext', '12 – December')
    // Expect focus to transition once a field is filled
    expect(dayEl).toHaveFocus()
    await userEvent.type(dayEl, '12')
    expect(dayEl).toHaveTextContent('12')
    expect(dayEl).toHaveAttribute('aria-valuetext', '12')
    await userEvent.type(yearEl, '2020')
    expect(yearEl).toHaveTextContent('2020')
    expect(yearEl).toHaveAttribute('aria-valuetext', '2020')
    // Is called 1 time per year, i.e [0002, 0020, 0202, 2020], so expect 4 calls in total
    expect(onChange).toHaveBeenCalledTimes(4)
  })

  it('Should be possible to pick a date from the calendar', async () => {
    const onChange = jest.fn()
    const date = new Date(2024, 4, 4)
    render(
      <I18nProvider locale={'en-US'}>
        <DatePicker label={'Datepicker'} value={date} onChange={onChange} />
      </I18nProvider>,
    )

    const picker = screen.getByLabelText(/^Change date.*/)
    expect(picker).toBeDefined()
    await userEvent.click(picker)
    expect(screen.getByText('May 2024')).toBeDefined()
    const highlighted = screen.getByRole('gridcell', { selected: true })
    expect(highlighted).toHaveTextContent('4')
    const firstDay = screen.getByLabelText('Wednesday, May 1, 2024')
    await userEvent.click(firstDay)
    expect(onChange).toHaveBeenCalled()
  })

  it('Should be possible to change month', async () => {
    const date = new Date(2024, 4, 4)
    render(
      <I18nProvider locale={'en-US'}>
        <DatePicker label={'Datepicker'} value={date} />
      </I18nProvider>,
    )

    const picker = screen.getByLabelText(/^Change date.*/)
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
    const date = new Date(2024, 4, 4)
    render(
      <I18nProvider locale={'en-US'}>
        <DatePicker label={'Datepicker'} value={date} />
      </I18nProvider>,
    )

    const picker = screen.getByLabelText(/^Change date.*/)
    await userEvent.click(picker)
    const header = screen.getByTestId('heading')
    expect(header).toHaveTextContent('May 2024')
    await userEvent.keyboard('{Shift>}{PageDown}{/Shift}')
    expect(header).toHaveTextContent('May 2025')
    await userEvent.keyboard('{Shift>}{PageUp}{PageUp}{/Shift}')
    expect(header).toHaveTextContent('May 2023')
  })

  it('should be possible to limit the min/max dates', async () => {
    const date = new Date(2024, 4, 4)
    const min = new Date(2024, 4, 2)
    const max = new Date(2024, 4, 29)
    render(
      <I18nProvider locale={'en-US'}>
        <DatePicker
          label={'Datepicker'}
          value={date}
          minValue={min}
          maxValue={max}
        />
      </I18nProvider>,
    )

    const picker = screen.getByLabelText(/^Change date.*/)
    await userEvent.click(picker)
    const header = screen.getByTestId('heading')
    expect(header).toHaveTextContent('May 2024')
    const disabledMinElement = screen.getByLabelText('Wednesday, May 1, 2024')
    const disabledMaxElement = screen.getByLabelText('Thursday, May 30, 2024')
    expect(disabledMinElement).toHaveAttribute('aria-disabled', 'true')
    expect(disabledMaxElement).toHaveAttribute('aria-disabled', 'true')
  })

  it('should be possible to limit specific days', async () => {
    const date = new Date(2024, 4, 4)

    render(
      <I18nProvider locale={'en-US'}>
        <DatePicker
          label={'Datepicker'}
          value={date}
          isDateUnavailable={(d) => d.getDate() === 30}
        />
      </I18nProvider>,
    )

    const picker = screen.getByLabelText(/^Change date.*/)
    await userEvent.click(picker)
    const header = screen.getByTestId('heading')
    expect(header).toHaveTextContent('May 2024')
    const disabledDate = screen.getByLabelText('Thursday, May 30, 2024')
    expect(disabledDate).toHaveAttribute('aria-disabled', 'true')
  })

  it('should be localized', () => {
    const date = new Date(2024, 4, 4)

    const { rerender } = render(
      <I18nProvider locale={'en-US'}>
        <DatePicker
          label={'Datepicker'}
          value={date}
          isDateUnavailable={(d) => d.getDate() === 31}
        />
      </I18nProvider>,
    )

    expect(screen.getByRole('presentation')).toHaveTextContent('05/04/2024')

    rerender(
      <I18nProvider locale={'no'}>
        <DatePicker
          label={'Datepicker'}
          value={date}
          isDateUnavailable={(d) => d.getDate() === 31}
        />
      </I18nProvider>,
    )

    expect(screen.getByRole('presentation')).toHaveTextContent('04.05.2024')

    rerender(
      <DatePicker
        locale={'no'}
        label={'Datepicker'}
        value={date}
        isDateUnavailable={(d) => d.getDate() === 31}
      />,
    )

    expect(screen.getByRole('presentation')).toHaveTextContent('04.05.2024')

    rerender(
      <I18nProvider locale={'zh-Hans-SG'}>
        <DatePicker
          label={'Datepicker'}
          value={date}
          isDateUnavailable={(d) => d.getDate() === 31}
        />
      </I18nProvider>,
    )

    expect(screen.getByRole('presentation')).toHaveTextContent('2024年05月04日')
  })
})
