import React from 'react'
import { Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import './../style.css'

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
`

export default {
  title: 'Components|Typography',
  component: Typography,
}

export const headings = () => (
  <Wrapper>
    <Typography variant="h1" bold>
      Heading 1 bold
    </Typography>
    <Typography variant="h1">Heading 1</Typography>
    <Typography variant="h2">Heading 2</Typography>
    <Typography variant="h3">Heading 3</Typography>
    <Typography variant="h4">Heading 4</Typography>
    <Typography variant="h5">Heading 5</Typography>
    <Typography variant="h6">Heading 6</Typography>
  </Wrapper>
)

export const paragraphs = () => (
  <Wrapper>
    <Typography variant="body_short" link>
      Body short link
    </Typography>
    <Typography variant="body_short">Body short</Typography>
    <Typography variant="body_short" italic>
      Body short italic
    </Typography>
    <Typography variant="body_short" bold>
      Body short bold
    </Typography>
    <Typography variant="body_short" bold italic>
      Body short bold italic
    </Typography>
    <Typography variant="body_long" link>
      Body long link
    </Typography>
    <Typography variant="body_long">Body long</Typography>
    <Typography variant="body_long" italic>
      Body long italic
    </Typography>
    <Typography variant="body_long" bold>
      Body long bold
    </Typography>

    <Typography variant="body_long" bold italic>
      Body long bold italic
    </Typography>
    <Typography variant="overline">Overline</Typography>
    <Typography variant="ingress">Ingress</Typography>
    <Typography variant="caption">Caption</Typography>
    <Typography variant="meta">Meta</Typography>
  </Wrapper>
)

export const colors = () => (
  <Wrapper>
    <Typography color="primary"> Primary</Typography>
    <Typography color="secondary">Secondary</Typography>
    <Typography color="danger">Danger</Typography>
    <Typography color="warning">Warning</Typography>
    <Typography color="success">Success</Typography>
    <Typography color="disabled">Disabled</Typography>
  </Wrapper>
)

export const custom = () => (
  <Wrapper>
    <Typography group="navigation" variant="label">
      Navigation / Label
    </Typography>
    <Typography group="navigation" variant="menu_title">
      Navigation / Menu / Title
    </Typography>
    <Typography group="table" variant="cell_text">
      Table / Cell / Text
    </Typography>
    <Typography group="table" variant="cell_text" fontWeight="medium">
      Table / Cell / Text / Medium
    </Typography>
    <Typography group="table" variant="cell_text" bold>
      Table / Cell / Text / Bold
    </Typography>
    <Typography group="table" variant="cell_text" link>
      Table / Cell / Text / Bold / Link
    </Typography>

    <Typography variant="h3" fontWeight="bold">
      Heading 3 Bold
    </Typography>
    <Typography variant="ingress" fontWeight="bold">
      Ingress Bold
    </Typography>
  </Wrapper>
)
