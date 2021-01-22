import React from 'react'
import styled from 'styled-components'
import { Story, Meta } from '@storybook/react'
import { Avatar, AvatarProps, Typography } from '@components'

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
  title: 'Components/Avatar',
  component: Avatar,
} as Meta

export const Default: Story<AvatarProps> = (args) => (
  <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} {...args} />
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
