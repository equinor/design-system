/* eslint-disable no-undef */
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { Slider } from './Slider'
import type { SliderProps } from './Slider'

const getUnixTime = (iso: string) => {
  return new Date(iso).getTime()
}

const DateSlider = ({
  value,
  ariaLabelledby = 'date-range-slider',
}: SliderProps) => {
  function outputFunction(val: number) {
    const date = new Date(val)
    // The test node server doesn't have full i18n capabilities, using english is the easiest
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
      aria-labelledby={ariaLabelledby}
      step={60 * 60 * 24 * 1000}
      value={value}
      outputFunction={outputFunction}
    />
  )
}

describe('Simple slider', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      <Slider value={0} aria-labelledby="test-one" id="test" />,
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(
      <>
        <span id="a11y-test">Text</span>
        <Slider value={40} aria-labelledby="a11y-test" />
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Creates a simple slider when providing a number as value', () => {
    render(<Slider value={0} aria-labelledby="test-one" />)
    const input = screen.getByRole('slider')

    expect(input).toBeDefined()
  })
  it('Sets the aria label', () => {
    render(<Slider value={5} aria-labelledby="test-label" />)
    const input = screen.getByRole('slider')
    expect(input).toHaveAttribute('aria-labelledby', 'test-label')
  })
  it('Can set min, max and step values', () => {
    render(
      <Slider
        value={5}
        min={4}
        max={10}
        step={2}
        aria-labelledby="test-minmax"
      />,
    )
    const input = screen.getByRole('slider')
    expect(input).toHaveAttribute('min', '4')
    expect(input).toHaveAttribute('max', '10')
    expect(input).toHaveAttribute('step', '2')
  })
  it('Updates output according to value change', () => {
    const handleChange = jest.fn()
    render(
      <Slider value={5} aria-labelledby="test-value" onChange={handleChange} />,
    )
    const input = screen.getByRole('slider')
    const outputValue = screen.getByRole('status')
    expect(outputValue).toHaveTextContent('5')
    fireEvent.change(input, { target: { value: '6' } })
    expect(outputValue).toHaveTextContent('6')
    expect(handleChange).toHaveBeenCalledTimes(1)
  })
  it('Can format the output if a formatting function is provided', () => {
    render(
      <DateSlider
        value={getUnixTime('2020-01-01')}
        aria-labelledby="date-test"
      />,
    )
    const input = screen.getByRole('slider')
    const outputValue = screen.getByRole('status')
    expect(outputValue).toHaveTextContent('Wednesday, January 1, 2020')
    expect(outputValue).not.toHaveTextContent('getUnixTime')
    expect(input).toHaveValue(getUnixTime('2020-01-01').toString())
  })
  it('Has minimum and maximum values as default', () => {
    const { container } = render(
      <Slider value={5} aria-labelledby="test-default" min={0} max={100} />,
    )
    expect(container).toHaveTextContent('0')
    expect(container).toHaveTextContent('100')
  })
  it('It is possible to turn off minimum and maximum values', () => {
    const { container } = render(
      <Slider
        value={5}
        aria-labelledby="test-default-off"
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
    render(<Slider value={[0, 20]} aria-labelledby="test-array" />)
    const inputs = screen.queryAllByRole('slider')
    expect(inputs).toHaveLength(2)
  })
  it('Can set min, max and step values', () => {
    render(
      <Slider
        value={[5, 6]}
        min={4}
        max={10}
        step={2}
        aria-labelledby="test-range-minmax"
      />,
    )
    const input = screen.getAllByRole('slider')[1]
    expect(input).toHaveAttribute('min', '4')
    expect(input).toHaveAttribute('max', '10')
    expect(input).toHaveAttribute('step', '2')
  })
  it('Updates output according to value change', () => {
    const handleChange = jest.fn()
    const ariaId = 'test-rangechange'
    render(
      <Slider
        value={[3, 6]}
        aria-labelledby={ariaId}
        onChange={handleChange}
      />,
    )

    const inputA = screen.getAllByRole('slider')[0]
    const inputB = screen.getAllByRole('slider')[1]
    const outputA = screen.getAllByRole('status')[0]
    const outputB = screen.getAllByRole('status')[1]

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
    const ariaId = 'test-output-formatting'
    render(
      <DateSlider
        value={[getUnixTime('2020-01-01'), getUnixTime('2020-01-31')]}
        aria-labelledby={ariaId}
      />,
    )
    const inputA = screen.getAllByRole('slider')[0]
    const inputB = screen.getAllByRole('slider')[1]
    const outputA = screen.getAllByRole('status')[0]
    const outputB = screen.getAllByRole('status')[1]

    expect(outputA).toHaveTextContent('Wednesday, January 1, 2020')
    expect(outputA).not.toHaveTextContent('getUnixTime')
    expect(outputB).toHaveTextContent('Friday, January 31, 2020')
    expect(outputB).not.toHaveTextContent('getUnixTime')
    expect(inputA).toHaveValue(getUnixTime('2020-01-01').toString())
    expect(inputB).toHaveValue(getUnixTime('2020-01-31').toString())
  })

  it('Sets the aria label', () => {
    render(<Slider value={[2, 4]} aria-labelledby="test-rangelabel" />)
    const wrapper = screen.getByRole('group')
    expect(wrapper).toHaveAttribute('aria-labelledby', 'test-rangelabel')
  })
  it('Has minimum and maximum values as default', () => {
    const { container } = render(
      <Slider
        value={[2, 4]}
        aria-labelledby="test-rangedefault"
        min={0}
        max={100}
      />,
    )
    expect(container).toHaveTextContent('0')
    expect(container).toHaveTextContent('100')
  })
  it('It is possible to turn off minimum and maximum values', () => {
    const { container } = render(
      <Slider
        value={[2, 4]}
        aria-labelledby="test-range-minmaxoff"
        min={0}
        max={100}
        minMaxValues={false}
      />,
    )
    expect(container).not.toHaveTextContent('0')
    expect(container).not.toHaveTextContent('100')
  })
})
