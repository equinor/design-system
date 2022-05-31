import styled from 'styled-components'
import { Story, ComponentMeta } from '@storybook/react'
import { Avatar, AvatarProps, Typography } from '../..'
import { Stack } from './../../../.storybook/components'
import page from './Avatar.docs.mdx'

const Container = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 16px;
`
const Wrapper = styled.div`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(5, fit-content(100%));
`

export default {
  title: 'Data Display/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Avatar>

export const Introduction: Story<AvatarProps> = (args) => (
  <Stack>
    <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} {...args} />
  </Stack>
)

export const Examples: Story<AvatarProps> = () => (
  <Container>
    <Typography variant="h2">Sizes</Typography>
    <Wrapper>
      <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} size={16} alt="avatar" />
      <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} size={24} alt="avatar" />
      <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} size={32} alt="avatar" />
      <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} size={40} alt="avatar" />
      <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} size={48} alt="avatar" />
    </Wrapper>
    <Typography variant="h2">Disabled</Typography>
    <Wrapper>
      <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} disabled alt="avatar" />
    </Wrapper>
  </Container>
)
