import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { DatePicker } from './DatePicker'
import userEvent from '@testing-library/user-event'
import { I18nProvider } from 'react-aria'

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
})
