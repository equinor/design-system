import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Typography, Button, Popover, PopoverProps, Card } from '@components'
import { Meta, Story } from '@storybook/react'

const { PopoverTitle, PopoverContent } = Popover
const { CardActions } = Card

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
`
export default {
  title: 'Components/Popover',
  component: Popover,
  subcomponents: {
    PopoverTitle,
    PopoverContent,
    CardActions,
  },
} as Meta

export const Default: Story<PopoverProps> = (args) => {
  const [openState, setOpenState] = useState(false)

  const handleToggle = () => {
    setOpenState(!openState)
  }

  const referenceElement = useRef(null)

  return (
    <div style={{ margin: '10em' }}>
      <Button
        id="default-popover-anchor"
        aria-controls="default-popover"
        ref={referenceElement}
        onClick={handleToggle}
      >
        Click me!
      </Button>

      <Popover
        {...args}
        id="default-popover"
        aria-expanded={openState}
        anchorEl={referenceElement.current}
        onClose={handleToggle}
        open={openState}
      >
        <PopoverTitle>Title</PopoverTitle>
        <PopoverContent>
          <Typography variant="body_short">Content</Typography>
        </PopoverContent>
        <CardActions>
          <Button onClick={handleToggle}>Cancel</Button>
          <Button onClick={handleToggle}>OK</Button>
        </CardActions>
      </Popover>
    </div>
  )
}

export const ActivationTypes: Story<PopoverProps> = () => {
  const [active, setActive] = React.useState(null)

  const handleClick = (num: 1 | 2) => {
    setActive(num)
  }

  const handleHover = (num: 1 | 2) => {
    setTimeout(() => {
      setActive(num)
    }, 300)
  }

  const handleClose = () => {
    setActive(null)
  }

  const Content = () => (
    <>
      <PopoverTitle>Title </PopoverTitle>
      <PopoverContent>
        <Typography variant="body_short">Content</Typography>
      </PopoverContent>
      <CardActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>OK</Button>
      </CardActions>
    </>
  )
  const refOne = useRef(null)
  const refTwo = useRef(null)

  return (
    <Body>
      <TextWrapper>
        <Typography variant="h3">Activation types</Typography>
        <Typography variant="body_long">
          Popovers can be activated by hover or click. To dismiss a popover, use
          the close icon, press the ESC key, open another popover or click
          outside the popover. If there are no actions in the popover, then the
          close icon should be the first focusable element.
        </Typography>
      </TextWrapper>
      <Wrapper>
        <Button
          id="click-popover-anchor"
          aria-controls="click-popover"
          ref={refOne}
          onClick={() => handleClick(1)}
        >
          Activate on click
        </Button>

        <Popover
          id="click-popover"
          aria-expanded={active === 1}
          anchorEl={refOne.current}
          onClose={handleClose}
          open={active === 1}
        >
          <Content />
        </Popover>
      </Wrapper>
      <Typography variant="body_long">
        Remember to use both onMouseEnter and onFocus attributes to your trigger
        element to be able to open the popover by tab iterations. A timeout
        delay on onMouseEnter is recommended to avoid unwanted trigger of the
        popup while browsing.
      </Typography>
      <Wrapper>
        <Button
          id="anchor-hover-popover"
          aria-controls="hover-popover"
          ref={refTwo}
          onMouseEnter={() => handleHover(2)}
          onFocus={() => handleClick(2)}
        >
          On Hover
        </Button>

        <Popover
          id="hover-popover"
          aria-expanded={active === 2}
          anchorEl={refTwo.current}
          onClose={handleClose}
          open={active === 2}
        >
          <Content />
        </Popover>
      </Wrapper>
    </Body>
  )
}
