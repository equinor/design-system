import { useState, ChangeEvent } from 'react'
import { Slider, SliderProps } from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import page from './Slider.docs.mdx'

export default {
  title: 'Inputs/Slider',
  component: Slider,
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Slider>

export const Introduction: Story<SliderProps> = (args) => {
  return (
    <div style={{ margin: '3rem' }}>
      <Slider {...args} />
    </div>
  )
}

export const SimpleSlider: Story<SliderProps> = () => (
  <>
    <span id="simple-slider">Slide me</span>
    <Slider value={4} min={0} max={10} aria-labelledby="simple-slider" />
  </>
)
SimpleSlider.storyName = 'Simple slider'
SimpleSlider.decorators = [
  (Story) => (
    <div style={{ margin: '3rem' }}>
      <Story />
    </div>
  ),
]

export const SimpleSliderWithSteps: Story<SliderProps> = () => {
  return (
    <>
      <span id="even-simpler-slider">
        Simple slider, no dots, no min or max values, steps of 10
      </span>
      <Slider
        aria-labelledby="even-simpler-slider"
        value={50}
        step={10}
        minMaxDots={false}
        minMaxValues={false}
      />
    </>
  )
}

SimpleSliderWithSteps.storyName = 'Simple slider with steps'
SimpleSliderWithSteps.decorators = [
  (Story) => (
    <div style={{ margin: '3rem' }}>
      <Story />
    </div>
  ),
]

export const RangeSlider: Story<SliderProps> = () => {
  const [value, updateValue] = useState([30, 70])
  const changeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    value: number[] | number,
  ) => {
    updateValue(value as number[])
  }

  return (
    <>
      <span id="range-slider-label">Range slider</span>
      <Slider
        value={value}
        onChange={changeHandler}
        aria-labelledby="range-slider-label"
      />
      <p style={{ marginTop: '1.5rem' }}>
        <small>Output from slider is {value.join(', ')}</small>
      </p>
    </>
  )
}
RangeSlider.storyName = 'Range slider'
RangeSlider.decorators = [
  (Story) => (
    <div style={{ margin: '3rem' }}>
      <Story />
    </div>
  ),
]

export const RangeSliderWithCommittedStep: Story<SliderProps> = () => {
  const [value, updateValue] = useState([0, 500])
  const [valueCommited, updateValueCommited] = useState([0, 500])

  return (
    <>
      <span id="range-slider-label-with-committed">
        Range slider with a lot of steps
      </span>
      <Slider
        value={value}
        onChange={(
          event: ChangeEvent<HTMLInputElement>,
          value: number[] | number,
        ) => {
          updateValue(value as number[])
        }}
        min={0}
        max={500}
        aria-labelledby="range-slider-label-with-committed"
        onChangeCommitted={(event, value) => {
          updateValueCommited(value as number[])
        }}
      />
      <p style={{ marginTop: '1.5rem' }}>
        <small>
          Committed output from slider is{' '}
          {valueCommited && valueCommited.join(', ')}
        </small>
      </p>
    </>
  )
}
RangeSliderWithCommittedStep.storyName = 'Range slider with committed step'
RangeSliderWithCommittedStep.decorators = [
  (Story) => (
    <div style={{ margin: '3rem' }}>
      <Story />
    </div>
  ),
]

export const RangeSliderWithInterval: Story<SliderProps> = () => (
  <>
    <span id="large-step-range-slider">Range slider with steps of 5</span>
    <Slider
      aria-labelledby="large-step-range-slider"
      step={5}
      min={30}
      minMaxDots={false}
      value={[40, 60]}
    />
  </>
)

RangeSliderWithInterval.storyName = 'Range slider with interval'
RangeSliderWithInterval.decorators = [
  (Story) => (
    <div style={{ margin: '3rem' }}>
      <Story />
    </div>
  ),
]

export const RangeSliderWithDates: Story<SliderProps> = () => {
  const outputFunction = (value: number) => {
    const date = new Date(value)
    return date.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    })
  }

  const getUnixTime = (iso: string | number | Date) => {
    return new Date(iso).getTime()
  }
  return (
    <>
      <span id="date-range-slider">Date range slider with days</span>
      <Slider
        min={getUnixTime('2020-01-01')}
        max={getUnixTime('2020-01-31')}
        aria-labelledby="date-range-slider"
        step={60 * 60 * 24 * 1000}
        value={[getUnixTime('2020-01-01'), getUnixTime('2020-01-31')]}
        outputFunction={outputFunction}
      />
    </>
  )
}

RangeSliderWithDates.storyName = 'Range slider with dates'
RangeSliderWithDates.decorators = [
  (Story) => (
    <div style={{ margin: '3rem' }}>
      <Story />
    </div>
  ),
]

export const Disabled: Story<SliderProps> = () => (
  <>
    <label htmlFor="disabled-slider">Disabled slider</label>
    <Slider
      id="disabled-slider"
      value={50}
      disabled
      aria-labelledby="disabled-slider"
    />
  </>
)

Disabled.decorators = [
  (Story) => (
    <div style={{ margin: '3rem' }}>
      <Story />
    </div>
  ),
]
