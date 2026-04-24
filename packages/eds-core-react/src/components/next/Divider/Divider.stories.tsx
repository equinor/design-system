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
⚠️ **Beta Component** - This component is under active development.

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
