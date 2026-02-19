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
    // Hide auto-detected 'variant' from HTML attributes
    ...({ variant: { table: { disable: true } } } as Record<string, unknown>),
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

const people = [
  { id: 1, name: 'John Doe', img: 'https://i.pravatar.cc/48?img=1' },
  { id: 2, name: 'Jane Smith', img: 'https://i.pravatar.cc/48?img=2' },
  { id: 3, name: 'Alex Johnson', img: 'https://i.pravatar.cc/48?img=3' },
  { id: 4, name: 'Sam Wilson', img: 'https://i.pravatar.cc/48?img=4' },
  { id: 5, name: 'Casey Brown', img: 'https://i.pravatar.cc/48?img=5' },
]

const MultiSelectChips = () => {
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <Wrapper>
      {people.map((person) => (
        <Chip
          key={person.id}
          onClick={() => toggle(person.id)}
          onDelete={() =>
            setSelected((prev) => {
              const next = new Set(prev)
              next.delete(person.id)
              return next
            })
          }
          selected={selected.has(person.id)}
          showCheckIcon={false}
        >
          <Avatar src={person.img} alt={person.name} size={16} />
          {person.name}
        </Chip>
      ))}
    </Wrapper>
  )
}

export const MultiSelect: Story = {
  name: 'Multi-select (with avatars)',
  render: () => <MultiSelectChips />,
  parameters: {
    docs: {
      source: {
        code: `import { Avatar } from '@equinor/eds-core-react'

const [selected, setSelected] = useState<Set<number>>(new Set())

const toggle = (id: number) => {
  setSelected(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
}

{people.map(person => (
  <Chip
    key={person.id}
    onClick={() => toggle(person.id)}
    onDelete={() => setSelected(prev => { const next = new Set(prev); next.delete(person.id); return next })}
    selected={selected.has(person.id)}
    showCheckIcon={false}
  >
    <Avatar src={person.img} alt={person.name} size={16} />
    {person.name}
  </Chip>
))}`,
      },
    },
  },
}

const SingleSelectChips = () => {
  const [selected, setSelected] = useState<string | null>(null)

  const options = ['Technology', 'Design', 'Engineering', 'Science', 'Business']

  return (
    <fieldset
      style={{ border: 'none', padding: 0, margin: 0 }}
      role="radiogroup"
      aria-label="Select a category"
    >
      <Wrapper>
        {options.map((option) => (
          <Chip
            key={option}
            role="radio"
            aria-checked={selected === option}
            onClick={() => setSelected(option)}
            selected={selected === option}
          >
            {option}
          </Chip>
        ))}
      </Wrapper>
    </fieldset>
  )
}

export const SingleSelect: Story = {
  name: 'Single-select',
  render: () => <SingleSelectChips />,
  parameters: {
    docs: {
      source: {
        code: `const [selected, setSelected] = useState<string | null>(null)

const options = ['Technology', 'Design', 'Engineering', 'Science', 'Business']

<fieldset role="radiogroup" aria-label="Select a category">
  {options.map(option => (
    <Chip
      key={option}
      role="radio"
      aria-checked={selected === option}
      onClick={() => setSelected(option)}
      selected={selected === option}
    >
      {option}
    </Chip>
  ))}
</fieldset>`,
      },
    },
  },
}

export const Density: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px' }}>Spacious (default — 32px)</h4>
        <Wrapper>
          <Chip onClick={() => {}}>Default</Chip>
          <Chip onClick={() => {}} selected>
            Selected
          </Chip>
          <Chip onClick={() => {}} icon={save}>
            With icon
          </Chip>
          <Chip onDelete={() => {}}>Deletable</Chip>
        </Wrapper>
      </div>
      <div data-density="comfortable">
        <h4 style={{ margin: '0 0 8px' }}>Comfortable (24px)</h4>
        <Wrapper>
          <Chip onClick={() => {}}>Default</Chip>
          <Chip onClick={() => {}} selected>
            Selected
          </Chip>
          <Chip onClick={() => {}} icon={save}>
            With icon
          </Chip>
          <Chip onDelete={() => {}}>Deletable</Chip>
        </Wrapper>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `{/* Spacious (default) — 32px */}
<Chip onClick={handleClick}>Default</Chip>

{/* Comfortable — wrap a parent with data-density="comfortable" */}
<div data-density="comfortable">
  <Chip onClick={handleClick}>Default</Chip>
</div>`,
      },
    },
  },
}
