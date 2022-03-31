import styled from 'styled-components'
import {
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  DividerProps,
  Typography,
} from '../..'
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
  padding: 32px;
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

export const Middle: Story<DividerProps> = () => (
  <Stack>
    <Card style={{ width: '50%' }}>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h4">TICKET</Typography>
        </Card.HeaderTitle>
        <Typography variant="h6">20.02.2020</Typography>
      </Card.Header>
      <Card.Content>
        <Typography variant="overline">Description</Typography>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Typography>
        <Divider style={{ width: '100%' }} />
      </Card.Content>
      <Card.Content>
        <Typography>Choose option</Typography>
      </Card.Content>
      <Card.Actions>
        <Chip>active</Chip>
        <Chip variant="active">pause</Chip>
        <Chip>disable</Chip>
        <Chip variant="error">stop</Chip>
      </Card.Actions>
      <Card.Actions>
        <Button style={{ marginTop: '16px' }} variant="outlined">
          SUBMIT TICKET
        </Button>
      </Card.Actions>
    </Card>
  </Stack>
)
