import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import { Icon, Chip, ChipProps, Avatar, AvatarProps } from '../..'
import { Meta, Story } from '@storybook/react'
import { save } from '@equinor/eds-icons'
import { Stack as SBStack } from './../../../.storybook/components'
import page from './Chips.docs.mdx'

const icons = {
  save,
}

Icon.add(icons)

const Stack = styled(SBStack)`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(4, fit-content(100%));
`

export default {
  title: 'Data Display/Chips',
  component: Chip,
  parameters: {
    docs: {
      page,
    },
  },
} as Meta

const handleDelete = action('onDelete')
const handleClick = action('onClick')

const CatImage = (props: Partial<AvatarProps>) => (
  <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} alt="cat" {...props} />
)

export const Introduction: Story<ChipProps> = (args) => (
  <Stack>
    <Chip {...args}>Play with me</Chip>
  </Stack>
)

export const Text: Story<ChipProps> = () => (
  <Stack>
    <Chip>NORMAL</Chip>
    <Chip variant="active">ACTIVE</Chip>
    <Chip variant="error">ERROR</Chip>
    <Chip disabled>DISABLED</Chip>
    <Chip onClick={handleClick}>clickable</Chip>
    <Chip variant="active" onClick={handleClick}>
      clickable
    </Chip>
    <Chip variant="error" onClick={handleClick}>
      clickable
    </Chip>
    <Chip onDelete={handleDelete} disabled>
      deletable
    </Chip>
    <Chip onDelete={handleDelete}>deletable</Chip>
    <Chip variant="active" onDelete={handleDelete}>
      deletable
    </Chip>
    <Chip variant="error" onDelete={handleDelete}>
      deletable
    </Chip>
    <div></div>
    <Chip onDelete={handleDelete} onClick={handleClick}>
      deletable + clickable
    </Chip>
    <Chip variant="active" onDelete={handleDelete} onClick={handleClick}>
      deletable + clickable
    </Chip>
    <Chip variant="error" onDelete={handleDelete} onClick={handleClick}>
      deletable + clickable
    </Chip>
  </Stack>
)

export const TextAndIcon: Story<ChipProps> = () => (
  <Stack>
    <Chip>
      <Icon name="save" />
      NORMAL
    </Chip>
    <Chip variant="active">
      <Icon name="save" />
      ACTIVE
    </Chip>
    <Chip variant="error">
      <Icon name="save" />
      ERROR
    </Chip>
    <Chip disabled>
      <Icon name="save" />
      DISABLED
    </Chip>
    <Chip onClick={handleClick}>
      <Icon name="save" />
      clickable
    </Chip>
    <Chip variant="active" onClick={handleClick}>
      <Icon name="save" />
      clickable
    </Chip>
    <Chip variant="error" onClick={handleClick}>
      <Icon name="save" />
      clickable
    </Chip>
    <Chip onDelete={handleDelete} disabled>
      <Icon name="save" />
      deletable
    </Chip>
    <Chip onDelete={handleDelete}>
      <Icon name="save" />
      deletable
    </Chip>
    <Chip variant="active" onDelete={handleDelete}>
      <Icon name="save" />
      deletable
    </Chip>
    <Chip variant="error" onDelete={handleDelete}>
      <Icon name="save" />
      deletable
    </Chip>
    <div></div>
    <Chip onDelete={handleDelete} onClick={handleClick}>
      <Icon name="save" />
      deletable + clickable
    </Chip>
    <Chip variant="active" onDelete={handleDelete} onClick={handleClick}>
      <Icon name="save" />
      deletable + clickable
    </Chip>
    <Chip variant="error" onDelete={handleDelete} onClick={handleClick}>
      <Icon name="save" />
      deletable + clickable
    </Chip>
  </Stack>
)
export const TextAndAvatar: Story<ChipProps> = () => (
  <Stack>
    <Chip>
      <CatImage />
      NORMAL
    </Chip>
    <Chip variant="active">
      <CatImage />
      ACTIVE
    </Chip>
    <Chip variant="error">
      <CatImage />
      ERROR
    </Chip>
    <Chip disabled>
      <CatImage />
      DISABLED
    </Chip>
    <Chip onClick={handleClick}>
      <CatImage />
      clickable
    </Chip>
    <Chip variant="active" onClick={handleClick}>
      <CatImage />
      clickable
    </Chip>
    <Chip variant="error" onClick={handleClick}>
      <CatImage />
      clickable
    </Chip>
    <Chip onDelete={handleDelete} disabled>
      <CatImage />
      deletable
    </Chip>
    <Chip onDelete={handleDelete}>
      <CatImage />
      deletable
    </Chip>
    <Chip variant="active" onDelete={handleDelete}>
      <CatImage />
      deletable
    </Chip>
    <Chip variant="error" onDelete={handleDelete}>
      <CatImage />
      deletable
    </Chip>
    <div></div>
    <Chip onDelete={handleDelete} onClick={handleClick}>
      <CatImage />
      deletable + clickable
    </Chip>
    <Chip variant="active" onDelete={handleDelete} onClick={handleClick}>
      <CatImage />
      deletable + clickable
    </Chip>
    <Chip variant="error" onDelete={handleDelete} onClick={handleClick}>
      <CatImage />
      deletable + clickable
    </Chip>
  </Stack>
)

TextAndIcon.storyName = 'Text and icon'
TextAndAvatar.storyName = 'Text and avatar'
