/* eslint-disable no-undef */

import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Slider } from './Slider'

afterEach(cleanup)

describe('Slider', () => {
  it('Creates a simple slider when providing a number as value', () => {
    const { container } = render(<Slider value={5} ariaLabelledby="test" />)
    // So much for not testing implementation details... :/
    const inputs = container.querySelectorAll('input')
    expect(inputs).toHaveLength(1)
  })
  it('Creates a range slider when providing an array as value', () => {
    const { container } = render(
      <Slider value={[0, 20]} ariaLabelledby="test" />,
    )
    const inputs = container.querySelectorAll('input')
    expect(inputs).toHaveLength(2)
  })
  it('Can set min, max and step values', () => {
    const { container } = render(
      <Slider value={5} min={4} max={10} step={2} ariaLabelledby="test" />,
    )
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('min', '4')
    expect(input).toHaveAttribute('max', '10')
    expect(input).toHaveAttribute('step', '2')
  })
  it('Updates output according to value change', () => {
    const handleChange = jest.fn()
    const { container } = render(
      <Slider value={5} ariaLabelledby="test" onChange={handleChange} />,
    )
    const input = container.querySelector('input')
    const outputValue = container.querySelector('output')
    expect(outputValue).toHaveTextContent('5')
    fireEvent.change(input, { target: { value: '6' } })
    expect(outputValue).toHaveTextContent('6')
    expect(handleChange).toHaveBeenCalledTimes(1)
  })
  it('Can format the output if a formatting function is provided', () => {})
  it('Sets the aria label', () => {})
})
