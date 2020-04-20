import React, { useState, Fragment } from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Tooltip, Typography, Button } from '@equinor/eds-core-react'

const Wrapper = styled.div`
  margin: 42px;
  display: grid;
  grid-gap: 32px;
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
      <Wrapper>
        <Tooltip title="Tooltip" placement="leftTop">
          <Button>Left top</Button>
        </Tooltip>
        <Tooltip title="Tooltip" placement="left">
          <Button>Left</Button>
        </Tooltip>
        <Tooltip title="Tooltip" placement="leftBottom">
          <Button>Left bottom</Button>
        </Tooltip>
      </Wrapper>
      <Wrapper>
        <Tooltip title="Tooltip" placement="rightTop">
          <Button>Right top</Button>
        </Tooltip>
        <Tooltip title="Tooltip" placement="right">
          <Button>Right</Button>
        </Tooltip>
        <Tooltip title="Tooltip" placement="rightBottom">
          <Button>Right bottom</Button>
        </Tooltip>
      </Wrapper>
    </>
  )
}
