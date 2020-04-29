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
  it('Updates output according to value change', () => {})
  it('Can format the output if a formatting function is provided', () => {})
  it('Sets the aria label', () => {})
})
