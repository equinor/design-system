import React from 'react'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import styled from 'styled-components'
import {
  Tooltip,
  Typography,
  Button,
  Icon,
  Avatar,
  Chip,
  TextField, //
  Search,
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
  title: 'Components/Tooltip',
  component: Tooltip,
  decorators: [withKnobs],
}

export function Placement() {
  return (
    <Body>
      <TextWrapper>
        <Typography variant="h3">Placement</Typography>
        <Typography variant="body_long">
          Tooltip has 12 placement choices. The placement is relative to the
          anchor element
        </Typography>
      </TextWrapper>
      <Typography variant="h5">Top</Typography>
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
      <Typography variant="h5">Bottom</Typography>
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
      <Typography variant="h5">Left</Typography>
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
      <Typography variant="h5">Right</Typography>
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
        <Tooltip title={title} placement={placement}>
          {ANCHOR_CHOICES[anchor]}
        </Tooltip>
      </Wrapper>
    </Body>
  )
}
