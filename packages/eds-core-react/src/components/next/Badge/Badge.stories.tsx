import type { Meta, StoryFn } from '@storybook/react-vite'
import { Badge, type BadgeProps } from '.'

const meta: Meta<typeof Badge> = {
  title: 'EDS 2.0 (beta)/Data Display/Badge',
  component: Badge,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component: `
⚠️ **Beta Component** — this component is under active development.

\`\`\`tsx
import { Badge } from '@equinor/eds-core-react/next'
\`\`\`

Compact, non-interactive labels for conveying status, category, or metadata. For selectable labels, use [Chip](?path=/docs/eds-2-0-beta-data-display-chip--docs) instead.
        `,
      },
    },
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'accent', 'success', 'info', 'warning', 'danger'],
    },
    emphasis: {
      control: 'select',
      options: ['low', 'medium'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'outlined'],
    },
  },
}

export default meta

export const Introduction: StoryFn<BadgeProps> = (args) => {
  return <Badge {...args}>Label</Badge>
}

Introduction.args = {
  tone: 'neutral',
  emphasis: 'low',
  variant: 'solid',
}

export const Tones: StoryFn<BadgeProps> = () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Badge tone="neutral">Neutral</Badge>
    <Badge tone="accent">Accent</Badge>
    <Badge tone="success">Success</Badge>
    <Badge tone="info">Info</Badge>
    <Badge tone="warning">Warning</Badge>
    <Badge tone="danger">Danger</Badge>
  </div>
)

Tones.parameters = {
  docs: {
    description: {
      story:
        'Six semantic tones cover the full status spectrum. Use `success`, `warning`, and `danger` for operational states; `info` for informational labels; `accent` for categorisation; `neutral` as the default when no semantic meaning is needed.',
    },
  },
}

export const Emphasis: StoryFn<BadgeProps> = () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Badge tone="accent" emphasis="low">
      Low
    </Badge>
    <Badge tone="accent" emphasis="medium">
      Medium
    </Badge>
  </div>
)

Emphasis.parameters = {
  docs: {
    description: {
      story:
        '`low` (default) uses a subtle background fill — appropriate for most inline use. `medium` increases the fill density for stronger contrast, useful when the badge needs to stand out on its own.',
    },
  },
}

export const Variants: StoryFn<BadgeProps> = () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Badge tone="accent" variant="solid">
      Solid
    </Badge>
    <Badge tone="accent" variant="outlined">
      Outlined
    </Badge>
  </div>
)

Variants.parameters = {
  docs: {
    description: {
      story:
        'Solid (default) suits most contexts. Outlined uses a border instead of a fill — useful when the background is already coloured or when a lighter visual weight is preferable.',
    },
  },
}

export const InlineWithText: StoryFn<BadgeProps> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <h3
      style={{
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '16px',
        fontFamily: 'var(--eds-typography-header-font-family)',
        fontWeight: 700,
      }}
    >
      Well integrity report{' '}
      <Badge tone="danger" emphasis="medium">
        Critical
      </Badge>
    </h3>
    <p
      style={{
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontFamily: 'var(--eds-typography-ui-body-font-family)',
      }}
    >
      Pressure test <Badge tone="success">Passed</Badge>
    </p>
    <p
      style={{
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontFamily: 'var(--eds-typography-ui-body-font-family)',
      }}
    >
      API documentation <Badge tone="info">Beta</Badge>
    </p>
  </div>
)

InlineWithText.parameters = {
  docs: {
    description: {
      story:
        'Badges sit inline with headings and body text. Use `align-items: center` on the flex container to align the badge baseline with the surrounding text.',
    },
  },
}

export const InTable: StoryFn<BadgeProps> = () => (
  <table
    style={{
      borderCollapse: 'collapse',
      fontSize: '14px',
      width: '100%',
      fontFamily: 'var(--eds-typography-ui-body-font-family)',
    }}
  >
    <thead>
      <tr>
        {['Work order', 'Location', 'Status', 'Priority'].map((h) => (
          <th
            key={h}
            style={{
              textAlign: 'left',
              padding: '8px 12px',
              borderBottom: '1px solid #e0e0e0',
              fontWeight: 600,
            }}
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {[
        {
          id: 'WO-1042',
          location: 'Oseberg A',
          status: 'Active',
          tone: 'success',
          priority: 'Normal',
          priorityTone: 'neutral',
        },
        {
          id: 'WO-1043',
          location: 'Gullfaks C',
          status: 'Pending',
          tone: 'warning',
          priority: 'High',
          priorityTone: 'warning',
        },
        {
          id: 'WO-1044',
          location: 'Troll B',
          status: 'Critical',
          tone: 'danger',
          priority: 'Critical',
          priorityTone: 'danger',
        },
        {
          id: 'WO-1045',
          location: 'Snorre A',
          status: 'Draft',
          tone: 'neutral',
          priority: 'Normal',
          priorityTone: 'neutral',
        },
      ].map((row) => (
        <tr key={row.id}>
          <td
            style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}
          >
            {row.id}
          </td>
          <td
            style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}
          >
            {row.location}
          </td>
          <td
            style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}
          >
            <Badge tone={row.tone as BadgeProps['tone']}>{row.status}</Badge>
          </td>
          <td
            style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}
          >
            <Badge
              tone={row.priorityTone as BadgeProps['tone']}
              emphasis="medium"
            >
              {row.priority}
            </Badge>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)

InTable.parameters = {
  docs: {
    description: {
      story:
        'Badges in table columns let users scan status and priority at a glance. Use `emphasis="medium"` for the more prominent priority column.',
    },
  },
}

const assets = [
  {
    name: 'Oseberg A',
    description: 'Fixed steel jacket platform, North Sea',
    tags: [
      { label: 'Offshore', tone: 'accent' },
      { label: 'Operational', tone: 'success' },
      { label: 'HPHT', tone: 'info' },
    ],
  },
  {
    name: 'Troll B',
    description: 'Semi-submersible floating production platform',
    tags: [
      { label: 'Offshore', tone: 'accent' },
      { label: 'Maintenance', tone: 'warning' },
    ],
  },
  {
    name: 'Mongstad',
    description: 'Refinery and oil terminal, western Norway',
    tags: [
      { label: 'Onshore', tone: 'neutral' },
      { label: 'Operational', tone: 'success' },
    ],
  },
] as const

export const MultipleLabels: StoryFn<BadgeProps> = () => (
  <ul
    style={{
      listStyle: 'none',
      margin: 0,
      padding: 0,
      fontFamily: 'var(--eds-typography-ui-body-font-family)',
      width: '360px',
    }}
  >
    {assets.map((asset, i) => (
      <li
        key={asset.name}
        style={{
          padding: '12px 0',
          borderBottom: i < assets.length - 1 ? '1px solid #e0e0e0' : undefined,
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '4px',
          }}
        >
          {asset.name}
        </span>
        <span
          style={{
            display: 'block',
            fontSize: '12px',
            color: '#6f6f6f',
            marginBottom: '8px',
          }}
        >
          {asset.description}
        </span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {asset.tags.map((tag) => (
            <Badge key={tag.label} tone={tag.tone}>
              {tag.label}
            </Badge>
          ))}
        </div>
      </li>
    ))}
  </ul>
)

MultipleLabels.parameters = {
  docs: {
    description: {
      story:
        'Multiple badges per item communicate orthogonal properties — location type, operational status, and technical classification — without cluttering the layout.',
    },
  },
}

export const AllCombinations: StoryFn<BadgeProps> = () => {
  const tones = [
    'neutral',
    'accent',
    'success',
    'info',
    'warning',
    'danger',
  ] as const
  const emphases = ['low', 'medium'] as const
  const variants = ['solid', 'outlined'] as const

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {emphases.map((emphasis) =>
        variants.map((variant) => (
          <div
            key={`${emphasis}-${variant}`}
            style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
          >
            <span style={{ fontSize: '12px', width: '120px', flexShrink: 0 }}>
              {emphasis} / {variant}
            </span>
            {tones.map((tone) => (
              <Badge
                key={tone}
                tone={tone}
                emphasis={emphasis}
                variant={variant}
              >
                Label
              </Badge>
            ))}
          </div>
        )),
      )}
    </div>
  )
}

AllCombinations.parameters = {
  docs: {
    description: {
      story: 'All combinations of tone × emphasis × variant for visual QA.',
    },
  },
}
