import React, { MouseEvent } from 'react'
import styled from 'styled-components'
import {
  Typography,
  Button,
  Popover,
  PopoverProps,
  Card,
} from '@equinor/eds-core-react'
import { Meta, Story } from '@storybook/react'

const { PopoverAnchor, PopoverTitle, PopoverContent } = Popover
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
  argTypes: {
    placement: {
      control: {
        type: 'select',
        options: [
          'topLeft',
          'top',
          'topRight',
          'rightTop',
          'right',
          'rightBottom',
          'bottomLeft',
          'bottom',
          'bottomRight',
          'leftTop',
          'left',
          'leftBottom',
        ],
      },
    },
  },
} as Meta

export const Default: Story<PopoverProps> = (args) => {
  const [active, setActive] = React.useState(false)
  const handleToggle = () => {
    setActive(!active)
  }
  return (
    <div style={{ margin: '10em' }}>
      <Popover {...args} onClose={handleToggle} open={active}>
        <PopoverAnchor>
          <Button id="1" onClick={handleToggle}>
            Click me!
          </Button>
        </PopoverAnchor>
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

export const Placements: Story<PopoverProps> = () => {
  const [active, setActive] = React.useState(null)

  const handleClick = (event: MouseEvent) => {
    setActive(event.currentTarget.id)
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

  return (
    <Body>
      <TextWrapper>
        <Typography variant="h3">Placement</Typography>
        <Typography variant="body_long">
          Popover has 12 placement choices. The placement is relative to the
          anchor element. Remember, you should always put the anchor element
          inside the PopoverAnchor tag
        </Typography>
      </TextWrapper>
      <Typography variant="h5" as="h4">
        Top
      </Typography>
      <Wrapper>
        <Popover
          onClose={handleClose}
          open={active === '1'}
          placement="topLeft"
        >
          <PopoverAnchor>
            <Button id="1" onClick={handleClick}>
              Top left
            </Button>
          </PopoverAnchor>
          <Content />
        </Popover>
        <Popover onClose={handleClose} open={active === '2'} placement="top">
          <PopoverAnchor>
            <Button id="2" onClick={handleClick}>
              Top
            </Button>
          </PopoverAnchor>
          <Content />
        </Popover>
        <Popover
          onClose={handleClose}
          open={active === '3'}
          placement="topRight"
        >
          <PopoverAnchor>
            <Button id="3" onClick={handleClick}>
              Top right
            </Button>
          </PopoverAnchor>
          <Content />
        </Popover>
      </Wrapper>

      <Typography variant="h5" as="h4">
        Bottom
      </Typography>
      <Wrapper>
        <Popover
          onClose={handleClose}
          open={active === '4'}
          placement="bottomLeft"
        >
          <PopoverAnchor>
            <Button id="4" onClick={handleClick}>
              Bottom left
            </Button>
          </PopoverAnchor>
          <Content />
        </Popover>
        <Popover onClose={handleClose} open={active === '5'} placement="bottom">
          <PopoverAnchor>
            <Button id="5" onClick={handleClick}>
              Bottom
            </Button>
          </PopoverAnchor>
          <Content />
        </Popover>
        <Popover
          onClose={handleClose}
          open={active === '6'}
          placement="bottomRight"
        >
          <PopoverAnchor>
            <Button id="6" onClick={handleClick}>
              Bottom right
            </Button>
          </PopoverAnchor>
          <Content />
        </Popover>
      </Wrapper>

      <Typography variant="h5" as="h4">
        Left
      </Typography>
      <Wrapper>
        <Popover
          onClose={handleClose}
          open={active === '7'}
          placement="leftTop"
        >
          <PopoverAnchor>
            <Button id="7" onClick={handleClick}>
              Left top
            </Button>
          </PopoverAnchor>
          <Content />
        </Popover>
        <Popover onClose={handleClose} open={active === '8'} placement="left">
          <PopoverAnchor>
            <Button id="8" onClick={handleClick}>
              Left
            </Button>
          </PopoverAnchor>
          <Content />
        </Popover>
        <Popover
          onClose={handleClose}
          open={active === '9'}
          placement="leftBottom"
        >
          <PopoverAnchor>
            <Button id="9" onClick={handleClick}>
              Left bottom
            </Button>
          </PopoverAnchor>
          <Content />
        </Popover>
      </Wrapper>
      <Typography variant="h5" as="h4">
        Right
      </Typography>
      <Wrapper>
        <Popover
          onClose={handleClose}
          open={active === '10'}
          placement="rightTop"
        >
          <PopoverAnchor>
            <Button id="10" onClick={handleClick}>
              Right top
            </Button>
          </PopoverAnchor>
          <Content />
        </Popover>
        <Popover onClose={handleClose} open={active === '11'} placement="right">
          <PopoverAnchor>
            <Button id="11" onClick={handleClick}>
              Right
            </Button>
          </PopoverAnchor>
          <Content />
        </Popover>
        <Popover
          onClose={handleClose}
          open={active === '12'}
          placement="rightBottom"
        >
          <PopoverAnchor>
            <Button id="12" onClick={handleClick}>
              Right bottom
            </Button>
          </PopoverAnchor>
          <Content />
        </Popover>
      </Wrapper>
    </Body>
  )
}

export const ActivationTypes: Story<PopoverProps> = () => {
  const [active, setActive] = React.useState(null)

  const handleClick = (event) => {
    setActive(event.currentTarget.id)
  }

  const handleHover = (event: MouseEvent) => {
    const current = event.currentTarget.id
    setTimeout(() => {
      setActive(current)
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
        <Popover onClose={handleClose} open={active === '1'}>
          <PopoverAnchor>
            <Button id="1" onClick={handleClick}>
              On Click
            </Button>
          </PopoverAnchor>
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
        <Popover onClose={handleClose} open={active === '2'}>
          <PopoverAnchor>
            <Button id="2" onMouseEnter={handleHover} onFocus={handleClick}>
              On Hover
            </Button>
          </PopoverAnchor>
          <Content />
        </Popover>
      </Wrapper>
    </Body>
  )
}
