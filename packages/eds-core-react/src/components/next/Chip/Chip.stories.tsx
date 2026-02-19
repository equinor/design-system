import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { save } from '@equinor/eds-icons'
import { Chip } from './Chip'
import { Avatar } from '../../Avatar'
import type { ChipProps } from './Chip.types'

type StoryArgs = ChipProps

const meta: Meta<StoryArgs> = {
  title: 'EDS 2.0 (beta)/Data Display/Chip',
  component: Chip,
  argTypes: {
    selected: {
      control: 'boolean',
      description: 'Whether the chip is selected (accent styling + checkmark)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
  args: {
    selected: false,
    disabled: false,
  },
}

export default meta

type Story = StoryObj<StoryArgs>

const Wrapper = ({
  children,
  gap = 8,
}: {
  children: React.ReactNode
  gap?: number
}) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: `${gap}px`,
      alignItems: 'center',
    }}
  >
    {children}
  </div>
)

export const Introduction: Story = {
  args: {
    children: 'Play with me',
    onClick: () => {},
  },
}

export const Clickable: Story = {
  render: () => (
    <Wrapper>
      <Chip onClick={() => {}}>Default</Chip>
      <Chip onClick={() => {}} selected>
        Selected
      </Chip>
      <Chip onClick={() => {}} disabled>
        Disabled
      </Chip>
      <Chip onClick={() => {}} selected disabled>
        Disabled selected
      </Chip>
    </Wrapper>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Chip onClick={handleClick}>Default</Chip>
<Chip onClick={handleClick} selected>Selected</Chip>
<Chip onClick={handleClick} disabled>Disabled</Chip>
<Chip onClick={handleClick} selected disabled>Disabled selected</Chip>`,
      },
    },
  },
}

export const Deletable: Story = {
  render: () => (
    <Wrapper>
      <Chip onDelete={() => {}}>Default</Chip>
      <Chip onDelete={() => {}} selected>
        Selected
      </Chip>
      <Chip onDelete={() => {}} disabled>
        Disabled
      </Chip>
    </Wrapper>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Chip onDelete={handleDelete}>Default</Chip>
<Chip onDelete={handleDelete} selected>Selected</Chip>
<Chip onDelete={handleDelete} disabled>Disabled</Chip>`,
      },
    },
  },
}

export const ClickableAndDeletable: Story = {
  name: 'Clickable + Deletable',
  render: () => (
    <Wrapper>
      <Chip onClick={() => {}} onDelete={() => {}}>
        Default
      </Chip>
      <Chip onClick={() => {}} onDelete={() => {}} selected>
        Selected
      </Chip>
    </Wrapper>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Chip onClick={handleClick} onDelete={handleDelete}>Default</Chip>
<Chip onClick={handleClick} onDelete={handleDelete} selected>Selected</Chip>`,
      },
    },
  },
}

export const WithIcon: Story = {
  render: () => (
    <Wrapper>
      <Chip onClick={() => {}} icon={save}>
        Default
      </Chip>
      <Chip onClick={() => {}} icon={save} selected>
        Selected (checkmark)
      </Chip>
      <Chip onClick={() => {}} icon={save} disabled>
        Disabled
      </Chip>
    </Wrapper>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { save } from '@equinor/eds-icons'

<Chip onClick={handleClick} icon={save}>Default</Chip>
<Chip onClick={handleClick} icon={save} selected>Selected (checkmark)</Chip>
<Chip onClick={handleClick} icon={save} disabled>Disabled</Chip>`,
      },
    },
  },
}

const SelectableChip = () => {
  const [selected, setSelected] = useState(false)
  return (
    <Chip onClick={() => setSelected(!selected)} selected={selected}>
      Toggle me
    </Chip>
  )
}

export const Selectable: Story = {
  render: () => <SelectableChip />,
  parameters: {
    docs: {
      source: {
        code: `const [selected, setSelected] = useState(false)

<Chip onClick={() => setSelected(!selected)} selected={selected}>
  Toggle me
</Chip>`,
      },
    },
  },
}

const SelectableWithDeleteChip = () => {
  const [selected, setSelected] = useState(false)
  return (
    <Chip
      onClick={() => setSelected(!selected)}
      onDelete={() => alert('Deleted!')}
      selected={selected}
    >
      Toggle + delete
    </Chip>
  )
}

export const SelectableWithDelete: Story = {
  name: 'Selectable + Deletable',
  render: () => <SelectableWithDeleteChip />,
  parameters: {
    docs: {
      source: {
        code: `const [selected, setSelected] = useState(false)

<Chip
  onClick={() => setSelected(!selected)}
  onDelete={() => alert('Deleted!')}
  selected={selected}
>
  Toggle + delete
</Chip>`,
      },
    },
  },
}

export const Dropdown: Story = {
  render: () => (
    <Wrapper>
      <Chip onClick={() => {}} dropdown>
        Category
      </Chip>
      <Chip onClick={() => {}} dropdown selected>
        Category (selected)
      </Chip>
      <Chip onClick={() => {}} dropdown icon={save}>
        With icon
      </Chip>
      <Chip onClick={() => {}} dropdown disabled>
        Disabled
      </Chip>
    </Wrapper>
  ),
  parameters: {
    docs: {
      source: {
        code: `{/* Dropdown renders a trailing arrow. Menu popover is handled by the consumer. */}
<Chip onClick={openMenu} dropdown>Category</Chip>
<Chip onClick={openMenu} dropdown selected>Category (selected)</Chip>
<Chip onClick={openMenu} dropdown icon={save}>With icon</Chip>
<Chip onClick={openMenu} dropdown disabled>Disabled</Chip>`,
      },
    },
  },
}

export const WithAvatar: Story = {
  render: () => (
    <Wrapper>
      <Chip onClick={() => {}}>
        <Avatar src="https://i.pravatar.cc/48?img=1" alt="John Doe" size={16} />
        John Doe
      </Chip>
      <Chip onDelete={() => {}}>
        <Avatar
          src="https://i.pravatar.cc/48?img=2"
          alt="Jane Smith"
          size={16}
        />
        Jane Smith
      </Chip>
      <Chip onClick={() => {}} onDelete={() => {}}>
        <Avatar
          src="https://i.pravatar.cc/48?img=3"
          alt="Alex Johnson"
          size={16}
        />
        Alex Johnson
      </Chip>
      <Chip onClick={() => {}} onDelete={() => {}} selected>
        <Avatar src="https://i.pravatar.cc/48?img=4" alt="Selected" size={16} />
        Selected
      </Chip>
      <Chip onDelete={() => {}} disabled>
        <Avatar
          src="https://i.pravatar.cc/48?img=5"
          alt="Disabled"
          size={16}
          disabled
        />
        Disabled
      </Chip>
    </Wrapper>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { Avatar } from '@equinor/eds-core-react'

<Chip onClick={handleClick}>
  <Avatar src="avatar.jpg" alt="John Doe" size={16} />
  John Doe
</Chip>
<Chip onDelete={handleDelete}>
  <Avatar src="avatar.jpg" alt="Jane Smith" size={16} />
  Jane Smith
</Chip>
<Chip onClick={handleClick} onDelete={handleDelete} selected>
  <Avatar src="avatar.jpg" alt="Selected" size={16} />
  Selected
</Chip>`,
      },
    },
  },
}
