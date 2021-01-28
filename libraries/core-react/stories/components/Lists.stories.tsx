import React from 'react'
import { List, ListProps } from '@components'
import { Meta, Story } from '@storybook/react'

const start = '15'

export default {
  title: 'Components/Lists',
  component: List,
  parameters: {
    docs: {
      description: {
        component: `Lists organise information into related groups of content.
        `,
      },
    },
  },
  subcomponents: { Item: List.Item },
} as Meta

export const Default: Story<ListProps> = (args) => (
  <List {...args}>
    <List.Item>List item</List.Item>
    <List.Item>List item</List.Item>
    <List.Item>
      List item
      <List {...args}>
        <List.Item>List item</List.Item>
        <List.Item>List item</List.Item>
        <List.Item>List item</List.Item>
      </List>
    </List.Item>
  </List>
)

export const Unordered: Story<ListProps> = () => (
  <List variant="bullet">
    <List.Item>List item</List.Item>
    <List.Item>List item</List.Item>
    <List.Item>
      List item
      <List>
        <List.Item>List item</List.Item>
        <List.Item>List item</List.Item>
        <List.Item>List item</List.Item>
      </List>
    </List.Item>
  </List>
)

export const Ordered: Story<ListProps> = () => (
  <List variant="numbered">
    <List.Item>List item</List.Item>
    <List.Item>
      List item
      <List variant="numbered">
        <List.Item>List item</List.Item>
        <List.Item>List item</List.Item>
        <List.Item>
          List item
          <List variant="numbered">
            <List.Item>List item</List.Item>
            <List.Item>List item</List.Item>
            <List.Item>List item</List.Item>
          </List>
        </List.Item>
      </List>
    </List.Item>
    <List.Item>List item</List.Item>
  </List>
)

export const OrderedStartingOn15: Story<ListProps> = () => (
  <List variant="numbered" start={start}>
    <List.Item>List item</List.Item>
    <List.Item>List item</List.Item>
    <List.Item>List item</List.Item>
    <List.Item>List item</List.Item>
    <List.Item>List item</List.Item>
    <List.Item>List item</List.Item>
    <List.Item>List item</List.Item>
    <List.Item>List item</List.Item>
  </List>
)
