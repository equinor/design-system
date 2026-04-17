import { useState, type ReactNode, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Chip } from './Chip'
import { Icon } from '../Icon'
import { Button } from '../Button'
import { bookmark_filled, person } from '@equinor/eds-icons'

type StoryArgs = ComponentProps<typeof Chip>

const meta: Meta<StoryArgs> = {
  title: 'EDS 2.0 (beta)/Data Display/Chip',
  component: Chip,
  parameters: {
    docs: {
      description: {
        component: `
⚠️ **Beta Component** - This component is under active development.

\`\`\`tsx
import { Chip } from '@equinor/eds-core-react/next'
\`\`\`
        `,
      },
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
        'Selected state — leading check icon (default) or flipped dropdown arrow.',
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
  wrap = false,
}: {
  children: ReactNode
  gap?: number
  direction?: 'row' | 'column'
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  wrap?: boolean
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: direction,
      gap: `${gap}px`,
      alignItems: align,
      flexWrap: wrap ? 'wrap' : undefined,
    }}
  >
    {children}
  </div>
)

type Story = StoryObj<StoryArgs>

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState(false)
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
        <Chip onClick={() => console.log('custom')}>
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
      <Wrapper wrap>
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
          'Deletable chips are typically used as filter tags. The consumer handles removal — here the chip is filtered out of state on click.',
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
          'Dropdown chips trigger a menu. Pass `selected` while the menu is open — the arrow flips from down to up. The consumer owns the actual menu and open/close state.',
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
          <Wrapper wrap>
            {recipients.map((name) => (
              <Chip
                key={name}
                tone="accent"
                onDelete={() => remove(name)}
              >
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

export const Density: Story = {
  render: () => {
    const [s1, setS1] = useState(false)
    const [s2, setS2] = useState(false)
    const [d1, setD1] = useState(true)
    const [d2, setD2] = useState(true)
    const [o1, setO1] = useState(false)
    const [o2, setO2] = useState(false)
    return (
      <Wrapper direction="column" gap={24} align="flex-start">
        <div data-density="spacious">
          <h3 style={{ marginBottom: '12px' }}>Spacious (default)</h3>
          <Wrapper>
            <Chip selected={s1} onClick={() => setS1(!s1)}>
              Selectable
            </Chip>
            {d1 ? (
              <Chip onDelete={() => setD1(false)}>Deletable</Chip>
            ) : (
              <Button variant="ghost" onClick={() => setD1(true)}>
                Reset
              </Button>
            )}
            <Chip dropdown selected={o1} onClick={() => setO1(!o1)}>
              Dropdown
            </Chip>
          </Wrapper>
        </div>
        <div data-density="comfortable">
          <h3 style={{ marginBottom: '12px' }}>Comfortable</h3>
          <Wrapper>
            <Chip selected={s2} onClick={() => setS2(!s2)}>
              Selectable
            </Chip>
            {d2 ? (
              <Chip onDelete={() => setD2(false)}>Deletable</Chip>
            ) : (
              <Button variant="ghost" onClick={() => setD2(true)}>
                Reset
              </Button>
            )}
            <Chip dropdown selected={o2} onClick={() => setO2(!o2)}>
              Dropdown
            </Chip>
          </Wrapper>
        </div>
      </Wrapper>
    )
  },
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
            <Wrapper wrap>
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
