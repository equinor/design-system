import React, { useState } from 'react'
import { Slider, SliderProps } from '@equinor/eds-core-react'
import { Story, Meta } from '@storybook/react'

import styled from 'styled-components'

const Body = styled.div`
  display: grid;
  grid-template-rows: min-content;
  padding: 32px;
  grid-gap: 4rem;
  position: relative;
`

function outputFunction(value) {
  const date = new Date(parseInt(value, 10))
  return date.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
}

const getUnixTime = (iso) => {
  return new Date(iso).getTime()
}

export default {
  title: 'Components/Slider',
  component: Slider,
} as Meta

export const Default: Story<SliderProps> = (args) => {
  return <Slider {...args} />
}

export const Examples = () => {
  const [value, updateValue] = useState([30, 70])
  const [valueTwo, updateValueTwo] = useState([0, 500])
  const [valueTwoCommited, updateValueTwoCommited] = useState([0, 500])
  const onChange = (event, value) => {
    updateValue(value)
  }

  return (
    <Body>
      <div>
        <span id="range-slider-label">Range slider</span>
        <Slider
          value={value}
          onChange={onChange}
          ariaLabelledby="range-slider-label"
        />
        <p style={{ marginTop: '1.5rem' }}>
          <small>Output from slider is {value.join(', ')}</small>
        </p>
      </div>
      <div>
        <span id="range-slider-label-with-mouseevent">
          Range slider with a lot of steps
        </span>
        <Slider
          value={valueTwo}
          onChange={(event, value) => {
            updateValueTwo(value)
          }}
          min={0}
          max={500}
          ariaLabelledby="range-slider-label-with-mouseevent"
          onChangeCommitted={(event, value) => {
            updateValueTwoCommited(value)
          }}
        />
        <p style={{ marginTop: '1.5rem' }}>
          <small>
            Committed output from slider is{' '}
            {valueTwoCommited && valueTwoCommited.join(', ')}
          </small>
        </p>
      </div>
      <div>
        <span id="large-step-range-slider">Range slider with steps of 5</span>
        <Slider
          ariaLabelledby="large-step-range-slider"
          step={5}
          min={30}
          minMaxDots={false}
          value={[40, 60]}
        />
      </div>
      <div>
        <span id="date-range-slider">Date range slider with days</span>
        <Slider
          min={getUnixTime('2020-01-01')}
          max={getUnixTime('2020-01-31')}
          ariaLabelledby="date-range-slider"
          step={60 * 60 * 24 * 1000}
          value={[getUnixTime('2020-01-01'), getUnixTime('2020-01-31')]}
          outputFunction={outputFunction}
        />
      </div>
      <div>
        <span id="simple-slider">Simple slider</span>
        <Slider value={4} min={0} max={10} ariaLabelledby="simple-slider" />
      </div>
      <div>
        <span id="even-simpler-slider">
          Simple slider, no dots, no min or max values, steps of 10
        </span>
        <Slider
          ariaLabelledby="even-simpler-slider"
          value={50}
          min={0}
          max={100}
          step={10}
          minMaxDots={false}
          minMaxValues={false}
        />
      </div>
      <div>
        <label htmlFor="disabled-slider">Disabled slider</label>
        <Slider
          id="disabled-slider"
          value={50}
          disabled
          ariaLabelledby="disabled-slider"
        />
      </div>
    </Body>
  )
}
