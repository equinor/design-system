import React, { useState } from 'react'
import { Radio, Checkbox, Switch } from '@equinor/eds-core-react'

import styled from 'styled-components'

const Body = styled.div`
  /* height: calc(100vh - 64px); */
  /* background: #ebebeb; */
  display: grid;
  grid-template-rows: min-width;
  padding: 32px;
  grid-gap: 4rem;
  position: relative;
`

export default {
  title: 'Components|SelectionControls',
  component: Radio,
}

export const Examples = () => {
  return (
    <Body>
      <div>
        <Radio />
        <Checkbox />
        <Switch />
      </div>
    </Body>
  )
}
