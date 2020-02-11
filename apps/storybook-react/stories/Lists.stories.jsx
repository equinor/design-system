import React from 'react'
import styled from 'styled-components'
import { List, Typography } from '@equinor/eds-core-react'

const { ListItem } = List

const start = '15'

export default {
  title: 'Components|Lists',
  component: List,
}

const Wrapper = styled.div`
  margin: 32px;
`

export const allLists = () => (
  <Wrapper>
    <Typography variant="h1">Lists</Typography>
    <Typography variant="h2">Unordered list</Typography>
    <List variant="bullet">
      <ListItem className="some-class">List item</ListItem>
      <ListItem>List item</ListItem>
      <ListItem>
        List item
        <List>
          <ListItem>List item</ListItem>
          <ListItem>List item</ListItem>
          <ListItem>List item</ListItem>
        </List>
      </ListItem>
    </List>
    <Typography variant="h2">Ordered list</Typography>
    <List variant="numbered">
      <ListItem>List item</ListItem>
      <ListItem>
        List item
        <List variant="numbered">
          <ListItem>List item</ListItem>
          <ListItem>List item</ListItem>
          <ListItem>
            List item
            <List variant="numbered">
              <ListItem>List item</ListItem>
              <ListItem>List item</ListItem>
              <ListItem>List item</ListItem>
            </List>
          </ListItem>
        </List>
      </ListItem>
      <ListItem>List item</ListItem>
    </List>
    <Typography variant="h2">Ordered list starting from {start}</Typography>
    <List variant="numbered" start={start}>
      <ListItem>List item</ListItem>
      <ListItem>List item</ListItem>
      <ListItem>List item</ListItem>
      <ListItem>List item</ListItem>
      <ListItem>List item</ListItem>
      <ListItem>List item</ListItem>
      <ListItem>List item</ListItem>
      <ListItem>List item</ListItem>
    </List>
  </Wrapper>
)
