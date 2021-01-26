import React from 'react'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import { Icon, Chip, ChipProps, Avatar, AvatarProps } from '@components'
import { Meta, Story } from '@storybook/react'
import { save } from '@equinor/eds-icons'

const icons = {
  save,
}

Icon.add(icons)

const Wrapper = styled.div`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(3, fit-content(100%));
`

export default {
  title: 'Components/Chips',
  component: Chip,
} as Meta

const handleDelete = action('onDelete')
const handleClick = action('onClick')

const CatImage = (props: Partial<AvatarProps>) => (
  <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} alt="cat" {...props} />
)

export const Default: Story<ChipProps> = (args) => (
  <Chip {...args}>Play with me</Chip>
)

export const Text: Story<ChipProps> = () => (
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
      error + deletable + clickable
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
)

export const TextAndIcon: Story<ChipProps> = () => (
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
      error + deletable + clickable
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
)
export const TextAndAvatar: Story<ChipProps> = () => (
  <Wrapper>
    <Chip>
      <CatImage />
      normal
    </Chip>
    <Chip variant="active">
      <CatImage />
      active
    </Chip>
    <Chip variant="active" onDelete={handleDelete}>
      <CatImage />
      active + deletable
    </Chip>
    <Chip variant="error">
      <CatImage />
      error
    </Chip>
    <Chip variant="error" onDelete={handleDelete}>
      <CatImage />
      error + deletable
    </Chip>
    <Chip variant="error" onDelete={handleDelete} onClick={handleClick}>
      <CatImage />
      error + deletable + clickable
    </Chip>
    <Chip onClick={handleClick}>
      <CatImage />
      clickable
    </Chip>
    <Chip onDelete={handleDelete}>
      <CatImage />
      deletable
    </Chip>
    <Chip onDelete={handleDelete} onClick={handleClick}>
      <CatImage />
      deletable + clickable
    </Chip>
    <Chip onDelete={handleDelete} disabled>
      <CatImage />
      disabled
    </Chip>
  </Wrapper>
)

TextAndIcon.storyName = 'Text and icon'
TextAndAvatar.storyName = 'Text and avatar'
