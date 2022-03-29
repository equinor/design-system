import styled from 'styled-components'
import { Divider, DividerProps, Card, Typography, Avatar } from '../..'
// import { chevron_left, edit_text, more_vertical } from '@equinor/eds-icons'
import { Story, Meta } from '@storybook/react/types-6-0'
import { Stack as SBStack } from './../../../.storybook/components'
import page from './Divider.docs.mdx'

export default {
  title: 'Data Display/Divider',
  component: Divider,
  argTypes: {
    color: { control: 'radio' },
    variant: { control: 'radio' },
  },
  parameters: {
    docs: {
      page,
    },
  },
} as Meta

const Stack = styled(SBStack)`
  /* display: block; */
  padding: 32px;
  /* background-color: #999; */
  background: #ebebeb;
`

export const Introduction: Story<DividerProps> = (args) => (
  <>
    <Divider {...args} />
    <Divider {...args} />
    <Divider {...args} />
  </>
)

export const FullBleed: Story<DividerProps> = () => (
  <Stack>
    <Card style={{ width: '50%' }}>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h4">NEWS</Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Content>
        <Typography variant="caption">Today</Typography>
        <br />
        <Typography variant="overline">News title</Typography>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Typography>
      </Card.Content>
      <Divider style={{ width: '100%' }} variant="small" />
      <Card.Content>
        <Typography variant="overline">News title</Typography>
        <Typography>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </Typography>
      </Card.Content>
      <Divider style={{ width: '100%' }} variant="small" />
      <Card.Content>
        <Typography variant="overline">News title</Typography>
        <Typography>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </Typography>
      </Card.Content>
    </Card>
  </Stack>
)

export const Inset: Story<DividerProps> = () => (
  <Stack>
    <Card style={{ width: '50%' }}>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h4">ALL</Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Header>
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
        <Card.HeaderTitle>
          <Typography variant="h6">Title goes here</Typography>
          <Typography variant="body_short">
            Ut enim ad minim veniam, quis nostrud exercitation.
          </Typography>
          <Divider style={{ width: '100%' }} variant="small" />
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Header>
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
        <Card.HeaderTitle>
          <Typography variant="h6">Title goes here</Typography>
          <Typography variant="body_short">
            Ut enim ad minim veniam, quis nostrud exercitation.
          </Typography>
          <Divider style={{ width: '100%' }} variant="small" />
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Header>
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
        <Card.HeaderTitle>
          <Typography variant="h6">Title goes here</Typography>
          <Typography variant="body_short">
            Ut enim ad minim veniam, quis nostrud exercitation.
          </Typography>
        </Card.HeaderTitle>
      </Card.Header>
    </Card>
  </Stack>
)
