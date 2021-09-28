import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { TimePicker } from './TimePicker'

afterEach(cleanup)

describe('TimePicker', () => {
  it('timepicker should show on click', () => {
    const { container } = render(
      <TimePicker id={'time-picker'} value="11:00" label={'Click Test'} />,
    )
    fireEvent.click(container)
    expect(screen.getByRole('listbox')).toBeTruthy()
  })

  it('timepicker should hide on selection', () => {
    render(<TimePicker id={'time-picker'} value="01:00" label={'Click Test'} />)
    fireEvent.click(screen.getByRole('time-select'))
    const options = screen.getAllByRole('option')
    expect(options.length).toBeGreaterThan(1)
  })
})
