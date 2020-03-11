import React from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Avatar, Typography } from '@equinor/eds-core-react'

const image = 'https://i.imgur.com/UM3mrju.jpg'

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
      <Avatar src={image} size={16}></Avatar>
      <Avatar src={image} size={24}></Avatar>
      <Avatar src={image} size={32}></Avatar>
      <Avatar src={image} size={40}></Avatar>
      <Avatar src={image} size={48}></Avatar>
    </Wrapper>
    <Typography variant="h2">Knobs</Typography>
    <Wrapper>
      <Avatar
        src={text('Source', image)}
        size={select('Sizes', [16, 24, 32, 40, 48], 24)}
      ></Avatar>
    </Wrapper>
  </Container>
)
