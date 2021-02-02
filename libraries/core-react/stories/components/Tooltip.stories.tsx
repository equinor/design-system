import React from 'react'
import styled from 'styled-components'
import { Tooltip, TooltipProps, Typography, Button } from '@components'
import { Story, Meta } from '@storybook/react'

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    title: {
      defaultValue: 'Tooltip title',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A tooltip shows when hovered or focused, and displays information
         such as a text label or a short description.
        `,
      },
    },
  },
} as Meta

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 64px;
  grid-template-columns: repeat(3, fit-content(100%));
`

const TextWrapper = styled.div`
  margin-bottom: 32px;
  width: 800px;
`

export const Default: Story<TooltipProps> = (args) => {
  return (
    <div style={{ margin: '3rem' }}>
      <Tooltip {...args}>
        <Button>Hover me!</Button>
      </Tooltip>
    </div>
  )
}

export const Placement: Story<TooltipProps> = () => {
  return (
    <>
      <TextWrapper>
        <Typography variant="h3">Placement</Typography>
        <Typography variant="body_long">
          Tooltip has 12 placement choices. The placement is relative to the
          anchor element
        </Typography>
      </TextWrapper>
      <Typography variant="h4">Top</Typography>
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
      <Typography variant="h4">Bottom</Typography>
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
      <Typography variant="h4">Left</Typography>
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
      <Typography variant="h4">Right</Typography>
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

export const WithDisabledElements: Story<TooltipProps> = () => {
  return (
    <>
      <TextWrapper>
        <Typography variant="h3">Tooltip with disabled elements</Typography>
        <Typography variant="body_long">
          Firefox, Edge and Chrome supports tooltip on disabled elements.
        </Typography>
        <Typography variant="body_long">
          If you have Safari users, you will need to add inline style to your
          disabled element, shown in the example below. This will help trigger
          the mouse events correctly. Unfortunately, this workaround overwrites
          the &apos;not-allowed&apos; cursor.
        </Typography>
      </TextWrapper>
      <Wrapper>
        <Tooltip title="Tooltip" placement="topLeft">
          <Button disabled>Disabled</Button>
        </Tooltip>

        <Tooltip title="Tooltip" placement="topLeft">
          <Button style={{ pointerEvents: 'none' }} disabled>
            Disabled for Safari Browser
          </Button>
        </Tooltip>
      </Wrapper>
    </>
  )
}
