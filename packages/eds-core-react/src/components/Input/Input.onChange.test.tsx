/* eslint-disable no-undef */
import { render, fireEvent, screen } from '@testing-library/react'
import { Input } from './Input'

describe('Input onChange typing', () => {
  it('Allows onChange handler without manual event type annotation', () => {
    let capturedValue = ''

    render(
      <label>
        Test Input
        <Input
          onChange={(event) => {
            // TypeScript infers event type automatically
            capturedValue = event.target.value
          }}
        />
      </label>,
    )

    const input = screen.getByLabelText('Test Input')
    fireEvent.change(input, { target: { value: 'input value' } })

    expect(capturedValue).toBe('input value')
  })

  it('Allows onFocus handler without manual event type annotation', () => {
    let focusCalled = false

    render(
      <label>
        Test Focus
        <Input
          onFocus={(event) => {
            // TypeScript infers event type automatically
            focusCalled = true
            expect(event.target).toBeInstanceOf(HTMLInputElement)
          }}
        />
      </label>,
    )

    const input = screen.getByLabelText('Test Focus')
    fireEvent.focus(input)

    expect(focusCalled).toBe(true)
  })
})
