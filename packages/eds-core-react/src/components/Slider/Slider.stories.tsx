import { useState, ChangeEvent } from 'react'
import { Label, Slider, SliderProps, Typography } from '../..'
import { StoryFn, Meta } from '@storybook/react-vite'
import styled from 'styled-components'
import { Stack } from './../../../.storybook/components'
import page from './Slider.docs.mdx'

const StyledSlider = styled(Slider)`
  margin-bottom: 32px;
`
const StyledLabel = styled(Label)`
  margin-bottom: 8px;
`

const meta: Meta<typeof Slider> = {
  title: 'Inputs/Slider',
  component: Slider,
  argTypes: {
    value: { control: { type: null } },
  },
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
        type: 'code',
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
}

export default meta

export const Introduction: StoryFn<SliderProps> = (args) => {
  return <Slider aria-label="simple-slider" {...args} />
}

export const SimpleSlider: StoryFn<SliderProps> = () => (
  <>
    <Label label="Slide me" id="simple-slider" />
    <Slider value={4} min={0} max={10} aria-labelledby="simple-slider" />
  </>
)
SimpleSlider.storyName = 'Simple slider'

export const LabelAlwaysOn: StoryFn<SliderProps> = () => (
  <Slider
    value={4}
    min={0}
    max={10}
    aria-labelledby="simple-slider"
    labelAlwaysOn
  />
)

export const SimpleSliderWithSteps: StoryFn<SliderProps> = () => (
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

export const RangeSlider: StoryFn<SliderProps> = () => {
  const [value, updateValue] = useState([30, 70])
  const changeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    value: number[],
  ) => {
    updateValue(value)
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

export const RangeSliderWithCommittedStep: StoryFn<SliderProps> = () => {
  const [value, updateValue] = useState([0, 500])
  const [valueCommited, updateValueCommited] = useState([0, 500])

  return (
    <>
      <Slider
        aria-label="Range slider with a lot of steps"
        value={value}
        onChange={(event, value) => {
          updateValue(value)
        }}
        min={0}
        max={500}
        onChangeCommitted={(event, value) => {
          updateValueCommited(value)
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

export const RangeSliderWithInterval: StoryFn<SliderProps> = () => (
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

export const RangeSliderWithDates: StoryFn<SliderProps> = () => {
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
    <Slider
      min={getUnixTime('2020-01-01')}
      max={getUnixTime('2020-01-31')}
      step={60 * 60 * 24 * 1000}
      value={[getUnixTime('2020-01-01'), getUnixTime('2020-01-31')]}
      outputFunction={outputFunction}
      aria-label="Range slider with dates"
    />
  )
}
RangeSliderWithDates.storyName = 'Range slider with dates'

export const Disabled: StoryFn<SliderProps> = () => (
  <>
    <Slider value={50} disabled aria-label="Disabled Slider" />
    <Slider value={[30, 70]} aria-label="disabled range slider" disabled />
  </>
)

export const HideActiveTrack: StoryFn<SliderProps> = () => (
  <>
    <Slider
      value={4}
      min={0}
      max={10}
      aria-label="hidden active track"
      hideActiveTrack
    />
    <Slider
      value={[30, 70]}
      aria-label="hidden active track range"
      hideActiveTrack
    />
  </>
)

export const SliderStack: StoryFn<SliderProps> = () => (
  <div style={{ width: '100%' }}>
    <StyledLabel label="Its a range slider" id="below-1" />
    <StyledSlider
      aria-labelledby="below-1"
      min={30}
      value={[40, 60]}
      labelBelow
      labelAlwaysOn
    />
    <StyledLabel label="Another range slider" id="below-2" />
    <StyledSlider
      aria-labelledby="below-2"
      min={30}
      value={[30, 70]}
      labelBelow
      labelAlwaysOn
    />
    <StyledLabel label="Slider" id="below-3" />
    <StyledSlider
      aria-labelledby="below-3"
      min={0}
      value={[35]}
      labelBelow
      labelAlwaysOn
    />
  </div>
)
RangeSliderWithInterval.storyName = 'Range slider with interval'
