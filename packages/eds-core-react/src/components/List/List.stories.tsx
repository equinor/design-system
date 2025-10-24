import { List, ListProps } from '../..'
import { StoryFn, Meta } from '@storybook/react-vite'
import { Stack } from '../../../.storybook/components'
import page from './List.docs.mdx'

const start = '15'

const meta: Meta<typeof List> = {
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
}

export default meta

export const Introduction: StoryFn<ListProps> = (args) => {
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

export const Unordered: StoryFn<ListProps> = () => (
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

export const Ordered: StoryFn<ListProps> = () => (
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

export const WithStartOption: StoryFn<ListProps> = () => (
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
