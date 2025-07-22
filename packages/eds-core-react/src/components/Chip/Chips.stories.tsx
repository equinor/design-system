import { action } from 'storybook/actions'
import { Icon, Chip, ChipProps, Avatar, AvatarProps } from '../..'
import { StoryFn, Meta } from '@storybook/react-vite'
import { save } from '@equinor/eds-icons'
import { Stack } from './../../../.storybook/components'
import page from './Chips.docs.mdx'

const icons = {
  save,
}

Icon.add(icons)

const meta: Meta<typeof Chip> = {
  title: 'Data Display/Chips',
  component: Chip,
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Stack
          style={{
            display: 'grid',
            gridGap: '32px',
            gridTemplateColumns: 'repeat(4, auto)',
          }}
        >
          <Story />
        </Stack>
      )
    },
  ],
}

export default meta

const handleDelete = action('onDelete')
const handleClick = action('onClick')

const CatImage = (props: Partial<AvatarProps>) => (
  <Avatar src={'https://i.imgur.com/UM3mrju.jpg'} alt="cat" {...props} />
)

export const Introduction: StoryFn<ChipProps> = (args) => (
  <Chip {...args}>Play with me</Chip>
)

export const Text: StoryFn<ChipProps> = () => (
  <>
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
  </>
)

export const TextAndIcon: StoryFn<ChipProps> = () => (
  <>
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
  </>
)
TextAndIcon.storyName = 'Text and icon'

export const TextAndAvatar: StoryFn<ChipProps> = () => (
  <>
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
  </>
)
TextAndAvatar.storyName = 'Text and avatar'
