import { useState, ChangeEvent } from 'react'
import { Label, Slider, SliderProps, Typography } from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import { Stack } from './../../../.storybook/components'
import page from './Slider.docs.mdx'

export default {
  title: 'Inputs/Slider',
  component: Slider,
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Stack
          direction="column"
          align="start"
          style={{ margin: '32px', gap: '32px' }}
        >
          <Story />
        </Stack>
      )
    },
  ],
} as ComponentMeta<typeof Slider>

export const Introduction: Story<SliderProps> = (args) => {
  return <Slider aria-label="simple-slider" {...args} />
}

export const SimpleSlider: Story<SliderProps> = () => (
  <>
    <Label label="Slide me" id="simple-slider" />
    <Slider value={4} min={0} max={10} aria-labelledby="simple-slider" />
  </>
)
SimpleSlider.storyName = 'Simple slider'

export const SimpleSliderWithSteps: Story<SliderProps> = () => (
  <>
    <Label
      label=" Simple slider, no dots, no min or max values, steps of 10"
      id="even-simpler-slider"
    />
    <Slider
      aria-labelledby="even-simpler-slider"
      value={50}
      step={10}
      minMaxDots={false}
      minMaxValues={false}
    />
  </>
)
SimpleSliderWithSteps.storyName = 'Simple slider with steps'

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
      <Slider
        value={value}
        onChange={changeHandler}
        aria-label="Range slider"
      />
      <Typography variant="caption">
        Output from slider is {value.join(', ')}
      </Typography>
    </>
  )
}
RangeSlider.storyName = 'Range slider'

export const RangeSliderWithCommittedStep: Story<SliderProps> = () => {
  const [value, updateValue] = useState([0, 500])
  const [valueCommited, updateValueCommited] = useState([0, 500])

  return (
    <>
      <Slider
        aria-label="Range slider with a lot of steps"
        value={value}
        onChange={(
          event: ChangeEvent<HTMLInputElement>,
          value: number[] | number,
        ) => {
          updateValue(value as number[])
        }}
        min={0}
        max={500}
        onChangeCommitted={(event, value) => {
          updateValueCommited(value as number[])
        }}
      />
      <Typography variant="caption">
        Committed output from slider is{' '}
        {valueCommited && valueCommited.join(', ')}
      </Typography>
    </>
  )
}
RangeSliderWithCommittedStep.storyName = 'Range slider with committed step'

export const RangeSliderWithInterval: Story<SliderProps> = () => (
  <>
    <Label label="Range slider with steps of 5" id="large-step-range-slider" />
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
      <Slider
        min={getUnixTime('2020-01-01')}
        max={getUnixTime('2020-01-31')}
        step={60 * 60 * 24 * 1000}
        value={[getUnixTime('2020-01-01'), getUnixTime('2020-01-31')]}
        outputFunction={outputFunction}
        aria-label="Range slider with dates"
      />
    </>
  )
}
RangeSliderWithDates.storyName = 'Range slider with dates'

export const Disabled: Story<SliderProps> = () => (
  <>
    <Slider value={50} disabled aria-label="Disabled Slider" />
  </>
)
