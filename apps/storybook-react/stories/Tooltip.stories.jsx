import React, { useState, Fragment } from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Tooltip, Typography, Button } from '@equinor/eds-core-react'

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(3, fit-content(100%));
`

export default {
  title: 'Components|Tooltip',
  component: Tooltip,
}

export function TooltipVariants() {
  const [toggle, setToggle] = useState(true)

  return (
    <>
      <Wrapper>
        <Tooltip title="Tooltip" placement="topLeft">
          <Button>Top left</Button>
        </Tooltip>
        <Tooltip title="Tooltip" placement="top">
          <Button>Top</Button>
        </Tooltip>
        <Tooltip title="Tooltip" placement="topRight">
          <Button>Top right</Button>
        </Tooltip>
      </Wrapper>
      <Wrapper>
        <Tooltip title="Tooltip" placement="bottomLeft">
          <Button>Bottom left</Button>
        </Tooltip>
        <Tooltip title="Tooltip">
          <Button>Bottom (default)</Button>
        </Tooltip>
        <Tooltip title="Tooltip" placement="bottomRight">
          <Button>Bottom right</Button>
        </Tooltip>
      </Wrapper>
    </>
  )
}
