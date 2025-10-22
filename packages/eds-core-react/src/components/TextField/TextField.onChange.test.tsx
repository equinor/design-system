/* eslint-disable no-undef */
import { render, fireEvent, screen } from '@testing-library/react'
import { TextField } from '.'

describe('TextField onChange typing', () => {
  it('Should properly type onChange event for TextField', () => {
    let capturedValue = ''

    render(
      <TextField
        id="test-onchange"
        label="Test"
        onChange={(event) => {
          // This should work without manual typing
          // event.target.value should be properly typed as string
          capturedValue = event.target.value
        }}
      />,
    )

    const input = screen.getByLabelText('Test')
    fireEvent.change(input, { target: { value: 'test value' } })

    expect(capturedValue).toBe('test value')
  })
})
