import type { Meta, StoryObj } from '@storybook/react-vite'
import { TypographyNext } from '../../Typography'
import { Divider } from '.'

const meta: Meta<typeof Divider> = {
  title: 'EDS 2.0 (beta)/Surface/Divider',
  component: Divider,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component: `
**Beta:** safe to adopt alongside EDS 1.0. The API may still change in small ways before the stable 3.0 release. See [About EDS 2.0](?path=/docs/eds-2-0-beta-about--docs) for what beta means.

\`\`\`tsx
import { Divider } from '@equinor/eds-core-react/next'
\`\`\`

A thin horizontal rule that separates related content. Renders as a native
\`<hr>\` with \`role="separator"\`.
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Divider>

const Row = ({ label, value }: { label: string; value: string }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBlock: 'var(--eds-spacing-vertical-md)',
    }}
  >
    <TypographyNext as="span" family="ui" size="md" baseline="center">
      {label}
    </TypographyNext>
    <TypographyNext
      as="span"
      family="ui"
      size="md"
      baseline="center"
      style={{ color: 'var(--eds-color-text-subtle)' }}
    >
      {value}
    </TypographyNext>
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
