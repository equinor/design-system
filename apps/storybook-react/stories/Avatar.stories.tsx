import React from 'react'
import styled from 'styled-components'
import { Story, Meta } from '@storybook/react'
import { Avatar, AvatarProps, Typography } from '@equinor/eds-core-react'
import catImg from '../images/cat.jpg'

const image: string = catImg

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
  <Avatar src={image} {...args} />
)

export const Examples: Story<AvatarProps> = () => (
  <Container>
    <Typography variant="h2">Sizes</Typography>
    <Wrapper>
      <Avatar src={image} size={16} alt="avatar" />
      <Avatar src={image} size={24} alt="avatar" />
      <Avatar src={image} size={32} alt="avatar" />
      <Avatar src={image} size={40} alt="avatar" />
      <Avatar src={image} size={48} alt="avatar" />
    </Wrapper>
    <Typography variant="h2">Disabled</Typography>
    <Wrapper>
      <Avatar src={image} disabled alt="avatar" />
    </Wrapper>
  </Container>
)
