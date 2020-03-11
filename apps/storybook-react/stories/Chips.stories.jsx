import React from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Icon, Chip, Avatar, Typography } from '@equinor/eds-core-react'
import { save } from '@equinor/eds-icons'

const icons = {
  save,
}

Icon.add(icons)

const Container = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 16px;
`

const Wrapper = styled.div`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(6, fit-content(100%));
`

export default {
  title: 'Components/Chips',
  component: Chip,
  decorators: [withKnobs],
}

const onDelete = (x) => console.log('Triggered onDelete!', x)
const onClick = (x) => console.log('Triggered onClick!', x)

export const Examples = () => (
  <Container>
    <Typography variant="h2">Text</Typography>
    <Wrapper>
      <Chip>normal</Chip>
      <Chip active>active</Chip>
      <Chip onClick={onClick}>clickable</Chip>
      <Chip onDelete={onDelete}>deletable</Chip>
      <Chip onDelete={onDelete} onClick={onClick}>
        deletable + clickable
      </Chip>
      <Chip onDelete={onDelete} disabled>
        disabled
      </Chip>
    </Wrapper>

    <Typography variant="h2">Text + Icon</Typography>
    <Wrapper>
      <Chip>
        <Icon name="save" />
        normal
      </Chip>
      <Chip active>
        <Icon name="save" />
        active
      </Chip>
      <Chip onClick={onClick}>
        <Icon name="save" />
        clickable
      </Chip>
      <Chip onDelete={onDelete}>
        <Icon name="save" />
        deletable
      </Chip>
      <Chip onDelete={onDelete} onClick={onClick}>
        <Icon name="save" />
        deletable + clickable
      </Chip>
      <Chip onDelete={onDelete} disabled>
        <Icon name="save" />
        disabled
      </Chip>
    </Wrapper>

    <Typography variant="h2">Text + Avatar</Typography>
    <Wrapper>
      <Chip>
        <Avatar src="https://i.imgur.com/UM3mrju.jpg" />
        normal
      </Chip>
      <Chip active>
        <Avatar src="https://i.imgur.com/UM3mrju.jpg" />
        active
      </Chip>
      <Chip onClick={onClick}>
        <Avatar src="https://i.imgur.com/UM3mrju.jpg" />
        clickable
      </Chip>
      <Chip onDelete={onDelete}>
        <Avatar src="https://i.imgur.com/UM3mrju.jpg" />
        deletable
      </Chip>
      <Chip onDelete={onDelete} onClick={onClick}>
        <Avatar src="https://i.imgur.com/UM3mrju.jpg" />
        deletable + clickable
      </Chip>
      <Chip onDelete={onDelete} disabled>
        <Avatar src="https://i.imgur.com/UM3mrju.jpg" />
        disabled
      </Chip>
    </Wrapper>
  </Container>
)
