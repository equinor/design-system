import { useEffect, useState, type ReactNode, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Chip } from './Chip'
import { Icon } from '../Icon'
import { Button } from '../Button'
import { bookmark_filled, person } from '@equinor/eds-icons'
import page from './Chip.docs.mdx'

type StoryArgs = ComponentProps<typeof Chip>

const meta: Meta<StoryArgs> = {
  title: 'Beta/Data Display/Chip',
  component: Chip,
  tags: ['beta'],
  parameters: {
    docs: {
      page,
    },
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'accent', 'success', 'info', 'warning', 'danger'],
      description: 'Color tone',
    },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'high-contrast'],
      description: 'Visual style',
    },
    selected: {
      control: 'boolean',
      description:
        'Selected state. Shows a leading check icon, or a flipped dropdown arrow on a dropdown chip.',
    },
    dropdown: {
      control: 'boolean',
      description: 'Shows trailing dropdown arrow icon',
    },
  },
  args: {
    tone: 'neutral',
    variant: 'default',
    selected: false,
    dropdown: false,
  },
}

export default meta

const Wrapper = ({
  children,
  gap = 16,
  direction = 'row',
  align = 'center',
}: {
  children: ReactNode
  gap?: number
  direction?: 'row' | 'column'
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: direction,
      gap: `${gap}px`,
      alignItems: align,
      // Wrap rather than overflow the narrow docs canvas
      flexWrap: 'wrap',
    }}
  >
    {children}
  </div>
)

type Story = StoryObj<StoryArgs>

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const Introduction: Story = {
  render: (args) => {
    const [selected, setSelected] = useState(args.selected ?? false)
    // Keep the chip in step with the `selected` control
    useEffect(() => setSelected(args.selected ?? false), [args.selected])
    return (
      <Chip
        {...args}
        selected={selected}
        onClick={() => setSelected(!selected)}
      >
        Chip
      </Chip>
    )
  },
}

export const Overview: Story = {
  render: () => {
    const [selected, setSelected] = useState(true)
    const [deletable, setDeletable] = useState(true)
    return (
      <Wrapper>
        <Chip selected={selected} onClick={() => setSelected(!selected)}>
          Selectable
        </Chip>
        {deletable && (
          <Chip tone="accent" onDelete={() => setDeletable(false)}>
            Deletable
          </Chip>
        )}
        <Chip variant="outlined" dropdown>
          Dropdown
        </Chip>
      </Wrapper>
    )
  },
}

export const Selectable: Story = {
  render: () => {
    const [a, setA] = useState(false)
    const [b, setB] = useState(false)
    const [c, setC] = useState(false)
    const [d, setD] = useState(false)
    return (
      <Wrapper>
        <Chip selected={a} onClick={() => setA(!a)}>
          Default
        </Chip>
        <Chip selected={b} onClick={() => setB(!b)} tone="accent">
          Accent
        </Chip>
        <Chip selected={c} onClick={() => setC(!c)} variant="outlined">
          Outlined
        </Chip>
        <Chip
          selected={d}
          onClick={() => setD(!d)}
          variant="high-contrast"
          tone="success"
        >
          High contrast
        </Chip>
      </Wrapper>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Chips are always selectable. Click to toggle the selected state, which shows a leading check icon.',
      },
    },
  },
}

export const Tones: Story = {
  render: () => {
    const tones = [
      'neutral',
      'accent',
      'success',
      'info',
      'warning',
      'danger',
    ] as const
    const [selected, setSelected] = useState<Record<string, boolean>>({})
    return (
      <Wrapper>
        {tones.map((tone) => (
          <Chip
            key={tone}
            tone={tone}
            selected={selected[tone] ?? false}
            onClick={() => setSelected((s) => ({ ...s, [tone]: !s[tone] }))}
          >
            {capitalize(tone)}
          </Chip>
        ))}
      </Wrapper>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Six tones set the colours: neutral (the default), accent, success, info, warning and danger. Every tone works with every variant.',
      },
    },
  },
}

export const Variants: Story = {
  render: () => {
    const [a, setA] = useState(false)
    const [b, setB] = useState(false)
    const [c, setC] = useState(false)
    return (
      <Wrapper>
        <Chip selected={a} onClick={() => setA(!a)} variant="default">
          Default
        </Chip>
        <Chip selected={b} onClick={() => setB(!b)} variant="outlined">
          Outlined
        </Chip>
        <Chip selected={c} onClick={() => setC(!c)} variant="high-contrast">
          High contrast
        </Chip>
      </Wrapper>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `variant` to change the visual weight. Default has a muted fill, outlined has a border and no fill, and high-contrast has a dark fill with light text.',
      },
    },
  },
}

export const Types: Story = {
  render: () => {
    const [selected, setSelected] = useState(false)
    const [deletableVisible, setDeletableVisible] = useState(true)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    return (
      <Wrapper>
        <Chip selected={selected} onClick={() => setSelected(!selected)}>
          Selectable
        </Chip>
        {deletableVisible ? (
          <Chip onDelete={() => setDeletableVisible(false)}>Deletable</Chip>
        ) : (
          <Button variant="ghost" onClick={() => setDeletableVisible(true)}>
            Reset
          </Button>
        )}
        <Chip
          dropdown
          selected={dropdownOpen}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          Dropdown
        </Chip>
        <Chip onClick={() => {}}>
          <Icon data={bookmark_filled} aria-hidden />
          Custom
        </Chip>
      </Wrapper>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Chips support four types: selectable (default, toggles check icon), deletable (trailing close icon), dropdown (trailing arrow), and custom (user-provided icons).',
      },
    },
  },
}

export const Deletable: Story = {
  render: () => {
    const [filters, setFilters] = useState([
      'Status: Active',
      'Type: Well',
      'Year: 2024',
      'Region: North Sea',
    ])
    const remove = (filter: string) =>
      setFilters((f) => f.filter((item) => item !== filter))
    return (
      <Wrapper>
        {filters.map((filter) => (
          <Chip key={filter} onDelete={() => remove(filter)}>
            {filter}
          </Chip>
        ))}
        {filters.length === 0 && (
          <Button
            variant="ghost"
            onClick={() =>
              setFilters([
                'Status: Active',
                'Type: Well',
                'Year: 2024',
                'Region: North Sea',
              ])
            }
          >
            Reset
          </Button>
        )}
      </Wrapper>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Deletable chips are typically used as filter tags. The consumer handles removal. Here the chip is filtered out of state on click.',
      },
    },
  },
}

export const Dropdown: Story = {
  render: () => {
    const [openChip, setOpenChip] = useState<string | null>(null)
    const toggle = (chip: string) =>
      setOpenChip((current) => (current === chip ? null : chip))
    return (
      <Wrapper>
        <Chip
          dropdown
          selected={openChip === 'options'}
          onClick={() => toggle('options')}
        >
          Options
        </Chip>
        <Chip
          dropdown
          selected={openChip === 'filter'}
          onClick={() => toggle('filter')}
          tone="accent"
        >
          Filter
        </Chip>
        <Chip
          dropdown
          selected={openChip === 'sort'}
          onClick={() => toggle('sort')}
          variant="outlined"
        >
          Sort
        </Chip>
      </Wrapper>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dropdown chips trigger a menu. Pass `selected` while the menu is open, and the arrow flips from down to up. The consumer owns the actual menu and open/close state.',
      },
    },
  },
}

export const CustomIcons: Story = {
  render: () => {
    const [filterApplied, setFilterApplied] = useState(false)
    const [recipients, setRecipients] = useState([
      'John Doe',
      'Jane Smith',
      'Alex Berg',
    ])
    const remove = (name: string) =>
      setRecipients((r) => r.filter((n) => n !== name))

    return (
      <Wrapper direction="column" gap={24} align="flex-start">
        <div>
          <h3 style={{ marginBottom: '12px' }}>Saved filter</h3>
          <Chip
            selected={filterApplied}
            onClick={() => setFilterApplied(!filterApplied)}
          >
            My filter
            <Icon data={bookmark_filled} aria-hidden />
          </Chip>
        </div>
        <div>
          <h3 style={{ marginBottom: '12px' }}>Recipients</h3>
          <Wrapper>
            {recipients.map((name) => (
              <Chip key={name} tone="accent" onDelete={() => remove(name)}>
                <Icon data={person} aria-hidden />
                {name}
              </Chip>
            ))}
            {recipients.length === 0 && (
              <Button
                variant="ghost"
                onClick={() =>
                  setRecipients(['John Doe', 'Jane Smith', 'Alex Berg'])
                }
              >
                Reset
              </Button>
            )}
          </Wrapper>
        </div>
      </Wrapper>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Custom chips give consumers full control over leading and/or trailing icons and click behaviour. Two realistic patterns: a saved filter (leading bookmark icon + toggle) and recipient chips combining a custom leading person icon with built-in `onDelete` behaviour.',
      },
    },
  },
}

const DensityRow = ({
  density,
  title,
}: {
  density: 'compact' | 'comfortable' | 'relaxed'
  title: string
}) => {
  const [selected, setSelected] = useState(false)
  const [deletable, setDeletable] = useState(true)
  const [open, setOpen] = useState(false)
  return (
    <div data-density={density}>
      <h3 style={{ marginBottom: '12px' }}>{title}</h3>
      <Wrapper>
        <Chip selected={selected} onClick={() => setSelected(!selected)}>
          Selectable
        </Chip>
        {deletable ? (
          <Chip onDelete={() => setDeletable(false)}>Deletable</Chip>
        ) : (
          <Button variant="ghost" onClick={() => setDeletable(true)}>
            Reset
          </Button>
        )}
        <Chip dropdown selected={open} onClick={() => setOpen(!open)}>
          Dropdown
        </Chip>
      </Wrapper>
    </div>
  )
}

export const Density: Story = {
  render: () => (
    <Wrapper direction="column" gap={24} align="flex-start">
      <DensityRow density="compact" title="Compact" />
      <DensityRow density="comfortable" title="Comfortable (default)" />
      <DensityRow density="relaxed" title="Relaxed" />
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Chips respect the `data-density` attribute on a parent element for density-aware sizing.',
      },
    },
  },
}

export const ToneVariantMatrix: Story = {
  render: () => {
    const tones = [
      'neutral',
      'accent',
      'success',
      'info',
      'warning',
      'danger',
    ] as const
    const variants = ['default', 'outlined', 'high-contrast'] as const
    const [selected, setSelected] = useState<Record<string, boolean>>({})
    const toggle = (key: string) =>
      setSelected((s) => ({ ...s, [key]: !s[key] }))
    return (
      <Wrapper direction="column" gap={24} align="flex-start">
        {variants.map((variant) => (
          <div key={variant}>
            <h3 style={{ marginBottom: '12px', textTransform: 'capitalize' }}>
              {variant}
            </h3>
            <Wrapper>
              {tones.map((tone) => {
                const key = `${variant}-${tone}`
                return (
                  <Chip
                    key={key}
                    tone={tone}
                    variant={variant}
                    selected={selected[key] ?? false}
                    onClick={() => toggle(key)}
                  >
                    {capitalize(tone)}
                  </Chip>
                )
              })}
            </Wrapper>
          </div>
        ))}
      </Wrapper>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete matrix of all tone × variant combinations.',
      },
    },
  },
}
