import React, { useState } from 'react'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import styled from 'styled-components'
import {
  Typography,
  Button,
  Avatar,
  Chip,
  TextField,
  Search,
  Icon,
  Popover,
  Card,
} from '@equinor/eds-core-react'
import catImg from '../images/cat.jpg'

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
  title: 'Components|Popover',
  component: Popover,
  decorators: [withKnobs],
}

const Content = () => (
  <>
    <PopoverTitle>Title </PopoverTitle>
    <PopoverContent>
      <Typography variant="body_short">Content</Typography>
    </PopoverContent>
    <CardActions>
      <Button>Cancel</Button>
      <Button>OK</Button>
    </CardActions>
  </>
)

export function Placement() {
  const [active, setActive] = React.useState(null)

  const handleClick = (event) => {
    setActive(event.currentTarget.id)
  }

  const handleClose = () => {
    setActive(null)
  }

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
      <Typography variant="h5">Top</Typography>
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

      <Typography variant="h5">Bottom</Typography>
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

      <Typography variant="h5">Left</Typography>
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
      <Typography variant="h5">Right</Typography>
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

export function ActivationTypes() {
  const [active, setActive] = React.useState(null)

  const handleClick = (event) => {
    setActive(event.currentTarget.id)
  }

  const handleClose = () => {
    setActive(null)
  }

  return (
    <Body>
      <TextWrapper>
        <Typography variant="h3">Open on Hover</Typography>
        <Typography variant="body_long">
          Popovers can be activated by hover or click
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

        <Popover
          onClose={handleClose}
          onBlur={handleClose}
          open={active === '2'}
        >
          <PopoverAnchor>
            <Button id="2" onMouseEnter={handleClick}>
              On Hover
            </Button>
          </PopoverAnchor>
          <Content />
        </Popover>
      </Wrapper>
    </Body>
  )
}

const ANCHOR_CHOICES = {
  button: <Button variant="ghost">Button</Button>,
  avatar: <Avatar src={catImg} size={48} alt="avatar" />,
  chip: <Chip>Chip</Chip>,
  search: (
    <Search aria-label="sitewide" id="search-normal" placeholder="Search" />
  ),
  textfield: (
    <TextField
      id="textfield-normal"
      placeholder="Placeholder text"
      label="Text"
      helperText="Helper text"
    />
  ),
  typography: <Typography variant="h3">Typography</Typography>,
  icon: <Icon name="work" color={'red'} />,
}

export const WithKnobs = () => {
  const anchor = select('Anchor', Object.keys(ANCHOR_CHOICES), 'avatar')
  const title = text('Title', 'Title')
  const placement = select(
    'Placement',
    [
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
    'bottom',
  )

  return (
    <Body>
      <TextWrapper>
        <Typography variant="h3">With knobs</Typography>
      </TextWrapper>
      <Wrapper>
        <Popover placement={placement}>
          {/* <PopoverTitle>Hi</PopoverTitle> */}
          {ANCHOR_CHOICES[anchor]}
        </Popover>
      </Wrapper>
    </Body>
  )
}
