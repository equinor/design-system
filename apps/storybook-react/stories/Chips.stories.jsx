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
  grid-template-columns: repeat(3, fit-content(100%));
`

export default {
  title: 'Components/Chips',
  component: Chip,
  decorators: [withKnobs],
}

const handleDelete = (x) => console.log('Triggered handleDelete!', x)
const handleClick = (x) => console.log('Triggered handleClick!', x)

export const Examples = () => (
  <Container>
    <Typography variant="h2">Text</Typography>
    <Wrapper>
      <Chip>normal</Chip>
      <Chip variant="active">active</Chip>
      <Chip variant="active" onDelete={handleDelete}>
        active + deletable
      </Chip>
      <Chip variant="error">error</Chip>
      <Chip variant="error" onDelete={handleDelete}>
        error + deletable
      </Chip>
      <Chip variant="error" onDelete={handleDelete} onClick={handleClick}>
        error + deletable
      </Chip>
      <Chip onClick={handleClick}>clickable</Chip>
      <Chip onDelete={handleDelete}>deletable</Chip>
      <Chip onDelete={handleDelete} onClick={handleClick}>
        deletable + clickable
      </Chip>
      <Chip onDelete={handleDelete} disabled>
        disabled
      </Chip>
    </Wrapper>

    <Typography variant="h2">Text + Icon</Typography>
    <Wrapper>
      <Chip>
        <Icon name="save" />
        normal
      </Chip>
      <Chip variant="active">
        <Icon name="save" />
        active
      </Chip>
      <Chip variant="active" onDelete={handleDelete}>
        <Icon name="save" />
        active + deletable
      </Chip>
      <Chip variant="error">
        <Icon name="save" />
        error
      </Chip>
      <Chip variant="error" onDelete={handleDelete}>
        <Icon name="save" />
        error + deletable
      </Chip>
      <Chip variant="error" onDelete={handleDelete} onClick={handleClick}>
        <Icon name="save" />
        error + deletable
      </Chip>
      <Chip onClick={handleClick}>
        <Icon name="save" />
        clickable
      </Chip>
      <Chip onDelete={handleDelete}>
        <Icon name="save" />
        deletable
      </Chip>
      <Chip onDelete={handleDelete} onClick={handleClick}>
        <Icon name="save" />
        deletable + clickable
      </Chip>
      <Chip onDelete={handleDelete} disabled>
        <Icon name="save" />
        disabled
      </Chip>
    </Wrapper>

    <Typography variant="h2">Text + Avatar</Typography>
    <Wrapper>
      <Chip>
        <Avatar src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
        normal
      </Chip>
      <Chip variant="active">
        <Avatar src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
        active
      </Chip>
      <Chip variant="active" onDelete={handleDelete}>
        <Avatar src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
        active + deletable
      </Chip>
      <Chip variant="error">
        <Avatar src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
        error
      </Chip>
      <Chip variant="error" onDelete={handleDelete}>
        <Avatar src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
        error + deletable
      </Chip>
      <Chip variant="error" onDelete={handleDelete} onClick={handleClick}>
        <Avatar src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
        error + deletable + clickable
      </Chip>
      <Chip onClick={handleClick}>
        <Avatar src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
        clickable
      </Chip>
      <Chip onDelete={handleDelete}>
        <Avatar src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
        deletable
      </Chip>
      <Chip onDelete={handleDelete} onClick={handleClick}>
        <Avatar src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
        deletable + clickable
      </Chip>
      <Chip onDelete={handleDelete} disabled>
        <Avatar src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
        disabled
      </Chip>
    </Wrapper>
  </Container>
)
