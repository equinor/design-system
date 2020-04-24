import React from 'react'
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
        <Popover title="Popover" placement="topLeft">
          <Button>Top left</Button>
        </Popover>
        <Popover title="Popover" placement="top">
          <Button>Top</Button>
        </Popover>
        <Popover title="Popover" placement="topRight">
          <Button>Top right</Button>
        </Popover>
      </Wrapper>
      <Typography variant="h5">Bottom</Typography>
      <Wrapper>
        <Popover title="Popover" placement="bottomLeft">
          <Button>Bottom left</Button>
        </Popover>
        <Popover title="Popover">
          <Button>Bottom (default)</Button>
        </Popover>
        <Popover title="Popover" placement="bottomRight">
          <Button>Bottom right</Button>
        </Popover>
      </Wrapper>
      <Typography variant="h5">Left</Typography>
      <Wrapper>
        <Popover title="Popover" placement="leftTop">
          <Button>Left top</Button>
        </Popover>
        <Popover title="Popover" placement="left">
          <Button>Left</Button>
        </Popover>
        <Popover title="Popover" placement="leftBottom">
          <Button>Left bottom</Button>
        </Popover>
      </Wrapper>
      <Typography variant="h5">Right</Typography>
      <Wrapper>
        <Popover title="Popover" placement="rightTop">
          <Button>Right top</Button>
        </Popover>
        <Popover title="Popover" placement="right">
          <Button>Right</Button>
        </Popover>
        <Popover title="Popover" placement="rightBottom">
          <Button>Right bottom</Button>
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
        <Popover title={title} placement={placement}>
          {ANCHOR_CHOICES[anchor]}
        </Popover>
      </Wrapper>
    </Body>
  )
}
