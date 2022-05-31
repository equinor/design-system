import { Story, ComponentMeta } from '@storybook/react'
import {
  Avatar,
  AvatarProps,
  Button,
  Card,
  Divider,
  Icon,
  Typography,
} from '../..'
import { Stack } from './../../../.storybook/components'
import page from './Avatar.docs.mdx'

export default {
  title: 'Data Display/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Avatar>

const iconSize = 24

export const Introduction: Story<AvatarProps> = (args) => (
  <Stack>
    <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} {...args} />
  </Stack>
)

export const Size: Story<AvatarProps> = () => (
  <Stack>
    <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} size={16} alt="avatar" />
    <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} size={24} alt="avatar" />
    <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} size={32} alt="avatar" />
    <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} size={40} alt="avatar" />
    <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} size={48} alt="avatar" />
  </Stack>
)

export const Disabled: Story<AvatarProps> = () => (
  <Stack>
    <Avatar
      src={'https://i.imgur.com/UM3mrju.jpg'}
      disabled
      size={48}
      alt="avatar"
    />
  </Stack>
)

export const Context: Story<AvatarProps> = () => (
  <>
    <Stack style={{ background: '#ebebeb', padding: '32px' }}>
      <Card style={{ width: '50%' }}>
        <Card.Header>
          <Card.HeaderTitle>
            <Typography variant="h4">ALL</Typography>
          </Card.HeaderTitle>
        </Card.Header>
        <Card.Header>
          <Avatar
            alt="Kitten"
            src="https://i.imgur.com/UM3mrju.jpg"
            size={40}
          />
          <Card.HeaderTitle>
            <Typography variant="h5">Title goes here</Typography>
            <Typography variant="body_short">
              Ut enim ad minim veniam, quis nostrud exercitation.
            </Typography>
            <Divider style={{ width: '100%' }} variant="small" />
          </Card.HeaderTitle>
        </Card.Header>
        <Card.Header>
          <Avatar
            alt="Kitten"
            src="https://i.imgur.com/UM3mrju.jpg"
            size={40}
          />
          <Card.HeaderTitle>
            <Typography variant="h5">Title goes here</Typography>
            <Typography variant="body_short">
              Ut enim ad minim veniam, quis nostrud exercitation.
            </Typography>
            <Divider style={{ width: '100%' }} variant="small" />
          </Card.HeaderTitle>
        </Card.Header>
        <Card.Header>
          <Avatar
            alt="Kitten"
            src="https://i.imgur.com/UM3mrju.jpg"
            size={40}
          />
          <Card.HeaderTitle>
            <Typography variant="h5">Title goes here</Typography>
            <Typography variant="body_short">
              Ut enim ad minim veniam, quis nostrud exercitation.
            </Typography>
          </Card.HeaderTitle>
        </Card.Header>
      </Card>
    </Stack>

    <Stack style={{ background: '#ebebeb', padding: '32px' }}>
      <Card variant="info">
        <Card.Header>
          <Card.HeaderTitle>
            <Typography variant="h5">Title goes here</Typography>
            <Typography variant="body_short">Body short</Typography>
          </Card.HeaderTitle>
          <Avatar
            alt="Kitten"
            src="https://i.imgur.com/UM3mrju.jpg"
            size={40}
          />
        </Card.Header>
      </Card>
      <Card variant="warning">
        <Card.Header>
          <Avatar
            alt="Kitten"
            src="https://i.imgur.com/UM3mrju.jpg"
            size={40}
          />
          <Card.HeaderTitle>
            <Typography variant="h5">Title goes here</Typography>
            <Typography variant="caption">Caption</Typography>
          </Card.HeaderTitle>
        </Card.Header>
      </Card>
      <Card variant="danger">
        <Card.Header>
          <Avatar
            alt="Kitten"
            src="https://i.imgur.com/UM3mrju.jpg"
            size={40}
          />
          <Card.HeaderTitle>
            <Typography variant="h5">Title goes here</Typography>
            <Typography variant="caption">Caption</Typography>
          </Card.HeaderTitle>
          <Button variant="ghost_icon">
            <Icon
              name="more_vertical"
              title="more action"
              size={iconSize}
            ></Icon>
          </Button>
        </Card.Header>
      </Card>
    </Stack>
  </>
)
