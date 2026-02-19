import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  save,
  calendar_event,
  share,
  directions,
  settings,
  home,
} from '@equinor/eds-icons'
import { Chip } from './Chip'
import { Avatar } from '../../Avatar'
import { Card } from '../../Card'
import { Divider } from '../../Divider'
import { Typography } from '../../Typography'
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

/* ------------------------------------------------------------------ */
/*  Default (interactive controls)                                    */
/* ------------------------------------------------------------------ */

export const Introduction: Story = {
  args: {
    children: 'Chip label',
    onClick: () => {},
  },
}

/* ------------------------------------------------------------------ */
/*  Assist chips                                                      */
/* ------------------------------------------------------------------ */

export const Assist: Story = {
  render: () => (
    <Card elevation="raised" style={{ maxWidth: 340 }}>
      <Card.Media fullWidth>
        <img
          src="https://i.imgur.com/UM3mrju.jpg"
          alt="Conference hall with stage lighting"
          style={{ width: '100%', display: 'block' }}
        />
      </Card.Media>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h5">EDS Design Summit 2026</Typography>
          <Typography variant="body_short">
            March 12 · 09:00–16:00 · Stavanger
          </Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Divider />
      <Card.Content>
        <Wrapper>
          <Chip onClick={() => {}} icon={calendar_event}>
            Add to calendar
          </Chip>
          <Chip onClick={() => {}} icon={directions}>
            Get directions
          </Chip>
          <Chip onClick={() => {}} icon={share}>
            Share event
          </Chip>
        </Wrapper>
      </Card.Content>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Assist chips represent smart actions a product can surface for the user. They appear dynamically and contextually, predicting what the user might need.',
      },
      source: {
        code: `import { calendar_event, directions, share } from '@equinor/eds-icons'

<Chip onClick={handleAction} icon={calendar_event}>Add to calendar</Chip>
<Chip onClick={handleAction} icon={directions}>Get directions</Chip>
<Chip onClick={handleAction} icon={share}>Share event</Chip>`,
      },
    },
  },
}

/* ------------------------------------------------------------------ */
/*  Filter chips                                                      */
/* ------------------------------------------------------------------ */

const filterOptions = [
  'Technology',
  'Design',
  'Engineering',
  'Science',
  'Business',
]

const MultiSelectFilter = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (option: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(option)) {
        next.delete(option)
      } else {
        next.add(option)
      }
      return next
    })
  }

  return (
    <Wrapper>
      {filterOptions.map((option) => (
        <Chip
          key={option}
          onClick={() => toggle(option)}
          selected={selected.has(option)}
        >
          {option}
        </Chip>
      ))}
    </Wrapper>
  )
}

const SingleSelectFilter = () => {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <fieldset
      style={{ border: 'none', padding: 0, margin: 0 }}
      role="radiogroup"
      aria-label="Select a category"
    >
      <Wrapper>
        {filterOptions.map((option) => (
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

const DropdownFilter = () => (
  <Wrapper>
    <Chip onClick={() => {}} dropdown>
      Category
    </Chip>
    <Chip onClick={() => {}} dropdown selected>
      Category (active)
    </Chip>
    <Chip onClick={() => {}} dropdown icon={save}>
      With icon
    </Chip>
    <Chip onClick={() => {}} dropdown disabled>
      Disabled
    </Chip>
  </Wrapper>
)

export const Filter: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Typography variant="h6" style={{ marginBottom: 8 }}>
          Multi-select
        </Typography>
        <MultiSelectFilter />
      </div>
      <div>
        <Typography variant="h6" style={{ marginBottom: 8 }}>
          Single-select (radio group)
        </Typography>
        <SingleSelectFilter />
      </div>
      <div>
        <Typography variant="h6" style={{ marginBottom: 8 }}>
          Dropdown
        </Typography>
        <DropdownFilter />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Filter chips let users refine content. They can be multi-select (checkboxes), single-select (radio group), or dropdown triggers.',
      },
      source: {
        code: `{/* Multi-select */}
const [selected, setSelected] = useState<Set<string>>(new Set())

<Chip onClick={() => toggle(option)} selected={selected.has(option)}>
  {option}
</Chip>

{/* Single-select radio group */}
<fieldset role="radiogroup" aria-label="Select a category">
  <Chip role="radio" aria-checked={selected === option}
        onClick={() => setSelected(option)} selected={selected === option}>
    {option}
  </Chip>
</fieldset>

{/* Dropdown filter */}
<Chip onClick={openMenu} dropdown>Category</Chip>`,
      },
    },
  },
}

/* ------------------------------------------------------------------ */
/*  Input chips                                                       */
/* ------------------------------------------------------------------ */

const people = [
  { id: 1, name: 'John Doe', img: 'https://i.pravatar.cc/48?img=1' },
  { id: 2, name: 'Jane Smith', img: 'https://i.pravatar.cc/48?img=2' },
  { id: 3, name: 'Alex Johnson', img: 'https://i.pravatar.cc/48?img=3' },
  { id: 4, name: 'Sam Wilson', img: 'https://i.pravatar.cc/48?img=4' },
  { id: 5, name: 'Casey Brown', img: 'https://i.pravatar.cc/48?img=5' },
]

const InputChips = () => {
  const [visible, setVisible] = useState(people.map((p) => p.id))

  const remove = (id: number) => {
    setVisible((prev) => prev.filter((v) => v !== id))
  }

  return (
    <Wrapper>
      {people
        .filter((p) => visible.includes(p.id))
        .map((person) => (
          <Chip key={person.id} onDelete={() => remove(person.id)}>
            <Avatar src={person.img} alt={person.name} size={16} />
            {person.name}
          </Chip>
        ))}
    </Wrapper>
  )
}

export const Input: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Typography variant="h6" style={{ marginBottom: 8 }}>
          People (deletable with avatar)
        </Typography>
        <InputChips />
      </div>
      <div>
        <Typography variant="h6" style={{ marginBottom: 8 }}>
          Tags (deletable with icon)
        </Typography>
        <Wrapper>
          <Chip onDelete={() => {}} icon={home}>
            Home
          </Chip>
          <Chip onDelete={() => {}} icon={settings}>
            Settings
          </Chip>
          <Chip onDelete={() => {}}>Plain tag</Chip>
        </Wrapper>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Input chips represent discrete pieces of information entered by the user, such as people in a "To" field or tags. They are always deletable.',
      },
      source: {
        code: `import { Avatar } from '@equinor/eds-core-react'
import { home, settings } from '@equinor/eds-icons'

{/* People chips with avatars */}
<Chip onDelete={() => remove(person.id)}>
  <Avatar src={person.img} alt={person.name} size={16} />
  {person.name}
</Chip>

{/* Tag chips with icons */}
<Chip onDelete={handleDelete} icon={home}>Home</Chip>
<Chip onDelete={handleDelete} icon={settings}>Settings</Chip>
<Chip onDelete={handleDelete}>Plain tag</Chip>`,
      },
    },
  },
}

/* ------------------------------------------------------------------ */
/*  Suggestion chips                                                  */
/* ------------------------------------------------------------------ */

export const Suggestion: Story = {
  render: () => {
    const suggestions = [
      'Quarterly report',
      'Budget overview',
      'Safety review',
      'Project timeline',
    ]

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Typography variant="body_short" style={{ color: '#6F6F6F' }}>
          Suggested searches
        </Typography>
        <Wrapper>
          {suggestions.map((s) => (
            <Chip key={s} onClick={() => {}}>
              {s}
            </Chip>
          ))}
        </Wrapper>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Suggestion chips surface dynamic recommendations. They appear below a text field or in a conversational UI to help users move forward.',
      },
      source: {
        code: `const suggestions = ['Quarterly report', 'Budget overview', 'Safety review']

{suggestions.map(s => (
  <Chip key={s} onClick={handleClick}>{s}</Chip>
))}`,
      },
    },
  },
}

/* ------------------------------------------------------------------ */
/*  Density                                                           */
/* ------------------------------------------------------------------ */

export const Density: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Typography variant="h6" style={{ marginBottom: 8 }}>
          Spacious (default — 32 px)
        </Typography>
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
        <Typography variant="h6" style={{ marginBottom: 8 }}>
          Comfortable (24 px)
        </Typography>
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
      description: {
        story:
          'Wrap a parent element with `data-density="comfortable"` to render a compact 24 px variant.',
      },
      source: {
        code: `{/* Spacious (default) — 32 px */}
<Chip onClick={handleClick}>Default</Chip>

{/* Comfortable — wrap a parent with data-density="comfortable" */}
<div data-density="comfortable">
  <Chip onClick={handleClick}>Default</Chip>
</div>`,
      },
    },
  },
}
