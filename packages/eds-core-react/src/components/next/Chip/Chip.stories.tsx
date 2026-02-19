import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { save } from '@equinor/eds-icons'
import { Chip } from './Chip'
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
