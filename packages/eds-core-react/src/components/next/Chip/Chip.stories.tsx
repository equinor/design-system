import { useId, useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  save,
  search,
  calendar_event,
  share,
  directions,
} from '@equinor/eds-icons'
import { Chip } from './Chip'
import { Avatar } from '../../Avatar'
import { Card } from '../../Card'
import { Divider } from '../../Divider'
import { Typography } from '../../Typography'
import { TextField } from '../TextField'
import { Icon as EdsIcon } from '../Icon'
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

const products = [
  'Johan Sverdrup',
  'Åsgard Blend',
  'Troll Blend',
  'Grane Blend',
  'Oseberg Blend',
]

const dischargePorts = [
  'Rotterdam',
  'Mongstad',
  'Wilhelmshaven',
  'Teesside',
  'Gothenburg',
]

const loadPorts = ['Mongstad', 'Sture', 'Kårstø', 'Stureterminalen', 'Kollsnes']

/**
 * Reusable popover-based multiselect dropdown chip.
 * Uses the native Popover API for the menu.
 */
const DropdownChip = ({
  label,
  options,
}: {
  label: string
  options: string[]
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const popoverId = useId()
  const chipRef = useRef<HTMLDivElement>(null)

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

  const hasSelection = selected.size > 0
  const chipLabel =
    hasSelection && selected.size <= 2
      ? [...selected].join(' and ')
      : hasSelection
        ? `${[...selected][0]} +${selected.size - 1}`
        : label

  const handleChipClick = () => {
    const el = document.getElementById(popoverId)
    if (el) el.togglePopover()
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Chip
        ref={chipRef}
        onClick={handleChipClick}
        dropdown
        selected={hasSelection}
        showCheckIcon={false}
      >
        {chipLabel}
      </Chip>
      <div
        id={popoverId}
        popover="auto"
        style={{
          position: 'absolute',
          inset: 'unset',
          top: '100%',
          left: 0,
          marginTop: 4,
          minWidth: 200,
          background: 'var(--eds-color-bg-default, #fff)',
          border: '1px solid var(--eds-color-border-medium, #ddd)',
          borderRadius: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,.12)',
          padding: '4px 0',
          zIndex: 10,
        }}
      >
        {options.map((option) => (
          <label
            key={option}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            <input
              type="checkbox"
              checked={selected.has(option)}
              onChange={() => toggle(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  )
}

const CargoFilterBar = () => {
  const [isCompleted, setIsCompleted] = useState(false)
  const [isEquinorChartered, setIsEquinorChartered] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TextField
        label="Search"
        placeholder="Search for cargos"
        startAdornment={<EdsIcon data={search} size="sm" />}
      />
      <Wrapper>
        <DropdownChip label="Product" options={products} />
        <Chip
          onClick={() => setIsCompleted(!isCompleted)}
          selected={isCompleted}
        >
          Is completed
        </Chip>
        <DropdownChip label="Discharge port" options={dischargePorts} />
        <DropdownChip label="Load port" options={loadPorts} />
        <Chip
          onClick={() => setIsEquinorChartered(!isEquinorChartered)}
          selected={isEquinorChartered}
        >
          Is Equinor chartered
        </Chip>
      </Wrapper>
    </div>
  )
}

export const Filter: Story = {
  render: () => <CargoFilterBar />,
  parameters: {
    docs: {
      description: {
        story:
          'Filter chips let users refine content. Dropdown chips open a multiselect popover and update their label with the selection. Boolean chips toggle a selected state with a checkmark.',
      },
      source: {
        code: `import { search } from '@equinor/eds-icons'
import { TextField } from '@equinor/eds-core-react/next'

<TextField label="Search" placeholder="Search for cargos"
  startAdornment={<Icon data={search} size="sm" />} />

{/* Dropdown multiselect chip */}
<Chip onClick={togglePopover} dropdown selected={hasSelection} showCheckIcon={false}>
  {hasSelection ? selectedItems.join(' and ') : 'Product'}
</Chip>

{/* Boolean filter chip */}
<Chip onClick={() => setCompleted(!completed)} selected={completed}>
  Is completed
</Chip>`,
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
  render: () => <InputChips />,
  parameters: {
    docs: {
      description: {
        story:
          'Input chips represent discrete pieces of information entered by the user, such as people in a "To" field. They are always deletable.',
      },
      source: {
        code: `import { Avatar } from '@equinor/eds-core-react'

<Chip onDelete={() => remove(person.id)}>
  <Avatar src={person.img} alt={person.name} size={16} />
  {person.name}
</Chip>`,
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
