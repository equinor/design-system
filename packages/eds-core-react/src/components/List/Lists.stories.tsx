import { List, ListProps } from '../..'
import { ComponentMeta, Story } from '@storybook/react'
import page from './List.docs.mdx'

const start = '15'

export default {
  title: 'Data Display/Lists',
  component: List,
  parameters: {
    docs: {
      page,
    },
  },
  subcomponents: { Item: List.Item },
} as ComponentMeta<typeof List>

export const Introduction: Story<ListProps> = (args) => (
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

export const WithStartOption: Story<ListProps> = () => (
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
WithStartOption.storyName = 'With start option'
