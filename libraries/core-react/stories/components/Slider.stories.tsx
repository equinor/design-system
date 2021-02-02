import React, { useState, FormEvent } from 'react'
import { Slider, SliderProps } from '@components'
import { Story, Meta } from '@storybook/react'

export default {
  title: 'Components/Slider',
  component: Slider,
  decorators: [
    (Story) => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `A slider is a flexible input that allows users to adjust
        predefined values.
        `,
      },
    },
  },
} as Meta

export const Default: Story<SliderProps> = (args) => {
  return <Slider {...args} />
}

export const RangeSlider: Story<SliderProps> = () => {
  const [value, updateValue] = useState([30, 70])
  const changeHandler = (
    event: FormEvent<HTMLDivElement>,
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
        ariaLabelledby="range-slider-label"
      />
      <p style={{ marginTop: '1.5rem' }}>
        <small>Output from slider is {value.join(', ')}</small>
      </p>
    </>
  )
}
RangeSlider.storyName = 'Range slider'

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
          event: FormEvent<HTMLDivElement>,
          value: number[] | number,
        ) => {
          updateValue(value as number[])
        }}
        min={0}
        max={500}
        ariaLabelledby="range-slider-label-with-committed"
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

export const RangeSliderWithInterval: Story<SliderProps> = () => (
  <>
    <span id="large-step-range-slider">Range slider with steps of 5</span>
    <Slider
      ariaLabelledby="large-step-range-slider"
      step={5}
      min={30}
      minMaxDots={false}
      value={[40, 60]}
    />
  </>
)

RangeSliderWithInterval.storyName = 'Range slider with interval'

export const RangeSliderWithDates: Story<SliderProps> = () => {
  const outputFunction = (value) => {
    const date = new Date(parseInt(value, 10))
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
        ariaLabelledby="date-range-slider"
        step={60 * 60 * 24 * 1000}
        value={[getUnixTime('2020-01-01'), getUnixTime('2020-01-31')]}
        outputFunction={outputFunction}
      />
    </>
  )
}

RangeSliderWithDates.storyName = 'Range slider with dates'

export const SimpleSlider: Story<SliderProps> = () => (
  <>
    <span id="simple-slider">Slide me</span>
    <Slider value={4} min={0} max={10} ariaLabelledby="simple-slider" />
  </>
)
SimpleSlider.storyName = 'Simple slider'

export const SimpleSliderWithSteps: Story<SliderProps> = () => {
  return (
    <>
      <span id="even-simpler-slider">
        Simple slider, no dots, no min or max values, steps of 10
      </span>
      <Slider
        ariaLabelledby="even-simpler-slider"
        value={50}
        step={10}
        minMaxDots={false}
        minMaxValues={false}
      />
    </>
  )
}

SimpleSliderWithSteps.storyName = 'Simple slider with steps'

export const Disabled: Story<SliderProps> = () => (
  <>
    <label htmlFor="disabled-slider">Disabled slider</label>
    <Slider
      id="disabled-slider"
      value={50}
      disabled
      ariaLabelledby="disabled-slider"
    />
  </>
)
