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

  describe('Bug #4477: typing "3" in day field', () => {
    it('should NOT auto-advance focus after typing "3" in day field (en-US)', async () => {
      render(
        <I18nProvider locale={'en-US'}>
          <DatePicker label={'Datepicker'} value={null} />
        </I18nProvider>,
      )
      const dayEl = screen.getByText('dd')
      await userEvent.click(dayEl)
      await userEvent.keyboard('3')
      // Focus should stay on day field — "30" and "31" are still valid
      expect(dayEl).toHaveFocus()
    })

    it('should NOT auto-advance focus after typing "3" in day field (no)', async () => {
      render(
        <I18nProvider locale={'no'}>
          <DatePicker label={'Datepicker'} value={null} />
        </I18nProvider>,
      )
      const dayEl = screen.getByText('dd')
      await userEvent.click(dayEl)
      await userEvent.keyboard('3')
      expect(dayEl).toHaveFocus()
    })

    it('should allow typing "31" in day field from empty state (en-US)', async () => {
      render(
        <I18nProvider locale={'en-US'}>
          <DatePicker label={'Datepicker'} value={null} />
        </I18nProvider>,
      )
      const dayEl = screen.getByText('dd')
      await userEvent.click(dayEl)
      await userEvent.keyboard('31')
      expect(dayEl).toHaveAttribute('aria-valuetext', '31')
    })

    it('should allow typing "31" in day field from empty state (no)', async () => {
      render(
        <I18nProvider locale={'no'}>
          <DatePicker label={'Datepicker'} value={null} />
        </I18nProvider>,
      )
      const dayEl = screen.getByText('dd')
      await userEvent.click(dayEl)
      await userEvent.keyboard('31')
      expect(dayEl).toHaveAttribute('aria-valuetext', '31')
    })

    it('should have valuemax 31 for day field when no date is selected (en-US)', () => {
      render(
        <I18nProvider locale={'en-US'}>
          <DatePicker label={'Datepicker'} value={null} />
        </I18nProvider>,
      )
      const dayEl = screen.getByText('dd')
      expect(dayEl).toHaveAttribute('aria-valuemax', '31')
    })

    it('should have valuemax 31 for day field when no date is selected (no)', () => {
      render(
        <I18nProvider locale={'no'}>
          <DatePicker label={'Datepicker'} value={null} />
        </I18nProvider>,
      )
      const dayEl = screen.getByText('dd')
      expect(dayEl).toHaveAttribute('aria-valuemax', '31')
    })
  })

  it('should display validation errors in the configured locale', () => {
    const maxDate = new Date(2024, 0, 1)
    const outOfRangeDate = new Date(2024, 5, 15)

    const { container, rerender } = render(
      <I18nProvider locale={'en-US'}>
        <DatePicker
          label={'Datepicker'}
          value={outOfRangeDate}
          maxValue={maxDate}
        />
      </I18nProvider>,
    )

    // English: "Value must be ... or earlier."
    expect(container.textContent).toMatch(/Value must be/)

    rerender(
      <I18nProvider locale={'nb-NO'}>
        <DatePicker
          label={'Datepicker'}
          value={outOfRangeDate}
          maxValue={maxDate}
        />
      </I18nProvider>,
    )

    // Norwegian: "Verdien må være ... eller tidligere."
    expect(container.textContent).toMatch(/Verdien/)
  })

  it('should display localized rangeUnderflow message', () => {
    const minDate = new Date(2024, 11, 31)
    const tooEarlyDate = new Date(2024, 0, 1)

    const { container } = render(
      <I18nProvider locale={'nb-NO'}>
        <DatePicker
          label={'Datepicker'}
          value={tooEarlyDate}
          minValue={minDate}
        />
      </I18nProvider>,
    )

    // Norwegian: "Verdien må være ... eller senere."
    expect(container.textContent).toMatch(/Verdien/)
  })

  it('should display the date in the provided timezone, not the local timezone (bug #4390)', () => {
    // 2025-01-21 11:00 UTC = 2025-01-22 00:00 in Pacific/Auckland (NZDT, UTC+13)
    // Without the fix, the formatter uses browser/Node timezone (UTC) and displays Jan 21.
    const date = new Date('2025-01-21T11:00:00Z')
    render(
      <I18nProvider locale={'en-US'}>
        <DatePicker
          label={'Datepicker'}
          value={date}
          timezone={'Pacific/Auckland'}
        />
      </I18nProvider>,
    )
    expect(screen.getByRole('presentation')).toHaveTextContent('01/22/2025')
  })

  describe('Today button (#4933)', () => {
    // Use a date well in the future so these tests remain valid regardless of when they run
    const futureYear = new Date().getFullYear() + 2

    it('selects today when the calendar is showing a past month', async () => {
      const onChange = jest.fn<void, [Date]>()
      render(
        <I18nProvider locale={'en-US'}>
          <DatePicker
            label={'Datepicker'}
            value={new Date(2020, 0, 1)}
            onChange={onChange}
          />
        </I18nProvider>,
      )

      await userEvent.click(screen.getByLabelText(/^Change date.*/))
      await userEvent.click(screen.getByText('Today'))

      expect(onChange).toHaveBeenCalledTimes(1)
      const result = onChange.mock.calls[0][0]
      const today = new Date()
      expect(result.getFullYear()).toBe(today.getFullYear())
      expect(result.getMonth()).toBe(today.getMonth())
      expect(result.getDate()).toBe(today.getDate())
    })

    it('selects today when the calendar is showing a future month (bug #4933)', async () => {
      // today < startDate caused react-stately's selectDate to bail out silently
      const onChange = jest.fn<void, [Date]>()
      render(
        <I18nProvider locale={'en-US'}>
          <DatePicker
            label={'Datepicker'}
            value={new Date(futureYear, 0, 1)}
            onChange={onChange}
          />
        </I18nProvider>,
      )

      await userEvent.click(screen.getByLabelText(/^Change date.*/))

      // Heading should show the future year before clicking Today
      expect(screen.getByTestId('heading')).toHaveTextContent(
        String(futureYear),
      )

      await userEvent.click(screen.getByText('Today'))

      // Heading should navigate back to current month
      const now = new Date()
      expect(screen.getByTestId('heading')).toHaveTextContent(
        String(now.getFullYear()),
      )

      expect(onChange).toHaveBeenCalledTimes(1)
      const result = onChange.mock.calls[0][0]
      const today = new Date()
      expect(result.getFullYear()).toBe(today.getFullYear())
      expect(result.getMonth()).toBe(today.getMonth())
      expect(result.getDate()).toBe(today.getDate())
    })

    it('fires onChange on repeated clicks without closing the picker', async () => {
      const onChange = jest.fn()
      render(
        <I18nProvider locale={'en-US'}>
          <DatePicker
            label={'Datepicker'}
            value={new Date(2020, 0, 1)}
            onChange={onChange}
          />
        </I18nProvider>,
      )

      await userEvent.click(screen.getByLabelText(/^Change date.*/))
      await userEvent.click(screen.getByText('Today'))
      expect(onChange).toHaveBeenCalledTimes(1)
      await userEvent.click(screen.getByText('Today'))
      expect(onChange).toHaveBeenCalledTimes(2)
    })

    it('does not fire onChange when today is before minValue', async () => {
      const onChange = jest.fn()
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      render(
        <I18nProvider locale={'en-US'}>
          <DatePicker
            label={'Datepicker'}
            value={new Date(futureYear, 0, 1)}
            minValue={tomorrow}
            onChange={onChange}
          />
        </I18nProvider>,
      )

      await userEvent.click(screen.getByLabelText(/^Change date.*/))
      expect(screen.getByText('Today').closest('button')).toBeDisabled()
      // Disabled button — click does nothing
      await userEvent.click(screen.getByText('Today'))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('does not fire onChange when today is unavailable', async () => {
      const onChange = jest.fn()
      render(
        <I18nProvider locale={'en-US'}>
          <DatePicker
            label={'Datepicker'}
            value={new Date(futureYear, 0, 1)}
            isDateUnavailable={(d) => {
              const today = new Date()
              return (
                d.getFullYear() === today.getFullYear() &&
                d.getMonth() === today.getMonth() &&
                d.getDate() === today.getDate()
              )
            }}
            onChange={onChange}
          />
        </I18nProvider>,
      )

      await userEvent.click(screen.getByLabelText(/^Change date.*/))
      expect(screen.getByText('Today').closest('button')).toBeDisabled()
      await userEvent.click(screen.getByText('Today'))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('preserves the existing time when showTimeInput is active', async () => {
      const onChange = jest.fn<void, [Date]>()
      // 14:30 should survive clicking Today
      const valueWithTime = new Date(futureYear, 0, 1, 14, 30)
      render(
        <I18nProvider locale={'en-US'}>
          <DatePicker
            label={'Datepicker'}
            showTimeInput
            value={valueWithTime}
            onChange={onChange}
          />
        </I18nProvider>,
      )

      await userEvent.click(screen.getByLabelText(/^Change date.*/))
      await userEvent.click(screen.getByText('Today'))

      expect(onChange).toHaveBeenCalledTimes(1)
      const result = onChange.mock.calls[0][0]
      expect(result.getHours()).toBe(14)
      expect(result.getMinutes()).toBe(30)
    })
  })

  it('should display localized message for unavailable dates', () => {
    const unavailableDate = new Date(2024, 4, 30)

    const { container } = render(
      <I18nProvider locale={'nb-NO'}>
        <DatePicker
          label={'Datepicker'}
          value={unavailableDate}
          isDateUnavailable={(d) => d.getDate() === 30}
        />
      </I18nProvider>,
    )

    // Norwegian: "Valgt dato utilgjengelig."
    expect(container.textContent).toMatch(/utilgjengelig/)
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
