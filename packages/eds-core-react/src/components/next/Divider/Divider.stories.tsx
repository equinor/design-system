import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Divider } from '.'
import page from './Divider.docs.mdx'

const meta: Meta<typeof Divider> = {
  title: 'EDS 2.0 (beta)/Surface/Divider',
  component: Divider,
  tags: ['beta'],
  parameters: {
    docs: {
      page,
    },
  },
}

export default meta

type Story = StoryObj<typeof Divider>

const Line = ({
  children,
  strong = false,
  subtle = false,
}: {
  children: ReactNode
  strong?: boolean
  subtle?: boolean
}) => (
  <span
    style={{
      display: 'block',
      paddingBlock: 'var(--eds-spacing-vertical-md)',
      fontFamily: 'var(--eds-font-family-ui)',
      fontSize: 'var(--eds-typography-body-md-font-size)',
      lineHeight: 'var(--eds-typography-body-md-line-height)',
      fontWeight: strong
        ? 'var(--eds-font-weight-bold)'
        : 'var(--eds-font-weight-normal)',
      color: subtle ? 'var(--eds-color-text-subtle)' : undefined,
    }}
  >
    {children}
  </span>
)

const Row = ({
  label,
  value,
  strong = false,
}: {
  label: string
  value: string
  strong?: boolean
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Line strong={strong}>{label}</Line>
    <Line strong={strong} subtle={!strong}>
      {value}
    </Line>
  </div>
)

export const Introduction: Story = {
  render: () => (
    <div
      style={{
        width: 360,
        paddingInline: 'var(--eds-spacing-horizontal-lg)',
      }}
    >
      <Row label="Language" value="English" />
      <Divider />
      <Row label="Theme" value="System" />
      <Divider />
      <Row label="Notifications" value="Enabled" />
      <Divider />
      <Row label="Time zone" value="Europe/Oslo" />
    </div>
  ),
}

export const Overview: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Line>Above the divider</Line>
      <Divider />
      <Line>Below the divider</Line>
    </div>
  ),
}

export const BetweenSections: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Line strong>Delivery</Line>
      <Line>Orders placed before 14:00 ship the same day.</Line>
      <Divider />
      <Line strong>Returns</Line>
      <Line>You can return an item within 30 days.</Line>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use a Divider to separate sections of a page when the headings alone do not make the break clear enough.',
      },
    },
  },
}

export const GroupedActions: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 'var(--eds-spacing-xs)',
        width: 200,
      }}
    >
      <Button variant="ghost" tone="neutral">
        Edit
      </Button>
      <Button variant="ghost" tone="neutral">
        Duplicate
      </Button>
      <Divider />
      <Button variant="ghost" tone="danger">
        Delete
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'In a list of actions, a Divider keeps a destructive action apart from the everyday ones, so it is harder to press by mistake.',
      },
    },
  },
}

export const BeforeTheTotal: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Row label="Coffee beans" value="120 NOK" />
      <Row label="Filter papers" value="45 NOK" />
      <Divider />
      <Row label="Total" value="165 NOK" strong />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A Divider before a total shows that the last row sums up the ones above it.',
      },
    },
  },
}
