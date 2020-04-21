import React from 'react'
import { Slider, Button, Typography } from '@equinor/eds-core-react'

import styled from 'styled-components'

const Body = styled.div`
  /* height: calc(100vh - 64px); */
  /* background: #ebebeb; */
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  padding: 32px;
  grid-gap: 32px;
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
  return (
    <Body>
      <Slider label="Range slider" />
      <Slider label="Range slider with steps of 5" step={5} />
      <Slider
        min={getUnixTime('2020-01-01')}
        max={getUnixTime('2020-01-31')}
        label="Date range day"
        step={60 * 60 * 24 * 1000}
        value={[getUnixTime('2020-01-01'), getUnixTime('2020-01-31')]}
        outputFunction={outputFunction}
      />
    </Body>
  )
}
