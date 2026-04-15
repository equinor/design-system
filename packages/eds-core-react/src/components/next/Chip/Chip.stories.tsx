import { useState, type ReactNode, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Chip } from './Chip'
import { Icon } from '../Icon'
import { save, settings } from '@equinor/eds-icons'

type StoryArgs = ComponentProps<typeof Chip>

const meta: Meta<StoryArgs> = {
  title: 'EDS 2.0 (beta)/Chip',
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
      description: 'Selected state — shows leading check icon',
    },
    deletable: {
      control: 'boolean',
      description: 'Shows trailing close icon',
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
    deletable: false,
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
    return (
      <Wrapper>
        <Chip selected={selected} onClick={() => setSelected(!selected)}>
          Selectable
        </Chip>
        <Chip deletable onClick={() => console.log('delete')}>
          Deletable
        </Chip>
        <Chip dropdown onClick={() => console.log('dropdown')}>
          Dropdown
        </Chip>
        <Chip onClick={() => console.log('custom')}>
          <Icon data={settings} size="sm" aria-hidden />
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
  render: () => (
    <Wrapper>
      <Chip deletable onClick={() => console.log('delete neutral')}>
        Neutral
      </Chip>
      <Chip
        deletable
        tone="accent"
        onClick={() => console.log('delete accent')}
      >
        Accent
      </Chip>
      <Chip
        deletable
        tone="danger"
        onClick={() => console.log('delete danger')}
      >
        Danger
      </Chip>
    </Wrapper>
  ),
}

export const Dropdown: Story = {
  render: () => (
    <Wrapper>
      <Chip dropdown onClick={() => console.log('options')}>
        Options
      </Chip>
      <Chip dropdown tone="accent" onClick={() => console.log('filter')}>
        Filter
      </Chip>
      <Chip dropdown variant="outlined" onClick={() => console.log('sort')}>
        Sort
      </Chip>
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Dropdown chips show a trailing arrow icon. The consumer handles what happens on click.',
      },
    },
  },
}

export const CustomIcons: Story = {
  render: () => (
    <Wrapper>
      <Chip onClick={() => console.log('save')}>
        <Icon data={save} size="sm" aria-hidden />
        Save
      </Chip>
      <Chip onClick={() => console.log('settings')}>
        <Icon data={settings} size="sm" aria-hidden />
        Settings
      </Chip>
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Custom chips allow consumers to add their own leading and/or trailing icons as children.',
      },
    },
  },
}

export const Density: Story = {
  render: () => {
    const [s1, setS1] = useState(false)
    const [s2, setS2] = useState(false)
    return (
      <Wrapper direction="column" gap={24} align="flex-start">
        <div data-density="spacious">
          <h3 style={{ marginBottom: '12px' }}>Spacious (default)</h3>
          <Wrapper>
            <Chip selected={s1} onClick={() => setS1(!s1)}>
              Selectable
            </Chip>
            <Chip deletable onClick={() => {}}>
              Deletable
            </Chip>
            <Chip dropdown onClick={() => {}}>
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
            <Chip deletable onClick={() => {}}>
              Deletable
            </Chip>
            <Chip dropdown onClick={() => {}}>
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
