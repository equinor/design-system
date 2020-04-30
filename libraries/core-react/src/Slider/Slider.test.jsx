/* eslint-disable no-undef */

import React from 'react'
import PropTypes from 'prop-types'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Slider } from './Slider'

afterEach(cleanup)

const getUnixTime = (iso) => {
  return new Date(iso).getTime()
}

const DateSlider = ({ value, ariaLabelledby = 'date-range-slider' }) => {
  function outputFunction(val) {
    const date = new Date(parseInt(val, 10))
    // The test node server doesn't have full i11y capabilities, using english is the easiest
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Slider
      min={getUnixTime('2020-01-01')}
      max={getUnixTime('2020-01-31')}
      ariaLabelledby={ariaLabelledby}
      step={60 * 60 * 24 * 1000}
      value={value}
      outputFunction={outputFunction}
    />
  )
}
DateSlider.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.array]).isRequired,
  ariaLabelledby: PropTypes.string,
}

describe('Simple slider', () => {
  it('Creates a simple slider when providing a number as value', () => {
    render(<Slider value={0} ariaLabelledby="test" />)
    // Illogical use of textbox as role, but role slider is  reserved for the thumb anyway
    const input = screen.getAllByRole('textbox', { name: 'test' })
    expect(input).toHaveLength(1)
  })
  it('Sets the aria label', () => {
    const { container } = render(<Slider value={5} ariaLabelledby="test" />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('aria-labelledby', 'test')
  })
  it('Can set min, max and step values', () => {
    render(<Slider value={5} min={4} max={10} step={2} ariaLabelledby="test" />)
    const input = screen.getByRole('textbox', { name: 'test' })
    expect(input).toHaveAttribute('min', '4')
    expect(input).toHaveAttribute('max', '10')
    expect(input).toHaveAttribute('step', '2')
  })
  it('Updates output according to value change', () => {
    const handleChange = jest.fn()
    const { container } = render(
      <Slider value={5} ariaLabelledby="test" onChange={handleChange} />,
    )
    const input = screen.getByRole('textbox', { name: 'test' })
    const outputValue = container.querySelector('output')
    expect(outputValue).toHaveTextContent('5')
    fireEvent.change(input, { target: { value: '6' } })
    expect(outputValue).toHaveTextContent('6')
    expect(handleChange).toHaveBeenCalledTimes(1)
  })
  it('Can format the output if a formatting function is provided', () => {
    const { container } = render(
      <DateSlider value={getUnixTime('2020-01-01')} />,
    )
    const outputValue = container.querySelector('output')
    const input = screen.getByRole('textbox', { name: 'test' })
    expect(outputValue).toHaveTextContent('Wednesday, January 1, 2020')
    expect(outputValue).not.toHaveTextContent(getUnixTime('2020-01-01'))
    expect(input).toHaveValue(getUnixTime('2020-01-01').toString())
  })
  it('Has minimum and maximum values as default', () => {
    const { container } = render(
      <Slider value={5} ariaLabelledby="test" min={0} max={100} />,
    )
    expect(container).toHaveTextContent('0')
    expect(container).toHaveTextContent('100')
  })
  it('It is possible to turn off minimum and maximum values', () => {
    const { container } = render(
      <Slider
        value={5}
        ariaLabelledby="test"
        min={0}
        max={100}
        minMaxValues={false}
      />,
    )
    expect(container).not.toHaveTextContent('0')
    expect(container).not.toHaveTextContent('100')
  })
})

describe('Range slider', () => {
  it('Creates a range slider when providing an array as value', () => {
    const { container } = render(
      <Slider value={[0, 20]} ariaLabelledby="test" />,
    )
    const inputs = container.querySelectorAll('input')
    expect(inputs).toHaveLength(2)
  })
  it('Can set min, max and step values', () => {
    const { container } = render(
      <Slider value={[5, 6]} min={4} max={10} step={2} ariaLabelledby="test" />,
    )
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('min', '4')
    expect(input).toHaveAttribute('max', '10')
    expect(input).toHaveAttribute('step', '2')
  })
  it('Updates output according to value change', () => {
    const handleChange = jest.fn()
    const ariaId = 'test'
    const { container } = render(
      <Slider value={[3, 6]} ariaLabelledby={ariaId} onChange={handleChange} />,
    )
    // Relies to much on implementation details
    const inputA = container.querySelector(`#${ariaId}-thumb-a`)
    const inputB = container.querySelector(`#${ariaId}-thumb-b`)
    const outputA = container.querySelector(`output[for="${ariaId}-thumb-a"]`)
    const outputB = container.querySelector(`output[for="${ariaId}-thumb-b"]`)
    expect(outputA).toHaveTextContent('3')
    expect(outputB).toHaveTextContent('6')
    fireEvent.change(inputA, { target: { value: '4' } })
    expect(outputA).toHaveTextContent('4')
    expect(handleChange).toHaveBeenCalledTimes(1)
    fireEvent.change(inputB, { target: { value: '7' } })
    expect(outputB).toHaveTextContent('7')
    expect(handleChange).toHaveBeenCalledTimes(2)
  })
  it('Can format the output if a formatting function is provided', () => {
    const ariaId = 'test'
    const { container } = render(
      <DateSlider
        value={[getUnixTime('2020-01-01'), getUnixTime('2020-01-31')]}
        ariaLabelledby={ariaId}
      />,
    )
    const outputA = container.querySelector(`output[for="${ariaId}-thumb-a"]`)
    const outputB = container.querySelector(`output[for="${ariaId}-thumb-b"]`)
    const inputA = container.querySelector(`#${ariaId}-thumb-a`)
    const inputB = container.querySelector(`#${ariaId}-thumb-b`)
    expect(outputA).toHaveTextContent('Wednesday, January 1, 2020')
    expect(outputA).not.toHaveTextContent(getUnixTime('2020-01-01'))
    expect(outputB).toHaveTextContent('Friday, January 31, 2020')
    expect(outputB).not.toHaveTextContent(getUnixTime('2020-01-01'))
    expect(inputA).toHaveValue(getUnixTime('2020-01-01').toString())
    expect(inputB).toHaveValue(getUnixTime('2020-01-31').toString())
  })

  it('Sets the aria label', () => {
    render(<Slider value={[2, 4]} ariaLabelledby="test" />)
    const wrapper = screen.getByRole('group')
    expect(wrapper).toHaveAttribute('aria-labelledby', 'test')
  })
  it('Has minimum and maximum values as default', () => {
    const { container } = render(
      <Slider value={[2, 4]} ariaLabelledby="test" min={0} max={100} />,
    )
    expect(container).toHaveTextContent('0')
    expect(container).toHaveTextContent('100')
  })
  it('It is possible to turn off minimum and maximum values', () => {
    const { container } = render(
      <Slider
        value={[2, 4]}
        ariaLabelledby="test"
        min={0}
        max={100}
        minMaxValues={false}
      />,
    )
    expect(container).not.toHaveTextContent('0')
    expect(container).not.toHaveTextContent('100')
  })
})
