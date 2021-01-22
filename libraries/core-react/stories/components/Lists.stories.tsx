import React from 'react'
import { List, ListProps } from '@components'
import { Meta, Story } from '@storybook/react'

const { ListItem } = List

const start = '15'

export default {
  title: 'Components/Lists',
  component: List,
} as Meta

export const Default: Story<ListProps> = (args) => (
  <List {...args}>
    <ListItem>List item</ListItem>
    <ListItem>List item</ListItem>
    <ListItem>
      List item
      <List {...args}>
        <ListItem>List item</ListItem>
        <ListItem>List item</ListItem>
        <ListItem>List item</ListItem>
      </List>
    </ListItem>
  </List>
)

export const Unordered: Story<ListProps> = () => (
  <List variant="bullet">
    <ListItem>List item</ListItem>
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
)

export const Ordered: Story<ListProps> = () => (
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
)

export const OrderedStartingOn15: Story<ListProps> = () => (
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
)
