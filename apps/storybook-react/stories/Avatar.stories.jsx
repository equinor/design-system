import React from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Avatar, Typography } from '@equinor/eds-core-react'
import catImg from '../images/cat.jpg'

const image = catImg

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
  decorators: [withKnobs],
}

export const Examples = () => (
  <Container>
    <Typography variant="h2">Sizes</Typography>
    <Wrapper>
      <Avatar src={image} size={16} alt="avatar"></Avatar>
      <Avatar src={image} size={24} alt="avatar"></Avatar>
      <Avatar src={image} size={32} alt="avatar"></Avatar>
      <Avatar src={image} size={40} alt="avatar"></Avatar>
      <Avatar src={image} size={48} alt="avatar"></Avatar>
    </Wrapper>
    <Typography variant="h2">Disabled</Typography>
    <Wrapper>
      <Avatar src={image} disabled alt="avatar"></Avatar>
    </Wrapper>
    <Typography variant="h2">Knobs</Typography>
    <Wrapper>
      <Avatar
        alt="avatar"
        src={text('Source', 'https://i.imgur.com/UM3mrju.jpg')}
        size={select('Sizes', [16, 24, 32, 40, 48], 24)}
        disabled={boolean('Disabled', false)}
      ></Avatar>
    </Wrapper>
  </Container>
)
