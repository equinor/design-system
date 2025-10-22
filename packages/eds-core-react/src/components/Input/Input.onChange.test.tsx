/* eslint-disable no-undef */
import { render, fireEvent, screen } from '@testing-library/react'
import { Input } from './Input'

describe('Input onChange typing', () => {
  it('Should properly type onChange event for Input', () => {
    let capturedValue = ''

    render(
      <label>
        Test Input
        <Input
          onChange={(event) => {
            // This should work without manual typing
            // event.target.value should be properly typed as string
            capturedValue = event.target.value
          }}
        />
      </label>,
    )

    const input = screen.getByLabelText('Test Input')
    fireEvent.change(input, { target: { value: 'input value' } })

    expect(capturedValue).toBe('input value')
  })

  it('Should properly type onFocus event for Input', () => {
    let focusCalled = false

    render(
      <label>
        Test Focus
        <Input
          onFocus={(event) => {
            // This should work without manual typing
            // event should be properly typed as FocusEvent<HTMLInputElement>
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
