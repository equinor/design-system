import React, { useState } from 'react'
import { Slider, Button, Typography, Label } from '@equinor/eds-core-react'

import styled from 'styled-components'

const Body = styled.div`
  /* height: calc(100vh - 64px); */
  /* background: #ebebeb; */
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  padding: 32px;
  grid-gap: 32px;
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
  title: 'Components|Slider',
  component: Slider,
}

export const Examples = () => {
  const [value, updateValue] = useState([30, 70])
  const onChange = (event, value) => {
    updateValue(value)
  }
  return (
    <Body>
      <span id="range-slider-label">Range slider</span>
      <Slider
        value={value}
        onChange={onChange}
        ariaLabelledby="range-slider-label"
      />
      <p>
        <small>Output from slider is {value.join(', ')}</small>
      </p>
      <span id="large-step-range-slider">Range slider with steps of 5</span>
      <Slider
        ariaLabelledby="large-step-range-slider"
        step={5}
        min={30}
        minMaxDots={false}
        value={[40, 60]}
      />
      <span id="date-range-slider">Date range slider with days</span>
      <Slider
        min={getUnixTime('2020-01-01')}
        max={getUnixTime('2020-01-31')}
        ariaLabelledby="date-range-slider"
        step={60 * 60 * 24 * 1000}
        value={[getUnixTime('2020-01-01'), getUnixTime('2020-01-31')]}
        outputFunction={outputFunction}
      />
      <span id="simple-slider">Simple slider</span>
      <Slider value={4} min={0} max={10} ariaLabelledby="simple-slider" />
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
      <label id="disabled-slider">Disabled slider</label>
      <Slider value={50} disabled={true} ariaLabelledby="disabled-slider" />
    </Body>
  )
}
