import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import {
  Tooltip,
  TooltipProps,
  Typography,
  Button,
} from '@equinor/eds-core-react'
import { Story, Meta } from '@storybook/react'

const Body = styled.div`
  margin: 42px;
  display: grid;
  grid-auto-columns: auto;
`

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

const Arrow = styled.div`
  &,
  &::before {
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: -1;
  }

  &::before {
    content: '';
    transform: rotate(45deg);
    background: #333;
  }
`

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    title: {
      defaultValue: 'Tooltip title',
    },
    placement: {
      control: {
        type: 'select',
        options: [
          'auto',
          'auto-start',
          'auto-end',
          'top',
          'top-start',
          'top-end',
          'bottom',
          'bottom-start',
          'bottom-end',
          'right',
          'right-start',
          'right-end',
          'left',
          'left-start',
          'left-end',
        ],
      },
    },
  },
} as Meta

export const Default: Story<TooltipProps> = (args) => {
  const [openState, setOpenState] = useState(false)

  const handleOpen = () => {
    setOpenState(true)
  }

  const handleClose = () => {
    setOpenState(false)
  }

  const referenceElement = useRef(null)

  return (
    <div style={{ margin: '3rem 10rem' }}>
      <Button
        ref={referenceElement}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        Hover me!
      </Button>
      {openState && <Tooltip {...args} anchorEl={referenceElement} />}
    </div>
  )
}

export const WithDisabledElements: Story<TooltipProps> = () => {
  const [openState, setOpenState] = useState(null)

  const handleOpen = (num: 1 | 2) => {
    setOpenState(num)
  }

  const handleClose = () => {
    setOpenState(null)
  }

  const referenceElementOne = useRef(null)
  const referenceElementTwo = useRef(null)

  return (
    <Body>
      <TextWrapper>
        <Typography variant="h3">Tooltip with disabled elements</Typography>
        <Typography variant="body_long">
          Firefox, Edge and Chrome supports tooltip on disabled elements. We
          found onPointerEnter and onPointerLeave was the best way to trigger
          events on disabled elements.
        </Typography>
        <Typography variant="body_long" style={{ marginTop: 8 }}>
          If you have Safari users, you will need to add inline style to your
          disabled element, shown in the example below, as well as wrapping the
          anchor inside a div which will handle the pointer event handlers. This
          will help trigger the mouse events correctly. Unfortunately, this
          workaround overwrites the &apos;not-allowed&apos; cursor.
        </Typography>
      </TextWrapper>
      <Wrapper>
        <Button
          disabled
          ref={referenceElementOne}
          onPointerEnter={() => handleOpen(1)}
          onPointerLeave={handleClose}
        >
          Disabled, but hover works!
        </Button>
        {openState === 1 && (
          <Tooltip title="Tooltip works!" anchorEl={referenceElementOne} />
        )}
        <div
          ref={referenceElementTwo}
          onPointerEnter={() => handleOpen(2)}
          onPointerLeave={handleClose}
        >
          <Button disabled style={{ pointerEvents: 'none' }}>
            Just Safari example
          </Button>
        </div>

        {openState === 2 && (
          <Tooltip title="Tooltip works!" anchorEl={referenceElementTwo} />
        )}
      </Wrapper>
    </Body>
  )
}
