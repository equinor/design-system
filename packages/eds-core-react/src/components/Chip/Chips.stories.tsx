import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import { Icon, Chip, ChipProps, Avatar, AvatarProps } from '../..'
import { ComponentMeta, Story } from '@storybook/react'
import { save } from '@equinor/eds-icons'
import page from './Chips.docs.mdx'

const icons = {
  save,
}

Icon.add(icons)

const Wrapper = styled.div`
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
} as ComponentMeta<typeof Chip>

const handleDelete = action('onDelete')
const handleClick = action('onClick')

const CatImage = (props: Partial<AvatarProps>) => (
  <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} alt="cat" {...props} />
)

export const Introduction: Story<ChipProps> = (args) => (
  <Wrapper>
    <Chip {...args}>Play with me</Chip>
  </Wrapper>
)

export const Text: Story<ChipProps> = () => (
  <Wrapper>
    <Chip>Normal</Chip>
    <Chip variant="active">Active</Chip>
    <Chip variant="error">Error</Chip>
    <Chip disabled>Disabled</Chip>
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
  </Wrapper>
)

export const TextAndIcon: Story<ChipProps> = () => (
  <Wrapper>
    <Chip>
      <Icon name="save" />
      Normal
    </Chip>
    <Chip variant="active">
      <Icon name="save" />
      Active
    </Chip>
    <Chip variant="error">
      <Icon name="save" />
      Error
    </Chip>
    <Chip disabled>
      <Icon name="save" />
      Disabled
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
  </Wrapper>
)
export const TextAndAvatar: Story<ChipProps> = () => (
  <Wrapper>
    <Chip>
      <CatImage />
      Normal
    </Chip>
    <Chip variant="active">
      <CatImage />
      Active
    </Chip>
    <Chip variant="error">
      <CatImage />
      Error
    </Chip>
    <Chip disabled>
      <CatImage />
      Disabled
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
  </Wrapper>
)

TextAndIcon.storyName = 'Text and icon'
TextAndAvatar.storyName = 'Text and avatar'
