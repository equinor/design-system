import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Typography, Button, Popover, PopoverProps, Card } from '@components'
import { Meta, Story } from '@storybook/react'
import { PlacementValues } from '@hooks'

const { Title, Content } = Popover
const { Actions } = Card

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
    Title,
    Content,
    Actions,
  },
  argTypes: {
    placement: {
      control: {
        type: 'select',
        options: PlacementValues,
        defaultValue: 'auto',
      },
    },
  },
} as Meta

export const Default: Story<PopoverProps> = (args) => {
  const [openState, setOpenState] = useState(false)

  const handleOpen = () => {
    setOpenState(true)
  }

  const handleClose = () => {
    setOpenState(false)
  }

  const referenceElement = useRef(null)

  return (
    <div style={{ margin: '10em' }}>
      <Button
        id="default-popover-anchor"
        aria-controls="default-popover"
        ref={referenceElement}
        onClick={handleOpen}
      >
        Click me!
      </Button>

      <Popover
        {...args}
        id="default-popover"
        aria-expanded={openState}
        anchorEl={referenceElement.current}
        onClose={handleClose}
        open={openState}
      >
        <Popover.Title>Title</Popover.Title>
        <Popover.Content>
          <Typography variant="body_short">Content</Typography>
        </Popover.Content>
        <Card.Actions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>OK</Button>
        </Card.Actions>
      </Popover>
    </div>
  )
}

export const ActivationTypes: Story<PopoverProps> = () => {
  const [active, setActive] = React.useState(null)

  const handleClick = (num: 1 | 2) => {
    setActive(num)
  }

  let timer: ReturnType<typeof setTimeout> = null

  const handleHover = () => {
    timer = setTimeout(() => {
      setActive(2)
    }, 300)
  }

  const handleClose = () => {
    clearTimeout(timer)
    setActive(null)
  }

  const Content = () => (
    <>
      <Popover.Title>Title </Popover.Title>
      <Popover.Content>
        <Typography variant="body_short">Content</Typography>
      </Popover.Content>
      <Card.Actions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>OK</Button>
      </Card.Actions>
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
          onMouseOver={handleHover}
          onFocus={() => handleClick(2)}
          onMouseLeave={handleClose}
          onBlur={handleClose}
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
