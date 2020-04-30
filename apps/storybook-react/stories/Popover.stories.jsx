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
} from '@equinor/eds-core-react'
import catImg from '../images/cat.jpg'

const { PopoverTitle } = Popover

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

export function Placement() {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  return (
    <Body>
      <TextWrapper>
        <Typography variant="h3">Placement</Typography>
        <Typography variant="body_long">
          Popover has 12 placement choices. The placement is relative to the
          anchor element
        </Typography>
      </TextWrapper>
      <Typography variant="h5">Top</Typography>
      <Wrapper>
        <Button onClick={handleClick}>Top left</Button>
        <Popover
          anchorEl={anchorEl}
          onClose={handleClose}
          open={open}
          placement="topLeft"
        ></Popover>
      </Wrapper>
    </Body>
  )
}

export function ActivationTypes() {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <Body>
      <TextWrapper>
        <Typography variant="h3">Open on Hover</Typography>
        <Typography variant="body_long">
          Popovers can be activated by hover or click
        </Typography>
      </TextWrapper>
      <Wrapper>
        <Button onClick={handleClick} variant="ghost">
          Activate on click
        </Button>
        <Button onMouseEnter={handleClick} variant="ghost">
          Activate on hover
        </Button>
        <Popover anchorEl={anchorEl} open={open}>
          <PopoverTitle></PopoverTitle>
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
          <PopoverTitle></PopoverTitle>
          {ANCHOR_CHOICES[anchor]}
        </Popover>
      </Wrapper>
    </Body>
  )
}
