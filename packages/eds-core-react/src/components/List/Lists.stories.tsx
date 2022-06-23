import { List, ListProps } from '../..'
import { ComponentMeta, Story } from '@storybook/react'
import { Stack } from './../../../.storybook/components'
import page from './List.docs.mdx'

const start = '15'

export default {
  title: 'Data Display/Lists',
  component: List,
  subcomponents: { Item: List.Item },
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Stack>
          <Story />
        </Stack>
      )
    },
  ],
} as ComponentMeta<typeof List>

export const Introduction: Story<ListProps> = (args) => {
  return (
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
}

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
