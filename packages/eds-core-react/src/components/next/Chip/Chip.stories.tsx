import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  save,
  search,
  calendar_event,
  share,
  directions,
  filter_alt,
} from '@equinor/eds-icons'
import page from './Chip.docs.mdx'
import { Chip } from './Chip'
import { Avatar } from '../../Avatar'
import { Card } from '../../Card'
import { Divider } from '../../Divider'
import { Menu } from '../../Menu'
import { Typography } from '../../Typography'
import { TextField } from '../TextField'
import { Checkbox } from '../Checkbox'
import { Icon as EdsIcon } from '../Icon'
import { Button } from '../Button'
import type { ChipProps, ChipColor } from './Chip.types'

type StoryArgs = ChipProps & { color?: ChipColor }

const meta: Meta<StoryArgs> = {
  title: 'EDS 2.0 (beta)/Data Display/Chip',
  component: Chip,
  parameters: {
    docs: {
      page,
    },
  },
  argTypes: {
    selected: {
      control: 'boolean',
      description: 'Whether the chip is selected (accent styling + checkmark)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    color: {
      control: 'select',
      options: [
        undefined,
        'accent',
        'danger',
        'warning',
        'info',
        'success',
        'moss-green',
        'energy-red',
        'weathered-red',
        'slate-blue',
        'spruce-wood',
        'mist-blue',
        'lichen-green',
        'purple-berry',
        'pink-rose',
        'pink-salmon',
        'green-cucumber',
        'green-succulent',
        'green-mint',
        'blue-ocean',
        'blue-overcast',
        'blue-sky',
      ],
      description: 'Color variant — semantic or data-visualization',
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
          src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2312&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
 * Reusable multiselect dropdown chip.
 * Uses the EDS Menu component for the dropdown.
 */
const DropdownChip = ({
  label,
  options,
}: {
  label: string
  options: string[]
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

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
  const chipLabel = hasSelection
    ? selected.size <= 2
      ? `${label} is ${[...selected].join(' and ')}`
      : `${label} is ${[...selected][0]} +${selected.size - 1}`
    : label

  return (
    <>
      <Chip
        ref={setAnchorEl}
        onClick={() => setOpen((prev) => !prev)}
        dropdown
        selected={hasSelection}
      >
        {chipLabel}
      </Chip>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={() => setOpen(false)}
        placement="bottom-start"
      >
        {options.map((option) => (
          <Menu.Item
            key={option}
            active={selected.has(option)}
            onClick={() => toggle(option)}
            closeMenuOnClick={false}
          >
            <Checkbox
              checked={selected.has(option)}
              readOnly
              style={
                {
                  '--_checkbox-touch-target': 'var(--_checkbox-icon-size)',
                } as React.CSSProperties
              }
            />
            {option}
          </Menu.Item>
        ))}
      </Menu>
    </>
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
import { Menu } from '@equinor/eds-core-react'
import { TextField, Icon } from '@equinor/eds-core-react/next'

<TextField label="Search" placeholder="Search for cargos"
  startAdornment={<Icon data={search} size="sm" />} />

{/* Dropdown multiselect chip with EDS Menu */}
<Chip ref={setAnchorEl} onClick={() => setOpen(!open)} dropdown selected={hasSelection}>
  {chipLabel}
</Chip>
<Menu open={open} anchorEl={anchorEl} onClose={() => setOpen(false)} placement="bottom-start">
  {options.map(option => (
    <Menu.Item key={option} active={selected.has(option)} onClick={() => toggle(option)}>
      {option}
    </Menu.Item>
  ))}
</Menu>

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

const ChatMessage = ({
  name,
  src,
  time,
  children,
  align = 'left',
}: {
  name: string
  src: string
  time: string
  children: React.ReactNode
  align?: 'left' | 'right'
}) => (
  <div
    style={{
      display: 'flex',
      gap: 8,
      flexDirection: align === 'right' ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
    }}
  >
    <Avatar alt={name} src={src} size={32} />
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: align === 'right' ? 'flex-end' : 'flex-start',
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
        <Typography
          variant="label"
          group="navigation"
          style={{ fontWeight: 600, fontSize: '0.8125rem' }}
        >
          {name}
        </Typography>
        <Typography
          variant="meta"
          style={{ color: 'var(--eds-color-text-subtle)', fontSize: '0.75rem' }}
        >
          {time}
        </Typography>
      </div>
      <div
        style={{
          background: 'var(--eds-color-bg-subtle, #f5f5f5)',
          borderRadius: 8,
          padding: '8px 12px',
          maxWidth: 280,
        }}
      >
        <Typography variant="body_short">{children}</Typography>
      </div>
    </div>
  </div>
)

const SuggestionChat = () => {
  const [messages, setMessages] = useState<
    {
      id: number
      name: string
      src: string
      time: string
      text: string
      align: 'left' | 'right'
    }[]
  >([
    {
      id: 1,
      name: 'Ola Nordmann',
      src: 'https://plus.unsplash.com/premium_photo-1739786996060-2769f1ded135?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      time: '15:00',
      text: 'Fine and you?',
      align: 'left',
    },
    {
      id: 2,
      name: 'James Doe',
      src: 'https://plus.unsplash.com/premium_photo-1739786995646-480d5cfd83dc?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      time: '16:27',
      text: 'Did you get that report?',
      align: 'left',
    },
  ])
  const [suggestions, setSuggestions] = useState([
    'Not yet',
    'Let me check',
    'Yes, I did',
  ])

  const handleSuggestion = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: 'You',
        src: 'https://plus.unsplash.com/premium_photo-1739786996040-32bde1db0610?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        time: '16:28',
        text,
        align: 'right',
      },
    ])
    setSuggestions([])
  }

  return (
    <Card
      elevation="raised"
      style={{
        maxWidth: 420,
        height: 360,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Card.Content style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              name={msg.name}
              src={msg.src}
              time={msg.time}
              align={msg.align}
            >
              {msg.text}
            </ChatMessage>
          ))}
        </div>
      </Card.Content>
      <Divider />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: '8px 16px 12px',
        }}
      >
        {suggestions.length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
            }}
          >
            {suggestions.map((s) => (
              <Chip key={s} onClick={() => handleSuggestion(s)}>
                {s}
              </Chip>
            ))}
          </div>
        )}
        <TextField placeholder="Type a new message" />
      </div>
    </Card>
  )
}

export const Suggestion: Story = {
  render: () => <SuggestionChat />,
  parameters: {
    docs: {
      description: {
        story:
          'Suggestion chips surface dynamic reply options in a conversational UI. Clicking a chip sends that reply. They disappear once used.',
      },
      source: {
        code: `const replies = ['Not yet', 'Let me check', 'Yes, I did']

{replies.map(reply => (
  <Chip key={reply} onClick={() => sendReply(reply)}>
    {reply}
  </Chip>
))}`,
      },
    },
  },
}

/* ------------------------------------------------------------------ */
/*  Suggestion (single select)                                        */
/* ------------------------------------------------------------------ */

const suggestedProducts = [
  'Johan Sverdrup',
  'Åsgard Blend',
  'Troll Blend',
  'Grane Blend',
  'Oseberg Blend',
]

const ProductSelector = () => {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Typography variant="h6">Select a product</Typography>
      <Wrapper>
        {suggestedProducts.map((product) => (
          <Chip
            key={product}
            onClick={() => setSelected(product)}
            selected={selected === product}
          >
            {product}
          </Chip>
        ))}
      </Wrapper>
      {selected && (
        <Typography variant="body_short">
          You selected <strong>{selected}</strong>
        </Typography>
      )}
    </div>
  )
}

export const SuggestionSingleSelect: Story = {
  name: 'Suggestion (single select)',
  render: () => <ProductSelector />,
  parameters: {
    docs: {
      description: {
        story:
          'Suggestion chips can also be used for single-select scenarios. Only one chip can be selected at a time, indicated by the checkmark and accent styling.',
      },
      source: {
        code: `const [selected, setSelected] = useState(null)

{products.map(product => (
  <Chip
    key={product}
    onClick={() => setSelected(product)}
    selected={selected === product}
  >
    {product}
  </Chip>
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

/* ------------------------------------------------------------------ */
/*  Active filters                                                    */
/* ------------------------------------------------------------------ */

const ActiveFilters = () => {
  const [filters, setFilters] = useState([
    { id: 'loadport', label: 'Loadport: Mongstad' },
    { id: 'movement', label: 'Movement Range: Thu Nov 20 2025 \u2013' },
    { id: 'responsible', label: 'Operations Responsible: Ola Nordmann' },
    { id: 'status', label: 'Status: COMPLETED' },
  ])

  const remove = (id: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <Wrapper>
      <Button
        variant="outlined"
        tone="accent"
        onClick={() => {}}
      >
        <EdsIcon data={filter_alt} size="sm" />
        Filters
        {filters.length > 0 && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 20,
              height: 20,
              padding: '0 6px',
              borderRadius: 10,
              background: 'var(--eds-color-bg-fill-emphasis-default, #007079)',
              color: 'var(--eds-color-text-strong-on-emphasis, #fff)',
              fontSize: '0.75rem',
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {filters.length}
          </span>
        )}
      </Button>
      {filters.map((filter) => (
        <Chip key={filter.id} onDelete={() => remove(filter.id)}>
          {filter.label}
        </Chip>
      ))}
    </Wrapper>
  )
}

export const ActiveFilterBar: Story = {
  name: 'Filter (active)',
  render: () => <ActiveFilters />,
  parameters: {
    docs: {
      description: {
        story:
          'A filter bar showing a filter button with an active count badge alongside deletable chips representing each applied filter. Removing a chip clears that filter.',
      },
      source: {
        code: `import { filter_alt } from '@equinor/eds-icons'
import { Button, Icon } from '@equinor/eds-core-react/next'

<Button variant="outlined" tone="accent">
  <Icon data={filter_alt} size="sm" />
  Filters
  <span className="badge">{activeCount}</span>
</Button>

{filters.map(filter => (
  <Chip key={filter.id} onDelete={() => remove(filter.id)}>
    {filter.label}
  </Chip>
))}`,
      },
    },
  },
}

/* ------------------------------------------------------------------ */
/*  Tags                                                              */
/* ------------------------------------------------------------------ */

const ShippingTags = () => {
  const [tags, setTags] = useState([
    { label: 'Delayed', color: 'warning' as const },
    { label: 'Cancelled', color: 'danger' as const },
    { label: 'In transit', color: 'info' as const },
    { label: 'Delivered', color: 'success' as const },
    { label: 'Awaiting pickup', color: 'spruce-wood' as const },
    { label: 'Customs hold', color: 'purple-berry' as const },
    { label: 'Rerouted', color: 'blue-overcast' as const },
    { label: 'Confirmed', color: 'moss-green' as const },
  ])

  const remove = (label: string) => {
    setTags((prev) => prev.filter((t) => t.label !== label))
  }

  return (
    <Wrapper>
      {tags.map((tag) => (
        <Chip key={tag.label} color={tag.color} onDelete={() => remove(tag.label)}>
          {tag.label}
        </Chip>
      ))}
    </Wrapper>
  )
}

export const Tags: Story = {
  render: () => <ShippingTags />,
  parameters: {
    docs: {
      description: {
        story:
          'Colored deletable chips work well as status tags. Each tag uses a different color to visually distinguish shipping statuses at a glance.',
      },
      source: {
        code: `const tags = [
  { label: 'Delayed', color: 'warning' },
  { label: 'Cancelled', color: 'danger' },
  { label: 'In transit', color: 'info' },
  { label: 'Delivered', color: 'success' },
]

{tags.map(tag => (
  <Chip key={tag.label} color={tag.color} onDelete={() => remove(tag.label)}>
    {tag.label}
  </Chip>
))}`,
      },
    },
  },
}
