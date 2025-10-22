/* eslint-disable no-undef */
import { render, fireEvent, screen } from '@testing-library/react'
import { TextField } from '.'

describe('TextField onChange typing', () => {
  it('Should properly type onChange event for single-line TextField', () => {
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

  it('Should properly type onChange event for multiline TextField', () => {
    let capturedValue = ''

    render(
      <TextField
        id="test-multiline-onchange"
        label="Test Multiline"
        multiline
        onChange={(event) => {
          // This should work without manual typing
          // event.target.value should be properly typed as string
          capturedValue = event.target.value
        }}
      />,
    )

    const textarea = screen.getByLabelText('Test Multiline')
    fireEvent.change(textarea, { target: { value: 'multiline value' } })

    expect(capturedValue).toBe('multiline value')
  })
})
