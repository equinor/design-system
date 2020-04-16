import React, { useState, Fragment } from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Tooltip, Typography, Button } from '@equinor/eds-core-react'

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 24px;
`

export default {
  title: 'Components|Tooltip',
  component: Tooltip,
}

export function Example() {
  const [toggle, setToggle] = useState(true)

  return (
    <Wrapper>
      <Tooltip title="Tooltip">
        <Button>Anchor</Button>
      </Tooltip>
    </Wrapper>
  )
}
